/* ACT 7 — THE TRANSLATION GAP
   Closing meditation. A vertical timeline of major moments in listening,
   a sonar-pulse "listening" element, and a final pull-quote. */

function Timeline() {
  return (
    <ol style={{
      listStyle: 'none', padding: 0, margin: 0,
      position: 'relative',
    }}>
      {/* Central vertical line */}
      <span aria-hidden="true" style={{
        position: 'absolute', top: 0, bottom: 0, left: 78, width: 1,
        background: 'linear-gradient(to bottom, transparent 0%, var(--lumen) 30%, var(--lumen) 70%, transparent 100%)',
        opacity: 0.5,
      }}/>
      {TIMELINE.map((ev, i) => (
        <li key={ev.year + ev.who} style={{
          position: 'relative',
          paddingLeft: 120, paddingBottom: 44,
        }}>
          {/* dot */}
          <span aria-hidden="true" style={{
            position: 'absolute', left: 72, top: 8,
            width: 13, height: 13, borderRadius: '50%',
            background: 'var(--abyss-deep)',
            border: '1.5px solid var(--lumen)',
            boxShadow: '0 0 14px var(--lumen-core)',
          }}/>
          {/* year */}
          <span style={{
            position: 'absolute', left: 0, top: 4,
            width: 58, textAlign: 'right',
            fontFamily: 'var(--font-mono)', fontSize: 14,
            color: 'var(--lumen)',
            letterSpacing: '0.04em',
          }}>{ev.year}</span>
          {/* body */}
          <div>
            <div style={{
              fontFamily: 'var(--font-sans)', fontSize: 11,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'var(--shoal)', marginBottom: 6,
            }}>{ev.who}</div>
            <p style={{
              margin: 0, color: 'var(--foam)',
              fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.55,
              maxWidth: '52ch',
            }}>{ev.what}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* A perpetual listening sonar — three pulsing rings + center */
function SonarListen({ size = 220 }) {
  return (
    <div style={{
      width: size, height: size, position: 'relative',
      margin: '0 auto',
    }}>
      {[0, 1, 2].map(i => (
        <span key={i} aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          border: '1px solid var(--lumen)',
          borderRadius: '50%',
          opacity: 0,
          animation: `sonar-ring 2.8s var(--ease-sound) infinite`,
          animationDelay: `${i * 0.9}s`,
        }}/>
      ))}
      <span style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 22, height: 22, borderRadius: '50%',
        background: 'var(--lumen)',
        boxShadow: '0 0 24px var(--lumen-core), 0 0 64px var(--lumen-core), 0 0 120px color-mix(in oklch, var(--lumen-core) 50%, transparent)',
      }}/>
      <style>{`
        @keyframes sonar-ring {
          0%   { transform: scale(0.2); opacity: 0.9; }
          100% { transform: scale(1);   opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function ActGap() {
  return (
    <section id="gap" className="act" data-screen-label="08 Translation"
      style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Subtle bioluminescent backdrop */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.25, mixBlendMode: 'screen',
        color: 'var(--lumen-core)', pointerEvents: 'none',
      }}>
        <img src="assets/bioluminescence.svg" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
      </div>

      <div className="col" style={{ position: 'relative', zIndex: 1 }}>
        <Eyebrow num={7}>Listening, then</Eyebrow>
        <h2>The translation&nbsp;gap.</h2>
        <p className="lede">
          Seventy-six years of recording. Statistical structure on every test we know.
          And still no decoded message. Why is this so&nbsp;hard?
        </p>

        <p>
          To translate between two human languages we triangulate from shared experience: a child points at a cup; an adult names it. Anthropologists describe this as the
          <em> joint attention</em> required for symbol grounding. We share enough — bodies, food, weather, time — that the gap closes.
        </p>
        <p>
          With a whale we share almost none of it. A sperm whale lives in pressure that would liquefy our chests, holds its breath for ninety minutes, navigates by sonar, sees colour
          in monochrome. Even if we could parse its codas perfectly, we might find ourselves staring at words for sensations we cannot have.
        </p>

        <h3 style={{ fontSize: 28, margin: '64px 0 32px' }}>A short history of trying anyway</h3>
        <Timeline/>

        <div style={{
          marginTop: 80,
          padding: '64px 32px',
          textAlign: 'center',
          borderTop: '1px solid var(--line)',
          borderBottom: '1px solid var(--line)',
        }}>
          <SonarListen/>
          <blockquote className="pullquote" style={{
            marginTop: 48, maxWidth: '24ch', marginLeft: 'auto', marginRight: 'auto',
            fontStyle: 'italic',
          }}>
            We do not know what they are saying.<br/>
            We do not know if they&nbsp;are.<br/>
            <span style={{ color: 'var(--lumen)' }}>We keep listening.</span>
          </blockquote>
        </div>

        <p className="small" style={{ marginTop: 64, color: 'var(--shoal)' }}>
          This essay is illustrative — figures use realistic-but-curated data drawn from the cited literature (Payne &amp; McVay 1971;
          Tyack &amp; Whitehead 1989; Garland et&nbsp;al. on song revolution; Sharma et&nbsp;al. 2024 on CETI combinatorics; Whitehead &amp; Rendell 2014).
          No real recordings were used; all audio is synthesized from published frequency profiles for the character of each call.
          Treat any specific number as instructive, not authoritative.
        </p>

        <p className="small" style={{ marginTop: 16, color: 'var(--shoal)' }}>
          Sounding · A field guide to listening. <span className="mono">v1 · 2026</span>
        </p>
      </div>
    </section>
  );
}

window.ActGap = ActGap;
