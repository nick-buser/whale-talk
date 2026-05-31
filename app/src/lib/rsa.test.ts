import { describe, it, expect } from 'vitest'
import {
  normalize, normalizeRows, normalizeColumns,
  literalListener, pragmaticSpeaker, pragmaticListener,
  arousalLikelihood, logLikelihood, fit,
} from './rsa'

const approx = (a: number, b: number, eps = 1e-10) => Math.abs(a - b) < eps
const sumRow = (row: number[]) => row.reduce((a, x) => a + x, 0)
const entropy = (v: number[]) => -v.reduce((s, p) => (p > 0 ? s + p * Math.log(p) : s), 0)

/* ── normalize ───────────────────────────────────────────────── */
describe('normalize', () => {
  it('sums to 1', () => {
    expect(approx(sumRow(normalize([1, 2, 3])), 1)).toBe(true)
  })

  it('returns uniform for all-zero input', () => {
    expect(normalize([0, 0, 0])).toEqual([1 / 3, 1 / 3, 1 / 3])
  })

  it('is identity on a valid distribution', () => {
    const v = [0.2, 0.5, 0.3]
    expect(normalize(v)).toEqual(v)
  })

  it('handles a single-element vector', () => {
    expect(normalize([5])).toEqual([1])
  })
})

/* ── normalizeRows ───────────────────────────────────────────── */
describe('normalizeRows', () => {
  it('every row sums to 1', () => {
    const mat = normalizeRows([[1, 1], [3, 1]])
    mat.forEach(row => expect(approx(sumRow(row), 1)).toBe(true))
  })

  it('rows are normalized independently', () => {
    const mat = normalizeRows([[3, 1], [1, 3]])
    expect(approx(mat[0][0], 0.75)).toBe(true)
    expect(approx(mat[1][1], 0.75)).toBe(true)
  })
})

/* ── normalizeColumns ────────────────────────────────────────── */
describe('normalizeColumns', () => {
  it('every column sums to 1', () => {
    const mat = normalizeColumns([[1, 3], [1, 1]])
    expect(approx(mat[0][0] + mat[1][0], 1)).toBe(true)
    expect(approx(mat[0][1] + mat[1][1], 1)).toBe(true)
  })

  it('produces correct normalized values', () => {
    const mat = normalizeColumns([[1, 3], [1, 1]])
    // Col 0: [1,1] → [0.5, 0.5]; Col 1: [3,1] → [0.75, 0.25]
    expect(approx(mat[0][0], 0.5)).toBe(true)
    expect(approx(mat[0][1], 0.75)).toBe(true)
    expect(approx(mat[1][1], 0.25)).toBe(true)
  })

  it('returns uniform column for all-zero column', () => {
    const mat = normalizeColumns([[0, 1], [0, 1]])
    expect(approx(mat[0][0], 0.5)).toBe(true)
    expect(approx(mat[1][0], 0.5)).toBe(true)
  })

  it('returns empty for empty input', () => {
    expect(normalizeColumns([])).toEqual([])
  })
})

/* ── literalListener ─────────────────────────────────────────── */
describe('literalListener', () => {
  it('every row sums to 1', () => {
    const L0 = literalListener([[0.8, 0.2], [0.3, 0.7]], [0.5, 0.5])
    L0.forEach(row => expect(approx(sumRow(row), 1)).toBe(true))
  })

  it('with uniform prior, row is proportional to likelihood row', () => {
    const L0 = literalListener([[0.8, 0.2], [0.3, 0.7]], [0.5, 0.5])
    // L0[0] ∝ [0.8, 0.2] → [0.8, 0.2]
    expect(approx(L0[0][0], 0.8)).toBe(true)
    expect(approx(L0[0][1], 0.2)).toBe(true)
  })

  it('skewed prior shifts posterior toward the high-prior state', () => {
    const L0 = literalListener([[0.5, 0.5]], [0.8, 0.2])
    // Both states equally likely given signal; prior dominates
    expect(L0[0][0]).toBeGreaterThan(L0[0][1])
  })

  it('handles zero-likelihood entries without NaN', () => {
    const L0 = literalListener([[0, 1], [1, 0]], [0.5, 0.5])
    // signal 0 only compatible with state 1; signal 1 only with state 0
    expect(approx(L0[0][1], 1)).toBe(true)
    expect(approx(L0[1][0], 1)).toBe(true)
  })
})

/* ── pragmaticSpeaker ────────────────────────────────────────── */
describe('pragmaticSpeaker', () => {
  it('every row sums to 1', () => {
    const L0 = literalListener([[0.8, 0.2], [0.3, 0.7]], [0.5, 0.5])
    const S1 = pragmaticSpeaker(L0, 1, [0, 0])
    S1.forEach(row => expect(approx(sumRow(row), 1)).toBe(true))
  })

  it('alpha=0 yields a uniform distribution over signals with non-zero L0', () => {
    const L = [[0.9, 0.1], [0.1, 0.9]]
    const L0 = literalListener(L, [0.5, 0.5])
    const S1 = pragmaticSpeaker(L0, 0, [0, 0])
    // exp(0 * log(p)) = 1 for all p > 0 → uniform after normalization
    S1.forEach(row => expect(approx(row[0], row[1])).toBe(true))
  })

  it('higher alpha sharpens toward the most-informative signal', () => {
    const L = [[0.9, 0.1], [0.1, 0.9]]
    const L0 = literalListener(L, [0.5, 0.5])
    const S1_low = pragmaticSpeaker(L0, 1, [0, 0])
    const S1_high = pragmaticSpeaker(L0, 10, [0, 0])
    expect(S1_high[0][0]).toBeGreaterThan(S1_low[0][0])  // state 0: more signal 0
    expect(S1_high[1][1]).toBeGreaterThan(S1_low[1][1])  // state 1: more signal 1
  })

  it('costs suppress expensive signals', () => {
    // Signals equally informative — cost alone drives selection
    const L0 = literalListener([[0.5, 0.5], [0.5, 0.5]], [0.5, 0.5])
    const S1 = pragmaticSpeaker(L0, 1, [0, 10])  // signal 1 very costly
    S1.forEach(row => expect(row[0]).toBeGreaterThan(row[1]))
  })

  it('produces scalar-implicature-like sharpening', () => {
    // "some" (u0) true in both states; "all" (u1) true only in state 1
    const L = [[1, 1], [0, 1]]  // likelihood[u][s]
    const L0 = literalListener(L, [0.5, 0.5])
    const S1 = pragmaticSpeaker(L0, 2, [0, 0])
    // State 0 (some-not-all): must say "some" (only compatible signal)
    expect(S1[0][0]).toBeGreaterThan(S1[0][1])
    // State 1 (all): prefers "all" over "some"
    expect(S1[1][1]).toBeGreaterThan(S1[1][0])
  })
})

/* ── pragmaticListener ───────────────────────────────────────── */
describe('pragmaticListener', () => {
  it('every row sums to 1', () => {
    const L0 = literalListener([[0.8, 0.2], [0.2, 0.8]], [0.5, 0.5])
    const S1 = pragmaticSpeaker(L0, 2, [0, 0])
    const L1 = pragmaticListener(S1, [0.5, 0.5])
    L1.forEach(row => expect(approx(sumRow(row), 1)).toBe(true))
  })

  it('L1 has strictly lower average row-entropy than L0 (pragmatics sharpens)', () => {
    const L = [[0.8, 0.2], [0.2, 0.8]]
    const prior = [0.5, 0.5]
    const L0 = literalListener(L, prior)
    const S1 = pragmaticSpeaker(L0, 2, [0, 0])
    const L1 = pragmaticListener(S1, prior)
    const avgH = (mat: number[][]) => mat.reduce((s, r) => s + entropy(r), 0) / mat.length
    expect(avgH(L1)).toBeLessThan(avgH(L0))
  })

  it('prior skews L1 toward high-prior states when signal is ambiguous', () => {
    // One signal, both states equally likely to produce it
    const S1 = [[0.5, 0.5], [0.5, 0.5]]  // speaker indifferent
    const L1 = pragmaticListener(S1, [0.9, 0.1])
    expect(L1[0][0]).toBeGreaterThan(L1[0][1])  // state 0 favored by prior
  })
})

/* ── arousalLikelihood ───────────────────────────────────────── */
describe('arousalLikelihood', () => {
  it('output columns sum to 1 (valid signal distribution per state)', () => {
    const arousalState = [[0.1, 0.5, 0.4], [0.4, 0.4, 0.2]]
    const arousalSignal = [[8, 3, 1], [2, 7, 9]]  // raw affinities (columns ≠ 1)
    const L = arousalLikelihood(arousalState, arousalSignal)
    for (let s = 0; s < arousalState.length; s++) {
      expect(approx(L.reduce((sum, row) => sum + row[s], 0), 1)).toBe(true)
    }
  })

  it('returns correct dimensions [|signals|][|states|]', () => {
    const L = arousalLikelihood(
      Array.from({ length: 3 }, () => [0.5, 0.5]),   // 3 states, 2 arousal
      Array.from({ length: 4 }, () => [0.5, 0.5]),   // 4 signals
    )
    expect(L.length).toBe(4)
    expect(L[0].length).toBe(3)
  })

  it('high-arousal state gets higher P(alarm signal) than low-arousal state', () => {
    // s0 = calm state; s1 = alarmed state
    const arousalState = [[0.9, 0.1], [0.1, 0.9]]  // [s][a=low,high]
    // u0 = calm call (low arousal); u1 = alarm call (high arousal)
    const arousalSignal = [[9, 1], [1, 9]]  // raw — cols sum to 10 before normalization
    const L = arousalLikelihood(arousalState, arousalSignal)
    expect(L[1][1]).toBeGreaterThan(L[0][1])  // alarm more likely in alarmed state
    expect(L[0][0]).toBeGreaterThan(L[1][0])  // calm more likely in calm state
  })

  it('uniform arousal signal affinities yield uniform likelihood per state', () => {
    const arousalState = [[0.3, 0.7], [0.7, 0.3]]
    const arousalSignal = [[1, 1], [1, 1]]  // identical affinities across arousal
    const L = arousalLikelihood(arousalState, arousalSignal)
    // All signals should be equally likely regardless of state
    L.forEach(row => row.forEach(v => expect(approx(v, 0.5)).toBe(true)))
  })
})

/* ── logLikelihood ───────────────────────────────────────────── */
describe('logLikelihood', () => {
  it('returns 0 when model perfectly predicts observed', () => {
    const obs = [[1, 0], [0, 1]]
    const model = [[1, 0], [0, 1]]
    expect(approx(logLikelihood(obs, model), 0)).toBe(true)
  })

  it('returns a very negative value when model assigns near-zero probability to observed', () => {
    const obs = [[1, 0]]
    const model = [[0, 1]]  // 0 probability for the observed signal
    expect(logLikelihood(obs, model)).toBeLessThan(-20)
  })

  it('better-matched model gives higher log-likelihood', () => {
    const obs = [[0.8, 0.2], [0.2, 0.8]]
    const good = [[0.7, 0.3], [0.3, 0.7]]
    const bad = [[0.3, 0.7], [0.7, 0.3]]
    expect(logLikelihood(obs, good)).toBeGreaterThan(logLikelihood(obs, bad))
  })

  it('zero observed frequencies do not contribute (skipped)', () => {
    const obs = [[0, 1], [1, 0]]
    const model = [[0, 1], [1, 0]]  // model correct where obs > 0
    expect(approx(logLikelihood(obs, model), 0)).toBe(true)
  })
})

/* ── fit ─────────────────────────────────────────────────────── */
describe('fit', () => {
  it('returns a FitResult with defined L0, S1, L1 and finite logLik', () => {
    const L = [[0.8, 0.2], [0.2, 0.8]]
    const result = fit([[0.9, 0.1], [0.1, 0.9]], L, [0.5, 0.5], [1, 2], [[0, 0]])
    expect(result.alpha).toBeDefined()
    expect(result.L0.length).toBeGreaterThan(0)
    expect(result.S1.length).toBeGreaterThan(0)
    expect(result.L1.length).toBeGreaterThan(0)
    expect(isFinite(result.logLik)).toBe(true)
  })

  it('best logLik is ≥ logLik of every individual grid point', () => {
    const L = [[0.7, 0.3], [0.4, 0.6]]
    const prior = [0.5, 0.5]
    const obs = [[0.8, 0.2], [0.2, 0.8]]
    const alphaGrid = [0.5, 1, 2]
    const costsGrid = [[0, 0], [0.5, 0], [0, 0.5]]
    const result = fit(obs, L, prior, alphaGrid, costsGrid)
    const L0 = literalListener(L, prior)
    for (const a of alphaGrid) {
      for (const c of costsGrid) {
        const ll = logLikelihood(obs, pragmaticSpeaker(L0, a, c))
        expect(result.logLik).toBeGreaterThanOrEqual(ll - 1e-10)
      }
    }
  })

  it('selects a higher alpha when observed data is more peaked than L0', () => {
    // Fully peaked observed → high rationality needed
    const L = [[0.8, 0.2], [0.2, 0.8]]
    const result = fit([[1, 0], [0, 1]], L, [0.5, 0.5], [0.1, 1, 10], [[0, 0]])
    expect(result.alpha).toBeGreaterThanOrEqual(1)
  })

  it('S1 rows sum to 1 in the returned best model', () => {
    const L = [[0.6, 0.4], [0.4, 0.6]]
    const result = fit([[0.7, 0.3], [0.3, 0.7]], L, [0.5, 0.5], [1, 2], [[0, 0]])
    result.S1.forEach(row => expect(approx(sumRow(row), 1)).toBe(true))
  })
})
