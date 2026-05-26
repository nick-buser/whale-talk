/* ACT 5 — HUMPBACK SONG HIERARCHY
   A hierarchical Gantt-tree of one example song:
     song → theme → phrase → subphrase → unit
   Each unit has a synthesizable f0/f1/dur. We compute durations bottom-up.
   The user can press play on any node — the playhead animates across that
   sub-range and the units sound in sequence. */

function annotateDurations(song) {
  let songDur = 0;
  song.themes.forEach((t) => {
    let themeDur = 0;
    t.phrases.forEach((p) => {
      let phraseDur = 0;
      p.subphrases.forEach((sp) => {
        let spDur = 0;
        sp.units.forEach((u) => {
          u.t0 = songDur + themeDur + phraseDur + spDur;
          u.t1 = u.t0 + u.dur;
          spDur += u.dur + 0.15;  // 150ms gap between units
        });
        sp.t0 = songDur + themeDur + phraseDur;
        sp.t1 = sp.t0 + spDur;
        sp.dur = spDur;
        phraseDur += spDur + 0.3;
      });
      p.t0 = songDur + themeDur;
      p.t1 = p.t0 + phraseDur;
      p.dur = phraseDur;
      themeDur += phraseDur + 0.4;
    });
    t.t0 = songDur;
    t.t1 = t.t0 + themeDur;
    t.dur = themeDur;
    songDur += themeDur + 0.5;
  });
  song.dur = songDur;
  return song;
}

const HUMP_SONG_ANN = annotateDurations(JSON.parse(JSON.stringify(HUMP_SONG)));

const THEME_COLORS = [
  '#7da6ff',  // blue
  '#4afdc6',  // lumen
  '#c6ffe6',  // lumen-bright
  '#ffb472',  // krill
  '#b6c8df',  // mist
];

function HumpbackTree({ song, playhead, selected, setSelected, onPlay }) {
  const wrapRef = useRef(null);
  const size = useSize(wrapRef);
  const W = Math.max(840, size.w);
  const H = 460;
  const pad = { l: 16, r: 16, t: 28, b: 16 };
  const innerW = W - pad.l - pad.r;
  const dur = song.dur;
  const x = (t) => pad.l + (t / dur) * innerW;

  const rows = [
    { label: 'Song',       y: pad.t,            height: 22 },
    { label: 'Themes',     y: pad.t + 52,       height: 36 },
    { label: 'Phrases',    y: pad.t + 122,      height: 30 },
    { label: 'Subphrases', y: pad.t + 184,      height: 26 },
    { label: 'Units',      y: pad.t + 232,      height: 100 },
  ];

  function blockProps(t0, t1, color, sel) {
    return {
      x: x(t0),
      width: Math.max(1, x(t1) - x(t0)) - 1,
      fill: color,
      opacity: sel ? 0.9 : 0.6,
      stroke: sel ? '#c6ffe6' : 'rgba(238,243,250,0.1)',
      strokeWidth: sel ? 1.5 : 0.7,
    };
  }

  const isSel = (kind, id) => selected && selected.kind === kind && selected.id === id;

  return (
    <div ref={wrapRef} style={{ width: '100%' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display:'block' }}>
        {/* Row labels */}
        {rows.map(r => (
          <text key={r.label} x={pad.l} y={r.y - 6}
                fill="#5b82b8" fontFamily="IBM Plex Sans" fontSize="10"
                letterSpacing="2">{r.label.toUpperCase()}</text>
        ))}

        {/* Song row (entire span) */}
        <rect
          {...blockProps(0, dur, '#0a1730', isSel('song', 'root'))}
          stroke="rgba(74,253,198,0.5)" strokeWidth={1.2}
          y={rows[0].y} height={rows[0].height}
          style={{ cursor: 'pointer' }}
          onClick={() => onPlay({ kind: 'song', id: 'root', t0: 0, t1: dur })}/>
        <text x={x(dur/2)} y={rows[0].y + 15}
              fill="#eef3fa" textAnchor="middle"
              fontFamily="Newsreader" fontStyle="italic" fontSize="13">
          one complete song · {dur.toFixed(1)} s
        </text>

        {/* Themes */}
        {song.themes.map((t, i) => (
          <g key={t.id}>
            <rect
              {...blockProps(t.t0, t.t1, THEME_COLORS[i % THEME_COLORS.length], isSel('theme', t.id))}
              y={rows[1].y} height={rows[1].height}
              style={{ cursor:'pointer' }}
              onClick={() => onPlay({ kind: 'theme', id: t.id, t0: t.t0, t1: t.t1 })}/>
            <text
              x={x((t.t0 + t.t1)/2)} y={rows[1].y + rows[1].height/2 + 5}
              fill="#03060f" textAnchor="middle"
              fontFamily="IBM Plex Sans" fontSize="11" fontWeight="600" letterSpacing="0.5">
              {t.name.toUpperCase()}
            </text>
          </g>
        ))}

        {/* Phrases */}
        {song.themes.flatMap((t, ti) =>
          t.phrases.map((p) => (
            <rect key={p.id}
              {...blockProps(p.t0, p.t1, THEME_COLORS[ti % THEME_COLORS.length], isSel('phrase', p.id))}
              y={rows[2].y} height={rows[2].height}
              style={{ cursor:'pointer' }}
              opacity={isSel('phrase', p.id) ? 0.9 : 0.4}
              onClick={() => onPlay({ kind: 'phrase', id: p.id, t0: p.t0, t1: p.t1 })}/>
          ))
        )}

        {/* Subphrases */}
        {song.themes.flatMap((t, ti) =>
          t.phrases.flatMap(p =>
            p.subphrases.map(sp => (
              <rect key={sp.id}
                {...blockProps(sp.t0, sp.t1, THEME_COLORS[ti % THEME_COLORS.length], isSel('sub', sp.id))}
                y={rows[3].y} height={rows[3].height}
                style={{ cursor:'pointer' }}
                opacity={isSel('sub', sp.id) ? 0.9 : 0.32}
                onClick={() => onPlay({ kind: 'sub', id: sp.id, t0: sp.t0, t1: sp.t1 })}/>
            ))
          )
        )}

        {/* Units — render as little waveform-shaped blocks */}
        {song.themes.flatMap((t, ti) =>
          t.phrases.flatMap(p =>
            p.subphrases.flatMap(sp =>
              sp.units.map(u => {
                const sel = isSel('unit', u.id);
                const ux = x(u.t0);
                const uw = Math.max(8, x(u.t1) - x(u.t0)) - 2;
                const color = THEME_COLORS[ti % THEME_COLORS.length];
                // Sketch a tiny waveform from f0→f1
                const points = [];
                const N = 32;
                for (let i = 0; i <= N; i++) {
                  const frac = i / N;
                  const f = u.f0 + (u.f1 - u.f0) * frac;
                  // normalize freq → vertical position
                  const norm = Math.log(f / 30) / Math.log(800 / 30);
                  const py = rows[4].y + rows[4].height - norm * rows[4].height;
                  points.push(`${ux + frac*uw},${py}`);
                }
                return (
                  <g key={u.id} style={{ cursor:'pointer' }}
                     onClick={() => onPlay({ kind: 'unit', id: u.id, t0: u.t0, t1: u.t1 })}>
                    <rect x={ux} y={rows[4].y} width={uw} height={rows[4].height}
                          fill={color} opacity={sel ? 0.2 : 0.08} rx={2}/>
                    <polyline points={points.join(' ')}
                      fill="none"
                      stroke={color}
                      strokeWidth={sel ? 2 : 1.4}
                      opacity={sel ? 1 : 0.85}
                      style={{ filter: sel ? `drop-shadow(0 0 6px ${color})` : 'none' }}/>
                    <text x={ux + uw/2} y={rows[4].y + rows[4].height + 14}
                          fill={sel ? color : '#5b82b8'} textAnchor="middle"
                          fontFamily="IBM Plex Mono" fontSize="9.5">
                      {u.name}
                    </text>
                  </g>
                );
              })
            )
          )
        )}

        {/* Time axis baseline */}
        <line x1={pad.l} x2={pad.l + innerW} y1={H - 16} y2={H - 16}
              stroke="rgba(238,243,250,0.2)"/>
        {[0, 5, 10, 15, 20, 25, 30].filter(t => t <= dur).map(t => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={H-20} y2={H-12} stroke="rgba(238,243,250,0.3)"/>
            <text x={x(t)} y={H-3} fill="#5b82b8" fontFamily="IBM Plex Mono"
                  fontSize="10" textAnchor="middle">{t}s</text>
          </g>
        ))}

        {/* Playhead */}
        {playhead != null && (
          <line x1={x(playhead)} x2={x(playhead)}
                y1={pad.t - 6} y2={H - 16}
                stroke="#c6ffe6" strokeWidth={1.5}
                style={{ filter:'drop-shadow(0 0 10px #4afdc6)' }}/>
        )}
      </svg>
    </div>
  );
}

function ActHumpback() {
  const [selected, setSelected] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [playheadT, setPlayheadT] = useState(null);
  const rafRef = useRef(null);
  const stopRef = useRef(false);

  const collectUnits = (sel) => {
    const all = [];
    HUMP_SONG_ANN.themes.forEach(t => {
      t.phrases.forEach(p => {
        p.subphrases.forEach(sp => {
          sp.units.forEach(u => {
            if (sel.kind === 'song') all.push(u);
            else if (sel.kind === 'theme' && t.id === sel.id) all.push(u);
            else if (sel.kind === 'phrase' && p.id === sel.id) all.push(u);
            else if (sel.kind === 'sub' && sp.id === sel.id) all.push(u);
            else if (sel.kind === 'unit' && u.id === sel.id) all.push(u);
          });
        });
      });
    });
    return all;
  };

  const play = useCallback((sel) => {
    if (!window.WhaleAudio) return;
    if (playing) { stopRef.current = true; setPlaying(false); cancelAnimationFrame(rafRef.current); setPlayheadT(null); }

    setSelected(sel);
    const A = window.WhaleAudio;
    A.resume();
    const units = collectUnits(sel);
    if (units.length === 0) return;
    const t0 = units[0].t0;
    const t1 = sel.t1;
    const startAudio = A.now() + 0.08;
    setPlaying(true);
    stopRef.current = false;

    units.forEach((u) => {
      const offset = u.t0 - t0;
      A.moan(startAudio + offset, {
        f0: u.f0, f1: u.f1, dur: u.dur,
        vibrato: u.vibrato || 3.5,
        harmonics: [1, 0.4, 0.18, 0.08],
        gain: 0.35,
      });
    });

    const startPerf = performance.now();
    const span = t1 - t0;
    const tick = () => {
      const elapsed = (performance.now() - startPerf) / 1000;
      if (stopRef.current || elapsed >= span + 0.5) {
        setPlaying(false); setPlayheadT(null);
        return;
      }
      setPlayheadT(t0 + Math.min(elapsed, span));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [playing]);

  useEffect(() => () => { stopRef.current = true; cancelAnimationFrame(rafRef.current); }, []);

  return (
    <section id="humpback" className="act" data-screen-label="06 Song">
      <div className="col-xwide">
        <Eyebrow num={5}>Humpback whale · Megaptera novaeangliae</Eyebrow>
        <h2>A&nbsp;<span className="hl-line">song</span> with grammar.</h2>
        <p className="lede" style={{ maxWidth: '46ch' }}>
          In 1971 Roger Payne and Scott McVay published spectrograms showing that humpback song
          isn&apos;t a stream — it&apos;s nested. Click any level to hear just that piece.
        </p>

        <div className="panel panel--lumen" style={{ padding: 20, marginTop: 32 }}>
          <span className="corner mono">FIG. 03 · song hierarchy · 5 themes</span>
          <div style={{ display:'flex', alignItems:'baseline', gap: 20, padding: '0 4px', marginBottom: 8 }}>
            <button className="btn btn-primary"
              onClick={() => play({ kind:'song', id:'root', t0: 0, t1: HUMP_SONG_ANN.dur })}
              disabled={playing}>
              {playing ? '◉ Playing…' : '► Play entire song'}
            </button>
            {selected && (
              <span className="mono" style={{ color:'var(--mist)', fontSize: 12 }}>
                playing: <span style={{ color:'var(--lumen)' }}>{selected.kind} · {selected.id}</span>
              </span>
            )}
          </div>
          <HumpbackTree
            song={HUMP_SONG_ANN}
            playhead={playheadT}
            selected={selected}
            setSelected={setSelected}
            onPlay={play}/>
        </div>

        <div className="split-2" style={{ marginTop: 56 }}>
          <div>
            <h3 style={{ fontSize: 28 }}>Conservation, recursion, revolution</h3>
            <p>
              All males in a breeding population sing the <em>same</em> song. The song slowly mutates over a season — a new phrase
              replaces an old one, a theme is dropped. By the next year the song is different, and again, everyone sings the same one.
            </p>
            <p>
              In 2003 the entire eastern Australian humpback population abandoned its own song over the course of two years and adopted
              the song of western Australian whales. Tens of thousands of males simultaneously learning a new tune. This is cultural
              transmission, of a kind we recognise.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 28 }}>Why call it a <em>grammar</em>?</h3>
            <p>
              Themes occur in a fixed order. Phrases are stacked from a small inventory of units, in patterns that recur.
              A unit out of place sounds wrong &mdash; to other humpbacks, presumably, and to the spectrogram.
              These are the structural properties of phonology in human languages.
            </p>
            <p>
              We do not yet know what it <em>means</em>. We know it is sexually selected — only mature males in breeding grounds
              sing — but we don&apos;t know what is being conveyed. A name? A history? A boast? The song persists either way.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

window.ActHumpback = ActHumpback;
