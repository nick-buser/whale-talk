import { useState, useEffect, lazy, Suspense } from 'react'
import { Chrome } from './components/Chrome'
import { TweaksPanel } from './components/TweaksPanel'
import { TweaksProvider } from './lib/tweaks'
import { ActHero } from './acts/ActHero'
import { ActSpectrum } from './acts/ActSpectrum'
import { ActRange } from './acts/ActRange'
import { ActAnatomy } from './acts/ActAnatomy'
import { ActCoda } from './acts/ActCoda'
const ActDsl   = lazy(() => import('./acts/ActDsl').then(m => ({ default: m.ActDsl })))
const ActSynth = lazy(() => import('./acts/ActSynth').then(m => ({ default: m.ActSynth })))
import { ActNetwork } from './acts/ActNetwork'
import { ActHumpback } from './acts/ActHumpback'
import { ActZipf } from './acts/ActZipf'
import { ActBrain } from './acts/ActBrain'
import { ActGap } from './acts/ActGap'
import { whaleAudio } from './lib/audio'

const ACT_IDS = ['hero', 'spectrum', 'range', 'anatomy', 'coda', 'dsl', 'synth', 'network', 'humpback', 'zipf', 'brain', 'gap']

function AppInner() {
  const [activeAct, setActiveAct] = useState('hero')
  const [audioOn, setAudioOn] = useState(false)
  const [tweaksOpen, setTweaksOpen] = useState(false)

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

  // Backtick shortcut to toggle tweaks panel
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '`' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target as HTMLElement).tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        setTweaksOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
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
      <Chrome
        activeAct={activeAct}
        audioOn={audioOn}
        onAudioToggle={handleAudioToggle}
        tweaksOpen={tweaksOpen}
        onTweaksToggle={() => setTweaksOpen(prev => !prev)}
      />
      <TweaksPanel open={tweaksOpen} onClose={() => setTweaksOpen(false)} />
      <main style={{ paddingTop: 64 }}>
        <ActHero />
        <ActSpectrum />
        <ActRange />
        <ActAnatomy />
        <ActCoda />
        <Suspense fallback={null}><ActDsl /></Suspense>
        <Suspense fallback={null}><ActSynth /></Suspense>
        <ActNetwork />
        <ActHumpback />
        <ActZipf />
        <ActBrain />
        <ActGap />
      </main>
    </>
  )
}

export default function App() {
  return (
    <TweaksProvider>
      <AppInner />
    </TweaksProvider>
  )
}
