/* RSA model data: Campbell's monkey and titi monkey call corpora.
   Observed frequencies are approximate, drawn from published field studies.
   Arousal parameters are calibrated to qualitative urgency descriptions. */

import { normalize, arousalLikelihood } from './rsa'

/* ── Campbell's monkey (Cercopithecus campbelli) ─────────────── */

export const CAMPBELLS_STATE_LABELS = [
  'Eagle', 'Leopard', 'Neighbor group', 'Non-predator',
] as const

export const CAMPBELLS_SIGNAL_LABELS = [
  'krak', 'krak-oo', 'hok', 'hok-oo', 'boom',
] as const

export type CampbellsState = (typeof CAMPBELLS_STATE_LABELS)[number]
export type CampbellsSignal = (typeof CAMPBELLS_SIGNAL_LABELS)[number]

/**
 * Observed production frequencies [state][signal], normalized.
 * Source: Zuberbühler 2001 (eagle/leopard predator models);
 *         Schlenker et al. 2016 (krak-oo/hok-oo suffix semantics, approximate).
 */
export const CAMPBELLS_OBSERVED: number[][] = [
  normalize([30, 55,  5,  8,  2]),  // eagle        → krak-oo dominant
  normalize([65,  5,  5,  5, 20]),  // leopard      → krak dominant
  normalize([20,  5, 10,  5, 60]),  // neighbor grp → boom dominant
  normalize([15,  5,  5,  5, 70]),  // non-predator → boom dominant
]

export const CAMPBELLS_AROUSAL_LABELS = ['low', 'medium', 'high'] as const

/**
 * P(arousal | state) [state][arousal = low/medium/high], rows sum to 1.
 * Calibrated from Zuberbühler 2001 predator-urgency gradient.
 */
export const CAMPBELLS_AROUSAL_STATE: number[][] = [
  normalize([0.05, 0.25, 0.70]),  // eagle        → high arousal
  normalize([0.05, 0.25, 0.70]),  // leopard      → high arousal (same urgency)
  normalize([0.20, 0.50, 0.30]),  // neighbor grp → medium arousal
  normalize([0.60, 0.30, 0.10]),  // non-predator → low arousal
]

/**
 * Arousal-signal affinity [signal][arousal = low/medium/high].
 * Raw (unnormalized by column); arousalLikelihood normalizes internally.
 * krak-oo → highest arousal; boom → lowest arousal.
 */
export const CAMPBELLS_AROUSAL_SIGNAL: number[][] = [
  [0.10, 0.35, 0.55],  // krak:    medium-high
  [0.02, 0.15, 0.83],  // krak-oo: highest arousal
  [0.10, 0.50, 0.40],  // hok:     medium
  [0.05, 0.35, 0.60],  // hok-oo:  medium-high
  [0.73, 0.15, 0.12],  // boom:    lowest arousal
]

/** Likelihood[signal][state] = P(signal | state), derived via arousal model. */
export const CAMPBELLS_LIKELIHOOD: number[][] = arousalLikelihood(
  CAMPBELLS_AROUSAL_STATE,
  CAMPBELLS_AROUSAL_SIGNAL,
)

/** Uniform prior over the four Campbell's states. */
export const CAMPBELLS_PRIOR: number[] = normalize([1, 1, 1, 1])

/* ── Titi monkey (Callicebus nigrifrons) ─────────────────────── */

export const TITI_STATE_LABELS = [
  'Raptor', 'Cat', 'No predator',
] as const

export const TITI_SIGNAL_LABELS = [
  'A-only', 'B-only', 'A→B seq', 'B→A seq',
] as const

export type TitiState = (typeof TITI_STATE_LABELS)[number]
export type TitiSignal = (typeof TITI_SIGNAL_LABELS)[number]

/**
 * Observed production frequencies [state][signal], normalized.
 * Source: Berthet et al. 2019 (Sci. Adv.) — wild titi monkey field recordings.
 * A-calls: aerial/raptor alarm; B-calls: calm/contact/cat context.
 * Sequences encode predator type × location conjunctively.
 */
export const TITI_OBSERVED: number[][] = [
  normalize([60,  5, 30,  5]),  // raptor:      A-only, then A→B
  normalize([10, 30,  5, 55]),  // cat:         B→A dominant
  normalize([10, 70,  5, 15]),  // no predator: B-only dominant
]

/**
 * Semantic likelihood [signal][state] = P(signal | state), columns sum to 1.
 * Direct specification reflecting call-type associations in Berthet et al.
 */
export const TITI_LIKELIHOOD: number[][] = [
  normalize([0.80, 0.10, 0.10]),  // A-only:  raptor >> cat > no-pred
  normalize([0.10, 0.30, 0.60]),  // B-only:  no-pred >> cat > raptor
  normalize([0.55, 0.25, 0.20]),  // A→B seq: raptor-biased
  normalize([0.15, 0.60, 0.25]),  // B→A seq: cat-biased
]

/** Uniform prior over the three titi states. */
export const TITI_PRIOR: number[] = normalize([1, 1, 1])
