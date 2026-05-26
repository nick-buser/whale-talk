/* ACT 3 — CODA SCORE
   A small DSL for sperm-whale coda rhythm. The user edits scores in a
   syntax-highlighted editor; each line becomes a playable coda.

   Grammar (informal):
     # comment             — ignored
     tempo NNN             — set default inter-click interval (milliseconds)
     name: PATTERN MODS    — define a coda

     PATTERN tokens:
       •     a click (use •  or .  )
       NNN   a literal millisecond gap, replacing the default
       |     a long gap (~ 2x default)
       ||    a longer gap (~ 3x default)

     MODS (any order, space-separated):
       *N         tempo multiplier (e.g. *0.7 = 70% speed)
       ~N         rubato — smooth tempo sweep by fraction N across the coda
       + ornament append an extra grace click
       ! N        ictus — accent the Nth click (louder)

   The score state is held in the parent so Tweaks/Reset can manipulate it. */

/* ── Tokenizer / parser ────────────────────────────────── */
const DSL_DEFAULT = `# Sperm-whale coda score
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
`;

function tokenize(line) {
  // Returns array of typed tokens for syntax highlighting
  const out = [];
  let i = 0;
  const s = line;
  while (i < s.length) {
    const c = s[i];
    if (c === '#') { out.push({ t:'comment', v: s.slice(i) }); return out; }
    if (/\s/.test(c)) { let j = i; while (j < s.length && /\s/.test(s[j])) j++; out.push({ t:'ws', v: s.slice(i, j) }); i = j; continue; }
    if (c === '•' || c === '.') { out.push({ t:'click', v: c }); i++; continue; }
    if (c === '|') { let j = i; while (s[j] === '|') j++; out.push({ t:'gap', v: s.slice(i, j) }); i = j; continue; }
    if (c === ':' || c === '=') { out.push({ t:'colon', v: c }); i++; continue; }
    if (c === '*' || c === '~') { let j = i+1; while (j<s.length && /[\-\d.]/.test(s[j])) j++; out.push({ t:'mod', v: s.slice(i, j) }); i = j; continue; }
    if (c === '+' ) { let j = i; while (j<s.length && s[j] !== ' ' && s[j] !== '#') j++; out.push({ t:'mod', v: s.slice(i, j) }); i = j; continue; }
    if (c === '!' ) { out.push({ t:'mod', v: '!' }); i++; continue; }
    if (/[0-9]/.test(c)) {
      let j = i+1; while (j<s.length && /[0-9.]/.test(s[j])) j++;
      out.push({ t:'num', v: s.slice(i, j) }); i = j; continue;
    }
    // keyword 'tempo' or 'ornament'
    if (/[a-z]/i.test(c)) {
      let j = i+1; while (j<s.length && /[a-z0-9_]/i.test(s[j])) j++;
      const w = s.slice(i, j).toLowerCase();
      const isKw = ['tempo', 'ornament'].includes(w);
      out.push({ t: isKw ? 'kw' : 'ident', v: s.slice(i, j) });
      i = j; continue;
    }
    out.push({ t:'op', v: c }); i++;
  }
  return out;
}

function parseScore(text) {
  const lines = text.split('\n');
  let defaultIci = 0.21;   // seconds
  const codas = []; // { lineIdx, name, intervals[], mods{} }
  lines.forEach((line, idx) => {
    const tokens = tokenize(line);
    const nonws = tokens.filter(t => t.t !== 'ws' && t.t !== 'comment');
    if (nonws.length === 0) return;

    // tempo NNN
    if (nonws[0].t === 'kw' && nonws[0].v.toLowerCase() === 'tempo' && nonws[1] && nonws[1].t === 'num') {
      defaultIci = Math.max(0.02, parseFloat(nonws[1].v) / 1000);
      return;
    }

    // identifier ':' pattern... mods
    if (nonws[0].t === 'ident' && nonws[1] && nonws[1].t === 'colon') {
      const name = nonws[0].v;
      const body = nonws.slice(2);

      // walk body, separating clicks/gaps from mods
      const clicks = [];          // boolean — true means "click here"
      const gaps   = [];          // explicit gap in seconds between clicks (or null = default)
      let lastGap = null;
      const mods = { tempo: 1, rubato: 0, ornament: false, ictus: 0 };
      for (let k = 0; k < body.length; k++) {
        const tk = body[k];
        if (tk.t === 'click') { clicks.push(true); if (clicks.length > 1) gaps.push(lastGap); lastGap = null; }
        else if (tk.t === 'gap') { lastGap = defaultIci * (tk.v.length === 1 ? 2.2 : tk.v.length === 2 ? 3.4 : 4.5); }
        else if (tk.t === 'num') { lastGap = parseFloat(tk.v) / 1000; }
        else if (tk.t === 'mod') {
          if (tk.v.startsWith('*')) mods.tempo *= parseFloat(tk.v.slice(1)) || 1;
          else if (tk.v.startsWith('~')) mods.rubato = parseFloat(tk.v.slice(1)) || 0;
          else if (tk.v.toLowerCase().startsWith('+')) mods.ornament = true;
          else if (tk.v === '!') {
            const next = body[k+1];
            if (next && next.t === 'num') { mods.ictus = parseInt(next.v, 10); k++; }
          }
        } else if (tk.t === 'kw' && tk.v.toLowerCase() === 'ornament') mods.ornament = true;
      }
      // Build intervals with rubato curve + tempo
      // Use default ici for unspecified gaps
      const baseGaps = gaps.map(g => (g == null ? defaultIci : g));
      const n = baseGaps.length;
      const r = mods.rubato;
      const intervals = baseGaps.map((g, i) => {
        // rubato r > 0: speed up monotonically (last interval = g*(1-r))
        // rubato r < 0: slow down (last = g*(1+|r|))
        const frac = n === 1 ? 0 : i / (n - 1);
        const scale = 1 + (-r) * (frac - 0.5) * 2;  // r>0 → starts >1, ends <1
        return g * scale * mods.tempo;
      });
      if (mods.ornament) {
        // grace click — a small fast gap after the last
        intervals.push(Math.max(0.05, defaultIci * 0.4 * mods.tempo));
      }
      codas.push({ lineIdx: idx, name, intervals, mods });
    }
  });
  return { codas, defaultIci };
}

/* ── Highlighted view ─────────────────────────────────── */
function colorFor(tt) {
  switch (tt) {
    case 'comment': return '#5b82b8';
    case 'click':   return '#c6ffe6';
    case 'gap':     return '#ffb472';
    case 'num':     return '#ffb472';
    case 'kw':      return '#4afdc6';
    case 'mod':     return '#4afdc6';
    case 'colon':   return '#b6c8df';
    case 'ident':   return '#eef3fa';
    default:        return '#b6c8df';
  }
}

function HighlightedLine({ line }) {
  if (line === '') return <span> </span>;
  const tokens = tokenize(line);
  return (
    <>
      {tokens.map((t, i) => (
        <span key={i} style={{
          color: colorFor(t.t),
          fontWeight: t.t === 'click' || t.t === 'kw' ? 500 : 400,
          textShadow: t.t === 'click' ? '0 0 8px #4afdc6' : 'none',
        }}>{t.v}</span>
      ))}
    </>
  );
}

/* The editor itself — textarea + transparent text over an overlay <pre> */
function CodaEditor({ text, onChange, onPlayLine, activeLine }) {
  const taRef = useRef(null);
  const preRef = useRef(null);
  const lines = text.split('\n');

  // Keep scroll positions in sync
  const onScroll = () => {
    if (!taRef.current || !preRef.current) return;
    preRef.current.scrollTop = taRef.current.scrollTop;
    preRef.current.scrollLeft = taRef.current.scrollLeft;
  };

  // Determine clickable lines
  const clickable = useMemo(() => {
    const set = new Set();
    parseScore(text).codas.forEach(c => set.add(c.lineIdx));
    return set;
  }, [text]);

  return (
    <div style={{
      position: 'relative',
      background: 'var(--abyss-deep)',
      border: '1px solid var(--line)',
      borderRadius: 6,
      overflow: 'hidden',
    }}>
      {/* Gutter — line numbers + play buttons */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: 56,
        borderRight: '1px solid var(--line)',
        background: 'color-mix(in oklch, var(--abyss-ink) 60%, transparent)',
        zIndex: 2,
      }}>
        {lines.map((_, i) => (
          <div key={i} style={{
            height: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 6px',
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: i === activeLine ? 'var(--lumen)' : 'var(--shoal)',
          }}>
            <span>{i+1}</span>
            {clickable.has(i) ? (
              <button onClick={() => onPlayLine(i)}
                title="Play this coda"
                style={{
                  width: 16, height: 16, border: '1px solid var(--lumen)',
                  borderRadius: '50%', background: i === activeLine ? 'var(--lumen)' : 'transparent',
                  color: i === activeLine ? 'var(--lumen-ink)' : 'var(--lumen)',
                  cursor: 'pointer', padding: 0,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8, lineHeight: 1,
                }}>►</button>
            ) : null}
          </div>
        ))}
      </div>

      {/* Highlighted overlay */}
      <pre ref={preRef} aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 56, right: 0, bottom: 0,
        margin: 0, padding: '0 14px',
        fontFamily: 'var(--font-mono)', fontSize: 13.5, lineHeight: '24px',
        color: 'transparent',                       /* text is visible only via spans */
        background: 'transparent',
        whiteSpace: 'pre',
        overflow: 'auto',
        pointerEvents: 'none',
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{
            background: i === activeLine ? 'color-mix(in oklch, var(--lumen) 10%, transparent)' : 'transparent',
            paddingLeft: 0,
          }}>
            <HighlightedLine line={line}/>
          </div>
        ))}
      </pre>

      <textarea ref={taRef} value={text} onChange={(e) => onChange(e.target.value)}
        onScroll={onScroll}
        spellCheck={false}
        style={{
          position: 'relative', display: 'block',
          width: '100%', height: 440,
          margin: 0, padding: '0 14px 0 70px',
          fontFamily: 'var(--font-mono)', fontSize: 13.5, lineHeight: '24px',
          color: 'transparent', caretColor: 'var(--lumen)',
          background: 'transparent', border: 0, outline: 'none', resize: 'vertical',
          whiteSpace: 'pre', overflowWrap: 'normal', overflow: 'auto',
        }}/>
    </div>
  );
}

function ActDsl() {
  const [text, setText] = useState(DSL_DEFAULT);
  const { codas } = useMemo(() => parseScore(text), [text]);
  const [active, setActive] = useState(-1);

  const playLine = useCallback((lineIdx) => {
    const c = codas.find(c => c.lineIdx === lineIdx);
    if (!c || !window.WhaleAudio) return;
    const A = window.WhaleAudio;
    A.resume();
    setActive(lineIdx);
    const start = A.now() + 0.06;
    const intervals = c.intervals.slice();
    const total = intervals.reduce((s,v)=>s+v,0);
    A.playCoda(intervals, {
      start,
      onClick: (i, n) => {
        // accent ictus
        if (c.mods.ictus && i === c.mods.ictus - 1) {
          // re-trigger a louder click at the same time
          A.click(A.now() + 0.001, { gain: 1.2 });
        }
        if (i === n - 1) setTimeout(() => setActive(-1), 200);
      }
    });
    setTimeout(() => setActive(-1), (total + 0.5) * 1000);
  }, [codas]);

  const playAll = useCallback(() => {
    if (!window.WhaleAudio) return;
    let delay = 0;
    codas.forEach((c, i) => {
      setTimeout(() => playLine(c.lineIdx), delay);
      delay += (c.intervals.reduce((s,v)=>s+v,0) + 0.5) * 1000;
    });
  }, [codas, playLine]);

  return (
    <section id="dsl" className="act" data-screen-label="04 Score">
      <div className="col-xwide">
        <Eyebrow num={3}>Coda score · a small DSL</Eyebrow>
        <h2><span className="hl">Compose</span> a coda. Hear it back.</h2>
        <p className="lede" style={{ maxWidth: '46ch' }}>
          A coda is rhythm and not much else, so we can write it as code. Edit the score; every line with a name becomes a&nbsp;playable phrase.
        </p>

        <div className="split-12-1" style={{ marginTop: 32, gap: 40 }}>
          <div>
            <div style={{ display:'flex', gap: 10, marginBottom: 12 }}>
              <button className="btn btn-primary" onClick={playAll}>► Play all</button>
              <button className="btn btn-ghost" onClick={() => setText(DSL_DEFAULT)}>Reset score</button>
              <span className="mono small" style={{ marginLeft:'auto', color:'var(--shoal)', alignSelf:'center' }}>{codas.length} codas parsed</span>
            </div>
            <CodaEditor text={text} onChange={setText} onPlayLine={playLine} activeLine={active}/>
            <p className="small" style={{ marginTop: 12, color:'var(--mist)' }}>
              Edit any line. Press <code style={{ background:'var(--abyss-ink)', padding:'2px 6px', borderRadius:3 }}>►</code> in the gutter to hear it. Hot-modify
              the <span className="mono" style={{color:'var(--lumen)'}}>tempo</span>, add <span className="mono" style={{color:'var(--lumen)'}}>*1.5</span> for speed,
              <span className="mono" style={{color:'var(--lumen)'}}>~0.6</span> for rubato.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: 26, marginTop: 0 }}>The CETI alphabet</h3>
            <p style={{ fontSize: 16, color: 'var(--mist)' }}>
              In 2024 Project CETI published evidence that coda variation isn&apos;t noise — it&apos;s structured along four orthogonal axes,
              like vowels and consonants in a phonology.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap: 12, marginTop: 20 }}>
              {CODA_MODIFIERS.map(m => (
                <div key={m.id} style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                    <strong style={{ color: 'var(--lumen)', fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.04em' }}>{m.name.toUpperCase()}</strong>
                    <span className="mono" style={{ color: 'var(--shoal)', fontSize: 11 }}>
                      {m.id === 'rubato' && '~N'}
                      {m.id === 'tempo' && '*N'}
                      {m.id === 'ornament' && '+ orn.'}
                      {m.id === 'ictus' && '! N'}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--mist)', margin: '6px 0 0' }}>{m.desc}</p>
                </div>
              ))}
            </div>
            <p className="small" style={{ marginTop: 20, color: 'var(--shoal)' }}>
              The point: a small base vocabulary (≈ 21 coda types) combined with four continuous modifiers yields hundreds of distinguishable utterances. Combinatorial.
              That&apos;s what languages do.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

window.ActDsl = ActDsl;
