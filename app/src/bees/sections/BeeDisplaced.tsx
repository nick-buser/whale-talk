import { useState } from 'react'

/* ── Displacement spectrum ─────────────────────────────────── */
interface DisplacementCase {
  id: string
  species: string
  color: string
  system: string
  temporal: string   // how far displaced in time
  spatial: string    // how far displaced in space
  productive: boolean
  learned: boolean
  notes: string
}

const CASES: DisplacementCase[] = [
  {
    id: 'bee-waggle',
    species: 'Honeybee', color: '#f4c430',
    system: 'Waggle dance',
    temporal: 'Hours (recent visit)',
    spatial: 'Up to 10 km',
    productive: true,
    learned: false,
    notes: 'Full polar-coordinate encoding of an absent location. Receiver has never visited site. Innate motor program, not culturally transmitted.',
  },
  {
    id: 'human-lang',
    species: 'Human', color: '#ff6b54',
    system: 'Language',
    temporal: 'Unbounded (past & future)',
    spatial: 'Unbounded (real & hypothetical)',
    productive: true,
    learned: true,
    notes: 'Full displacement in all dimensions: temporal, spatial, counterfactual, fictional. Culturally transmitted, compositionally productive.',
  },
  {
    id: 'bonobo-lexigraph',
    species: 'Bonobo (Kanzi)', color: '#b57bee',
    system: 'Lexigrams (trained)',
    temporal: 'Minutes to hours',
    spatial: 'Same building/site',
    productive: false,
    learned: true,
    notes: 'Kanzi could request objects and locations not immediately present. Displacement is limited in range and requires extensive training.',
  },
  {
    id: 'ant-trail',
    species: 'Ant (Temnothorax)', color: '#8ae04a',
    system: 'Tandem running',
    temporal: 'None (real-time only)',
    spatial: 'None (leader present)',
    productive: false,
    learned: false,
    notes: 'Recruiter must escort follower to site — no displacement. The contrast with bees makes the bee waggle dance all the more remarkable.',
  },
  {
    id: 'dolphin-eaq',
    species: 'Bottlenose dolphin', color: '#4afdc6',
    system: 'Echoic-acoustic query (experimental)',
    temporal: 'Seconds',
    spatial: 'Adjacent room',
    productive: false,
    learned: false,
    notes: 'Herman et al. showed dolphins could respond to queries about objects moved out of view. Very limited temporal and spatial range.',
  },
  {
    id: 'crow-cache',
    species: 'Corvid (scrub-jay)', color: '#ffb472',
    system: 'Episodic-like memory',
    temporal: 'Days to weeks',
    spatial: 'Spatial map',
    productive: false,
    learned: false,
    notes: 'Jays cache food and return later — evidence for memory of past events. But there is no communication of this displacement to others.',
  },
]

/* ── What displacement requires ─────────────────────────────── */
interface Requirement {
  id: string
  label: string
  desc: string
  bees: boolean
  humans: boolean
  chimps: boolean
}

const REQUIREMENTS: Requirement[] = [
  { id: 'mental-rep',   label: 'Mental representation of absent referent',    desc: 'The sender must internally represent something not perceptually present.',                   bees: true,  humans: true,  chimps: false },
  { id: 'signal-encod', label: 'Signal that encodes the representation',       desc: 'The internal representation must be converted into a transmissible signal.',                  bees: true,  humans: true,  chimps: false },
  { id: 'receiver-dec', label: 'Receiver decodes signal to representation',   desc: 'The receiver must reconstruct a representation of the absent thing from the signal alone.',   bees: true,  humans: true,  chimps: false },
  { id: 'productive',   label: 'Productive (novel referents communicable)',    desc: 'New, previously unseen locations/objects can be communicated.',                               bees: true,  humans: true,  chimps: false },
  { id: 'learned',      label: 'Convention learned by each individual',        desc: 'The signal system is acquired through learning, not fixed by genome.',                        bees: false, humans: true,  chimps: false },
  { id: 'counterfact',  label: 'Counterfactual/hypothetical displacement',     desc: 'Can communicate about things that do not or could not exist.',                                bees: false, humans: true,  chimps: false },
]

/* ── Key papers ─────────────────────────────────────────────── */
const PAPERS = [
  {
    id: 'von-frisch',
    author: 'von Frisch (1967)',
    title: 'The Dance Language and Orientation of Bees',
    finding: 'First complete decoding of waggle dance direction (solar compass) and distance (run duration). Nobel Prize 1973.',
    accent: '#f4c430',
  },
  {
    id: 'hockett',
    author: 'Hockett (1960)',
    title: 'The origin of speech (Scientific American)',
    finding: 'Introduced 13 design features of language; identified displacement as among the rarest and most significant. Bees cited as the only non-human system with productive displacement.',
    accent: '#ff6b54',
  },
  {
    id: 'gould-gould',
    author: 'Gould & Gould (1988)',
    title: 'The Honey Bee',
    finding: 'Systematic deflector experiments confirming that bees cannot communicate displacement beyond horizon — evidence for limits of the waggle channel.',
    accent: '#4afdc6',
  },
  {
    id: 'kohl',
    author: 'Kohl & Rutschmann (2011)',
    title: 'The first internationally calibrated waggle dance distance function',
    finding: 'Nonlinear regression on forager dances across multiple populations. Duration–distance curve: t = 1.34 ln(d/150 + 1). Supersedes earlier linear estimates.',
    accent: '#8ae04a',
  },
]

export function BeeDisplaced() {
  const [activeCase, setActiveCase] = useState<string>('bee-waggle')
  const [activePaper, setActivePaper] = useState<string | null>(null)

  const cs = CASES.find(c => c.id === activeCase)!

  return (
    <div className="bee-displaced">
      <p className="bee-intro-eyebrow">Displaced Reference</p>
      <h1 className="bee-intro-title">Hockett's Rarest Feature</h1>
      <p className="bee-intro-lede">
        Displacement — the ability to communicate about things absent in time and space —
        is one of the rarest of Hockett's design features. Only bees and humans use it
        productively and without training. Understanding what it requires, and where the bee
        channel falls short of human language, maps the key boundaries.
      </p>

      {/* Displacement spectrum selector */}
      <div>
        <h2 className="bee-section-h2">Displacement Across Systems</h2>
        <p className="bee-intro-sub">Select a system to compare temporal and spatial range.</p>
        <div className="bee-disp-tabs">
          {CASES.map(c => (
            <button
              key={c.id}
              className={`bee-disp-tab${activeCase === c.id ? ' active' : ''}`}
              style={{ '--disp-color': c.color } as React.CSSProperties}
              onClick={() => setActiveCase(c.id)}
            >
              {c.species}
            </button>
          ))}
        </div>
        <div className="bee-disp-panel" style={{ borderColor: cs.color }}>
          <div className="bee-disp-panel-head">
            <span className="bee-disp-panel-species" style={{ color: cs.color }}>{cs.species}</span>
            <span className="bee-disp-panel-sys">{cs.system}</span>
            <div className="bee-disp-panel-badges">
              <span className={`bee-disp-badge${cs.productive ? ' yes' : ' no'}`}>
                {cs.productive ? '✓ Productive' : '✗ Not productive'}
              </span>
              <span className={`bee-disp-badge${cs.learned ? ' yes' : ' no'}`}>
                {cs.learned ? '✓ Culturally learned' : '✗ Innate / trained'}
              </span>
            </div>
          </div>
          <div className="bee-disp-panel-range">
            <div>
              <span className="bee-disp-range-label">Temporal displacement</span>
              <span className="bee-disp-range-val">{cs.temporal}</span>
            </div>
            <div>
              <span className="bee-disp-range-label">Spatial displacement</span>
              <span className="bee-disp-range-val">{cs.spatial}</span>
            </div>
          </div>
          <p className="bee-disp-panel-notes">{cs.notes}</p>
        </div>
      </div>

      {/* What displacement requires */}
      <div>
        <h2 className="bee-section-h2">What Displacement Requires</h2>
        <p className="bee-intro-sub">Cognitive and communicative prerequisites — and where each species meets them.</p>
        <div className="bee-disp-reqs">
          <div className="bee-disp-req-head">
            <span>Requirement</span>
            <span>Bees</span>
            <span>Humans</span>
            <span>Chimps</span>
          </div>
          {REQUIREMENTS.map(r => (
            <div key={r.id} className="bee-disp-req-row">
              <div className="bee-disp-req-left">
                <span className="bee-disp-req-label">{r.label}</span>
                <span className="bee-disp-req-desc">{r.desc}</span>
              </div>
              <span className={`bee-hockett-cell ${r.bees ? 'bee-hockett-yes' : 'bee-hockett-no'}`}>{r.bees ? 'Yes' : 'No'}</span>
              <span className={`bee-hockett-cell ${r.humans ? 'bee-hockett-yes' : 'bee-hockett-no'}`}>{r.humans ? 'Yes' : 'No'}</span>
              <span className={`bee-hockett-cell ${r.chimps ? 'bee-hockett-yes' : 'bee-hockett-no'}`}>{r.chimps ? 'Yes' : 'No'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Limits of bee displacement */}
      <div className="bee-disp-limits">
        <h2 className="bee-section-h2">Limits of the Waggle Channel</h2>
        <div className="bee-disp-limit-grid">
          {[
            { title: 'No counterfactual', body: 'A bee cannot communicate about a location that does not exist, or about what would happen if a food source moved. The channel encodes only real visited locations.' },
            { title: 'No past tense', body: 'The dance represents a recent foraging visit (same day). There is no mechanism to encode "yesterday\'s patch" versus "this morning\'s patch".' },
            { title: 'No novelty beyond geography', body: 'The system cannot communicate anything other than location, direction, distance, and quality. It is a one-domain channel with no generalization beyond foraging.' },
            { title: 'Horizon effect', body: 'Gould & Gould\'s deflector experiments: if the indicated site is over water or beyond a hill bees recognize as impassable, recruits do not search there — evidence of pragmatic filtering but also channel rigidity.' },
          ].map(item => (
            <div key={item.title} className="bee-disp-limit-card">
              <span className="bee-disp-limit-title">{item.title}</span>
              <p className="bee-disp-limit-body">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key papers */}
      <div>
        <h2 className="bee-section-h2">Landmark Papers</h2>
        <div className="bee-disp-papers">
          {PAPERS.map(p => (
            <div
              key={p.id}
              className={`bee-disp-paper${activePaper === p.id ? ' active' : ''}`}
              style={{ '--paper-accent': p.accent } as React.CSSProperties}
              onClick={() => setActivePaper(activePaper === p.id ? null : p.id)}
            >
              <span className="bee-disp-paper-author">{p.author}</span>
              <span className="bee-disp-paper-title">{p.title}</span>
              {activePaper === p.id && (
                <p className="bee-disp-paper-finding">{p.finding}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
