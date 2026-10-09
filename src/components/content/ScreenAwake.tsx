import { useEffect, useState } from 'react'
import { useStore } from '../../state/store'
import { useC } from '@/i18n/companion'

export function ScreenAwake() {
  const c = useC()
  const { state } = useStore()
  const [status, setStatus] = useState('')
  useEffect(() => {
    if (!state.settings.keepScreenAwake) { setStatus(''); return }
    if (!('wakeLock' in navigator)) { setStatus('Ta przeglądarka nie obsługuje utrzymania włączonego ekranu.'); return }
    let cancelled = false, pending = false
    let lock: WakeLockSentinel | null = null
    const acquire = async () => {
      if (cancelled || pending || document.visibilityState !== 'visible' || (lock && !lock.released)) return
      pending = true
      try {
        const acquired = await navigator.wakeLock.request('screen')
        if (cancelled) { await acquired.release(); return }
        lock = acquired; setStatus('Ekran pozostaje włączony')
        acquired.addEventListener('release', () => { if (!cancelled) setStatus('Utrzymanie ekranu zostało zwolnione przez urządzenie.') })
      } catch { if (!cancelled) setStatus('Urządzenie nie pozwoliło utrzymać włączonego ekranu.') }
      finally { pending = false }
    }
    void acquire(); document.addEventListener('visibilitychange', acquire)
    return () => { cancelled = true; document.removeEventListener('visibilitychange', acquire); if (lock && !lock.released) void lock.release().catch(() => {}) }
  }, [state.settings.keepScreenAwake])
  return status ? <p className="awake-status u-mono" role="status">{c(status)}</p> : null
}
