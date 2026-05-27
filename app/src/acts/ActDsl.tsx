import { useState, useMemo, useCallback } from 'react'
import { DSL_DEFAULT, CODA_MODIFIERS } from '../lib/data'
import { whaleAudio } from '../lib/audio'
import { Eyebrow } from '../components/Eyebrow'
import { CodaEditor } from '../components/CodaEditor'

/* ── Tokenizer ─────────────────────────────────────────── */
interface Token { t: string; v: string }

function tokenize(line: string): Token[] {
  const out: Token[] = []
  let i = 0
  const s = line
  while (i < s.length) {
    const c = s[i]
    if (c === '#') { out.push({ t: 'comment', v: s.slice(i) }); return out }
    if (/\s/.test(c)) { let j = i; while (j < s.length && /\s/.test(s[j])) j++; out.push({ t: 'ws', v: s.slice(i, j) }); i = j; continue }
    if (c === '•' || c === '.') { out.push({ t: 'click', v: c }); i++; continue }
    if (c === '|') { let j = i; while (s[j] === '|') j++; out.push({ t: 'gap', v: s.slice(i, j) }); i = j; continue }
    if (c === ':' || c === '=') { out.push({ t: 'colon', v: c }); i++; continue }
    if (c === '*' || c === '~') { let j = i+1; while (j<s.length && /[\-\d.]/.test(s[j])) j++; out.push({ t: 'mod', v: s.slice(i, j) }); i = j; continue }
    if (c === '+') { let j = i; while (j<s.length && s[j] !== ' ' && s[j] !== '#') j++; out.push({ t: 'mod', v: s.slice(i, j) }); i = j; continue }
    if (c === '!') { out.push({ t: 'mod', v: '!' }); i++; continue }
    if (/[0-9]/.test(c)) {
      let j = i+1; while (j<s.length && /[0-9.]/.test(s[j])) j++
      out.push({ t: 'num', v: s.slice(i, j) }); i = j; continue
    }
    if (/[a-z]/i.test(c)) {
      let j = i+1; while (j<s.length && /[a-z0-9_]/i.test(s[j])) j++
      const w = s.slice(i, j).toLowerCase()
      const isKw = ['tempo', 'ornament'].includes(w)
      out.push({ t: isKw ? 'kw' : 'ident', v: s.slice(i, j) })
      i = j; continue
    }
    out.push({ t: 'op', v: c }); i++
  }
  return out
}

interface ParsedCoda {
  lineIdx: number
  name: string
  intervals: number[]
  mods: { tempo: number; rubato: number; ornament: boolean; ictus: number }
}

function parseScore(text: string): { codas: ParsedCoda[]; defaultIci: number } {
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

export function ActDsl() {
  const [text, setText] = useState(DSL_DEFAULT)
  const { codas } = useMemo(() => parseScore(text), [text])
  const [active, setActive] = useState(-1)

  const playLine = useCallback((lineIdx: number) => {
    const c = codas.find(c => c.lineIdx === lineIdx)
    if (!c) return
    void whaleAudio.resume()
    setActive(lineIdx)
    const start = whaleAudio.now() + 0.06
    const intervals = c.intervals.slice()
    const total = intervals.reduce((s, v) => s+v, 0)
    whaleAudio.playCoda(intervals, {
      start,
      onClick: (i, n) => {
        if (c.mods.ictus && i === c.mods.ictus - 1) {
          whaleAudio.click(whaleAudio.now() + 0.001, { gain: 1.2 })
        }
        if (i === n - 1) setTimeout(() => setActive(-1), 200)
      }
    })
    setTimeout(() => setActive(-1), (total + 0.5) * 1000)
  }, [codas])

  const playAll = useCallback(() => {
    let delay = 0
    codas.forEach(c => {
      setTimeout(() => playLine(c.lineIdx), delay)
      delay += (c.intervals.reduce((s, v) => s+v, 0) + 0.5) * 1000
    })
  }, [codas, playLine])

  return (
    <section id="dsl" className="act" data-screen-label="04 Score">
      <div className="col-xwide">
        <Eyebrow num={3}>Coda score · a small DSL</Eyebrow>
        <h2><span className="hl">Compose</span> a coda. Hear it back.</h2>
        <p className="lede" style={{ maxWidth: '46ch' }}>
          A coda is rhythm and not much else, so we can write it as code. Edit the score; every line with a name becomes a&nbsp;playable phrase.
        </p>

        <div className="split-12-1" style={{ marginTop: 32, gap: 40 }}>
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <button className="btn btn-primary" onClick={playAll}>► Play all</button>
              <button className="btn btn-ghost" onClick={() => setText(DSL_DEFAULT)}>Reset score</button>
              <span className="mono small" style={{ marginLeft: 'auto', color: 'var(--shoal)', alignSelf: 'center' }}>{codas.length} codas parsed</span>
            </div>
            <CodaEditor text={text} onChange={setText} onPlayLine={playLine} activeLine={active}/>
            <p className="small" style={{ marginTop: 12, color: 'var(--mist)' }}>
              Edit any line. Press <code style={{ background: 'var(--abyss-ink)', padding: '2px 6px', borderRadius: 3 }}>►</code> in the gutter to hear it. Hot-modify
              the <span className="mono" style={{ color: 'var(--lumen)' }}>tempo</span>, add <span className="mono" style={{ color: 'var(--lumen)' }}>*1.5</span> for speed,
              <span className="mono" style={{ color: 'var(--lumen)' }}>~0.6</span> for rubato.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: 26, marginTop: 0 }}>The CETI alphabet</h3>
            <p style={{ fontSize: 16, color: 'var(--mist)' }}>
              In 2024 Project CETI published evidence that coda variation isn&apos;t noise — it&apos;s structured along four orthogonal axes,
              like vowels and consonants in a phonology.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
              {CODA_MODIFIERS.map(m => (
                <div key={m.id} style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <strong style={{ color: 'var(--lumen)', fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.04em' }}>{m.name.toUpperCase()}</strong>
                    <span className="mono" style={{ color: 'var(--shoal)', fontSize: 11 }}>
                      {m.id === 'rubato' && '~N'}
                      {m.id === 'tempo' && '*N'}
                      {m.id === 'ornament' && '+ orn.'}
                      {m.id === 'ictus' && '! N'}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--mist)', margin: '6px 0 0' }}>{m.desc}</p>
                </div>
              ))}
            </div>
            <p className="small" style={{ marginTop: 20, color: 'var(--shoal)' }}>
              The point: a small base vocabulary (≈ 21 coda types) combined with four continuous modifiers yields hundreds of distinguishable utterances. Combinatorial.
              That&apos;s what languages do.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
