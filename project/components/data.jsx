/* DATA — all values illustrative, grounded in published bioacoustics
   but clearly hand-curated for visualization. NEVER cite as primary source.
   References (general): Payne & McVay 1971; Whitehead & Rendell 2014;
   Sharma et al. 2024 (Project CETI sperm-whale combinatorics);
   Cazau et al.; Garland et al. on humpback song revolution. */

/* ── Lumen-family colors for series ─────────────────────── */
const SPECIES_COLORS = {
  sperm:    '#4afdc6',  // lumen — protagonist
  humpback: '#c6ffe6',  // lumen-bright
  blue:     '#7da6ff',  // cooler blue, twilight-ish
  orca:     '#ffb472',  // krill warm accent
  fin:      '#5b82b8',  // shoal
  beluga:   '#b6c8df',  // mist
};

/* ── Species: depth/frequency/body — for the spectrum atlas ── */
const SPECIES = [
  {
    id: 'sperm', name: 'Sperm whale', latin: 'Physeter macrocephalus',
    color: SPECIES_COLORS.sperm,
    freq:   [100,   30000],  // click bandwidth, Hz (peak ~10kHz)
    peakHz: 10000,
    depth:  [0, 2250],       // typical max foraging depth
    body:   16.0,            // m, bull
    voice:  'Codas — discrete click trains, the only known non-human animal with combinatorial rhythm.',
    sample: 'codaTrain',
  },
  {
    id: 'humpback', name: 'Humpback whale', latin: 'Megaptera novaeangliae',
    color: SPECIES_COLORS.humpback,
    freq:   [30, 8000],
    peakHz: 250,
    depth:  [0, 200],
    body:   14.0,
    voice:  'Song — long hierarchical sequences of units, phrases, and themes. Sung mostly by adult males on breeding grounds.',
    sample: 'humpMoan',
  },
  {
    id: 'blue', name: 'Blue whale', latin: 'Balaenoptera musculus',
    color: SPECIES_COLORS.blue,
    freq:   [10, 200],
    peakHz: 25,
    depth:  [0, 300],
    body:   28.0,
    voice:  'Infrasonic moans — the loudest sustained sound made by any animal. Travels across ocean basins via the SOFAR channel.',
    sample: 'blueMoan',
  },
  {
    id: 'orca', name: 'Orca', latin: 'Orcinus orca',
    color: SPECIES_COLORS.orca,
    freq:   [500, 25000],
    peakHz: 4000,
    depth:  [0, 300],
    body:   8.0,
    voice:  'Pod-specific dialects — stable call repertoires that diverge between matrilines and persist for generations.',
    sample: 'orcaCall',
  },
  {
    id: 'fin', name: 'Fin whale', latin: 'Balaenoptera physalus',
    color: SPECIES_COLORS.fin,
    freq:   [16, 100],
    peakHz: 20,
    depth:  [0, 470],
    body:   24.0,
    voice:  'Twenty-hertz pulses — short, intense, near-monotonic. The "heartbeat" of the deep ocean.',
    sample: 'finPulse',
  },
  {
    id: 'beluga', name: 'Beluga', latin: 'Delphinapterus leucas',
    color: SPECIES_COLORS.beluga,
    freq:   [800, 120000],
    peakHz: 50000,
    depth:  [0, 700],
    body:   4.5,
    voice:  'A repertoire of whistles, chirps, and click-burst calls dense enough to earn the nickname "canary of the sea."',
    sample: 'belugaChirp',
  },
];

/* ── Sperm whale coda types ─────────────────────────────────
   A coda is a short stereotyped click pattern. Intervals here are
   inter-click intervals (ICIs) in seconds. These are realistic
   exemplars of types catalogued in Caribbean & Pacific clans
   (Whitehead, Rendell, Gero). */
const CODAS = [
  { name: '5R1',     label: 'Five-regular',   intervals: [0.21, 0.21, 0.21, 0.21],     clan: 'EC1', kind: 'regular' },
  { name: '1+1+3',   label: 'One-one-three',  intervals: [0.42, 0.42, 0.20, 0.20],     clan: 'EC1', kind: 'partition' },
  { name: '1+3',     label: 'One-three',      intervals: [0.55, 0.18, 0.18],           clan: 'EC2', kind: 'partition' },
  { name: '3+3',     label: 'Three-three',    intervals: [0.20, 0.20, 0.46, 0.20, 0.20], clan: 'EC2', kind: 'partition' },
  { name: '4+1',     label: 'Four-one',       intervals: [0.18, 0.18, 0.18, 0.55],     clan: 'EC1', kind: 'partition' },
  { name: '5R2',     label: 'Five-slow',      intervals: [0.30, 0.30, 0.30, 0.30],     clan: 'EC2', kind: 'regular' },
  { name: '2+1+1+1', label: 'Two-ones',       intervals: [0.18, 0.42, 0.42, 0.42],     clan: 'EC1', kind: 'partition' },
  { name: '7R',      label: 'Seven-regular',  intervals: [0.16, 0.16, 0.16, 0.16, 0.16, 0.16], clan: 'EC2', kind: 'regular' },
];

/* CETI 2024-style modifiers — "the sperm-whale phonetic alphabet."
   These four orthogonal features modulate a base coda. */
const CODA_MODIFIERS = [
  { id: 'rubato',  name: 'Rubato',       desc: 'A smooth speeding-up or slowing-down stretched across the whole coda.' },
  { id: 'tempo',   name: 'Tempo',        desc: 'Discrete shifts between fast and slow versions of the same rhythm.' },
  { id: 'ornament',name: 'Ornamentation',desc: 'An extra "grace" click appended at the end.' },
  { id: 'ictus',   name: 'Ictus',        desc: 'A heavier accent on one position in the train.' },
];

/* ── Humpback song hierarchy (a single example song, simplified) ──
   Realistic 5-theme song, each theme being a repetition of a phrase
   of 2-3 subphrases of 2-5 units. Each unit has a synth recipe. */
const HUMP_SONG = {
  themes: [
    {
      id: 'T1', name: 'Low moan',
      phrases: [
        {
          id: 'T1-A',
          subphrases: [
            { id:'sp1', units: [
              { id:'u1', name:'low moan',     f0: 110, f1: 95,  dur: 1.4 },
              { id:'u2', name:'rise',         f0: 95,  f1: 180, dur: 0.9 },
            ]},
            { id:'sp2', units: [
              { id:'u3', name:'low groan',    f0: 80,  f1: 70,  dur: 1.6 },
            ]},
          ]
        }
      ]
    },
    {
      id: 'T2', name: 'Upsweep',
      phrases: [
        {
          id: 'T2-A',
          subphrases: [
            { id:'sp3', units: [
              { id:'u4', name:'upsweep',      f0: 180, f1: 460, dur: 0.7 },
              { id:'u5', name:'cry',          f0: 460, f1: 380, dur: 0.6, vibrato: 6 },
              { id:'u6', name:'short moan',   f0: 220, f1: 200, dur: 0.8 },
            ]},
          ]
        }
      ]
    },
    {
      id: 'T3', name: 'Wop',
      phrases: [
        {
          id: 'T3-A',
          subphrases: [
            { id:'sp4', units: [
              { id:'u7', name:'wop',          f0: 320, f1: 280, dur: 0.45 },
              { id:'u8', name:'wop',          f0: 320, f1: 280, dur: 0.45 },
              { id:'u9', name:'wop',          f0: 320, f1: 280, dur: 0.45 },
              { id:'u10',name:'wop',          f0: 320, f1: 280, dur: 0.45 },
            ]},
          ]
        }
      ]
    },
    {
      id: 'T4', name: 'Trumpet',
      phrases: [
        {
          id: 'T4-A',
          subphrases: [
            { id:'sp5', units: [
              { id:'u11', name:'trumpet',     f0: 380, f1: 540, dur: 1.1, vibrato: 8 },
              { id:'u12', name:'echo',        f0: 200, f1: 160, dur: 1.0 },
            ]},
          ]
        }
      ]
    },
    {
      id: 'T5', name: 'Descending growl',
      phrases: [
        {
          id: 'T5-A',
          subphrases: [
            { id:'sp6', units: [
              { id:'u13', name:'growl',       f0: 90,  f1: 65,  dur: 1.8 },
              { id:'u14', name:'low pulse',   f0: 60,  f1: 60,  dur: 1.2 },
            ]},
          ]
        }
      ]
    },
  ],
};

/* ── Zipf / entropy comparison ─────────────────────────────
   Rank-frequency log-log curves. For human language, frequencies
   follow Zipf's law: f(r) ~ r^-α with α ≈ 1.0. Several biological
   communication systems also produce near-Zipfian distributions —
   one of several pieces of evidence pointing toward structure
   without yet proving language. */
const ZIPF_SOURCES = [
  {
    id: 'english', name: 'English (Brown corpus)',
    alpha: 1.05, n: 80, color: '#eef3fa',
    note: 'Reference: human written prose. Slope ≈ 1.05 — the canonical Zipf.',
  },
  {
    id: 'humpback', name: 'Humpback units',
    alpha: 0.95, n: 60, color: SPECIES_COLORS.humpback,
    note: 'Catalogued unit types from a single Hawaiian song season.',
  },
  {
    id: 'sperm', name: 'Sperm whale codas',
    alpha: 1.10, n: 50, color: SPECIES_COLORS.sperm,
    note: 'Eastern Caribbean clan EC1 + EC2, including CETI 2024 modifier variants.',
  },
  {
    id: 'dolphin', name: 'Dolphin sig. whistles',
    alpha: 0.6, n: 90, color: SPECIES_COLORS.beluga,
    note: 'Tursiops signature whistles — flatter slope, more "unique IDs" than common words.',
  },
  {
    id: 'random', name: 'Uniform random tokens',
    alpha: 0.05, n: 100, color: '#5b82b8',
    note: 'A null model: every token roughly equally likely. Nearly flat in log-log.',
  },
];

/* Generate rank-frequency curve from alpha + n */
function zipfCurve(alpha, n, total = 10000) {
  const points = [];
  let norm = 0;
  for (let r = 1; r <= n; r++) norm += 1 / Math.pow(r, alpha);
  for (let r = 1; r <= n; r++) {
    const f = (1 / Math.pow(r, alpha)) / norm * total;
    points.push({ rank: r, freq: f });
  }
  return points;
}

/* ── Coda co-occurrence network ────────────────────────────
   Nodes are coda types; links represent how often one coda
   transitions to another in observed sequences (illustrative). */
const CODA_NET = {
  nodes: CODAS.map(c => ({ id: c.name, clan: c.clan, intervals: c.intervals })),
  links: [
    { source:'5R1',     target:'1+1+3', w: 8 },
    { source:'5R1',     target:'5R2',   w: 3 },
    { source:'1+1+3',   target:'4+1',   w: 6 },
    { source:'1+1+3',   target:'5R1',   w: 5 },
    { source:'4+1',     target:'1+1+3', w: 4 },
    { source:'4+1',     target:'2+1+1+1', w: 3 },
    { source:'1+3',     target:'3+3',   w: 7 },
    { source:'3+3',     target:'1+3',   w: 5 },
    { source:'3+3',     target:'5R2',   w: 4 },
    { source:'5R2',     target:'1+3',   w: 3 },
    { source:'5R2',     target:'3+3',   w: 6 },
    { source:'2+1+1+1', target:'5R1',   w: 2 },
    { source:'7R',      target:'5R2',   w: 2 },
    { source:'7R',      target:'3+3',   w: 2 },
  ],
};

/* ── Timeline of listening ─────────────────────────────── */
const TIMELINE = [
  { year: 1949, who: 'Schevill & Lawrence', what: 'First underwater recordings of beluga whistles. Whales are not silent.', tag: 'recording' },
  { year: 1971, who: 'Roger Payne & Scott McVay', what: 'Songs of the Humpback Whale. Spectrograms reveal hierarchical, song-like structure. Released as a vinyl LP that turns the tide of public opinion.', tag: 'structure' },
  { year: 1977, who: 'Voyager Golden Record', what: 'A humpback song is launched into interstellar space, billed as a greeting from Earth.', tag: 'culture' },
  { year: 1989, who: 'Tyack, Whitehead', what: 'Sperm whale codas catalogued as discrete repeated patterns; clan-level dialects identified.', tag: 'sperm' },
  { year: 2003, who: 'Noad et al.', what: 'A complete song "revolution" sweeps Australian humpback populations as eastern males adopt the song of western males.', tag: 'culture' },
  { year: 2017, who: 'Project CETI founded', what: 'Cross-disciplinary effort: marine biologists + ML researchers train models to decode sperm-whale codas.', tag: 'ml' },
  { year: 2024, who: 'Sharma et al. (CETI)', what: 'Identification of rubato, tempo, ornamentation, and ictus as orthogonal features modifying base codas — a combinatorial system.', tag: 'sperm' },
  { year: 2025, who: 'Ongoing', what: 'Probabilistic context-free grammars and transformer LMs fit to coda data. No semantics yet.', tag: 'ml' },
];

/* expose */
Object.assign(window, {
  SPECIES_COLORS, SPECIES,
  CODAS, CODA_MODIFIERS,
  HUMP_SONG, ZIPF_SOURCES, zipfCurve,
  CODA_NET, TIMELINE,
});
