import { useState } from 'react'
import { Link } from '@tanstack/react-router'

type Confidence = 'firm' | 'leaning' | 'open'

interface Claim {
  id: string
  to: string
  claim: string
  confidence: Confidence
  pct: number
  why: string
  break: string
  move: string
}

const CONF_LABEL: Record<Confidence, string> = {
  firm:    'Firm',
  leaning: 'Leaning',
  open:    'Genuinely open',
}

const CLAIMS: Claim[] = [
  {
    id: 'distillation',
    to: 'compressibility',
    claim: 'LLMs are cultural distillation — a third category, neither convergence nor homology.',
    confidence: 'firm',
    pct: 86,
    why: 'It is not just a metaphor; it has testable consequences. If a system inherits the behavioral product without the generative process, you predict exactly what we see: strong local statistics, weak systematic productivity, failure at compositional extrapolation. The framework predicts the anomalies instead of merely labelling them.',
    break: 'If models trained from scratch on non-linguistic structured data spontaneously developed the full human bundle, "distillation" would lose its teeth. So far they do not.',
    move: 'Keep it — but separate the part that is distilled from the part that might be genuinely convergent (compression). That separation is the work of the final section.',
  },
  {
    id: 'tc0',
    to: 'scratchpad',
    claim: 'The TC⁰ result shows formal class and empirical performance are decoupled.',
    confidence: 'firm',
    pct: 82,
    why: 'A fixed transformer sits below the regular languages, yet models mildly context-sensitive human language better than anything ever built. That is real and it breaks the intuition that climbing the Chomsky hierarchy is what matters.',
    break: 'The decoupling is about idealized, single-pass expressivity. The moment you add a scratchpad, the formal ceiling moves — so the irony is narrower than the slogan "transformers are below birdsong" suggests.',
    move: 'Sharpen, do not retract. The honest version: a one-shot transformer is weak; a transformer that thinks out loud is not. The next section makes that concrete.',
  },
  {
    id: 'grounding',
    to: 'grounding',
    claim: 'Text-only models lack the kind of grounding semantics requires.',
    confidence: 'leaning',
    pct: 68,
    why: 'Grounding is not one property. Pull it apart and text-only models clearly have rich inferential-role meaning but lack referential grounding — a causal-informational link to what words pick out. On the view that reference is what semantics needs, that gap is decisive.',
    break: 'It rests on a contested premise: that referential grounding is necessary for meaning at all. Inferentialists deny it. If they are right, the gap is not fatal.',
    move: 'We were too even-handed before. Plant the flag between Bender (too strong) and Piantadosi (too permissive), on the Mollo–Millière middle — and say so out loud.',
  },
  {
    id: 'compositionality',
    to: 'scratchpad',
    claim: 'Compositionality is present but brittle — the keystone is cracked.',
    confidence: 'leaning',
    pct: 71,
    why: 'Dziri\'s multiplication results show transformers reduce multi-step composition to linearized subgraph matching, and accuracy falls off a cliff as the problem deepens. Systematicity needs a meta-learning objective, not scale alone (Lake & Baroni).',
    break: 'Chain-of-thought and tool use recover much of the brittle behavior. "Brittle without scaffolding" is a weaker — and truer — claim than "absent."',
    move: 'Qualify: brittle in a single forward pass, far more robust with externalized reasoning. The keystone is cracked, not missing.',
  },
  {
    id: 'compression',
    to: 'compressibility',
    claim: 'Shared compressibility is the best candidate for genuine convergence.',
    confidence: 'open',
    pct: 52,
    why: 'Language modeling is provably equivalent to lossless compression, and biological codes obey the same efficiency laws. Of every resemblance in the grid, this is the one most likely to be deep rather than borrowed.',
    break: 'Compressibility is a consequence of efficient coding under a bottleneck — not a cause. If LLMs show the signature only because they ingested already-compressed human text, it is an echo, not a convergence. We cannot yet tell which.',
    move: 'This is the sharpest unresolved question in the whole analysis. The final section designs the experiment that would distinguish the two stories.',
  },
  {
    id: 'bottleneck',
    to: 'compressibility',
    claim: 'The inverted-bottleneck argument explains LLM structure.',
    confidence: 'open',
    pct: 44,
    why: 'Kirby shows human compositionality is an adaptation to a transmission bottleneck. LLMs ingest the product of that bottleneck without undergoing the process — and model collapse under recursive self-training looks like its photographic negative.',
    break: 'RLHF and instruction tuning arguably do impose a bottleneck — outputs are filtered through human raters. Whether that selects for structure or merely for tone is unestablished, and model collapse may be about data diversity rather than the structural argument we leaned on.',
    move: 'This was the most speculative section, presented too cleanly. Flag it as a hypothesis, not a result — and engage the RLHF-as-bottleneck counterpoint honestly.',
  },
]

export function FrontiersIntro() {
  const [open, setOpen] = useState<string | null>('distillation')

  return (
    <div className="fr-section">
      <p className="fr-eyebrow">Coda · The Open Edge</p>
      <h1 className="fr-title">The Open Edge</h1>
      <p className="fr-lede">
        The eight pillars built a confident structure. The honest thing is to walk back to the seams.
        Here are six claims from the Machine Language analysis, sorted not by how good they sound but by
        how much weight the evidence can actually bear — from <em>firm</em>, through <em>leaning</em>, to
        <em> genuinely open</em>. Each one opens onto a section that makes the debate interactive.
      </p>

      <div className="fr-legend">
        <span className="fr-legend-item"><span className="fr-dot firm" /> Firm — I would defend this</span>
        <span className="fr-legend-item"><span className="fr-dot leaning" /> Leaning — a side, not a settlement</span>
        <span className="fr-legend-item"><span className="fr-dot open" /> Genuinely open — the evidence is split</span>
      </div>

      <div className="fr-claims">
        {CLAIMS.map(c => {
          const isOpen = open === c.id
          return (
            <div key={c.id} className={`fr-claim ${c.confidence}${isOpen ? ' open' : ''}`}>
              <button className="fr-claim-head" onClick={() => setOpen(isOpen ? null : c.id)} aria-expanded={isOpen}>
                <span className="fr-claim-meter" aria-hidden="true">
                  <span className="fr-claim-meter-fill" style={{ width: `${c.pct}%` }} />
                </span>
                <span className="fr-claim-main">
                  <span className={`fr-claim-conf ${c.confidence}`}>{CONF_LABEL[c.confidence]} · {c.pct}%</span>
                  <span className="fr-claim-text">{c.claim}</span>
                </span>
                <span className="fr-claim-chevron">{isOpen ? '–' : '+'}</span>
              </button>
              {isOpen && (
                <div className="fr-claim-body">
                  <div className="fr-claim-row">
                    <span className="fr-claim-row-label why">Why it holds</span>
                    <p>{c.why}</p>
                  </div>
                  <div className="fr-claim-row">
                    <span className="fr-claim-row-label break">Where it could break</span>
                    <p>{c.break}</p>
                  </div>
                  <div className="fr-claim-row">
                    <span className="fr-claim-row-label move">The sharpened move</span>
                    <p>{c.move}</p>
                  </div>
                  <Link to="/frontiers/$section" params={{ section: c.to }} className="fr-claim-link">
                    Explore it interactively →
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="fr-callout">
        <strong>Why a whole tab for the doubts?</strong> Because the unresolved questions are the most
        alive part of the subject — and because a comparison this ambitious earns trust only by showing
        its own load-bearing assumptions. The other tabs argue a case. This one stress-tests it.
      </div>
    </div>
  )
}
