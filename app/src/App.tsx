import { useState, useEffect } from 'react'
import { Chrome } from './components/Chrome'
import { ActHero } from './acts/ActHero'
import { ActSpectrum } from './acts/ActSpectrum'
import { ActRange } from './acts/ActRange'
import { ActAnatomy } from './acts/ActAnatomy'
import { ActCoda } from './acts/ActCoda'
import { ActDsl } from './acts/ActDsl'
import { ActNetwork } from './acts/ActNetwork'
import { ActHumpback } from './acts/ActHumpback'
import { ActZipf } from './acts/ActZipf'
import { ActBrain } from './acts/ActBrain'
import { ActGap } from './acts/ActGap'
import { whaleAudio } from './lib/audio'

const ACT_IDS = ['hero', 'spectrum', 'range', 'anatomy', 'coda', 'dsl', 'network', 'humpback', 'zipf', 'brain', 'gap']

export default function App() {
  const [activeAct, setActiveAct] = useState('hero')
  const [audioOn, setAudioOn] = useState(false)

  // Scrollspy
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY + 120
      let active = ACT_IDS[0]
      for (const id of ACT_IDS) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= y) active = id
      }
      setActiveAct(active)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Audio resume on first user interaction
  useEffect(() => {
    let armed = false
    function arm() {
      if (armed) return
      armed = true
      void whaleAudio.resume()
    }
    document.addEventListener('click', arm, { once: true })
    document.addEventListener('keydown', arm, { once: true })
    return () => {
      document.removeEventListener('click', arm)
      document.removeEventListener('keydown', arm)
    }
  }, [])

  function handleAudioToggle() {
    const next = !audioOn
    setAudioOn(next)
    void whaleAudio.resume()
    whaleAudio.setMuted(!next)
  }

  return (
    <>
      <Chrome activeAct={activeAct} audioOn={audioOn} onAudioToggle={handleAudioToggle} />
      <main style={{ paddingTop: 64 }}>
        <ActHero />
        <ActSpectrum />
        <ActRange />
        <ActAnatomy />
        <ActCoda />
        <ActDsl />
        <ActNetwork />
        <ActHumpback />
        <ActZipf />
        <ActBrain />
        <ActGap />
      </main>
    </>
  )
}
