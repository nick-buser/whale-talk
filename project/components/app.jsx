/* APP — orchestrator and Tweaks wiring. */

const TWEAKS = /*EDITMODE-BEGIN*/{
  "audio_default_on": false,
  "tempo_humpback": 1.0,
  "show_annotations": true,
  "lumen_intensity": 1.0,
  "ambient_drone": false
}/*EDITMODE-END*/;

function App() {
  const t = window.useTweaks ? window.useTweaks(TWEAKS) : { t: TWEAKS, set: () => {} };
  const tweaks = t.t || t;
  const setTweak = t.setTweak || (() => {});

  return (
    <>
      <ActHero/>
      <ActSpectrum/>
      <ActRange/>
      <ActAnatomy/>
      <ActCoda/>
      <ActDsl/>
      <ActNetwork/>
      <ActHumpback/>
      <ActZipf/>
      <ActBrain/>
      <ActGap/>

      {window.TweaksPanel ? (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection title="Audio">
            <window.TweakToggle
              label="Audio default on"
              checked={!!tweaks.audio_default_on}
              onChange={(v) => { setTweak('audio_default_on', v); window.__setAudio && window.__setAudio(v); }}/>
            <window.TweakToggle
              label="Ambient blue-whale drone"
              checked={!!tweaks.ambient_drone}
              onChange={(v) => {
                setTweak('ambient_drone', v);
                if (window.WhaleAudio) {
                  window.WhaleAudio.resume();
                  if (v) window.WhaleAudio.startDrone(); else window.WhaleAudio.stopDrone();
                }
              }}/>
          </window.TweakSection>
          <window.TweakSection title="Reading">
            <window.TweakToggle
              label="Show annotations"
              checked={!!tweaks.show_annotations}
              onChange={(v) => setTweak('show_annotations', v)}/>
          </window.TweakSection>
          <window.TweakSection title="Motion">
            <window.TweakSlider
              label="Lumen intensity"
              value={tweaks.lumen_intensity ?? 1.0}
              min={0.3} max={1.6} step={0.05}
              onChange={(v) => {
                setTweak('lumen_intensity', v);
                document.documentElement.style.setProperty('--lumen-bright', `color-mix(in oklch, #c6ffe6 ${Math.min(100, v * 100)}%, var(--foam))`);
              }}/>
          </window.TweakSection>
        </window.TweaksPanel>
      ) : null}
    </>
  );
}

/* ── Mount ───────────────────────────────────────────── */
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);

/* ── Audio toggle button (top chrome) ────────────────── */
(function () {
  const btn = document.getElementById('audio-toggle');
  let on = false;
  function set(v) {
    on = !!v;
    if (window.WhaleAudio) {
      if (on) window.WhaleAudio.resume();
      window.WhaleAudio.setMuted(!on);
    }
    btn.classList.toggle('off', !on);
    btn.querySelector('.lbl').textContent = on ? 'Audio · on' : 'Audio · off';
  }
  window.__setAudio = set;
  btn.addEventListener('click', () => set(!on));
  set(false);

  // Resume audio context on any user interaction so initial click plays
  let armed = false;
  function arm() {
    if (armed) return; armed = true;
    if (window.WhaleAudio) window.WhaleAudio.resume();
  }
  document.addEventListener('click', arm, { once: true });
  document.addEventListener('keydown', arm, { once: true });
})();

/* ── Nav: scrollspy ──────────────────────────────────── */
(function () {
  const links = Array.from(document.querySelectorAll('.chrome .nav a'));
  links.forEach(a => {
    a.addEventListener('click', () => {
      const id = a.dataset.act;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  function onScroll() {
    const y = window.scrollY + 120;
    let active = links[0]?.dataset.act;
    for (const a of links) {
      const el = document.getElementById(a.dataset.act);
      if (el && el.offsetTop <= y) active = a.dataset.act;
    }
    links.forEach(a => a.classList.toggle('active', a.dataset.act === active));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
