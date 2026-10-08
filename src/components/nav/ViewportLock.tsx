import { useLayoutEffect } from 'react'

/**
 * Fit the app column to the visible frame without touching the device's
 * safe-area insets.
 *
 * The bottom inset is CSS, never JS: `--safe-b` is the device's own
 * `env(safe-area-inset-bottom)` (tokens.css) and the installed-iOS floor for the
 * gesture indicator lives in `dock-fit.css`. Reserving an inset here *and*
 * sizing the shell to the reduced visual viewport was what opened the ~34–50px
 * hole under NOW/SZUKAJ on an iPhone 17 Pro.
 *
 * So this only grows: a transient visual viewport taller than the document
 * (pinch-out in an installed app) is followed while it lasts, and `--app-h` is
 * dropped again for the stylesheet's `--app-h: 100dvh` when it returns to rest.
 * Frozen at the pinch height it clips the dock labels; sized to a short viewport
 * it strands the column above the screen bottom.
 *
 * `--app-t` follows the visual viewport's offset, so a keyboard or a scrolled
 * visual viewport does not leave the fixed column behind.
 */
export function ViewportLock() {
  useLayoutEffect(() => {
    const root = document.documentElement

    const sync = () => {
      const vv = window.visualViewport
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
      const visible = Math.max(window.innerHeight, vv?.height ?? 0)

      if (standalone && visible > root.clientHeight + 1) {
        root.style.setProperty('--app-h', `${Math.round(visible)}px`)
      } else {
        root.style.removeProperty('--app-h')
      }
      root.style.setProperty('--app-t', `${Math.round(vv?.offsetTop ?? 0)}px`)
    }

    sync()
    window.visualViewport?.addEventListener('resize', sync)
    window.visualViewport?.addEventListener('scroll', sync)
    window.addEventListener('resize', sync)
    window.addEventListener('orientationchange', sync)
    return () => {
      root.style.removeProperty('--app-h')
      root.style.removeProperty('--app-t')
      window.visualViewport?.removeEventListener('resize', sync)
      window.visualViewport?.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
      window.removeEventListener('orientationchange', sync)
    }
  }, [])
  return null
}
