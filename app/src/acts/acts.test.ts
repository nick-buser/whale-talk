import { describe, it, expect } from 'vitest'
import { calcStats, codaDur, EXCHANGE } from './ActConversation'
import { logFrac } from './ActCapacity'
import { CODAS } from '../lib/data'

describe('ActConversation · codaDur', () => {
  it('sums the intervals of a known coda', () => {
    const c = CODAS.find(c => c.name === '5R1')!
    expect(codaDur('5R1')).toBeCloseTo(c.intervals.reduce((s, v) => s + v, 0))
  })

  it('falls back to 0.8s for an unknown coda name', () => {
    expect(codaDur('nope')).toBe(0.8)
  })
})

describe('ActConversation · calcStats', () => {
  const stats = calcStats()

  it('counts every whale turn exactly once', () => {
    const total = Object.values(stats.turns).reduce((s, v) => s + v, 0)
    expect(total).toBe(EXCHANGE.length)
  })

  it('reports a positive average response latency', () => {
    expect(stats.avgGap).toBeGreaterThan(0)
    expect(stats.minGap).toBeGreaterThan(0)
    expect(stats.minGap).toBeLessThanOrEqual(stats.avgGap)
  })

  it('counts same-coda cross-whale responses as echoes', () => {
    // Reference implementation: a turn echoes when a different whale repeats
    // the previous coda type. (Indices 4, 5 and 13 in the authored data.)
    const expected = EXCHANGE.filter((e, i) =>
      i > 0 && EXCHANGE[i - 1].whale !== e.whale && EXCHANGE[i - 1].coda === e.coda,
    ).length
    expect(stats.echoes).toBe(expected)
    expect(stats.echoes).toBeGreaterThan(0)
  })

  it('derives gaps only from turn changes (never same-whale)', () => {
    // avg latency for these recordings should land in the ~1–2s dialogue band
    expect(stats.avgGap).toBeGreaterThan(0.5)
    expect(stats.avgGap).toBeLessThan(3)
  })
})

describe('ActCapacity · logFrac', () => {
  it('is monotonically increasing in n', () => {
    expect(logFrac(100)).toBeLessThan(logFrac(1000))
    expect(logFrac(1000)).toBeLessThan(logFrac(100000))
  })

  it('floors tiny inputs (never returns a negative fraction)', () => {
    expect(logFrac(1)).toBeGreaterThanOrEqual(0)
    expect(logFrac(0)).toBeGreaterThanOrEqual(0)
  })

  it('maps the top of the scale (200k) to ~1', () => {
    expect(logFrac(200_000)).toBeCloseTo(1, 5)
  })
})
