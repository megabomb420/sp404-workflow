import { useLayoutEffect } from 'react'

/** Pin the app column to the visual viewport so iOS/Grok chrome cannot clip overlays. */
export function ViewportLock() {
  useLayoutEffect(() => {
    const root = document.documentElement
    const sync = () => {
      const vv = window.visualViewport
      const h = vv?.height ?? window.innerHeight
      const t = vv?.offsetTop ?? 0
      root.style.setProperty('--app-h', `${Math.round(h)}px`)
      root.style.setProperty('--app-t', `${Math.round(t)}px`)
    }
    sync()
    window.visualViewport?.addEventListener('resize', sync)
    window.visualViewport?.addEventListener('scroll', sync)
    window.addEventListener('resize', sync)
    window.addEventListener('orientationchange', sync)
    return () => {
      window.visualViewport?.removeEventListener('resize', sync)
      window.visualViewport?.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
      window.removeEventListener('orientationchange', sync)
    }
  }, [])
  return null
}
