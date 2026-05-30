import { describe, it, expect } from 'vitest'
import {
  tokenize, tokenizeWithPos, parseScore, applyMods, getPlayableLines,
} from './coda-dsl'

const sum = (a: number[]) => a.reduce((s, v) => s + v, 0)
const approx = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps

describe('tokenize', () => {
  it('classifies clicks, both glyph forms', () => {
    expect(tokenize('• .').filter(t => t.t === 'click').map(t => t.v)).toEqual(['•', '.'])
  })

  it('treats # as a comment to end of line', () => {
    const toks = tokenize('greet : • • # five clicks')
    const comment = toks.find(t => t.t === 'comment')
    expect(comment?.v).toBe('# five clicks')
    // nothing after the comment is tokenized
    expect(toks[toks.length - 1].t).toBe('comment')
  })

  it('reads numbers (including decimals) as a single num token', () => {
    const nums = tokenize('• 420 • 1.5').filter(t => t.t === 'num').map(t => t.v)
    expect(nums).toEqual(['420', '1.5'])
  })

  it('groups consecutive bars into one gap token', () => {
    const gaps = tokenize('• ||| •').filter(t => t.t === 'gap').map(t => t.v)
    expect(gaps).toEqual(['|||'])
  })

  it('recognises tempo/ornament as keywords, other words as idents', () => {
    expect(tokenize('tempo').map(t => t.t)).toEqual(['kw'])
    expect(tokenize('ornament').map(t => t.t)).toEqual(['kw'])
    expect(tokenize('greet').map(t => t.t)).toEqual(['ident'])
  })

  it('captures *, ~, +, ! modifiers with their operands', () => {
    const mods = tokenize('• *0.55 ~-0.4 +orn !').filter(t => t.t === 'mod').map(t => t.v)
    expect(mods).toEqual(['*0.55', '~-0.4', '+orn', '!'])
  })

  it('colon and equals both produce colon tokens', () => {
    expect(tokenize('a :').find(t => t.t === 'colon')?.v).toBe(':')
    expect(tokenize('a =').find(t => t.t === 'colon')?.v).toBe('=')
  })
})

describe('tokenizeWithPos', () => {
  it('records the character offset of each token', () => {
    const toks = tokenizeWithPos('greet : •')
    expect(toks.map(t => [t.t, t.pos])).toEqual([
      ['ident', 0], ['ws', 5], ['colon', 6], ['ws', 7], ['click', 8],
    ])
  })

  it('strips to the same tokens as the position-free tokenize', () => {
    const line = 'reply : • 420 • • • # hi'
    expect(tokenize(line)).toEqual(
      tokenizeWithPos(line).map(({ t, v }) => ({ t, v })),
    )
  })
})

describe('parseScore', () => {
  it('parses a simple regular coda using the default ICI', () => {
    const { codas, defaultIci } = parseScore('greet : • • • • •')
    expect(defaultIci).toBeCloseTo(0.21)
    expect(codas).toHaveLength(1)
    expect(codas[0].name).toBe('greet')
    // 5 clicks → 4 gaps, all default
    expect(codas[0].intervals).toHaveLength(4)
    codas[0].intervals.forEach(g => expect(g).toBeCloseTo(0.21))
  })

  it('honours a tempo directive as the default inter-click interval (ms)', () => {
    const { defaultIci, codas } = parseScore('tempo 300\ng : • •')
    expect(defaultIci).toBeCloseTo(0.3)
    expect(codas[0].intervals[0]).toBeCloseTo(0.3)
  })

  it('clamps a too-small tempo directive to 0.02s', () => {
    const { defaultIci } = parseScore('tempo 5')
    expect(defaultIci).toBeCloseTo(0.02)
  })

  it('reads literal millisecond gaps between clicks', () => {
    const { codas } = parseScore('reply : • 420 • 420 • • •')
    // gaps: 420, 420, default, default
    expect(codas[0].intervals[0]).toBeCloseTo(0.42)
    expect(codas[0].intervals[1]).toBeCloseTo(0.42)
    expect(codas[0].intervals[2]).toBeCloseTo(0.21)
    expect(codas[0].intervals[3]).toBeCloseTo(0.21)
  })

  it('scales bar gaps by length (1=2.2x, 2=3.4x, 3+=4.5x of ICI)', () => {
    const { codas, defaultIci } = parseScore('a : • | • || • ||| •')
    expect(codas[0].intervals[0]).toBeCloseTo(defaultIci * 2.2)
    expect(codas[0].intervals[1]).toBeCloseTo(defaultIci * 3.4)
    expect(codas[0].intervals[2]).toBeCloseTo(defaultIci * 4.5)
  })

  it('applies a tempo modifier (*N) multiplicatively', () => {
    const base = parseScore('a : • • • • •').codas[0].intervals
    const fast = parseScore('a : • • • • • *0.5').codas[0].intervals
    fast.forEach((g, i) => expect(g).toBeCloseTo(base[i] * 0.5))
  })

  it('applies rubato (~N) as a symmetric ramp that preserves the mean gap', () => {
    const { codas } = parseScore('a : • • • • • ~0.4')
    const base = parseScore('a : • • • • •').codas[0].intervals
    const ints = codas[0].intervals
    // first gap stretched, last gap compressed (accelerando)
    expect(ints[0]).toBeGreaterThan(base[0])
    expect(ints[ints.length - 1]).toBeLessThan(base[base.length - 1])
    // mean is preserved by the symmetric ramp
    expect(approx(sum(ints) / ints.length, sum(base) / base.length, 1e-9)).toBe(true)
    expect(codas[0].mods.rubato).toBeCloseTo(0.4)
  })

  it('appends an ornament grace click and records the flag', () => {
    const plain = parseScore('a : • • •').codas[0]
    const orn   = parseScore('a : • • • + ornament').codas[0]
    expect(orn.mods.ornament).toBe(true)
    expect(orn.intervals).toHaveLength(plain.intervals.length + 1)
  })

  it('records ictus as the 1-based click index after !', () => {
    const { codas } = parseScore('a : • • • • • ! 3')
    expect(codas[0].mods.ictus).toBe(3)
  })

  it('skips comments and blank lines, keeps line indices', () => {
    const text = '# header\n\ntempo 200\ngreet : • •\n# trailing'
    const { codas } = parseScore(text)
    expect(codas).toHaveLength(1)
    expect(codas[0].lineIdx).toBe(3)
  })

  it('ignores a coda definition with no clicks (no intervals)', () => {
    const { codas } = parseScore('empty :')
    expect(codas[0].intervals).toEqual([])
  })
})

describe('applyMods', () => {
  it('is identity at tempo=1, rubato=0, no ornament', () => {
    const base = [0.21, 0.21, 0.21, 0.21]
    expect(applyMods(base, 1, 0, false)).toEqual(base)
  })

  it('scales uniformly with tempo', () => {
    expect(applyMods([0.2, 0.2], 2, 0, false)).toEqual([0.4, 0.4])
  })

  it('leaves a single-interval coda unchanged under rubato', () => {
    // frac is pinned to 0.5 when n<=1, so rubato has no effect
    expect(applyMods([0.3], 1, 0.8, false)).toEqual([0.3])
  })

  it('appends an ornament click sized from the average gap', () => {
    const out = applyMods([0.2, 0.4], 1, 0, true)
    expect(out).toHaveLength(3)
    expect(out[2]).toBeCloseTo(Math.max(0.05, 0.3 * 0.4)) // avg=0.3
  })

  it('never emits an ornament click shorter than 0.05s', () => {
    const out = applyMods([0.01, 0.01], 1, 0, true)
    expect(out[out.length - 1]).toBe(0.05)
  })
})

describe('getPlayableLines', () => {
  it('flags named coda lines, skips tempo/ornament keywords and comments', () => {
    const text = [
      '# comment',        // 0
      'tempo 200',        // 1 — keyword, not playable
      'greet : • •',      // 2 — playable
      '',                 // 3
      'reply : • •',      // 4 — playable
      'ornament : • •',   // 5 — keyword name, not playable
    ].join('\n')
    expect([...getPlayableLines(text)].sort((a, b) => a - b)).toEqual([2, 4])
  })

  it('only recognises the colon form, not the = form (gutter limitation)', () => {
    // NOTE: parseScore accepts "name = ..." too, but the gutter does not light it up.
    expect(getPlayableLines('reply = • •').size).toBe(0)
  })

  it('is case-insensitive about the keyword exclusion', () => {
    expect(getPlayableLines('TEMPO : • •').size).toBe(0)
  })
})
