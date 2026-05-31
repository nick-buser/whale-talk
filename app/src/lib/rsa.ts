/* RSA (Rational Speech Acts) model — pure functions, no React dependencies.
   Implements L0 → S1 → L1 recursion with arousal-gradient likelihood.
   Designed for fitting against Campbell's monkey and titi monkey corpora. */

/** Normalize a vector to sum to 1. Returns uniform if all-zero. */
export function normalize(v: number[]): number[] {
  const s = v.reduce((a, x) => a + x, 0)
  return s === 0 ? v.map(() => 1 / v.length) : v.map(x => x / s)
}

/** Normalize each row of a 2-D matrix independently. */
export function normalizeRows(mat: number[][]): number[][] {
  return mat.map(normalize)
}

/** Normalize each column of a 2-D matrix independently. */
export function normalizeColumns(mat: number[][]): number[][] {
  if (mat.length === 0) return []
  const nRows = mat.length
  const nCols = mat[0].length
  const colSums = Array.from({ length: nCols }, (_, j) =>
    mat.reduce((s, row) => s + (row[j] ?? 0), 0),
  )
  return mat.map(row =>
    row.map((v, j) => (colSums[j] === 0 ? 1 / nRows : v / colSums[j])),
  )
}

/**
 * Literal listener L0.
 * likelihood[u][s] = P(signal u | state s)  — columns sum to 1
 * prior[s]         = P(state s)
 * Returns L0[u][s] = P(state s | signal u)  — rows sum to 1
 */
export function literalListener(likelihood: number[][], prior: number[]): number[][] {
  return likelihood.map(row =>
    normalize(row.map((p, s) => p * (prior[s] ?? 0))),
  )
}

/**
 * Pragmatic speaker S1.
 * L0[u][s]  = P(state s | signal u)  — rows sum to 1
 * alpha     = rationality (higher → more informative)
 * costs[u]  = production cost of signal u (default 0)
 * Returns S1[s][u] = P(signal u | state s)  — rows sum to 1
 */
export function pragmaticSpeaker(L0: number[][], alpha: number, costs: number[]): number[][] {
  const nStates = L0.length > 0 ? L0[0].length : 0
  const nSignals = L0.length
  return Array.from({ length: nStates }, (_, s) =>
    normalize(
      Array.from({ length: nSignals }, (_, u) => {
        const p = L0[u]?.[s] ?? 0
        return p > 0 ? Math.exp(alpha * Math.log(p) - (costs[u] ?? 0)) : 0
      }),
    ),
  )
}

/**
 * Pragmatic listener L1.
 * S1[s][u] = P(signal u | state s)  — rows sum to 1
 * prior[s] = P(state s)
 * Returns L1[u][s] = P(state s | signal u)  — rows sum to 1
 */
export function pragmaticListener(S1: number[][], prior: number[]): number[][] {
  const nSignals = S1.length > 0 ? S1[0].length : 0
  return Array.from({ length: nSignals }, (_, u) =>
    normalize(S1.map((stateRow, s) => (stateRow[u] ?? 0) * (prior[s] ?? 0))),
  )
}

/**
 * Arousal-gradient likelihood.
 * arousalState[s][a]  = P(arousal a | state s)  — rows sum to 1
 * arousalSignal[u][a] = affinity of signal u at arousal level a  — raw, normalized by column
 * Returns likelihood[u][s] = P(signal u | state s)  — columns sum to 1
 *
 * The marginalization: P(u|s) = Σ_a P(u|a) · P(a|s)
 */
export function arousalLikelihood(
  arousalState: number[][],   // [|states|][|arousal|]
  arousalSignal: number[][],  // [|signals|][|arousal|]  — raw affinities
): number[][] {
  const normSig = normalizeColumns(arousalSignal)  // P(signal | arousal) per level
  return normSig.map(sigRow =>
    arousalState.map(stateRow =>
      sigRow.reduce((sum, p_u_a, a) => sum + p_u_a * (stateRow[a] ?? 0), 0),
    ),
  )
}

/**
 * Log-likelihood of observed speaker behavior under model.
 * observed[s][u] = relative frequency of signal u in state s  — rows sum to 1
 * model[s][u]    = speaker probability                         — rows sum to 1
 */
export function logLikelihood(observed: number[][], model: number[][]): number {
  let ll = 0
  for (let s = 0; s < observed.length; s++) {
    for (let u = 0; u < (observed[s]?.length ?? 0); u++) {
      const obs = observed[s][u]
      if (obs > 0) {
        const p = model[s]?.[u] ?? 0
        ll += obs * Math.log(p > 0 ? p : 1e-12)
      }
    }
  }
  return ll
}

export interface FitResult {
  alpha: number
  costs: number[]
  logLik: number
  L0: number[][]
  S1: number[][]
  L1: number[][]
}

/**
 * Grid search over alpha and costs maximizing log-likelihood of observed data under S1.
 * observed[s][u]  = production frequencies  — rows sum to 1
 * likelihood[u][s] = prior lexical associations  — columns sum to 1
 * prior[s]        = base rates of states
 */
export function fit(
  observed: number[][],
  likelihood: number[][],
  prior: number[],
  alphaGrid: number[],
  costsGrid: number[][],
): FitResult {
  const L0 = literalListener(likelihood, prior)
  let best: FitResult | null = null

  for (const alpha of alphaGrid) {
    for (const costs of costsGrid) {
      const S1 = pragmaticSpeaker(L0, alpha, costs)
      const L1 = pragmaticListener(S1, prior)
      const ll = logLikelihood(observed, S1)
      if (best === null || ll > best.logLik) {
        best = { alpha, costs: [...costs], logLik: ll, L0, S1, L1 }
      }
    }
  }

  const nSignals = likelihood.length
  return best ?? {
    alpha: 1,
    costs: new Array(nSignals).fill(0),
    logLik: -Infinity,
    L0,
    S1: L0,
    L1: L0,
  }
}
