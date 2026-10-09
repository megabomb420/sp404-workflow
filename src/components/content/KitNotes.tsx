import { useStore } from '@/state/store'
import type { KitSet } from '@/state/model'
import { useLocale } from '@/i18n/locale'

export function KitNotes({ kit }: { kit: KitSet }) {
  const { dispatch, storageAvailable } = useStore()
  const { locale } = useLocale(), en = locale === 'en'
  const notes = kit.notes ?? { project: '', bankPad: '', bpm: '', text: '' }
  return <section className="kit-notes panel-surface" aria-label={en ? 'Session notes' : 'Notatki do sesji'}>
    <h2 className="u-label">{en ? 'SESSION NOTES' : 'NOTATKI DO SESJI'}</h2>
    <div className="kit-notes__fields">{([['project', en ? 'Project' : 'Projekt', 100], ['bankPad', en ? 'Bank / pad' : 'Bank / pad', 100], ['bpm', 'BPM', 20]] as const).map(([key, label, max]) => <label key={key}>{label}<input value={notes[key]} maxLength={max} onChange={event => dispatch({ type: 'SET_KIT_NOTES', id: kit.id, notes: { ...notes, [key]: event.target.value } })} /></label>)}</div>
    <label>{en ? 'Your notes' : 'Twoje uwagi'}<textarea maxLength={2000} rows={4} value={notes.text} placeholder={en ? 'Samples, FX settings, transitions…' : 'Sample, ustawienia FX, przejścia…'} onChange={event => dispatch({ type: 'SET_KIT_NOTES', id: kit.id, notes: { ...notes, text: event.target.value } })} /></label>
    <p className="u-mono" role="status">{en ? (storageAvailable ? 'Saved on this device · included in backups' : 'Session only · local storage unavailable') : (storageAvailable ? 'Zapisane na tym urządzeniu · zawarte w kopii zapasowej' : 'Tylko ta sesja · zapis lokalny niedostępny')}</p>
  </section>
}
