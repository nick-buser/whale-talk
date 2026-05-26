import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { SPECIES, SPECIES_COLORS } from '../lib/data'
import { useSize } from '../lib/hooks'
import { whaleAudio } from '../lib/audio'
import { Eyebrow } from '../components/Eyebrow'
import { Chip } from '../components/Chip'

function SpectrumChart({ selected, setSelected, onPlay }: {
  selected: string
  setSelected: (id: string) => void
  onPlay?: (id: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)

  useEffect(() => {
    if (!ref.current) return
    const W = size.w, H = Math.max(560, size.h)
    const m = { top: 40, right: 40, bottom: 60, left: 80 }

    const svg = d3.select(ref.current).selectAll<SVGSVGElement, unknown>('svg').data([0])
    const svgEnter = svg.enter().append('svg')
    const svgEl = svgEnter.merge(svg)
      .attr('width', W).attr('height', H)
      .attr('viewBox', `0 0 ${W} ${H}`)

    svgEl.selectAll('*').remove()

    const x = d3.scaleLog().domain([8, 200000]).range([m.left, W - m.right])
    const y = d3.scaleLinear().domain([0, 2500]).range([m.top, H - m.bottom])

    const zones = [
      { name: 'Epipelagic',   range: [0, 200]   as [number, number], tone: '#0a1730' },
      { name: 'Mesopelagic',  range: [200, 1000] as [number, number], tone: '#070e22' },
      { name: 'Bathypelagic', range: [1000, 2500]as [number, number], tone: '#03060f' },
    ]
    svgEl.append('g').selectAll('rect').data(zones).enter().append('rect')
      .attr('x', m.left).attr('width', W - m.left - m.right)
      .attr('y', d => y(d.range[0])).attr('height', d => y(d.range[1]) - y(d.range[0]))
      .attr('fill', d => d.tone).attr('opacity', 0.7)

    const baths = d3.range(0, 2500, 250)
    svgEl.append('g').selectAll('line').data(baths).enter().append('line')
      .attr('x1', m.left).attr('x2', W - m.right)
      .attr('y1', d => y(d)).attr('y2', d => y(d))
      .attr('stroke', 'rgba(238,243,250,0.05)').attr('stroke-width', 1)

    svgEl.append('g').selectAll('text').data(zones).enter().append('text')
      .attr('x', W - m.right - 8)
      .attr('y', d => (y(d.range[0]) + y(d.range[1])) / 2)
      .attr('fill', '#5b82b8')
      .attr('text-anchor', 'end').attr('font-family', 'IBM Plex Mono')
      .attr('font-size', 10).attr('letter-spacing', 0.6)
      .attr('opacity', 0.8)
      .text(d => d.name.toUpperCase())

    const ticks = [10, 100, 1000, 10000, 100000]
    const xAxis = svgEl.append('g').attr('transform', `translate(0, ${H - m.bottom})`)
    xAxis.append('line')
      .attr('x1', m.left).attr('x2', W - m.right).attr('stroke', 'rgba(238,243,250,0.2)')
    xAxis.selectAll<SVGGElement, number>('g.tick').data(ticks).enter().append('g').attr('class', 'tick')
      .each(function(d) {
        const g = d3.select(this)
        g.append('line').attr('x1', x(d)).attr('x2', x(d)).attr('y1', 0).attr('y2', 6).attr('stroke', 'rgba(238,243,250,0.3)')
        g.append('text').attr('x', x(d)).attr('y', 22)
          .attr('fill', '#b6c8df').attr('text-anchor', 'middle')
          .attr('font-family', 'IBM Plex Mono').attr('font-size', 11)
          .text(d >= 1000 ? (d/1000) + ' kHz' : d + ' Hz')
      })
    svgEl.append('text').attr('x', (W) / 2).attr('y', H - 18)
      .attr('fill', '#5b82b8').attr('font-family', 'IBM Plex Sans')
      .attr('font-size', 11).attr('letter-spacing', 2)
      .attr('text-anchor', 'middle').text('FREQUENCY — log scale')

    const yTicks = [0, 250, 500, 1000, 1500, 2000]
    const yAxis = svgEl.append('g')
    yAxis.append('line').attr('y1', m.top).attr('y2', H - m.bottom).attr('x1', m.left).attr('x2', m.left)
      .attr('stroke', 'rgba(238,243,250,0.2)')
    yAxis.selectAll<SVGGElement, number>('g.tick').data(yTicks).enter().append('g').attr('class', 'tick')
      .each(function(d) {
        const g = d3.select(this)
        g.append('line').attr('x1', m.left - 6).attr('x2', m.left).attr('y1', y(d)).attr('y2', y(d)).attr('stroke', 'rgba(238,243,250,0.3)')
        g.append('text').attr('x', m.left - 10).attr('y', y(d) + 4)
          .attr('fill', '#b6c8df').attr('text-anchor', 'end')
          .attr('font-family', 'IBM Plex Mono').attr('font-size', 11)
          .text(d === 0 ? 'surface' : `−${d} m`)
      })
    svgEl.append('text')
      .attr('transform', `translate(${m.left - 56}, ${H/2}) rotate(-90)`)
      .attr('fill', '#5b82b8').attr('font-family', 'IBM Plex Sans')
      .attr('font-size', 11).attr('letter-spacing', 2).attr('text-anchor', 'middle')
      .text('TYPICAL DIVE DEPTH')

    svgEl.append('rect')
      .attr('x', x(85)).attr('width', x(8000) - x(85))
      .attr('y', m.top - 28).attr('height', 6)
      .attr('fill', '#ffb472').attr('opacity', 0.65)
    svgEl.append('text').attr('x', x(85)).attr('y', m.top - 32)
      .attr('fill', '#ffb472').attr('font-family', 'IBM Plex Mono').attr('font-size', 10)
      .attr('letter-spacing', 0.5).text('Human speech')

    svgEl.append('rect')
      .attr('x', m.left).attr('width', W - m.left - m.right)
      .attr('y', y(700)).attr('height', y(1200) - y(700))
      .attr('fill', '#4afdc6').attr('opacity', 0.04)
    svgEl.append('text').attr('x', m.left + 14).attr('y', y(950))
      .attr('fill', '#4afdc6').attr('opacity', 0.7)
      .attr('font-family', 'IBM Plex Mono').attr('font-size', 11)
      .attr('letter-spacing', 0.5)
      .text('— SOFAR channel — low-frequency sound trapped here travels for thousands of kilometres')

    const bandH = 30
    const bandY = (s: typeof SPECIES[0]) => y(s.depth[1] * 0.45)
    const g = svgEl.append('g')

    SPECIES.forEach((s) => {
      const isSel = selected === s.id
      const xa = x(s.freq[0])
      const xb = x(s.freq[1])
      const yPos = bandY(s)

      g.append('line')
        .attr('x1', x(s.peakHz)).attr('x2', x(s.peakHz))
        .attr('y1', y(0)).attr('y2', y(s.depth[1]))
        .attr('stroke', s.color).attr('stroke-width', isSel ? 2 : 1).attr('opacity', isSel ? 0.55 : 0.25)
        .attr('stroke-dasharray', '2 4')

      g.append('circle')
        .attr('cx', x(s.peakHz)).attr('cy', y(s.depth[1]))
        .attr('r', isSel ? 4 : 3).attr('fill', s.color).attr('opacity', isSel ? 1 : 0.6)
      g.append('text')
        .attr('x', x(s.peakHz) + 8).attr('y', y(s.depth[1]) + 4)
        .attr('fill', s.color).attr('font-family', 'IBM Plex Mono').attr('font-size', 10)
        .attr('opacity', isSel ? 0.95 : 0.55)
        .text(`−${s.depth[1]} m`)

      g.append('rect')
        .attr('x', xa).attr('width', Math.max(2, xb - xa))
        .attr('y', yPos - bandH/2).attr('height', bandH)
        .attr('fill', s.color).attr('opacity', isSel ? 0.85 : 0.32)
        .attr('rx', 2).attr('cursor', 'pointer')
        .style('filter', isSel ? `drop-shadow(0 0 18px ${s.color})` : 'none')
        .on('click', () => { setSelected(s.id); onPlay && onPlay(s.id) })

      g.append('line')
        .attr('x1', x(s.peakHz)).attr('x2', x(s.peakHz))
        .attr('y1', yPos - bandH/2).attr('y2', yPos + bandH/2)
        .attr('stroke', '#03060f').attr('stroke-width', 1.5).attr('opacity', isSel ? 0.5 : 0.3)

      g.append('text')
        .attr('x', xa + 10).attr('y', yPos - bandH/2 - 6)
        .attr('fill', s.color).attr('font-family', 'Newsreader')
        .attr('font-style', 'italic')
        .attr('font-size', isSel ? 18 : 15).attr('font-weight', 400)
        .style('cursor', 'pointer')
        .style('text-shadow', isSel ? `0 0 12px ${s.color}` : 'none')
        .text(s.name)
        .on('click', () => { setSelected(s.id); onPlay && onPlay(s.id) })
    })
  }, [size.w, selected])

  return <div ref={ref} style={{ width: '100%', minHeight: 600 }}></div>
}

function playSpeciesSample(id: string) {
  void whaleAudio.resume()
  const now = whaleAudio.now() + 0.05
  switch (id) {
    case 'sperm':
      whaleAudio.playCoda([0.21, 0.21, 0.21, 0.21], { start: now })
      break
    case 'humpback':
      whaleAudio.moan(now, { f0: 180, f1: 460, dur: 0.9, vibrato: 5, harmonics: [1, 0.4, 0.18, 0.08] })
      whaleAudio.moan(now+1.1, { f0: 460, f1: 380, dur: 0.7, vibrato: 6, harmonics: [1, 0.35, 0.12] })
      break
    case 'blue':
      whaleAudio.moan(now, { f0: 25, f1: 22, dur: 4.0, vibrato: 0.2, vibratoDepth: 1, harmonics: [1, 0.2, 0.05] })
      break
    case 'orca':
      whaleAudio.moan(now, { f0: 1200, f1: 2200, dur: 0.5, vibrato: 8, harmonics: [1, 0.3] })
      whaleAudio.moan(now+0.55, { f0: 2200, f1: 900, dur: 0.4, vibrato: 6, harmonics: [1, 0.3] })
      break
    case 'fin':
      ;[0, 1.3, 2.6].forEach(d => whaleAudio.moan(now+d, { f0: 22, f1: 18, dur: 0.9, vibrato: 0, harmonics: [1, 0.15] }))
      break
    case 'beluga':
      whaleAudio.moan(now, { f0: 1800, f1: 4400, dur: 0.25, vibrato: 0, harmonics: [1, 0.6, 0.3] })
      whaleAudio.moan(now+0.35, { f0: 4400, f1: 2200, dur: 0.25, vibrato: 0, harmonics: [1, 0.4, 0.2] })
      whaleAudio.moan(now+0.7,  { f0: 3000, f1: 5200, dur: 0.3,  vibrato: 0, harmonics: [1, 0.4, 0.2] })
      break
  }
}

export function ActSpectrum() {
  const [selected, setSelected] = useState('sperm')
  const spec = SPECIES.find(s => s.id === selected)!

  return (
    <section id="spectrum" className="act" data-screen-label="02 Voices">
      <div className="col-xwide">
        <Eyebrow num={1}>An atlas of voices</Eyebrow>
        <h2>Six species. Six ways of being heard.</h2>
        <p className="lede" style={{ maxWidth: '46ch' }}>
          The ocean is a stack of acoustic neighbourhoods. The blue whale lives near 20&nbsp;hertz; the beluga
          screeches up past 50&nbsp;kilohertz. Click a band to listen.
        </p>

        <div style={{ marginTop: 24, marginBottom: 24, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SPECIES.map(s => (
            <Chip key={s.id} active={selected === s.id} dotColor={s.color}
                  onClick={() => { setSelected(s.id); playSpeciesSample(s.id) }}>
              {s.name}
            </Chip>
          ))}
        </div>

        <div className="panel panel--lumen" style={{ padding: 24, marginTop: 8 }}>
          <span className="corner mono">FIG. 01 · frequency × depth</span>
          <SpectrumChart selected={selected} setSelected={setSelected} onPlay={playSpeciesSample} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, marginTop: 48, alignItems: 'start' }}>
          <div>
            <div className="eyebrow" style={{ color: spec.color, marginBottom: 16 }}>
              <span className="rule" style={{ background: spec.color }}></span>
              <span>Selected</span>
            </div>
            <h3 style={{ fontSize: 38, marginBottom: 4 }}>{spec.name}</h3>
            <p style={{ fontStyle: 'italic', color: 'var(--mist)', fontSize: 17, marginBottom: 24 }}>{spec.latin}</p>
            <p style={{ fontSize: 18, color: 'var(--foam)', maxWidth: '46ch' }}>{spec.voice}</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => playSpeciesSample(spec.id)}>
              ► Play a sample
            </button>
            <p className="small" style={{ marginTop: 16, color: 'var(--shoal)' }}>
              Audio is <em>synthesized</em> from published frequency profiles, not real recordings. The character is approximate; the structure, accurate.
            </p>
          </div>
          <div className="specimen">
            <span className="latin">{spec.latin}</span>
            <span className="name">{spec.name}</span>
            <div className="coord-row" style={{ flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
              <span>FREQ <span className="v">{spec.freq[0]} – {spec.freq[1].toLocaleString()} Hz</span></span>
              <span>PEAK <span className="v">{spec.peakHz.toLocaleString()} Hz</span></span>
              <span>DEPTH <span className="v">0 to −{spec.depth[1].toLocaleString()} m</span></span>
              <span>LENGTH <span className="v">≈ {spec.body} m</span></span>
            </div>
          </div>
        </div>

        <p style={{ marginTop: 64, maxWidth: '60ch', color: 'var(--mist)' }}>
          Notice the band marked <span style={{ color: 'var(--lumen)' }}>SOFAR</span>: a layer between roughly 700 and 1,200 metres
          where temperature and pressure conspire to bend sound back into itself. Low-frequency calls trapped here can travel
          for thousands of kilometres. The blue and fin whale evolved to sing into this channel — a single deep moan can
          reach an ocean basin away.
        </p>
      </div>
    </section>
  )
}
