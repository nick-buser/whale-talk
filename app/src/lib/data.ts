import type { Species, Coda, CodaModifier, Brain, TimelineEvent, ZipfSource, Range } from './schemas'

/* ── Lumen-family colors for series ─────────────────────── */
export const SPECIES_COLORS: Record<string, string> = {
  sperm:    '#4afdc6',
  humpback: '#c6ffe6',
  blue:     '#7da6ff',
  orca:     '#ffb472',
  fin:      '#5b82b8',
  beluga:   '#b6c8df',
}

/* ── Species ─────────────────────────────────────────────── */
export const SPECIES: Species[] = [
  {
    id: 'sperm', name: 'Sperm whale', latin: 'Physeter macrocephalus',
    color: SPECIES_COLORS.sperm,
    freq: [100, 30000],
    peakHz: 10000,
    depth: [0, 2250],
    body: 16.0,
    voice: 'Codas — discrete click trains, the only known non-human animal with combinatorial rhythm.',
    sample: 'codaTrain',
  },
  {
    id: 'humpback', name: 'Humpback whale', latin: 'Megaptera novaeangliae',
    color: SPECIES_COLORS.humpback,
    freq: [30, 8000],
    peakHz: 250,
    depth: [0, 200],
    body: 14.0,
    voice: 'Song — long hierarchical sequences of units, phrases, and themes. Sung mostly by adult males on breeding grounds.',
    sample: 'humpMoan',
  },
  {
    id: 'blue', name: 'Blue whale', latin: 'Balaenoptera musculus',
    color: SPECIES_COLORS.blue,
    freq: [10, 200],
    peakHz: 25,
    depth: [0, 300],
    body: 28.0,
    voice: 'Infrasonic moans — the loudest sustained sound made by any animal. Travels across ocean basins via the SOFAR channel.',
    sample: 'blueMoan',
  },
  {
    id: 'orca', name: 'Orca', latin: 'Orcinus orca',
    color: SPECIES_COLORS.orca,
    freq: [500, 25000],
    peakHz: 4000,
    depth: [0, 300],
    body: 8.0,
    voice: 'Pod-specific dialects — stable call repertoires that diverge between matrilines and persist for generations.',
    sample: 'orcaCall',
  },
  {
    id: 'fin', name: 'Fin whale', latin: 'Balaenoptera physalus',
    color: SPECIES_COLORS.fin,
    freq: [16, 100],
    peakHz: 20,
    depth: [0, 470],
    body: 24.0,
    voice: 'Twenty-hertz pulses — short, intense, near-monotonic. The "heartbeat" of the deep ocean.',
    sample: 'finPulse',
  },
  {
    id: 'beluga', name: 'Beluga', latin: 'Delphinapterus leucas',
    color: SPECIES_COLORS.beluga,
    freq: [800, 120000],
    peakHz: 50000,
    depth: [0, 700],
    body: 4.5,
    voice: 'A repertoire of whistles, chirps, and click-burst calls dense enough to earn the nickname "canary of the sea."',
    sample: 'belugaChirp',
  },
]

/* ── Codas ───────────────────────────────────────────────── */
export const CODAS: Coda[] = [
  { name: '5R1',     label: 'Five-regular',   intervals: [0.21, 0.21, 0.21, 0.21],        clan: 'EC1', kind: 'regular' },
  { name: '1+1+3',   label: 'One-one-three',  intervals: [0.42, 0.42, 0.20, 0.20],        clan: 'EC1', kind: 'partition' },
  { name: '1+3',     label: 'One-three',      intervals: [0.55, 0.18, 0.18],              clan: 'EC2', kind: 'partition' },
  { name: '3+3',     label: 'Three-three',    intervals: [0.20, 0.20, 0.46, 0.20, 0.20],  clan: 'EC2', kind: 'partition' },
  { name: '4+1',     label: 'Four-one',       intervals: [0.18, 0.18, 0.18, 0.55],        clan: 'EC1', kind: 'partition' },
  { name: '5R2',     label: 'Five-slow',      intervals: [0.30, 0.30, 0.30, 0.30],        clan: 'EC2', kind: 'regular' },
  { name: '2+1+1+1', label: 'Two-ones',       intervals: [0.18, 0.42, 0.42, 0.42],        clan: 'EC1', kind: 'partition' },
  { name: '7R',      label: 'Seven-regular',  intervals: [0.16, 0.16, 0.16, 0.16, 0.16, 0.16], clan: 'EC2', kind: 'regular' },
]

/* ── Coda modifiers ──────────────────────────────────────── */
export const CODA_MODIFIERS: CodaModifier[] = [
  { id: 'rubato',   name: 'Rubato',        desc: 'A smooth speeding-up or slowing-down stretched across the whole coda.' },
  { id: 'tempo',    name: 'Tempo',         desc: 'Discrete shifts between fast and slow versions of the same rhythm.' },
  { id: 'ornament', name: 'Ornamentation', desc: 'An extra "grace" click appended at the end.' },
  { id: 'ictus',    name: 'Ictus',         desc: 'A heavier accent on one position in the train.' },
]

/* ── Humpback song hierarchy ─────────────────────────────── */
export interface HumpUnit {
  id: string; name: string; f0: number; f1: number; dur: number; vibrato?: number;
  t0?: number; t1?: number;
}
export interface HumpSubphrase {
  id: string; units: HumpUnit[];
  t0?: number; t1?: number; dur?: number;
}
export interface HumpPhrase {
  id: string; subphrases: HumpSubphrase[];
  t0?: number; t1?: number; dur?: number;
}
export interface HumpTheme {
  id: string; name: string; phrases: HumpPhrase[];
  t0?: number; t1?: number; dur?: number;
}
export interface HumpSong {
  themes: HumpTheme[];
  dur?: number;
}

export const HUMP_SONG: HumpSong = {
  themes: [
    {
      id: 'T1', name: 'Low moan',
      phrases: [{
        id: 'T1-A',
        subphrases: [
          { id:'sp1', units: [
            { id:'u1', name:'low moan',  f0: 110, f1: 95,  dur: 1.4 },
            { id:'u2', name:'rise',      f0: 95,  f1: 180, dur: 0.9 },
          ]},
          { id:'sp2', units: [
            { id:'u3', name:'low groan', f0: 80,  f1: 70,  dur: 1.6 },
          ]},
        ]
      }]
    },
    {
      id: 'T2', name: 'Upsweep',
      phrases: [{
        id: 'T2-A',
        subphrases: [
          { id:'sp3', units: [
            { id:'u4', name:'upsweep',   f0: 180, f1: 460, dur: 0.7 },
            { id:'u5', name:'cry',       f0: 460, f1: 380, dur: 0.6, vibrato: 6 },
            { id:'u6', name:'short moan',f0: 220, f1: 200, dur: 0.8 },
          ]},
        ]
      }]
    },
    {
      id: 'T3', name: 'Wop',
      phrases: [{
        id: 'T3-A',
        subphrases: [
          { id:'sp4', units: [
            { id:'u7',  name:'wop', f0: 320, f1: 280, dur: 0.45 },
            { id:'u8',  name:'wop', f0: 320, f1: 280, dur: 0.45 },
            { id:'u9',  name:'wop', f0: 320, f1: 280, dur: 0.45 },
            { id:'u10', name:'wop', f0: 320, f1: 280, dur: 0.45 },
          ]},
        ]
      }]
    },
    {
      id: 'T4', name: 'Trumpet',
      phrases: [{
        id: 'T4-A',
        subphrases: [
          { id:'sp5', units: [
            { id:'u11', name:'trumpet', f0: 380, f1: 540, dur: 1.1, vibrato: 8 },
            { id:'u12', name:'echo',    f0: 200, f1: 160, dur: 1.0 },
          ]},
        ]
      }]
    },
    {
      id: 'T5', name: 'Descending growl',
      phrases: [{
        id: 'T5-A',
        subphrases: [
          { id:'sp6', units: [
            { id:'u13', name:'growl',     f0: 90, f1: 65, dur: 1.8 },
            { id:'u14', name:'low pulse', f0: 60, f1: 60, dur: 1.2 },
          ]},
        ]
      }]
    },
  ],
}

/* ── Zipf sources ────────────────────────────────────────── */
export const ZIPF_SOURCES: ZipfSource[] = [
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
]

export function zipfCurve(alpha: number, n: number, total = 10000): Array<{ rank: number; freq: number }> {
  const points: Array<{ rank: number; freq: number }> = []
  let norm = 0
  for (let r = 1; r <= n; r++) norm += 1 / Math.pow(r, alpha)
  for (let r = 1; r <= n; r++) {
    const f = (1 / Math.pow(r, alpha)) / norm * total
    points.push({ rank: r, freq: f })
  }
  return points
}

/* ── Coda network ────────────────────────────────────────── */
export const CODA_NET = {
  nodes: CODAS.map(c => ({ id: c.name, clan: c.clan, intervals: c.intervals })),
  links: [
    { source: '5R1',     target: '1+1+3',   w: 8 },
    { source: '5R1',     target: '5R2',     w: 3 },
    { source: '1+1+3',   target: '4+1',     w: 6 },
    { source: '1+1+3',   target: '5R1',     w: 5 },
    { source: '4+1',     target: '1+1+3',   w: 4 },
    { source: '4+1',     target: '2+1+1+1', w: 3 },
    { source: '1+3',     target: '3+3',     w: 7 },
    { source: '3+3',     target: '1+3',     w: 5 },
    { source: '3+3',     target: '5R2',     w: 4 },
    { source: '5R2',     target: '1+3',     w: 3 },
    { source: '5R2',     target: '3+3',     w: 6 },
    { source: '2+1+1+1', target: '5R1',     w: 2 },
    { source: '7R',      target: '5R2',     w: 2 },
    { source: '7R',      target: '3+3',     w: 2 },
  ],
}

/* ── Timeline ────────────────────────────────────────────── */
export const TIMELINE: TimelineEvent[] = [
  { year: 1949, who: 'Schevill & Lawrence', what: 'First underwater recordings of beluga whistles. Whales are not silent.', tag: 'recording' },
  { year: 1971, who: 'Roger Payne & Scott McVay', what: 'Songs of the Humpback Whale. Spectrograms reveal hierarchical, song-like structure. Released as a vinyl LP that turns the tide of public opinion.', tag: 'structure' },
  { year: 1977, who: 'Voyager Golden Record', what: 'A humpback song is launched into interstellar space, billed as a greeting from Earth.', tag: 'culture' },
  { year: 1989, who: 'Tyack, Whitehead', what: 'Sperm whale codas catalogued as discrete repeated patterns; clan-level dialects identified.', tag: 'sperm' },
  { year: 2003, who: 'Noad et al.', what: 'A complete song "revolution" sweeps Australian humpback populations as eastern males adopt the song of western males.', tag: 'culture' },
  { year: 2017, who: 'Project CETI founded', what: 'Cross-disciplinary effort: marine biologists + ML researchers train models to decode sperm-whale codas.', tag: 'ml' },
  { year: 2024, who: 'Sharma et al. (CETI)', what: 'Identification of rubato, tempo, ornamentation, and ictus as orthogonal features modifying base codas — a combinatorial system.', tag: 'sperm' },
  { year: 2025, who: 'Ongoing', what: 'Probabilistic context-free grammars and transformer LMs fit to coda data. No semantics yet.', tag: 'ml' },
]

/* ── Ranges ──────────────────────────────────────────────── */
export const RANGES: Range[] = [
  { id: 'beluga',   name: 'Beluga',      peak: 1.2,  max: 5,
    note: 'Whistles and clicks above 5 kHz attenuate fast in seawater. Conversations are intimate — within an arrow-shot.' },
  { id: 'orca',     name: 'Orca',        peak: 8,    max: 25,
    note: 'Stereotyped pod calls in the 1–10 kHz band carry across a fjord or sound, far enough to coordinate a hunt.' },
  { id: 'sperm',    name: 'Sperm whale', peak: 6,    max: 16,
    note: 'Codas exchanged between socialising whales travel kilometres. Echolocation clicks aimed forward can be detected further, but communication is short-range.' },
  { id: 'humpback', name: 'Humpback',    peak: 30,   max: 120,
    note: 'A singing male on a breeding ground can be heard across thirty kilometres in normal conditions, and well past a hundred in calm seas.' },
  { id: 'fin',      name: 'Fin whale',   peak: 400,  max: 1500,
    note: 'Twenty-hertz pulses launched into the SOFAR channel routinely carry across an entire sea — from Iceland to the Azores, for instance.' },
  { id: 'blue',     name: 'Blue whale',  peak: 1500, max: 3000,
    note: 'The loudest sustained sound any animal makes (~188 dB) at 10–25 Hz. Trapped in the SOFAR layer, individual moans have been tracked across whole ocean basins.' },
]

export const RANGE_LANDMARKS = [
  { km: 0.1,   label: 'a city block' },
  { km: 1,     label: 'a small bay' },
  { km: 10,    label: 'across a strait' },
  { km: 100,   label: 'continental shelf' },
  { km: 1000,  label: 'sea-to-sea' },
  { km: 3000,  label: 'across an ocean basin' },
  { km: 20000, label: 'halfway round the world' },
]

/* ── Anatomy data ────────────────────────────────────────── */
export interface AnatomyPart {
  id: string; name: string; desc: string;
}
export interface AnatomyRegion {
  d: string;
}
export interface AnatomyClickWaypoint {
  x: number; y: number; label: string;
}
export interface AnatomyConfig {
  label: string; latin: string; intro: string;
  parts: AnatomyPart[];
  viewBox: [number, number, number, number];
  outline: string;
  eye: { x: number; y: number };
  mouth: string;
  regions: Record<string, AnatomyRegion>;
  clickPath: AnatomyClickWaypoint[];
}

export const ANATOMY: Record<string, AnatomyConfig> = {
  sperm: {
    label: 'Sperm whale',
    latin: 'Physeter macrocephalus',
    intro: 'Toothed whales generate sound in the nose, not the throat. Air driven past a pair of fatty lips (the museau de singe — "monkey muzzle") makes a sharp click. The click bounces off an air-filled sac at the back of the head, passes forward through a wax-filled organ acting as a lens, and exits the front as a tightly-focused pulse.',
    parts: [
      { id:'blowhole',   name:'Blowhole', desc:"Sperm whales have a single asymmetric blowhole on the left side of the head. Air to vocalise is moved internally — they don't exhale to click." },
      { id:'rightsac',   name:'Distal air sac', desc:'The reservoir behind the phonic lips. Air shuttled into this sac pressurises the system before each click.' },
      { id:'mds',        name:'Phonic lips · museau de singe', desc:'A pair of fatty valves at the front of the nasal passage. Air slipping between them produces the click. Their French name — "monkey muzzle" — comes from how they pucker.' },
      { id:'frontalsac', name:'Frontal sac', desc:'An air-filled cushion at the back of the spermaceti organ. It acts as an acoustic mirror, reflecting the click forwards.' },
      { id:'spermaceti', name:'Spermaceti organ', desc:"A massive wax-filled chamber occupying the upper forehead — up to a third of the whale's body length. Acts as an acoustic delay line; possibly tunes click structure." },
      { id:'junk',       name:'The junk', desc:'A series of fatty lenses (the lower lobed counterpart to the spermaceti). Focuses the outgoing pulse into a narrow forward beam — the loudest directional sound any animal makes.' },
    ],
    viewBox: [0, 0, 720, 420],
    outline:
      'M 60 240 ' +
      'C 70 150  130 60  240 60 ' +
      'L 540 60 ' +
      'C 600 60  660 100 690 160 ' +
      'L 700 220 ' +
      'L 695 280 ' +
      'C 670 320 600 350 510 360 ' +
      'L 250 365 ' +
      'C 180 360 110 320 80 290 ' +
      'L 60 270 Z',
    eye: { x: 580, y: 230 },
    mouth:
      'M 60 270 L 110 285 L 175 290 L 240 288 ' +
      'L 245 320 L 175 322 L 110 318 L 78 305',
    regions: {
      spermaceti: { d: 'M 90 230 C 120 110  220 78  340 78 L 470 80 C 480 130 470 195 460 235 C 380 245 200 245 110 240 Z' },
      junk:       { d: 'M 100 250 C 120 270  240 290  370 285 L 420 280 L 415 320 L 250 322 L 130 308 Z' },
      frontalsac: { d: 'M 470 90 C 530 100 555 150 555 200 C 555 235 530 245 478 235 C 470 195 470 130 470 90 Z' },
      rightsac:   { d: 'M 195 110 C 235 105 270 120 270 150 C 270 175 240 180 200 175 C 175 165 175 130 195 110 Z' },
      mds:        { d: 'M 110 215 C 110 198 130 192 145 200 C 158 207 158 230 145 240 C 130 248 110 240 110 222 Z' },
      blowhole:   { d: 'M 215 80 C 235 70 255 78 260 88 C 263 96 248 102 235 100 C 222 98 211 92 215 80 Z' },
    },
    clickPath: [
      { x: 230, y: 145, label: 'air pressurised' },
      { x: 135, y: 220, label: 'click at phonic lips' },
      { x: 510, y: 175, label: 'reflects off frontal sac' },
      { x: 240, y: 215, label: 'travels through spermaceti' },
      { x: 250, y: 290, label: 'focused by the junk' },
      { x: 70,  y: 290, label: 'pulse exits forward' },
    ],
  },
  humpback: {
    label: 'Humpback',
    latin: 'Megaptera novaeangliae',
    intro: 'Baleen whales sing with their throats — and they do it without losing breath. Air is pushed past the U-fold of the larynx, vibrating the vocal cords; it then collects in a stretched-out laryngeal sac, and is shunted back to the lungs. The whole song is sung on a single recycled lungful of air.',
    parts: [
      { id:'blowholes', name:'Twin blowholes', desc:'Baleen whales have paired nostrils. They open them only to breathe; song does not pass through.' },
      { id:'trachea',   name:'Trachea', desc:'The airway from lungs to larynx. During song, the same column of air loops repeatedly along this path.' },
      { id:'larynx',    name:'Larynx · U-fold', desc:'A muscular hinged fold in the throat. Air pressed past it sets the cords vibrating; the muscular pressure controls the pitch.' },
      { id:'cords',     name:'Vocal cords', desc:"Massive flat ridges of tissue inside the larynx. Unlike land mammals, these don't snap shut — they wave, like a flag, producing low tones." },
      { id:'sac',       name:'Laryngeal sac', desc:'A balloon-like reservoir below the larynx. Used air collects here under pressure, ready to be pushed back up for the next phrase.' },
      { id:'lung',      name:'Lung', desc:'A single fifteen-minute lungful supplies an entire song bout. No air is exhaled; the recirculated cycle keeps the whale buoyant.' },
    ],
    viewBox: [0, 0, 720, 420],
    outline:
      'M 50 220 ' +
      'C 60 140 120 80 230 70 ' +
      'L 460 70 ' +
      'C 560 80 630 130 680 200 ' +
      'L 690 250 ' +
      'L 670 300 ' +
      'C 600 340 460 360 320 360 ' +
      'L 180 358 ' +
      'C 110 340 70 290 50 250 Z',
    eye: { x: 200, y: 220 },
    mouth: 'M 50 250 L 180 270 L 320 270 L 440 268',
    regions: {
      blowholes: { d: 'M 215 80 L 230 76 L 240 85 L 230 92 L 215 88 Z M 255 78 L 270 74 L 280 84 L 270 92 L 255 88 Z' },
      trachea:   { d: 'M 405 210 L 445 220 L 545 235 L 615 250 L 615 268 L 545 252 L 445 240 L 405 230 Z' },
      larynx:    { d: 'M 365 200 C 360 180 385 170 405 180 L 420 220 C 420 245 405 255 385 250 C 367 245 360 225 365 200 Z' },
      cords:     { d: 'M 378 215 L 408 218 L 408 224 L 378 222 Z M 378 230 L 408 233 L 408 239 L 378 237 Z' },
      sac:       { d: 'M 330 270 C 320 295 330 330 380 340 C 460 348 510 330 510 305 C 510 285 470 270 410 270 C 380 268 350 268 330 270 Z' },
      lung:      { d: 'M 530 230 C 580 220 640 240 660 280 C 668 320 620 350 560 345 C 510 335 500 290 510 260 C 515 245 520 235 530 230 Z' },
    },
    clickPath: [
      { x: 600, y: 280, label: 'air pressed from the lung' },
      { x: 480, y: 240, label: 'up the trachea' },
      { x: 395, y: 215, label: 'past the larynx fold' },
      { x: 395, y: 232, label: 'cords vibrate — tone produced' },
      { x: 410, y: 300, label: 'air collects in laryngeal sac' },
      { x: 555, y: 290, label: 'recycled back to the lung' },
    ],
  },
}

/* ── Brains ──────────────────────────────────────────────── */
export const BRAINS: Brain[] = [
  {
    id: 'human',
    name: 'Human', latin: 'Homo sapiens',
    mass: 1.35, neurons: 86, cortexNeurons: 16, EQ: 7.4,
    cortexArea: 2275, length: 165, height: 130,
    color: '#eef3fa',
    facts: [
      'Roughly 2 % of body mass; 20 % of resting energy use.',
      'Layered six-layer neocortex with strong layer IV.',
      'Sleep consolidates memory in both hemispheres simultaneously.',
    ],
  },
  {
    id: 'dolphin',
    name: 'Bottlenose dolphin', latin: 'Tursiops truncatus',
    mass: 1.6, neurons: 37, cortexNeurons: 5.8, EQ: 5.3,
    cortexArea: 3745, length: 190, height: 140,
    color: '#c6ffe6',
    facts: [
      'Larger absolute cortical surface than a human.',
      'Five-layer cortex without a thick layer IV — a different wiring.',
      'Sleeps one hemisphere at a time. Always half-awake, always half-listening.',
    ],
  },
  {
    id: 'sperm',
    name: 'Sperm whale', latin: 'Physeter macrocephalus',
    mass: 7.8, neurons: 22, cortexNeurons: 10.5, EQ: 0.58,
    cortexArea: 7400, length: 580, height: 340,
    color: '#4afdc6',
    facts: [
      "Largest brain that has ever evolved — heavier than a dinosaur's.",
      'EQ is low because body mass is enormous — but absolute cortex is huge.',
      'Auditory areas dominate the cortex; dedicated to processing click echoes.',
      'Contains von Economo neurons in higher density than humans in some regions.',
    ],
  },
]

/* ── Entropy data ────────────────────────────────────────── */
export const ENTROPY_BY_LAG = [
  { id: 'english',  name: 'English (chars)',       lags: [4.10, 3.32, 2.85, 2.40, 1.95, 1.55] },
  { id: 'humpback', name: 'Humpback units',         lags: [4.85, 3.95, 3.20, 2.80, 2.55, 2.40] },
  { id: 'sperm',    name: 'Sperm coda types',       lags: [3.05, 2.40, 2.10, 1.95, 1.85, 1.78] },
  { id: 'dolphin',  name: 'Dolphin sig. whistles',  lags: [5.20, 4.95, 4.85, 4.80, 4.78, 4.75] },
  { id: 'random',   name: 'Random tokens',          lags: [6.65, 6.65, 6.65, 6.65, 6.65, 6.65] },
]
export const ENTROPY_COLORS: Record<string, string> = {
  english:'#eef3fa', humpback:'#c6ffe6', sperm:'#4afdc6', dolphin:'#b6c8df', random:'#5b82b8'
}

/* ── Humpback song annotated with durations ─────────────── */
function annotateDurations(song: HumpSong): HumpSong {
  let songDur = 0
  song.themes.forEach((t) => {
    let themeDur = 0
    t.phrases.forEach((p) => {
      let phraseDur = 0
      p.subphrases.forEach((sp) => {
        let spDur = 0
        sp.units.forEach((u) => {
          u.t0 = songDur + themeDur + phraseDur + spDur
          u.t1 = u.t0 + u.dur
          spDur += u.dur + 0.15
        })
        sp.t0 = songDur + themeDur + phraseDur
        sp.t1 = sp.t0 + spDur
        sp.dur = spDur
        phraseDur += spDur + 0.3
      })
      p.t0 = songDur + themeDur
      p.t1 = p.t0 + phraseDur
      p.dur = phraseDur
      themeDur += phraseDur + 0.4
    })
    t.t0 = songDur
    t.t1 = t.t0 + themeDur
    t.dur = themeDur
    songDur += themeDur + 0.5
  })
  song.dur = songDur
  return song
}

export const HUMP_SONG_ANN: HumpSong = annotateDurations(JSON.parse(JSON.stringify(HUMP_SONG)))

export const THEME_COLORS = [
  '#7da6ff',
  '#4afdc6',
  '#c6ffe6',
  '#ffb472',
  '#b6c8df',
]

/* ── DSL default score ────────────────────────────────────── */
export const DSL_DEFAULT = `# Sperm-whale coda score
# Type your own; press Play on any line.
# • is a click.  numbers are literal millisecond gaps.

tempo 210                          # default inter-click interval

greet  : • • • • •                  # 5R1 — five regular
reply  : • 420 • 420 • • •          # 1+1+3
ask    : • 550 • • •                # 1+3
heavy  : • • • • • ! 3              # ictus — accent the 3rd click
quick  : • • • • •  *0.55           # tempo — 55% the duration
slow   : • • • • •  *1.7            # tempo — slower
sweep  : • • • • • ~0.6             # rubato — speed up 60% across the coda
fancy  : • • • • • + ornament       # ornamentation — grace click
ask3   : • 550 • • • ~-0.4          # negative rubato — slow down across coda
`
