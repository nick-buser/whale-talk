/* ACT — ANATOMY
   How are these sounds physically produced?
   Two cross-section diagrams the user can flip between:
     · Sperm whale — phonic lips (museau de singe) + spermaceti organ
     · Humpback   — larynx + laryngeal sac with recycled air
   Hover/tap parts to highlight. A "fire click" button animates an
   air-pulse pathway through the producer, ending in an audible click. */

const ANATOMY = {
  sperm: {
    label: 'Sperm whale',
    latin: 'Physeter macrocephalus',
    intro: 'Toothed whales generate sound in the nose, not the throat. Air driven past a pair of fatty lips (the museau de singe — "monkey muzzle") makes a sharp click. The click bounces off an air-filled sac at the back of the head, passes forward through a wax-filled organ acting as a lens, and exits the front as a tightly-focused pulse.',
    parts: [
      { id:'blowhole',  name:'Blowhole',
        desc:'Sperm whales have a single asymmetric blowhole on the left side of the head. Air to vocalise is moved internally — they don\'t exhale to click.' },
      { id:'rightsac',  name:'Distal air sac',
        desc:'The reservoir behind the phonic lips. Air shuttled into this sac pressurises the system before each click.' },
      { id:'mds',       name:'Phonic lips · museau de singe',
        desc:'A pair of fatty valves at the front of the nasal passage. Air slipping between them produces the click. Their French name — "monkey muzzle" — comes from how they pucker.' },
      { id:'frontalsac',name:'Frontal sac',
        desc:'An air-filled cushion at the back of the spermaceti organ. It acts as an acoustic mirror, reflecting the click forwards.' },
      { id:'spermaceti',name:'Spermaceti organ',
        desc:'A massive wax-filled chamber occupying the upper forehead — up to a third of the whale\'s body length. Acts as an acoustic delay line; possibly tunes click structure.' },
      { id:'junk',      name:'The junk',
        desc:'A series of fatty lenses (the lower lobed counterpart to the spermaceti). Focuses the outgoing pulse into a narrow forward beam — the loudest directional sound any animal makes.' },
    ],
    /* SVG path strokes are drawn in a 720×420 viewBox.
       The whale faces left; head dominates the frame. */
    viewBox: [0, 0, 720, 420],
    outline:
      'M 60 240 ' +
      'C 70 150  130 60  240 60 ' +    // top of head rising sharply (sperm whale's boxy forehead)
      'L 540 60 ' +
      'C 600 60  660 100 690 160 ' +   // back of head
      'L 700 220 ' +
      'L 695 280 ' +
      'C 670 320 600 350 510 360 ' +   // body underline
      'L 250 365 ' +
      'C 180 360 110 320 80 290 ' +
      'L 60 270 Z',
    eye: { x: 580, y: 230 },
    mouth:
      'M 60 270 L 110 285 L 175 290 L 240 288 ' +  // upper jaw / lower-lip seam
      'L 245 320 L 175 322 L 110 318 L 78 305',
    regions: {
      spermaceti: {
        d: 'M 90 230 C 120 110  220 78  340 78 L 470 80 C 480 130 470 195 460 235 C 380 245 200 245 110 240 Z',
      },
      junk: {
        d: 'M 100 250 C 120 270  240 290  370 285 L 420 280 L 415 320 L 250 322 L 130 308 Z',
      },
      frontalsac: {
        // Back-of-head air cushion (reflector)
        d: 'M 470 90 C 530 100 555 150 555 200 C 555 235 530 245 478 235 C 470 195 470 130 470 90 Z',
      },
      rightsac: {
        // Air reservoir behind phonic lips
        d: 'M 195 110 C 235 105 270 120 270 150 C 270 175 240 180 200 175 C 175 165 175 130 195 110 Z',
      },
      mds: {
        // Phonic lips at front of spermaceti
        d: 'M 110 215 C 110 198 130 192 145 200 C 158 207 158 230 145 240 C 130 248 110 240 110 222 Z',
      },
      blowhole: {
        d: 'M 215 80 C 235 70 255 78 260 88 C 263 96 248 102 235 100 C 222 98 211 92 215 80 Z',
      },
    },
    /* Path the click travels: from rightsac → mds → backward to frontalsac
       (reflection) → forward through spermaceti → junk → out. */
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
      { id:'blowholes', name:'Twin blowholes',
        desc:'Baleen whales have paired nostrils. They open them only to breathe; song does not pass through.' },
      { id:'trachea',   name:'Trachea',
        desc:'The airway from lungs to larynx. During song, the same column of air loops repeatedly along this path.' },
      { id:'larynx',    name:'Larynx · U-fold',
        desc:'A muscular hinged fold in the throat. Air pressed past it sets the cords vibrating; the muscular pressure controls the pitch.' },
      { id:'cords',     name:'Vocal cords',
        desc:'Massive flat ridges of tissue inside the larynx. Unlike land mammals, these don\'t snap shut — they wave, like a flag, producing low tones.' },
      { id:'sac',       name:'Laryngeal sac',
        desc:'A balloon-like reservoir below the larynx. Used air collects here under pressure, ready to be pushed back up for the next phrase.' },
      { id:'lung',      name:'Lung',
        desc:'A single fifteen-minute lungful supplies an entire song bout. No air is exhaled; the recirculated cycle keeps the whale buoyant.' },
    ],
    viewBox: [0, 0, 720, 420],
    outline:
      'M 50 220 ' +
      'C 60 140 120 80 230 70 ' +     // forehead — sleeker than sperm whale
      'L 460 70 ' +
      'C 560 80 630 130 680 200 ' +
      'L 690 250 ' +
      'L 670 300 ' +
      'C 600 340 460 360 320 360 ' +
      'L 180 358 ' +
      'C 110 340 70 290 50 250 Z',
    eye: { x: 200, y: 220 },
    mouth: 'M 50 250 L 180 270 L 320 270 L 440 268',  // long baleen mouthline
    regions: {
      blowholes: {
        d: 'M 215 80 L 230 76 L 240 85 L 230 92 L 215 88 Z M 255 78 L 270 74 L 280 84 L 270 92 L 255 88 Z',
      },
      trachea: {
        d: 'M 405 210 L 445 220 L 545 235 L 615 250 L 615 268 L 545 252 L 445 240 L 405 230 Z',
      },
      larynx: {
        // U-shaped fold
        d: 'M 365 200 C 360 180 385 170 405 180 L 420 220 C 420 245 405 255 385 250 C 367 245 360 225 365 200 Z',
      },
      cords: {
        d: 'M 378 215 L 408 218 L 408 224 L 378 222 Z M 378 230 L 408 233 L 408 239 L 378 237 Z',
      },
      sac: {
        // Laryngeal sac (the "U-fold" reservoir)
        d: 'M 330 270 C 320 295 330 330 380 340 C 460 348 510 330 510 305 C 510 285 470 270 410 270 C 380 268 350 268 330 270 Z',
      },
      lung: {
        d: 'M 530 230 C 580 220 640 240 660 280 C 668 320 620 350 560 345 C 510 335 500 290 510 260 C 515 245 520 235 530 230 Z',
      },
    },
    /* Path the air travels: lung → trachea → larynx → cords vibrate → sac → looped back */
    clickPath: [
      { x: 600, y: 280, label: 'air pressed from the lung' },
      { x: 480, y: 240, label: 'up the trachea' },
      { x: 395, y: 215, label: 'past the larynx fold' },
      { x: 395, y: 232, label: 'cords vibrate — tone produced' },
      { x: 410, y: 300, label: 'air collects in laryngeal sac' },
      { x: 555, y: 290, label: 'recycled back to the lung' },
    ],
  },
};

/* ── A simple "fire" particle that traverses click-path waypoints ── */
function ClickPulse({ pathPoints, running, onDone, color = '#4afdc6' }) {
  const [pos, setPos] = useState({ x: pathPoints[0].x, y: pathPoints[0].y, idx: 0 });
  const [active, setActive] = useState(false);
  const [traveled, setTraveled] = useState([]);

  useEffect(() => {
    if (!running) { setActive(false); setTraveled([]); setPos({ ...pathPoints[0], idx: 0 }); return; }
    setActive(true); setTraveled([0]);
    let i = 0;
    const step = () => {
      if (i >= pathPoints.length - 1) { setActive(false); onDone && onDone(); return; }
      const a = pathPoints[i], b = pathPoints[i+1];
      const startT = performance.now();
      const dur = 380;
      const animate = (now) => {
        const tt = Math.min(1, (now - startT) / dur);
        const e = 1 - Math.pow(1 - tt, 3);
        setPos({ x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, idx: i });
        if (tt < 1) requestAnimationFrame(animate);
        else { i++; setTraveled(prev => [...prev, i]); setTimeout(step, 60); }
      };
      requestAnimationFrame(animate);
    };
    step();
  }, [running]);

  if (!active && traveled.length === 0) return null;

  // Trail behind the pulse
  const trailPts = pathPoints.slice(0, pos.idx + 1).concat([{ x: pos.x, y: pos.y }]);
  const trailD = trailPts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x + ',' + p.y).join(' ');
  const cur = pathPoints[pos.idx];
  const lbl = cur && cur.label;

  return (
    <g>
      <path d={trailD} fill="none" stroke={color} strokeWidth={2}
            strokeOpacity={0.55} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}/>
      <circle cx={pos.x} cy={pos.y} r={9} fill="none" stroke={color} strokeOpacity={0.4}/>
      <circle cx={pos.x} cy={pos.y} r={5} fill={color}
              style={{ filter: `drop-shadow(0 0 14px ${color})` }}/>
      {lbl && (
        <g transform={`translate(${pos.x}, ${pos.y - 24})`}>
          <rect x={-86} y={-12} width={172} height={20} rx={10}
                fill="#03060f" stroke={color} strokeOpacity="0.5"/>
          <text y={3} fill={color} fontSize="11"
                fontFamily="IBM Plex Mono" textAnchor="middle">
            {lbl}
          </text>
        </g>
      )}
    </g>
  );
}

function AnatomyDiagram({ which, hovered, setHovered }) {
  const cfg = ANATOMY[which];
  const [vbX, vbY, vbW, vbH] = cfg.viewBox;
  const [pulseRunning, setPulseRunning] = useState(false);
  const wrapRef = useRef(null);
  const size = useSize(wrapRef);
  const W = Math.max(720, size.w);
  const H = (vbH / vbW) * W;

  // Color per region
  const REGION_COLORS = {
    spermaceti: '#7da6ff',
    junk: '#4afdc6',
    frontalsac: '#ffb472',
    rightsac: '#b6c8df',
    mds: '#c6ffe6',
    blowhole: '#5b82b8',
    blowholes: '#5b82b8',
    trachea: '#b6c8df',
    larynx: '#c6ffe6',
    cords: '#4afdc6',
    sac: '#ffb472',
    lung: '#7da6ff',
  };

  function fireClick() {
    setPulseRunning(false);
    setTimeout(() => setPulseRunning(true), 50);
    if (window.WhaleAudio) {
      window.WhaleAudio.resume();
      if (which === 'sperm') {
        // 5R coda
        window.WhaleAudio.playCoda([0.18, 0.18, 0.18, 0.18]);
      } else {
        // humpback unit
        const A = window.WhaleAudio;
        const now = A.now() + 0.05;
        A.moan(now, { f0: 120, f1: 280, dur: 1.2, vibrato: 4, harmonics: [1, 0.4, 0.18] });
      }
    }
  }

  return (
    <div ref={wrapRef} style={{ width:'100%' }}>
      <svg width={W} height={H} viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
           style={{ display:'block', maxHeight: 480 }}>
        <defs>
          <radialGradient id="ana-body-grad" cx="0.4" cy="0.4">
            <stop offset="0%" stopColor="#0a1730"/>
            <stop offset="100%" stopColor="#03060f"/>
          </radialGradient>
          <filter id="ana-soft">
            <feGaussianBlur stdDeviation="0.6"/>
          </filter>
        </defs>

        {/* Outline silhouette */}
        <path d={cfg.outline} fill="url(#ana-body-grad)"
              stroke="rgba(238,243,250,0.4)" strokeWidth={1.2}/>
        {/* Mouth line */}
        <path d={cfg.mouth} fill="none" stroke="rgba(238,243,250,0.35)" strokeWidth={1.1}/>
        {/* Eye */}
        <circle cx={cfg.eye.x} cy={cfg.eye.y} r={3.2} fill="#eef3fa"/>
        <circle cx={cfg.eye.x} cy={cfg.eye.y} r={1.2} fill="#03060f"/>

        {/* Region fills */}
        {cfg.parts.map(part => {
          const reg = cfg.regions[part.id];
          if (!reg) return null;
          const isHov = hovered === part.id;
          const c = REGION_COLORS[part.id] || '#4afdc6';
          return (
            <g key={part.id}
               onMouseEnter={() => setHovered(part.id)}
               onMouseLeave={() => setHovered(null)}
               onClick={() => setHovered(part.id)}
               style={{ cursor:'pointer' }}>
              <path d={reg.d} fill={c} fillOpacity={isHov ? 0.4 : 0.16}
                    stroke={c} strokeOpacity={isHov ? 1 : 0.55}
                    strokeWidth={isHov ? 1.6 : 1}
                    style={{ filter: isHov ? `drop-shadow(0 0 12px ${c})` : 'none',
                             transition: 'all 220ms var(--ease-glide)' }}/>
            </g>
          );
        })}

        {/* Part labels with leader lines */}
        {cfg.parts.map((part, i) => {
          const reg = cfg.regions[part.id];
          if (!reg) return null;
          // Compute centroid (approx) by sampling the path
          const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          tmp.setAttribute('d', reg.d);
          const tlen = tmp.getTotalLength ? tmp.getTotalLength() : 0;
          // Estimated centroid via 3 sample average
          const pa = tmp.getPointAtLength ? tmp.getPointAtLength(tlen * 0.25) : null;
          const pb = tmp.getPointAtLength ? tmp.getPointAtLength(tlen * 0.5) : null;
          const pc = tmp.getPointAtLength ? tmp.getPointAtLength(tlen * 0.75) : null;
          if (!pa || !pb || !pc) return null;
          const cx = (pa.x + pb.x + pc.x) / 3;
          const cy = (pa.y + pb.y + pc.y) / 3;
          // Place label outside top/bottom depending on y
          const labelAbove = cy < 200;
          const lx = cx;
          const ly = labelAbove ? Math.max(20, cy - 60) : Math.min(410, cy + 60);
          const isHov = hovered === part.id;
          const c = REGION_COLORS[part.id] || '#4afdc6';
          return (
            <g key={part.id + '-lbl'} style={{ pointerEvents:'none' }}>
              <line x1={cx} y1={cy} x2={lx} y2={ly}
                    stroke={c} strokeOpacity={isHov ? 0.95 : 0.35} strokeWidth={1}/>
              <circle cx={cx} cy={cy} r={2.6} fill={c}/>
              <text x={lx} y={ly + (labelAbove ? -8 : 14)} fill={isHov ? c : '#b6c8df'}
                    fontSize={isHov ? 12 : 11}
                    fontFamily="IBM Plex Sans" textAnchor="middle"
                    letterSpacing="0.04em"
                    style={{ transition: 'all 200ms var(--ease-glide)' }}>
                {part.name}
              </text>
            </g>
          );
        })}

        {/* Click animation overlay */}
        <ClickPulse pathPoints={cfg.clickPath} running={pulseRunning}
                    onDone={() => setPulseRunning(false)}
                    color={which === 'sperm' ? '#4afdc6' : '#7da6ff'}/>
      </svg>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 4px 0' }}>
        <button className="btn btn-primary" onClick={fireClick} disabled={pulseRunning}>
          {pulseRunning ? '◉ Sounding…'
            : which === 'sperm' ? '► Fire a click' : '► Begin a song unit'}
        </button>
        <span className="mono" style={{ color:'var(--shoal)', fontSize: 11 }}>
          hover or tap a region to read
        </span>
      </div>
    </div>
  );
}

function ActAnatomy() {
  const [which, setWhich] = useState('sperm');
  const [hovered, setHovered] = useState(null);
  const cfg = ANATOMY[which];
  const part = cfg.parts.find(p => p.id === hovered) || cfg.parts[2];

  return (
    <section id="anatomy" className="act" data-screen-label="04 Anatomy">
      <div className="col-xwide">
        <Eyebrow num={3}>The instrument</Eyebrow>
        <h2>Whales sing&nbsp;<em>through their heads.</em></h2>
        <p className="lede" style={{ maxWidth:'46ch' }}>
          Toothed whales make sound in the nose. Baleen whales make it in the throat without losing breath.
          Both are evolutionary inventions for the same problem: pushing energy into water.
        </p>

        <div style={{ display:'flex', gap:8, marginTop: 24, marginBottom: 16 }}>
          <Chip active={which === 'sperm'} onClick={() => { setWhich('sperm'); setHovered(null); }}>
            <span className="dot" style={{ background: '#4afdc6' }}></span>Sperm whale · phonic lips
          </Chip>
          <Chip active={which === 'humpback'} onClick={() => { setWhich('humpback'); setHovered(null); }}>
            <span className="dot" style={{ background: '#7da6ff' }}></span>Humpback · laryngeal sac
          </Chip>
        </div>

        <div className="split-12-1" style={{ gap: 40 }}>
          <div className="panel panel--lumen" style={{ padding: 12 }}>
            <span className="corner mono">FIG. 03 · cross section · {cfg.label.toLowerCase()}</span>
            <AnatomyDiagram which={which} hovered={hovered} setHovered={setHovered}/>
          </div>
          <div>
            <h3 style={{ fontSize: 24, marginTop: 0 }}>{cfg.label}</h3>
            <p style={{ fontStyle:'italic', color:'var(--mist)', fontSize:14, margin:0 }}>{cfg.latin}</p>
            <p style={{ marginTop: 16, fontSize: 15 }}>{cfg.intro}</p>

            <div style={{ marginTop: 24, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
              <div className="eyebrow" style={{ color:'var(--lumen)', marginBottom: 8 }}>
                <span className="rule"></span>
                <span>{hovered ? 'Selected' : 'Default · phonic structure'}</span>
              </div>
              <strong style={{ color:'var(--foam)', fontFamily:'var(--font-mono)', fontSize: 13, letterSpacing: '0.04em' }}>
                {part.name.toUpperCase()}
              </strong>
              <p style={{ marginTop: 10, fontSize: 14, color:'var(--mist)' }}>{part.desc}</p>
            </div>

            <p className="small" style={{ marginTop: 24, color:'var(--shoal)' }}>
              Diagram is schematic — internal regions are sized for clarity, not anatomical accuracy.
            </p>
          </div>
        </div>

        <div className="split-2" style={{ marginTop: 80 }}>
          <div>
            <h3 style={{ fontSize: 24 }}>Why such different machines?</h3>
            <p>
              Toothed whales evolved sound for <em>echolocation</em> — a short, sharp, broadband pulse that returns useful echoes from prey.
              The whole click apparatus is essentially a directional sonar gun. Sperm whales, the largest of them, scaled the gun up until it took up
              a third of the body.
            </p>
            <p>
              Baleen whales never developed echolocation. Their vocalisations are long tonal calls used for distance communication,
              not for sensing. A throat-based mechanism with air recycling is cheap to run for hours and pumps a lot of energy into low frequencies.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 24 }}>The bent-horn click</h3>
            <p>
              When a sperm whale clicks, you don&apos;t hear one pulse — you hear a structured echo. The click is generated at the front of the spermaceti,
              <em> bounces back</em> off the frontal air sac, <em>passes forward</em> through the spermaceti, then radiates from the junk.
            </p>
            <p>
              The interval between the &ldquo;p<sub>0</sub>&rdquo; surface pulse and the &ldquo;p<sub>1</sub>&rdquo; through-and-out pulse is proportional to the length of the spermaceti
              — and therefore to the size of the whale. Researchers can <em>measure</em> a sperm whale&apos;s length from a single click. The whale is, in a real sense, an instrument that announces its own dimensions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

window.ActAnatomy = ActAnatomy;
