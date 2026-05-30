import { useEffect, useRef, useMemo } from 'react'
import type { MutableRefObject } from 'react'
import {
  EditorView, gutter, GutterMarker, keymap, lineNumbers,
  Decoration,
} from '@codemirror/view'
import type { DecorationSet } from '@codemirror/view'
import {
  EditorState, StateField, StateEffect, RangeSetBuilder,
} from '@codemirror/state'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { StreamLanguage, HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { linter } from '@codemirror/lint'
import type { Diagnostic } from '@codemirror/lint'
import { tokenizeWithPos, getPlayableLines } from '../lib/coda-dsl'
import type { Tok } from '../lib/coda-dsl'

/* ── DSL linter ─────────────────────────────────────────── */
function codaLinter(view: EditorView): Diagnostic[] {
  const diags: Diagnostic[] = []
  const seen = new Map<string, number>()

  for (let n = 1; n <= view.state.doc.lines; n++) {
    const { from, text } = view.state.doc.line(n)
    if (!text.trim() || text.trim().startsWith('#')) continue

    const toks = tokenizeWithPos(text)
    const nws = toks.filter(t => t.t !== 'ws' && t.t !== 'comment')
    if (!nws.length) continue

    const span = (t: Tok) => ({ from: from + t.pos, to: from + t.pos + t.v.length })

    // tempo directive
    if (nws[0].t === 'kw' && nws[0].v.toLowerCase() === 'tempo') {
      const num = nws[1]
      if (!num || num.t !== 'num') {
        diags.push({ ...span(nws[0]), severity: 'error', message: 'tempo requires a positive number (e.g. tempo 200)' })
      } else if (parseFloat(num.v) <= 0) {
        diags.push({ ...span(num), severity: 'error', message: `tempo must be a positive number, got ${num.v}` })
      }
      continue
    }

    // coda definition
    if (nws[0].t === 'ident' && nws[1]?.t === 'colon') {
      const name = nws[0].v.toLowerCase()
      if (seen.has(name)) {
        diags.push({ ...span(nws[0]), severity: 'error', message: `duplicate coda name "${nws[0].v}" (already defined at line ${seen.get(name)})` })
      } else {
        seen.set(name, n)
      }

      const body = nws.slice(2)
      if (!body.some(t => t.t === 'click')) {
        diags.push({ from: from + nws[1].pos, to: from + text.length, severity: 'warning', message: `coda "${nws[0].v}" has no clicks — add • or .` })
      }

      for (let k = 0; k < body.length; k++) {
        const t = body[k]
        if (t.t !== 'mod') continue
        if (t.v.startsWith('*')) {
          const val = parseFloat(t.v.slice(1))
          if (isNaN(val) || val <= 0)
            diags.push({ ...span(t), severity: 'error', message: `tempo modifier must be a positive number (e.g. *0.55 or *1.7)` })
        } else if (t.v.startsWith('~')) {
          const val = parseFloat(t.v.slice(1))
          if (isNaN(val))
            diags.push({ ...span(t), severity: 'error', message: `rubato modifier requires a number (e.g. ~0.6 or ~-0.4)` })
          else if (Math.abs(val) > 1)
            diags.push({ ...span(t), severity: 'warning', message: `rubato ${val} is unusually large — typical range is -1 to 1` })
        } else if (t.v === '!') {
          const next = body[k + 1]
          if (!next || next.t !== 'num' || parseInt(next.v, 10) < 1)
            diags.push({ ...span(t), severity: 'error', message: 'ictus ! must be followed by a click index (e.g. ! 3)' })
        }
      }
      continue
    }

    // line starts with something unrecognised
    if (nws[0].t !== 'kw') {
      diags.push({ ...span(nws[0]), severity: 'warning', message: `unexpected token "${nws[0].v}" — lines should start with a coda name or "tempo"` })
    }
  }

  return diags
}

/* ── State effects & fields ─────────────────────────────── */
const setActiveLine = StateEffect.define<number>()

const playableLinesField = StateField.define<Set<number>>({
  create: state => getPlayableLines(state.doc.toString()),
  update: (val, tr) => tr.docChanged ? getPlayableLines(tr.newDoc.toString()) : val,
})

// Combined field: tracks the active (playing) line and builds its decoration
const activeLineField = StateField.define<{ line: number; decos: DecorationSet }>({
  create: () => ({ line: -1, decos: Decoration.none }),
  update(val, tr) {
    let line = val.line
    for (const e of tr.effects) {
      if (e.is(setActiveLine)) { line = e.value; break }
    }
    if (line === val.line && !tr.docChanged) return val
    const decos = line < 0 ? Decoration.none : (() => {
      try {
        const docLine = tr.state.doc.line(line + 1)
        const builder = new RangeSetBuilder<Decoration>()
        builder.add(docLine.from, docLine.from, Decoration.line({ class: 'cm-active-coda-line' }))
        return builder.finish()
      } catch {
        return Decoration.none
      }
    })()
    return { line, decos }
  },
  provide: f => EditorView.decorations.from(f, v => v.decos),
})

/* ── Coda DSL stream language ───────────────────────────── */
const codaLang = StreamLanguage.define<Record<string, never>>({
  startState: () => ({}),
  token(stream) {
    if (stream.eatSpace()) return null
    if (stream.match(/^#.*/)) return 'comment'
    if (stream.match(/^[•.]/)) return 'atom'
    if (stream.match(/^\|+/)) return 'number'
    if (stream.match(/^[0-9]+(?:\.[0-9]*)*/)) return 'number'
    if (stream.match(/^(?:tempo|ornament)\b/i)) return 'keyword'
    if (stream.match(/^[*~][^\s#]*/)) return 'operator'
    if (stream.match(/^\+[^\s#]*/)) return 'operator'
    if (stream.match(/^!/)) return 'operator'
    if (stream.match(/^[:=]/)) return 'punctuation'
    if (stream.match(/^[a-z][a-z0-9_]*/i)) return 'variableName'
    stream.next()
    return null
  },
  blankLine: () => {},
})

/* ── Highlight style ────────────────────────────────────── */
const codaHighlight = HighlightStyle.define([
  { tag: tags.comment,      color: '#5b82b8' },
  { tag: tags.atom,         color: '#c6ffe6', fontWeight: '500' },
  { tag: tags.number,       color: '#ffb472' },
  { tag: tags.keyword,      color: '#4afdc6', fontWeight: '500' },
  { tag: tags.operator,     color: '#4afdc6' },
  { tag: tags.punctuation,  color: '#b6c8df' },
  { tag: tags.variableName, color: '#eef3fa' },
])

/* ── Editor dark theme ──────────────────────────────────── */
const codaTheme = EditorView.theme({
  '&': {
    height: '440px',
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '13.5px',
    background: 'var(--abyss-deep)',
    border: '1px solid var(--line)',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  '.cm-scroller': { fontFamily: 'inherit', lineHeight: '24px', overflow: 'auto' },
  '.cm-content': { caretColor: 'var(--lumen)', padding: 0 },
  '.cm-line': { padding: '0 14px 0 4px' },
  '.cm-gutters': {
    background: 'color-mix(in oklch, var(--abyss-ink) 60%, transparent)',
    borderRight: '1px solid var(--line)',
    color: 'var(--shoal)',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    fontSize: '11px', padding: '0 4px', minWidth: '28px',
    textAlign: 'right', userSelect: 'none',
  },
  '.cm-play-gutter': { minWidth: '28px' },
  '.cm-play-gutter .cm-gutterElement': {
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
  },
  '.cm-activeLine': { background: 'transparent' },
  '.cm-active-coda-line': { background: 'color-mix(in oklch, var(--lumen) 10%, transparent)' },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--lumen)' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
    background: 'rgba(74,253,198,0.15)',
  },
  '&.cm-focused': { outline: 'none' },
  // lint tooltips
  '.cm-tooltip.cm-tooltip-lint': {
    background: 'var(--abyss-ink)', border: '1px solid var(--line)',
    borderRadius: '4px', padding: '2px 0',
  },
  '.cm-diagnostic': { fontFamily: 'var(--font-mono)', fontSize: '12px', padding: '4px 10px' },
  '.cm-diagnostic-error': { borderLeft: '3px solid #ff6b6b' },
  '.cm-diagnostic-warning': { borderLeft: '3px solid #ffb472' },
}, { dark: true })

/* ── Play-button gutter ─────────────────────────────────── */
class PlayMarker extends GutterMarker {
  constructor(
    private readonly lineIdx: number,
    private readonly isActive: boolean,
    private readonly onPlay: () => void,
  ) { super() }

  toDOM() {
    const btn = document.createElement('button')
    btn.textContent = '►'
    btn.title = 'Play this coda'
    btn.style.cssText = [
      'width:16px', 'height:16px', 'border-radius:50%',
      'border:1px solid var(--lumen)',
      `background:${this.isActive ? 'var(--lumen)' : 'transparent'}`,
      `color:${this.isActive ? 'var(--lumen-ink,#03060f)' : 'var(--lumen)'}`,
      'cursor:pointer', 'padding:0',
      'display:inline-flex', 'align-items:center', 'justify-content:center',
      'font-size:8px', 'line-height:1',
    ].join(';')
    btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); this.onPlay() })
    return btn
  }

  eq(other: GutterMarker) {
    return other instanceof PlayMarker &&
           other.lineIdx === this.lineIdx &&
           other.isActive === this.isActive
  }
}

class EmptySpacer extends GutterMarker {
  toDOM() {
    const s = document.createElement('span')
    s.style.cssText = 'display:inline-block;width:16px'
    return s
  }
  eq(_o: GutterMarker) { return false }
}

function makePlayGutter(onPlayRef: MutableRefObject<(i: number) => void>) {
  return gutter({
    class: 'cm-play-gutter',
    markers(view) {
      const playable = view.state.field(playableLinesField)
      const { line: active } = view.state.field(activeLineField)
      const builder = new RangeSetBuilder<GutterMarker>()
      for (let n = 1; n <= view.state.doc.lines; n++) {
        const docLine = view.state.doc.line(n)
        const idx = n - 1
        if (playable.has(idx)) {
          builder.add(docLine.from, docLine.from,
            new PlayMarker(idx, idx === active, () => onPlayRef.current?.(idx))
          )
        }
      }
      return builder.finish()
    },
    lineMarkerChange: update =>
      update.docChanged ||
      update.transactions.some(tr => tr.effects.some(e => e.is(setActiveLine))),
    initialSpacer: () => new EmptySpacer(),
  })
}

/* ── CodaEditor component ───────────────────────────────── */
export function CodaEditor({ text, onChange, onPlayLine, activeLine }: {
  text: string
  onChange: (v: string) => void
  onPlayLine: (lineIdx: number) => void
  activeLine: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const onPlayLineRef = useRef(onPlayLine)
  const onChangeRef  = useRef(onChange)

  useEffect(() => { onPlayLineRef.current = onPlayLine }, [onPlayLine])
  useEffect(() => { onChangeRef.current  = onChange    }, [onChange])

  const extensions = useMemo(() => [
    history(),
    keymap.of([...defaultKeymap, ...historyKeymap]),
    codaLang,
    syntaxHighlighting(codaHighlight),
    codaTheme,
    playableLinesField,
    activeLineField,
    lineNumbers(),
    makePlayGutter(onPlayLineRef),
    linter(codaLinter, { delay: 400 }),
    EditorView.updateListener.of(update => {
      if (update.docChanged) onChangeRef.current(update.state.doc.toString())
    }),
  ], [])  // stable — created once per mount

  // Mount the editor once
  useEffect(() => {
    if (!containerRef.current) return
    const view = new EditorView({
      state: EditorState.create({ doc: text, extensions }),
      parent: containerRef.current,
    })
    viewRef.current = view
    return () => { view.destroy(); viewRef.current = null }
  }, [extensions])

  // Sync text from outside (e.g., Reset score)
  useEffect(() => {
    const view = viewRef.current
    if (!view || view.state.doc.toString() === text) return
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } })
  }, [text])

  // Sync active-line highlight
  useEffect(() => {
    viewRef.current?.dispatch({ effects: setActiveLine.of(activeLine) })
  }, [activeLine])

  return <div ref={containerRef} />
}
