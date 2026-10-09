import { useC } from '@/i18n/companion'
import { useRef, useState } from 'react'
import { useStore } from '../../state/store'
import type { AppState } from '../../state/model'
import { exportBackup, importBackup } from '../../utils/backup'
import { useLocale } from '@/i18n/locale'

export function BackupPanel() {
  const c = useC()
  const { state, dispatch } = useStore()
  const { locale, setLocale } = useLocale()
  const input = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<{ state: AppState; createdAt: string; locale?: 'pl' | 'en' } | null>(null)
  const [message, setMessage] = useState('')
  const exportFile = () => {
    const url = URL.createObjectURL(new Blob([exportBackup(state, locale)], { type: 'application/json' }))
    const a = document.createElement('a'); a.href = url; a.download = `sp-workflow-${new Date().toISOString().slice(0, 10)}.json`
    document.body.append(a); a.click(); a.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMessage('Kopia została przygotowana do pobrania.')
  }
  return <section className="setgroup panel-surface backup-panel">
    <h2 className="setgroup__title u-label">{c("KOPIA ZAPASOWA")}</h2>
    <p>{c("Przenieś MY KIT, własne zestawy, postęp, trening, laboratorium groove’u i ustawienia na drugi telefon. Kopia jest plikiem zapisanym u Ciebie.")}</p>
    <div className="tool-actions"><button type="button" className="chip" onClick={exportFile}>{c("POBIERZ KOPIĘ")}</button><button type="button" className="chip" onClick={() => input.current?.click()}>{c("WCZYTAJ KOPIĘ")}</button></div>
    <input hidden ref={input} type="file" accept=".json,application/json" aria-label={c("plik kopii zapasowej")} onChange={async (event) => {
      const file = event.target.files?.[0]; event.target.value = ''; setPending(null); setMessage('')
      if (!file) return
      try { if (file.size > 2_000_000) throw new Error('Plik jest za duży. Maksymalny rozmiar kopii to 2 MB.'); setPending(importBackup(await file.text())) }
      catch (error) { setMessage(error instanceof Error ? error.message : 'Nie można odczytać kopii.') }
    }} />
    {pending && <div className="backup-preview">
      <strong>{c("Podgląd kopii")}</strong>
      <p>{pending.state.kits.length}  {c("zestawów ·")} {Object.values(pending.state.favorites).reduce((n, items) => n + items.length, 0)}  {c("ulubionych ·")} {pending.state.progress.completedWorkflows.length}  {c("ukończonych workflow.")}</p>
      <p>{c("Przywrócenie zastąpi obecne dane aplikacji na tym urządzeniu. Możesz najpierw pobrać aktualną kopię.")}</p>
      <div className="tool-actions"><button type="button" className="chip" onClick={() => { dispatch({ type: 'IMPORT_STATE', state: { ...pending.state, ui: { ...pending.state.ui, onboarded: true } } }); if (pending.locale) setLocale(pending.locale); setPending(null); setMessage('Kopia została przywrócona.') }}>{c("PRZYWRÓĆ DANE Z KOPII")}</button><button type="button" className="chip" onClick={() => setPending(null)}>{c("ANULUJ")}</button></div>
    </div>}
    {message && <p role="status">{c(message)}</p>}
  </section>
}
