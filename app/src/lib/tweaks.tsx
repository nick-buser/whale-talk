import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { whaleAudio } from './audio'

export interface Tweaks {
  lumenIntensity: number
  showAnnotations: boolean
  ambientDrone: boolean
}

const DEFAULTS: Tweaks = {
  lumenIntensity: 1.0,
  showAnnotations: true,
  ambientDrone: false,
}

interface TweaksContextValue {
  tweaks: Tweaks
  setTweak: <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => void
}

export const TweaksContext = createContext<TweaksContextValue>({
  tweaks: DEFAULTS,
  setTweak: () => {},
})

export function useTweaks() {
  return useContext(TweaksContext)
}

export function TweaksProvider({ children }: { children: ReactNode }) {
  const [tweaks, setTweaks] = useState<Tweaks>(DEFAULTS)

  const setTweak = useCallback(<K extends keyof Tweaks>(key: K, value: Tweaks[K]) => {
    setTweaks(prev => ({ ...prev, [key]: value }))

    if (key === 'lumenIntensity') {
      const v = value as number
      document.documentElement.style.setProperty(
        '--lumen-bright',
        `color-mix(in oklch, #c6ffe6 ${Math.min(100, Math.round(v * 100))}%, var(--foam))`
      )
    }

    if (key === 'ambientDrone') {
      void whaleAudio.resume()
      if (value) whaleAudio.startDrone()
      else whaleAudio.stopDrone()
    }
  }, [])

  // Sync drone with audio mute state — stop the drone if audio is muted externally
  useEffect(() => {
    if (!tweaks.ambientDrone) whaleAudio.stopDrone()
  }, [tweaks.ambientDrone])

  return (
    <TweaksContext.Provider value={{ tweaks, setTweak }}>
      {children}
    </TweaksContext.Provider>
  )
}
