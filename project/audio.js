/* WhaleAudio — synthesized whale-call instruments.
   No real recordings; everything is generated with the Web Audio API.
   Three voices:
     - clickTrain : sperm-whale codas (sharp broadband ticks)
     - moan       : long tonal calls (humpback / blue), with pitch envelope + vibrato
     - sweep      : downsweep / upsweep glissandi
   A single shared AudioContext is created lazily so we don't block until first interaction. */

(function (global) {
  let ctx = null;
  let masterGain = null;
  let masterMuted = false;
  let masterVolume = 0.6;

  function ensureCtx() {
    if (ctx) return ctx;
    const AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = masterMuted ? 0 : masterVolume;
    masterGain.connect(ctx.destination);
    return ctx;
  }

  function resume() {
    const c = ensureCtx();
    if (c && c.state === 'suspended') c.resume();
    return c;
  }

  function setMuted(m) {
    masterMuted = !!m;
    if (masterGain) masterGain.gain.cancelScheduledValues(ctx.currentTime);
    if (masterGain) masterGain.gain.setTargetAtTime(masterMuted ? 0 : masterVolume, ctx ? ctx.currentTime : 0, 0.04);
  }
  function setVolume(v) {
    masterVolume = Math.max(0, Math.min(1, v));
    if (!masterMuted && masterGain) masterGain.gain.setTargetAtTime(masterVolume, ctx.currentTime, 0.04);
  }

  /* ── A single sperm whale click ─────────────────────────
     A coda click is broadband (most energy 5-25kHz, with a thump down low).
     We model it as a short noise burst through a band-pass with a quick decay,
     plus a low thump for body. Duration ~3-8ms. */
  function click(time, opts) {
    const c = ensureCtx(); if (!c) return;
    opts = opts || {};
    const dur = opts.dur || 0.012;
    const gainPeak = opts.gain != null ? opts.gain : 0.9;

    // Noise burst
    const bufSize = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, bufSize, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      // Pink-ish noise with sharp attack and short decay
      const t = i / bufSize;
      const env = Math.exp(-t * 9) * (1 - t * 0.3);
      d[i] = (Math.random() * 2 - 1) * env;
    }
    const src = c.createBufferSource();
    src.buffer = buf;

    const bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 4500;
    bp.Q.value = 1.4;

    const hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 800;

    const g = c.createGain();
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(gainPeak, time + 0.0008);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    src.connect(bp); bp.connect(hp); hp.connect(g); g.connect(masterGain);
    src.start(time);
    src.stop(time + dur + 0.02);

    // A small low thump for body
    const osc = c.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, time);
    osc.frequency.exponentialRampToValueAtTime(60, time + dur * 1.5);
    const og = c.createGain();
    og.gain.setValueAtTime(0, time);
    og.gain.linearRampToValueAtTime(gainPeak * 0.4, time + 0.001);
    og.gain.exponentialRampToValueAtTime(0.0001, time + dur * 2);
    osc.connect(og); og.connect(masterGain);
    osc.start(time);
    osc.stop(time + dur * 2 + 0.02);
  }

  /* Play a coda — an array of inter-click intervals (in seconds).
     Returns the total duration. Callback fires per-click for visualization.
     `start` is the absolute audio time to start (defaults to now+0.06). */
  function playCoda(intervals, opts) {
    const c = resume(); if (!c) return { duration: 0, stop: () => {} };
    opts = opts || {};
    const start = opts.start != null ? opts.start : c.currentTime + 0.06;
    const onClick = opts.onClick || (() => {});
    // First click at t=0 (relative)
    let t = 0;
    const times = [];
    times.push(start);
    click(start, { gain: 0.9 });
    for (let i = 0; i < intervals.length; i++) {
      t += Math.max(0.01, intervals[i]);
      const at = start + t;
      times.push(at);
      click(at, { gain: 0.85 });
    }
    // schedule visual callbacks
    times.forEach((at, i) => {
      const delay = Math.max(0, (at - c.currentTime) * 1000);
      const id = global.setTimeout(() => onClick(i, intervals.length + 1), delay);
    });
    return { duration: t, start };
  }

  /* ── A moan / long tonal call ───────────────────────────
     Used for humpback "units" and blue whale low calls.
     opts: { f0, f1, dur, vibrato, harmonics, gain } */
  function moan(time, opts) {
    const c = resume(); if (!c) return;
    opts = opts || {};
    const dur = opts.dur || 1.6;
    const f0 = opts.f0 || 220;
    const f1 = opts.f1 != null ? opts.f1 : f0;     // ending freq for sweep
    const vibratoHz = opts.vibrato || 4.2;
    const vibratoDepth = opts.vibratoDepth || 6;
    const harmonics = opts.harmonics || [1, 0.45, 0.18, 0.08];
    const peak = opts.gain != null ? opts.gain : 0.5;

    const group = c.createGain();
    group.gain.setValueAtTime(0, time);
    group.gain.linearRampToValueAtTime(peak, time + Math.min(0.12, dur * 0.15));
    group.gain.linearRampToValueAtTime(peak * 0.85, time + dur * 0.7);
    group.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    group.connect(masterGain);

    // LFO for vibrato (modulates all oscillator frequencies via a gain that adds to base freq)
    const lfo = c.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = vibratoHz;
    const lfoGain = c.createGain();
    lfoGain.gain.value = vibratoDepth;
    lfo.connect(lfoGain);
    lfo.start(time);
    lfo.stop(time + dur + 0.05);

    harmonics.forEach((amp, idx) => {
      const n = idx + 1;
      const osc = c.createOscillator();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f0 * n, time);
      osc.frequency.linearRampToValueAtTime(f1 * n, time + dur);
      // Connect LFO depth scaled to harmonic so the vibrato tracks
      const lfoToFreq = c.createGain();
      lfoToFreq.gain.value = n;
      lfoGain.connect(lfoToFreq);
      lfoToFreq.connect(osc.frequency);

      const g = c.createGain();
      g.gain.value = amp;
      osc.connect(g); g.connect(group);
      osc.start(time);
      osc.stop(time + dur + 0.05);
    });

    return { duration: dur };
  }

  /* Quick sweep — like a humpback "wop" or a downsweep */
  function sweep(time, opts) {
    return moan(time, Object.assign({ dur: 0.7, vibrato: 0, harmonics: [1, 0.3, 0.1] }, opts || {}));
  }

  /* Ambient blue whale infrasound drone (subtle ambient bed) */
  let droneNodes = null;
  function startDrone() {
    const c = resume(); if (!c) return;
    if (droneNodes) return;
    const o1 = c.createOscillator(); o1.type = 'sine'; o1.frequency.value = 38;
    const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = 56;
    const o3 = c.createOscillator(); o3.type = 'triangle'; o3.frequency.value = 26;
    const g = c.createGain(); g.gain.value = 0; g.connect(masterGain);
    o1.connect(g); o2.connect(g); o3.connect(g);
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 240;
    // Soft fade in
    g.gain.setTargetAtTime(0.06, c.currentTime, 1.2);
    o1.start(); o2.start(); o3.start();
    droneNodes = { oscs: [o1, o2, o3], g };
  }
  function stopDrone() {
    if (!droneNodes) return;
    droneNodes.g.gain.setTargetAtTime(0, ctx.currentTime, 0.8);
    const oldOscs = droneNodes.oscs;
    setTimeout(() => oldOscs.forEach(o => { try { o.stop(); } catch(_) {} }), 2400);
    droneNodes = null;
  }

  /* Sequence helper — given an array of {at, kind, opts}, schedule each
     event. Used by humpback song player. Returns total dur and stop fn. */
  function sequence(events, opts) {
    const c = resume(); if (!c) return { duration: 0, stop: () => {} };
    opts = opts || {};
    const start = opts.start != null ? opts.start : c.currentTime + 0.08;
    const onEvent = opts.onEvent || (() => {});
    let last = 0;
    events.forEach((e, i) => {
      const at = start + e.at;
      if (e.kind === 'click') click(at, e.opts);
      else if (e.kind === 'moan') moan(at, e.opts);
      else if (e.kind === 'sweep') sweep(at, e.opts);
      last = Math.max(last, e.at + (e.opts && e.opts.dur || 0.5));
      const delay = Math.max(0, (at - c.currentTime) * 1000);
      global.setTimeout(() => onEvent(i, events.length), delay);
    });
    return { duration: last, start };
  }

  global.WhaleAudio = {
    ensure: ensureCtx,
    resume,
    setMuted, setVolume,
    isMuted: () => masterMuted,
    now: () => ctx ? ctx.currentTime : 0,
    click, playCoda,
    moan, sweep, sequence,
    startDrone, stopDrone,
  };
})(window);
