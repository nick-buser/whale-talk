/* WhaleAudio — synthesized whale-call instruments.
   Ported from project/audio.js to TypeScript. */

interface ClickOpts {
  dur?: number
  gain?: number
}

interface PlayCodaOpts {
  start?: number
  onClick?: (i: number, total: number) => void
}

interface MoanOpts {
  f0?: number
  f1?: number
  dur?: number
  vibrato?: number
  vibratoDepth?: number
  harmonics?: number[]
  gain?: number
}

interface SequenceEvent {
  at: number
  kind: 'click' | 'moan' | 'sweep'
  opts?: MoanOpts & ClickOpts
}

interface SequenceOpts {
  start?: number
  onEvent?: (i: number, total: number) => void
}

interface DroneNodes {
  oscs: OscillatorNode[]
  g: GainNode
}

class WhaleAudio {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private masterMuted = false
  private masterVolume = 0.6
  private droneNodes: DroneNodes | null = null

  private ensureCtx(): AudioContext | null {
    if (this.ctx) return this.ctx
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    this.ctx = new AC()
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.value = this.masterMuted ? 0 : this.masterVolume
    this.masterGain.connect(this.ctx.destination)
    return this.ctx
  }

  now(): number {
    return this.ctx ? this.ctx.currentTime : 0
  }

  async resume(): Promise<void> {
    const c = this.ensureCtx()
    if (c && c.state === 'suspended') await c.resume()
  }

  setMuted(m: boolean): void {
    this.masterMuted = !!m
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime)
      this.masterGain.gain.setTargetAtTime(this.masterMuted ? 0 : this.masterVolume, this.ctx.currentTime, 0.04)
    }
  }

  setVolume(v: number): void {
    this.masterVolume = Math.max(0, Math.min(1, v))
    if (!this.masterMuted && this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.04)
    }
  }

  isMuted(): boolean {
    return this.masterMuted
  }

  click(time: number, opts?: ClickOpts): void {
    const c = this.ensureCtx()
    if (!c || !this.masterGain) return
    const dur = opts?.dur ?? 0.012
    const gainPeak = opts?.gain ?? 0.9

    const bufSize = Math.floor(c.sampleRate * dur)
    const buf = c.createBuffer(1, bufSize, c.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) {
      const t = i / bufSize
      const env = Math.exp(-t * 9) * (1 - t * 0.3)
      d[i] = (Math.random() * 2 - 1) * env
    }
    const src = c.createBufferSource()
    src.buffer = buf

    const bp = c.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 4500
    bp.Q.value = 1.4

    const hp = c.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 800

    const g = c.createGain()
    g.gain.setValueAtTime(0, time)
    g.gain.linearRampToValueAtTime(gainPeak, time + 0.0008)
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur)

    src.connect(bp); bp.connect(hp); hp.connect(g); g.connect(this.masterGain)
    src.start(time)
    src.stop(time + dur + 0.02)

    const osc = c.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(180, time)
    osc.frequency.exponentialRampToValueAtTime(60, time + dur * 1.5)
    const og = c.createGain()
    og.gain.setValueAtTime(0, time)
    og.gain.linearRampToValueAtTime(gainPeak * 0.4, time + 0.001)
    og.gain.exponentialRampToValueAtTime(0.0001, time + dur * 2)
    osc.connect(og); og.connect(this.masterGain)
    osc.start(time)
    osc.stop(time + dur * 2 + 0.02)
  }

  playCoda(intervals: number[], opts?: PlayCodaOpts): { duration: number; start: number } {
    const c = this.ensureCtx()
    if (!c) return { duration: 0, start: 0 }
    void c.resume()
    const start = opts?.start != null ? opts.start : c.currentTime + 0.06
    const onClick = opts?.onClick ?? (() => {})

    let t = 0
    const times: number[] = [start]
    this.click(start, { gain: 0.9 })
    for (let i = 0; i < intervals.length; i++) {
      t += Math.max(0.01, intervals[i])
      const at = start + t
      times.push(at)
      this.click(at, { gain: 0.85 })
    }
    times.forEach((at, i) => {
      const delay = Math.max(0, (at - c.currentTime) * 1000)
      window.setTimeout(() => onClick(i, intervals.length + 1), delay)
    })
    return { duration: t, start }
  }

  moan(time: number, opts?: MoanOpts): { duration: number } {
    const c = this.ensureCtx()
    if (!c || !this.masterGain) return { duration: 0 }
    void c.resume()
    const dur = opts?.dur ?? 1.6
    const f0 = opts?.f0 ?? 220
    const f1 = opts?.f1 != null ? opts.f1 : f0
    const vibratoHz = opts?.vibrato ?? 4.2
    const vibratoDepth = opts?.vibratoDepth ?? 6
    const harmonics = opts?.harmonics ?? [1, 0.45, 0.18, 0.08]
    const peak = opts?.gain ?? 0.5

    const group = c.createGain()
    group.gain.setValueAtTime(0, time)
    group.gain.linearRampToValueAtTime(peak, time + Math.min(0.12, dur * 0.15))
    group.gain.linearRampToValueAtTime(peak * 0.85, time + dur * 0.7)
    group.gain.exponentialRampToValueAtTime(0.0001, time + dur)
    group.connect(this.masterGain)

    const lfo = c.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = vibratoHz
    const lfoGain = c.createGain()
    lfoGain.gain.value = vibratoDepth
    lfo.connect(lfoGain)
    lfo.start(time)
    lfo.stop(time + dur + 0.05)

    harmonics.forEach((amp, idx) => {
      const n = idx + 1
      const osc = c.createOscillator()
      osc.type = idx === 0 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(f0 * n, time)
      osc.frequency.linearRampToValueAtTime(f1 * n, time + dur)

      const lfoToFreq = c.createGain()
      lfoToFreq.gain.value = n
      lfoGain.connect(lfoToFreq)
      lfoToFreq.connect(osc.frequency)

      const g = c.createGain()
      g.gain.value = amp
      osc.connect(g); g.connect(group)
      osc.start(time)
      osc.stop(time + dur + 0.05)
    })

    return { duration: dur }
  }

  sweep(time: number, opts?: MoanOpts): { duration: number } {
    return this.moan(time, Object.assign({ dur: 0.7, vibrato: 0, harmonics: [1, 0.3, 0.1] }, opts ?? {}))
  }

  startDrone(): void {
    const c = this.ensureCtx()
    if (!c || !this.masterGain || this.droneNodes) return
    void c.resume()
    const o1 = c.createOscillator(); o1.type = 'sine'; o1.frequency.value = 38
    const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = 56
    const o3 = c.createOscillator(); o3.type = 'triangle'; o3.frequency.value = 26
    const g = c.createGain(); g.gain.value = 0; g.connect(this.masterGain)
    o1.connect(g); o2.connect(g); o3.connect(g)
    g.gain.setTargetAtTime(0.06, c.currentTime, 1.2)
    o1.start(); o2.start(); o3.start()
    this.droneNodes = { oscs: [o1, o2, o3], g }
  }

  stopDrone(): void {
    if (!this.droneNodes || !this.ctx) return
    this.droneNodes.g.gain.setTargetAtTime(0, this.ctx.currentTime, 0.8)
    const oldOscs = this.droneNodes.oscs
    setTimeout(() => oldOscs.forEach(o => { try { o.stop() } catch (_) {} }), 2400)
    this.droneNodes = null
  }

  sequence(events: SequenceEvent[], opts?: SequenceOpts): { duration: number; start: number } {
    const c = this.ensureCtx()
    if (!c) return { duration: 0, start: 0 }
    void c.resume()
    const start = opts?.start != null ? opts.start : c.currentTime + 0.08
    const onEvent = opts?.onEvent ?? (() => {})
    let last = 0
    events.forEach((e, i) => {
      const at = start + e.at
      if (e.kind === 'click') this.click(at, e.opts)
      else if (e.kind === 'moan') this.moan(at, e.opts)
      else if (e.kind === 'sweep') this.sweep(at, e.opts)
      last = Math.max(last, e.at + (e.opts && (e.opts as MoanOpts).dur || 0.5))
      const delay = Math.max(0, (at - c.currentTime) * 1000)
      window.setTimeout(() => onEvent(i, events.length), delay)
    })
    return { duration: last, start }
  }
}

export const whaleAudio = new WhaleAudio()
