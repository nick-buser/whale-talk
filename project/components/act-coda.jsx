/* ACT 2 — CODAS
   Introduces sperm-whale clicks. A scrubbable click train visualization.
   - Cycle through 8 named coda types
   - For each, render the click-train as vertical ticks on a timeline
   - Play it; visualize the playhead crossing each tick
   - Show ICI (inter-click interval) bars below for rhythm intuition */

function CodaPlayer({ coda, onClick, autoplay }) {
  const [playing, setPlaying] = useState(false);
  const [tick, setTick] = useState(-1);
  const wrapRef = useRef(null);
  const size = useSize(wrapRef);

  // Build per-click times (cumulative)
  const times = useMemo(() => {
    const ts = [0];
    for (let i = 0; i < coda.intervals.length; i++) ts.push(ts[ts.length-1] + coda.intervals[i]);
    return ts;
  }, [coda]);
  const totalDur = times[times.length-1] + 0.2;

  const playRef = useRef(null);
  const play = useCallback(() => {
    if (!window.WhaleAudio) return;
    const A = window.WhaleAudio;
    A.resume();
    setPlaying(true); setTick(-1);
    const startAt = A.now() + 0.08;
    A.playCoda(coda.intervals, {
      start: startAt,
      onClick: (i, total) => {
        setTick(i);
        if (onClick) onClick(i, total);
        if (i === total - 1) setTimeout(() => { setPlaying(false); setTick(-1); }, 250);
      }
    });
  }, [coda]);

  useEffect(() => { if (autoplay) { const t = setTimeout(play, 300); return () => clearTimeout(t); } }, [coda, autoplay, play]);

  const W = Math.max(560, size.w);
  const H = 220;
  const pad = { l: 32, r: 32, t: 30, b: 60 };
  const x = (t) => pad.l + (t / totalDur) * (W - pad.l - pad.r);

  return (
    <div ref={wrapRef} style={{ width: '100%' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display:'block' }}>
        {/* Timeline rule */}
        <line x1={pad.l} x2={W - pad.r} y1={H/2} y2={H/2} stroke="rgba(238,243,250,0.18)" />
        {/* Time ticks */}
        {[0, 0.5, 1.0, 1.5, 2.0].filter(t => t < totalDur).map(t => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={H/2-4} y2={H/2+4} stroke="rgba(238,243,250,0.4)"/>
            <text x={x(t)} y={H/2+22} fill="#5b82b8"
                  fontFamily="IBM Plex Mono" fontSize="10" textAnchor="middle">
              {(t).toFixed(1)} s
            </text>
          </g>
        ))}

        {/* Click ticks */}
        {times.map((t, i) => {
          const hit = i <= tick;
          return (
            <g key={i}>
              <line x1={x(t)} x2={x(t)} y1={H/2 - 56} y2={H/2 + 56}
                    stroke={hit ? '#c6ffe6' : '#4afdc6'}
                    strokeWidth={hit ? 3 : 2}
                    style={{ filter: hit ? 'drop-shadow(0 0 12px #00ffc4)' : 'drop-shadow(0 0 4px #4afdc6)',
                             transition: 'all 100ms var(--ease-sound)' }}/>
              {/* Click index labels */}
              <text x={x(t)} y={H/2 - 64} fill={hit ? '#c6ffe6' : '#5b82b8'}
                    fontFamily="IBM Plex Mono" fontSize="10" textAnchor="middle">
                {i+1}
              </text>
            </g>
          );
        })}

        {/* ICI bars beneath */}
        {coda.intervals.map((iv, i) => {
          const a = times[i], b = times[i+1];
          const cx = (x(a) + x(b)) / 2;
          return (
            <g key={i} transform={`translate(0, ${H/2 + 40})`}>
              <line x1={x(a)+4} x2={x(b)-4} y1={0} y2={0} stroke="rgba(238,243,250,0.35)"/>
              <line x1={x(a)+4} x2={x(a)+4} y1={-4} y2={4} stroke="rgba(238,243,250,0.35)"/>
              <line x1={x(b)-4} x2={x(b)-4} y1={-4} y2={4} stroke="rgba(238,243,250,0.35)"/>
              <text x={cx} y={18} fill="#b6c8df" fontFamily="IBM Plex Mono" fontSize="10" textAnchor="middle">
                {Math.round(iv*1000)} ms
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
        <button className="btn btn-primary" onClick={play} disabled={playing}>
          {playing ? '◉ Playing…' : '► Play coda'}
        </button>
        <span className="mono" style={{ color: 'var(--mist)', fontSize: 12 }}>
          {coda.intervals.length + 1} clicks · total {fmtSec(totalDur - 0.2)}
        </span>
      </div>
    </div>
  );
}

function ActCoda() {
  const [idx, setIdx] = useState(0);
  const coda = CODAS[idx];

  return (
    <section id="coda" className="act" data-screen-label="03 Codas">
      <div className="col-wide">
        <Eyebrow num={2}>Sperm whale · Physeter macrocephalus</Eyebrow>
        <h2>A coda is a&nbsp;<span className="hl-line">rhythm</span></h2>
        <p className="lede">
          The sperm whale has the largest brain on Earth, and it uses it to make clicks.
          Sharp, broadband, machine-gun fast: <em>tick, tick, tick</em>. The pattern matters more than the&nbsp;pitch.
        </p>

        <div className="split-12-1" style={{ marginTop: 24 }}>
          <div>
            <p>
              A single sperm whale click is louder than a jet engine — about <strong>230&nbsp;decibels</strong> at the source — and lasts under
              fifteen milliseconds. Most of its energy is broadband impulse, not tone. There is no <em>melody</em> here.
            </p>
            <p>
              When whales are foraging they emit slow, evenly-spaced <em>usual clicks</em> for echolocation. But when they socialise — clustered at
              the surface, touching — they switch into <em>codas</em>: short stereotyped patterns of four to twelve clicks. Each lasts under two seconds.
              Each is recognisable. Each repeats.
            </p>
            <p>
              Click through the eight catalogued exemplars below. Notice that the same rhythms reappear across thousands of recordings, across
              decades, across thousands of kilometres of ocean. They are conserved — like a&nbsp;<a className="inline" href="#dsl">grammar</a>.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CODAS.map((c, i) => (
              <button key={c.name}
                onClick={() => setIdx(i)}
                style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  background: i === idx ? 'color-mix(in oklch, var(--lumen) 12%, transparent)' : 'transparent',
                  border: i === idx ? '1px solid var(--lumen)' : '1px solid var(--line)',
                  borderRadius: 4,
                  color: 'var(--foam)', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: 13,
                  transition: 'all 200ms var(--ease-glide)',
                }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                  <span style={{ color: i === idx ? 'var(--lumen)' : 'var(--foam)', fontWeight: 500 }}>{c.name}</span>
                  <span style={{ color: 'var(--shoal)', fontSize: 11 }}>{c.clan}</span>
                </div>
                <div style={{ color: 'var(--mist)', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>
                  {c.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="panel panel--lumen" style={{ padding: 28, marginTop: 32 }}>
          <span className="corner mono">CODA &nbsp;·&nbsp; {coda.name} &nbsp;·&nbsp; {coda.clan}</span>
          <CodaPlayer coda={coda} autoplay={false}/>
        </div>

        <div style={{ marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          <div className="panel">
            <div className="bignum">{coda.intervals.length + 1}<span className="unit">clicks</span></div>
            <p className="small" style={{ marginTop: 8 }}>per single utterance — the unit of the coda alphabet.</p>
          </div>
          <div className="panel">
            <div className="bignum">{Math.round((coda.intervals[coda.intervals.length-1]/coda.intervals[0])*100)/100}<span className="unit">× tempo</span></div>
            <p className="small" style={{ marginTop: 8 }}>ratio of last interval to first — captures <em>rubato</em>, a CETI-identified feature.</p>
          </div>
          <div className="panel">
            <div className="bignum">~{(coda.intervals.reduce((s,v)=>s+v,0) + 0.01).toFixed(2)}<span className="unit">sec</span></div>
            <p className="small" style={{ marginTop: 8 }}>total duration. Codas are short — they are sentences, not songs.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

window.ActCoda = ActCoda;
