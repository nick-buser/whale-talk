import { describe, it, expect } from 'vitest'
import {
  zipfCurve, CODAS, CODA_NET, HUMP_SONG_ANN, RANGES, SPECIES,
} from './data'
import { CodaSchema, SpeciesSchema } from './schemas'

describe('zipfCurve', () => {
  it('returns n points ranked 1..n', () => {
    const pts = zipfCurve(1.0, 25)
    expect(pts).toHaveLength(25)
    expect(pts[0].rank).toBe(1)
    expect(pts[24].rank).toBe(25)
  })

  it('is normalised so frequencies sum to the total', () => {
    const total = 10000
    const pts = zipfCurve(1.07, 40, total)
    const sum = pts.reduce((s, p) => s + p.freq, 0)
    expect(sum).toBeCloseTo(total, 6)
  })

  it('is monotonically non-increasing for a positive exponent', () => {
    const pts = zipfCurve(1.1, 50)
    for (let i = 1; i < pts.length; i++) {
      expect(pts[i].freq).toBeLessThanOrEqual(pts[i - 1].freq)
    }
  })

  it('is nearly flat for an exponent close to zero', () => {
    const pts = zipfCurve(0.01, 10, 1000)
    const ratio = pts[9].freq / pts[0].freq
    expect(ratio).toBeGreaterThan(0.9) // almost uniform
  })
})

describe('CODAS data integrity', () => {
  it('every coda matches the schema', () => {
    CODAS.forEach(c => expect(() => CodaSchema.parse(c)).not.toThrow())
  })

  it('has unique names', () => {
    const names = CODAS.map(c => c.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('has only positive intervals (so total duration is positive)', () => {
    CODAS.forEach(c => {
      expect(c.intervals.length).toBeGreaterThan(0)
      c.intervals.forEach(iv => expect(iv).toBeGreaterThan(0))
    })
  })

  it('assigns every coda to a known clan', () => {
    CODAS.forEach(c => expect(['EC1', 'EC2']).toContain(c.clan))
  })
})

describe('CODA_NET', () => {
  it('every link references an existing node id', () => {
    const ids = new Set(CODA_NET.nodes.map(n => n.id))
    CODA_NET.links.forEach(l => {
      expect(ids.has(l.source)).toBe(true)
      expect(ids.has(l.target)).toBe(true)
    })
  })

  it('exposes one node per catalogued coda', () => {
    expect(CODA_NET.nodes).toHaveLength(CODAS.length)
  })
})

describe('SPECIES data integrity', () => {
  it('every species matches the schema', () => {
    SPECIES.forEach(s => expect(() => SpeciesSchema.parse(s)).not.toThrow())
  })

  it('frequency ranges are ordered low < high', () => {
    SPECIES.forEach(s => expect(s.freq[0]).toBeLessThan(s.freq[1]))
  })
})

describe('RANGES', () => {
  it('peak distance never exceeds max distance', () => {
    RANGES.forEach(r => expect(r.peak).toBeLessThanOrEqual(r.max))
  })
})

describe('HUMP_SONG_ANN duration annotation', () => {
  it('assigns a positive total song duration', () => {
    expect(HUMP_SONG_ANN.dur).toBeGreaterThan(0)
  })

  it('orders units chronologically with t1 > t0 within each unit', () => {
    let lastStart = -Infinity
    HUMP_SONG_ANN.themes.forEach(t => {
      expect(t.t0).toBeLessThan(t.t1!)
      t.phrases.forEach(p =>
        p.subphrases.forEach(sp =>
          sp.units.forEach(u => {
            expect(u.t1!).toBeGreaterThan(u.t0!)
            expect(u.t0!).toBeGreaterThanOrEqual(lastStart)
            lastStart = u.t0!
          }),
        ),
      )
    })
  })

  it('keeps every theme window inside the song span', () => {
    HUMP_SONG_ANN.themes.forEach(t => {
      expect(t.t0!).toBeGreaterThanOrEqual(0)
      expect(t.t1!).toBeLessThanOrEqual(HUMP_SONG_ANN.dur!)
    })
  })
})
