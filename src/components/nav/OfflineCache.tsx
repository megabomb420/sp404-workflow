import { useEffect, useState } from 'react'
import { publicUrl } from '@/lib/publicUrl'
import { useLocale } from '@/i18n/locale'

export function OfflineCache() {
  const { locale } = useLocale()
  const [updated, setUpdated] = useState(false)
  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return
    const hadController = !!navigator.serviceWorker.controller
    const changed = () => { if (hadController) setUpdated(true) }
    navigator.serviceWorker.addEventListener('controllerchange', changed)
    void navigator.serviceWorker.register(publicUrl('sw.js'), { scope: publicUrl('') }).catch(() => {})
    return () => navigator.serviceWorker.removeEventListener('controllerchange', changed)
  }, [])
  return updated ? <button className="offline-update" type="button" onClick={() => location.reload()}>{locale === 'en' ? 'New version ready · refresh' : 'Nowa wersja gotowa · odśwież'}</button> : null
}
