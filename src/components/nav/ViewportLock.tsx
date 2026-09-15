import { useLayoutEffect } from 'react'

/**
 * Pin the app column to the visible frame.
 *
 * iPhone 17 Pro (402×874, 34px home indicator): visualViewport often ends
 * just above the indicator. If we size the shell to that and ALSO pad the
 * dock with safe-area-inset-bottom, a ~34–50px hole opens under NOW/SZUKAJ.
 * When the only missing slice is that indicator band, fill it and let the
 * dock paint into it. Chrome-inset webviews (Grok) keep the short frame
 * and drop the phantom inset so we don't pad twice.
 */
export function ViewportLock() {
  useLayoutEffect(() => {
    const root = document.documentElement
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone)

    const sync = () => {
      const vv = window.visualViewport
      const inner = window.innerHeight
      const vvH = vv?.height ?? inner
      const t = vv?.offsetTop ?? 0
      const bottomGap = inner - (t + vvH)
      const indicatorBand = bottomGap > 0 && bottomGap <= 56 && t <= 8

      let h = vvH
      let top = t
      if (indicatorBand || standalone) {
        h = Math.max(vvH + Math.max(0, bottomGap), inner)
        top = 0
        root.style.setProperty('--safe-b', 'env(safe-area-inset-bottom, 0px)')
      } else if (bottomGap > 56 || t > 8) {
        root.style.setProperty('--safe-b', '0px')
      } else {
        root.style.setProperty('--safe-b', 'env(safe-area-inset-bottom, 0px)')
      }

      root.style.setProperty('--app-h', `${Math.round(h)}px`)
      root.style.setProperty('--app-t', `${Math.round(top)}px`)
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
