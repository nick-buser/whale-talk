/* ACT 6 — ZIPF & ENTROPY
   Rank-frequency comparison: human language, humpback units, sperm-whale codas,
   dolphin signature whistles, and a uniform-random null model.
   We plot log-rank vs log-frequency. Lines that look straight in log-log obey
   Zipf's law: f(r) ~ r^-α. Slope α tells you how skewed the vocabulary is. */

function ZipfChart({ active, hovered, setHovered }) {
  const wrapRef = useRef(null);
  const size = useSize(wrapRef);
  const W = Math.max(680, size.w);
  const H = 460;
  const m = { top: 30, right: 30, bottom: 60, left: 70 };

  // Compute curves
  const curves = useMemo(() => ZIPF_SOURCES.map(s => ({
    ...s,
    pts: zipfCurve(s.alpha, s.n),
  })), []);

  const x = d3.scaleLog().domain([1, 100]).range([m.left, W - m.right]);
  const y = d3.scaleLog().domain([0.5, 5000]).range([H - m.bottom, m.top]);

  const line = d3.line().x(d => x(d.rank)).y(d => y(Math.max(0.6, d.freq))).curve(d3.curveMonotoneX);

  // Vis state: highlight one curve
  const highlightId = hovered || active;

  return (
    <div ref={wrapRef}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* Grid lines (decade) */}
        {[1, 10, 100].map(t => (
          <line key={'gx'+t} x1={x(t)} x2={x(t)} y1={m.top} y2={H - m.bottom}
                stroke="rgba(238,243,250,0.05)"/>
        ))}
        {[1, 10, 100, 1000].map(t => (
          <line key={'gy'+t} x1={m.left} x2={W - m.right} y1={y(t)} y2={y(t)}
                stroke="rgba(238,243,250,0.05)"/>
        ))}

        {/* Axes */}
        <line x1={m.left} x2={W - m.right} y1={H - m.bottom} y2={H - m.bottom} stroke="rgba(238,243,250,0.2)"/>
        <line x1={m.left} x2={m.left} y1={m.top} y2={H - m.bottom} stroke="rgba(238,243,250,0.2)"/>

        {/* X ticks */}
        {[1, 2, 5, 10, 20, 50, 100].map(t => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={H-m.bottom} y2={H-m.bottom+4} stroke="rgba(238,243,250,0.3)"/>
            <text x={x(t)} y={H-m.bottom+18} fill="#b6c8df"
                  fontFamily="IBM Plex Mono" fontSize="11" textAnchor="middle">{t}</text>
          </g>
        ))}
        <text x={(W+m.left)/2} y={H-12} fill="#5b82b8" textAnchor="middle"
              fontFamily="IBM Plex Sans" fontSize="11" letterSpacing="2">
          RANK (LOG SCALE)
        </text>

        {/* Y ticks */}
        {[1, 10, 100, 1000].map(t => (
          <g key={t}>
            <line x1={m.left-4} x2={m.left} y1={y(t)} y2={y(t)} stroke="rgba(238,243,250,0.3)"/>
            <text x={m.left-8} y={y(t)+4} fill="#b6c8df"
                  fontFamily="IBM Plex Mono" fontSize="11" textAnchor="end">{t}</text>
          </g>
        ))}
        <text transform={`translate(${m.left-50},${(H)/2}) rotate(-90)`}
              fill="#5b82b8" textAnchor="middle"
              fontFamily="IBM Plex Sans" fontSize="11" letterSpacing="2">
          FREQUENCY (LOG)
        </text>

        {/* Curves */}
        {curves.map(c => {
          const isHi = c.id === highlightId;
          const isOther = highlightId && !isHi;
          return (
            <g key={c.id}>
              <path d={line(c.pts)}
                fill="none"
                stroke={c.color}
                strokeWidth={isHi ? 3 : 1.6}
                opacity={isOther ? 0.18 : 0.95}
                style={{ filter: isHi ? `drop-shadow(0 0 12px ${c.color})` : 'none' }}/>
              {/* Dots, sparse, only for highlighted */}
              {isHi && c.pts.filter((_, i) => i % 4 === 0).map((p, i) => (
                <circle key={i} cx={x(p.rank)} cy={y(Math.max(0.6, p.freq))} r={3}
                        fill={c.color}/>
              ))}
              {/* Label on right end */}
              <text x={x(c.pts[c.pts.length-1].rank) + 6}
                    y={y(Math.max(0.6, c.pts[c.pts.length-1].freq)) + 4}
                    fill={isOther ? 'rgba(238,243,250,0.3)' : c.color}
                    fontFamily="IBM Plex Sans" fontSize="11"
                    style={{ pointerEvents:'none' }}>
                α ≈ {c.alpha.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Ideal Zipf line α=1 dashed for reference */}
        {(() => {
          const ideal = zipfCurve(1.0, 100);
          return <path d={line(ideal)}
                       fill="none" stroke="#5b82b8" strokeWidth={1}
                       strokeDasharray="3 4" opacity={0.45}/>;
        })()}
      </svg>
    </div>
  );
}

/* Entropy bar — show conditional entropy at lag N for several systems.
   H(X_{t+1} | X_t..X_{t-N+1}). The faster it drops with lag, the more
   structure there is in the sequence. Toy numbers but reasonable. */
const ENTROPY_BY_LAG = [
  { id: 'english',  name: 'English (chars)',         lags: [4.10, 3.32, 2.85, 2.40, 1.95, 1.55] },
  { id: 'humpback', name: 'Humpback units',          lags: [4.85, 3.95, 3.20, 2.80, 2.55, 2.40] },
  { id: 'sperm',    name: 'Sperm coda types',        lags: [3.05, 2.40, 2.10, 1.95, 1.85, 1.78] },
  { id: 'dolphin',  name: 'Dolphin sig. whistles',   lags: [5.20, 4.95, 4.85, 4.80, 4.78, 4.75] },
  { id: 'random',   name: 'Random tokens',           lags: [6.65, 6.65, 6.65, 6.65, 6.65, 6.65] },
];
const ENTROPY_COLORS = {
  english:'#eef3fa', humpback:'#c6ffe6', sperm:'#4afdc6', dolphin:'#b6c8df', random:'#5b82b8'
};

function EntropyChart({ highlight }) {
  const wrapRef = useRef(null);
  const size = useSize(wrapRef);
  const W = Math.max(580, size.w);
  const H = 320;
  const m = { top: 24, right: 100, bottom: 50, left: 50 };
  const lagsN = ENTROPY_BY_LAG[0].lags.length;
  const x = d3.scaleLinear().domain([0, lagsN-1]).range([m.left, W - m.right]);
  const y = d3.scaleLinear().domain([0, 7]).range([H - m.bottom, m.top]);
  const line = d3.line().x((d, i) => x(i)).y(d => y(d)).curve(d3.curveMonotoneX);

  return (
    <div ref={wrapRef}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* gridlines */}
        {[0, 2, 4, 6].map(v => (
          <line key={v} x1={m.left} x2={W - m.right} y1={y(v)} y2={y(v)}
                stroke="rgba(238,243,250,0.06)"/>
        ))}
        <line x1={m.left} x2={W - m.right} y1={H - m.bottom} y2={H - m.bottom}
              stroke="rgba(238,243,250,0.2)"/>
        <line x1={m.left} x2={m.left} y1={m.top} y2={H - m.bottom}
              stroke="rgba(238,243,250,0.2)"/>

        {/* X ticks */}
        {d3.range(lagsN).map(i => (
          <g key={i}>
            <text x={x(i)} y={H - m.bottom + 18}
                  fill="#b6c8df" fontFamily="IBM Plex Mono" fontSize="11"
                  textAnchor="middle">N={i}</text>
          </g>
        ))}
        <text x={(W - m.right + m.left)/2} y={H - 8} fill="#5b82b8"
              fontFamily="IBM Plex Sans" fontSize="11" letterSpacing="2"
              textAnchor="middle">CONTEXT LENGTH (N)</text>

        {/* Y ticks */}
        {[0, 2, 4, 6].map(v => (
          <text key={v} x={m.left - 8} y={y(v) + 4}
                fill="#b6c8df" fontFamily="IBM Plex Mono" fontSize="11"
                textAnchor="end">{v}</text>
        ))}
        <text transform={`translate(${m.left - 36}, ${(H)/2}) rotate(-90)`}
              fill="#5b82b8" fontFamily="IBM Plex Sans" fontSize="11"
              letterSpacing="2" textAnchor="middle">BITS · H(X | context)</text>

        {/* Series */}
        {ENTROPY_BY_LAG.map(s => {
          const isHi = highlight === s.id;
          const isOther = highlight && !isHi;
          return (
            <g key={s.id}>
              <path d={line(s.lags)} fill="none"
                stroke={ENTROPY_COLORS[s.id]}
                strokeWidth={isHi ? 3 : 1.6}
                opacity={isOther ? 0.18 : 0.95}
                style={{ filter: isHi ? `drop-shadow(0 0 10px ${ENTROPY_COLORS[s.id]})` : 'none' }}/>
              <text x={x(lagsN-1) + 8} y={y(s.lags[lagsN-1]) + 4}
                    fill={isOther ? 'rgba(238,243,250,0.3)' : ENTROPY_COLORS[s.id]}
                    fontFamily="IBM Plex Sans" fontSize="11">
                {s.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ActZipf() {
  const [active, setActive] = useState('english');
  const [hov, setHov] = useState(null);

  return (
    <section id="zipf" className="act" data-screen-label="07 Zipf">
      <div className="col-xwide">
        <Eyebrow num={6}>Statistical fingerprints</Eyebrow>
        <h2>Does it look like&nbsp;<span className="hl">language</span>?</h2>
        <p className="lede" style={{ maxWidth: '46ch' }}>
          Two tests. First: do common &ldquo;words&rdquo; dominate over rare ones the way they do in human speech?
          Second: does context predict what comes next? Both yield <em>necessary</em> but not <em>sufficient</em> signs of language.
        </p>

        <h3 style={{ fontSize: 28, marginTop: 56 }}>Test 1 · Zipf&apos;s law</h3>
        <p>
          Plot vocabulary by rank (most common first) against frequency. For human prose the result is a straight line on log-log axes
          with slope close to <code>−1</code>: the second-most-common word appears half as often as the most common, the tenth a tenth as often.
          This is a fingerprint of generative structure.
        </p>

        <div style={{ display:'flex', gap: 8, flexWrap:'wrap', margin: '24px 0 8px' }}>
          {ZIPF_SOURCES.map(s => (
            <Chip key={s.id} active={active === s.id} dotColor={s.color}
                  onClick={() => setActive(s.id)}>{s.name}</Chip>
          ))}
        </div>

        <div className="panel panel--lumen" style={{ padding: 28, marginTop: 8 }}
             onMouseLeave={() => setHov(null)}>
          <span className="corner mono">FIG. 04 · log–log rank/frequency</span>
          <ZipfChart active={active} hovered={hov} setHovered={setHov}/>
          <p className="small" style={{ marginTop: 12, color:'var(--mist)' }}>
            <span style={{ color:'var(--shoal)' }}>— — —</span> the ideal Zipf line, slope α = 1.0.&nbsp;
            English, humpback song, and sperm-whale codas all hug it. The signature whistle catalogue of dolphins flattens out — they have many &ldquo;rare&rdquo; calls (individual names).
            Uniform random is a flat line.
          </p>
        </div>

        <h3 style={{ fontSize: 28, marginTop: 80 }}>Test 2 · Conditional entropy</h3>
        <p>
          Zipf is a first-order test — it ignores order. The deeper test: given the last few tokens, can you predict the next?
          As context length grows, true language gets <em>much</em> more predictable. Random tokens don&apos;t.
        </p>

        <div className="panel panel--lumen" style={{ padding: 28, marginTop: 24 }}>
          <span className="corner mono">FIG. 05 · entropy decay</span>
          <EntropyChart highlight={active}/>
          <p className="small" style={{ marginTop: 12, color:'var(--mist)' }}>
            English drops from ~4&nbsp;bits to ~1.6&nbsp;bits per character once you condition on five letters of context.
            Humpback and sperm whale show <em>some</em> decay; dolphin signature whistles barely move because each call functions as an identifier. Random tokens never decay.
          </p>
        </div>

        <div className="split-2" style={{ marginTop: 80 }}>
          <div>
            <h3 style={{ fontSize: 24 }}>What this shows</h3>
            <p>
              The Zipf fit and entropy decay together say: <strong>sperm whale codas and humpback units carry combinatorial structure.</strong>
              A signal that could be reproduced by an i.i.d. die-roll would fail both tests. Coda exchanges do not.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 24 }}>What it doesn&apos;t show</h3>
            <p>
              <em>Structure is not meaning.</em> Music passes the Zipf test. Phone numbers pass it. To call something a <em>language</em>
              we want compositional semantics — symbols that combine to produce <em>new</em> meanings.
              We don&apos;t have that evidence yet for any cetacean. We may&nbsp;never.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

window.ActZipf = ActZipf;
