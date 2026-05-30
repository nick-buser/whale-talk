/* Coda DSL — pure parsing & modifier logic.
   Extracted from ActDsl / ActSynth / CodaEditor so it can be unit-tested
   and shared without pulling in React or CodeMirror. */

/* ── Position-aware tokenizer ───────────────────────────── */
export interface Tok { t: string; v: string; pos: number }

export function tokenizeWithPos(line: string): Tok[] {
  const out: Tok[] = []
  let i = 0
  while (i < line.length) {
    const c = line[i], pos = i
    if (c === '#') { out.push({ t: 'comment', v: line.slice(i), pos }); return out }
    if (/\s/.test(c)) { let j = i; while (j < line.length && /\s/.test(line[j])) j++; out.push({ t: 'ws', v: line.slice(i, j), pos }); i = j; continue }
    if (c === '•' || c === '.') { out.push({ t: 'click', v: c, pos }); i++; continue }
    if (c === '|') { let j = i; while (line[j] === '|') j++; out.push({ t: 'gap', v: line.slice(i, j), pos }); i = j; continue }
    if (c === ':' || c === '=') { out.push({ t: 'colon', v: c, pos }); i++; continue }
    if (c === '*' || c === '~') { let j = i+1; while (j < line.length && /[-\d.]/.test(line[j])) j++; out.push({ t: 'mod', v: line.slice(i, j), pos }); i = j; continue }
    if (c === '+') { let j = i; while (j < line.length && line[j] !== ' ' && line[j] !== '#') j++; out.push({ t: 'mod', v: line.slice(i, j), pos }); i = j; continue }
    if (c === '!') { out.push({ t: 'mod', v: '!', pos }); i++; continue }
    if (/[0-9]/.test(c)) { let j = i+1; while (j < line.length && /[0-9.]/.test(line[j])) j++; out.push({ t: 'num', v: line.slice(i, j), pos }); i = j; continue }
    if (/[a-z]/i.test(c)) {
      let j = i+1; while (j < line.length && /[a-z0-9_]/i.test(line[j])) j++
      const w = line.slice(i, j).toLowerCase()
      out.push({ t: ['tempo','ornament'].includes(w) ? 'kw' : 'ident', v: line.slice(i, j), pos })
      i = j; continue
    }
    out.push({ t: 'unknown', v: c, pos }); i++
  }
  return out
}

/* ── Position-free tokenizer (parsing convenience) ──────── */
export interface Token { t: string; v: string }

export function tokenize(line: string): Token[] {
  return tokenizeWithPos(line).map(({ t, v }) => ({ t, v }))
}

/* ── Apply the four CETI modifiers to a base interval array ─ */
export function applyMods(base: number[], tempo: number, rubato: number, ornament: boolean): number[] {
  const n = base.length
  const out = base.map((g, i) => {
    const frac = n <= 1 ? 0.5 : i / (n - 1)
    const scale = 1 + (-rubato) * (frac - 0.5) * 2
    return g * scale * tempo
  })
  if (ornament) {
    const avg = base.reduce((s, v) => s + v, 0) / n
    out.push(Math.max(0.05, avg * 0.4 * tempo))
  }
  return out
}

/* ── Score parser ───────────────────────────────────────── */
export interface ParsedCoda {
  lineIdx: number
  name: string
  intervals: number[]
  mods: { tempo: number; rubato: number; ornament: boolean; ictus: number }
}

export function parseScore(text: string): { codas: ParsedCoda[]; defaultIci: number } {
  const lines = text.split('\n')
  let defaultIci = 0.21
  const codas: ParsedCoda[] = []
  lines.forEach((line, idx) => {
    const tokens = tokenize(line)
    const nonws = tokens.filter(t => t.t !== 'ws' && t.t !== 'comment')
    if (nonws.length === 0) return

    if (nonws[0].t === 'kw' && nonws[0].v.toLowerCase() === 'tempo' && nonws[1] && nonws[1].t === 'num') {
      defaultIci = Math.max(0.02, parseFloat(nonws[1].v) / 1000)
      return
    }

    if (nonws[0].t === 'ident' && nonws[1] && nonws[1].t === 'colon') {
      const name = nonws[0].v
      const body = nonws.slice(2)
      const clicks: boolean[] = []
      const gaps: (number | null)[] = []
      let lastGap: number | null = null
      const mods = { tempo: 1, rubato: 0, ornament: false, ictus: 0 }
      for (let k = 0; k < body.length; k++) {
        const tk = body[k]
        if (tk.t === 'click') { clicks.push(true); if (clicks.length > 1) gaps.push(lastGap); lastGap = null }
        else if (tk.t === 'gap') { lastGap = defaultIci * (tk.v.length === 1 ? 2.2 : tk.v.length === 2 ? 3.4 : 4.5) }
        else if (tk.t === 'num') { lastGap = parseFloat(tk.v) / 1000 }
        else if (tk.t === 'mod') {
          if (tk.v.startsWith('*')) mods.tempo *= parseFloat(tk.v.slice(1)) || 1
          else if (tk.v.startsWith('~')) mods.rubato = parseFloat(tk.v.slice(1)) || 0
          else if (tk.v.toLowerCase().startsWith('+')) mods.ornament = true
          else if (tk.v === '!') {
            const next = body[k+1]
            if (next && next.t === 'num') { mods.ictus = parseInt(next.v, 10); k++ }
          }
        } else if (tk.t === 'kw' && tk.v.toLowerCase() === 'ornament') mods.ornament = true
      }
      const baseGaps = gaps.map(g => (g == null ? defaultIci : g))
      const n = baseGaps.length
      const r = mods.rubato
      const intervals = baseGaps.map((g, i) => {
        const frac = n === 1 ? 0 : i / (n - 1)
        const scale = 1 + (-r) * (frac - 0.5) * 2
        return g * scale * mods.tempo
      })
      if (mods.ornament) intervals.push(Math.max(0.05, defaultIci * 0.4 * mods.tempo))
      codas.push({ lineIdx: idx, name, intervals, mods })
    }
  })
  return { codas, defaultIci }
}

/* ── Playable-line detection (editor gutter) ────────────── */
const KEYWORDS = new Set(['tempo', 'ornament'])

export function getPlayableLines(text: string): Set<number> {
  const result = new Set<number>()
  text.split('\n').forEach((line, idx) => {
    const m = line.match(/^\s*([a-z][a-z0-9_]*)\s*:/i)
    if (m && !KEYWORDS.has(m[1].toLowerCase())) result.add(idx)
  })
  return result
}
