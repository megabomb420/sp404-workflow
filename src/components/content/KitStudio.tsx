import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from '@/lib/rr'
import { useLocale } from '@/i18n/locale'
import { useStore } from '@/state/store'
import type { KitSet } from '@/state/model'
import { defaultStudio, moveSongPart, songRoles, type KitStudio as Studio, type SongPart } from '@/utils/kitStudio'

export function KitStudio({ kit }: { kit: KitSet }) {
  const { state, dispatch, storageAvailable } = useStore()
  const { locale } = useLocale(), en = locale === 'en'
  const [params] = useSearchParams()
  const tab = params.get('tab')
  const [songOpen, setSongOpen] = useState(tab === 'song')
  const [abOpen, setAbOpen] = useState(tab === 'ab')
  const songRef = useRef<HTMLDetailsElement>(null), abRef = useRef<HTMLDetailsElement>(null)
  const nextRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (tab !== 'song' && tab !== 'ab' && tab !== 'next') return
    if (tab === 'song') setSongOpen(true); else if (tab === 'ab') setAbOpen(true)
    const frame = requestAnimationFrame(() => (tab === 'next' ? nextRef : tab === 'song' ? songRef : abRef).current?.scrollIntoView({ block: 'start', behavior: 'instant' }))
    return () => cancelAnimationFrame(frame)
  }, [tab])
  const jump = (target: 'song' | 'ab') => {
    if (target === 'song') setSongOpen(true); else setAbOpen(true)
    requestAnimationFrame(() => (target === 'song' ? songRef : abRef).current?.scrollIntoView({ block: 'start', behavior: 'instant' }))
  }
  const [removed, setRemoved] = useState<{ part: SongPart; index: number } | null>(null)
  const studio = kit.studio ?? defaultStudio(state.settings.firmware)
  const patch = (patch: Partial<Studio>) => dispatch({ type: 'PATCH_KIT_STUDIO', id: kit.id, patch })
  const roles = en ? ['Intro', 'Main motif', 'Break', 'Return', 'Ending', 'Own section'] : ['Intro', 'Główny motyw', 'Przerwa', 'Powrót', 'Zakończenie', 'Własny fragment']
  const roleName = (role: SongPart['role']) => roles[songRoles.indexOf(role)]
  const updatePart = (id: string, changes: Partial<SongPart>) => patch({ song: studio.song.map(part => part.id === id ? { ...part, ...changes } : part) })
  const newPart = (role: SongPart['role']): SongPart => ({ id: crypto.randomUUID(), role, pattern: '', bars: 4, note: '' })
  return <section className="kit-studio" aria-label={en ? 'Develop this sketch' : 'Rozwijaj ten szkic'}>
    <div ref={nextRef} className="sketch-next panel-surface">
      <div className="studio-heading"><h2 className="u-label">{en ? 'NEXT STEP' : 'NASTĘPNY KROK'}</h2><span className="u-mono">{studio.firmware === 'doom' ? 'DOOM OS' : 'ROLAND'}</span></div>
      <label>{en ? 'What will you do next?' : 'Co zrobisz przy następnej sesji?'}<textarea maxLength={1000} rows={2} value={studio.nextStep} placeholder={en ? 'Make a transition before the drums return…' : 'Zrób przejście przed powrotem perkusji…'} onChange={e => patch({ nextStep: e.target.value })} /></label>
      <div className="tool-actions"><button className="chip" type="button" onClick={() => dispatch({ type: 'ACTIVATE_KIT', id: kit.id })}>{en ? 'PIN TO NOW' : 'POKAŻ NA NOW'}</button><button className="chip" type="button" onClick={() => patch({ finished: !studio.finished })}>{studio.finished ? (en ? 'REOPEN SKETCH' : 'ROZWIJAJ PONOWNIE') : (en ? 'MARK AS FINISHED' : 'OZNACZ GOTOWY')}</button></div>
      <p className="studio-status" role="status">{studio.finished ? (en ? 'Finished · kept in MY KIT' : 'Gotowy · zostaje w MY KIT') : state.ui.activeKitId === kit.id ? (en ? 'This sketch is on NOW' : 'Ten szkic jest na NOW') : (en ? 'Choose this sketch to resume it from NOW' : 'Wybierz ten szkic, żeby wracać do niego z NOW')}</p>
      <div className="tool-actions"><button className="chip" type="button" onClick={() => jump('song')}>SONG MAP ↓</button><button className="chip" type="button" onClick={() => jump('ab')}>A / B ↓</button></div>
    </div>

    <details ref={songRef} className="studio-panel panel-surface song-map" open={songOpen} onToggle={e => setSongOpen(e.currentTarget.open)}>
      <summary><span className="u-label">SONG MAP</span><span>{en ? 'From loop to song' : 'Od pętli do utworu'} · {studio.song.length}/8</span></summary>
      <div className="studio-body">
        <p className="studio-help">{en ? 'Plan the order, then build it on your SP. Each block points to your pattern or variation; the map does not control playback.' : 'Zaplanuj kolejność, potem ułóż ją na SP. Każdy blok wskazuje Twój pattern lub wariację; mapa służy do planowania.'}</p>
        {!studio.song.length ? <button type="button" className="chip" onClick={() => patch({ song: ['intro', 'main', 'break', 'return', 'outro'].map(role => newPart(role as SongPart['role'])) })}>{en ? 'START WITH FIVE SECTIONS' : 'ZACZNIJ OD PIĘCIU FRAGMENTÓW'}</button> : <>
          <div className="song-strip" aria-label={en ? 'Arrangement overview' : 'Podgląd aranżacji'}>{studio.song.map((part, index) => <button type="button" key={part.id} onClick={() => document.getElementById(`song-${part.id}`)?.scrollIntoView({ block: 'center', behavior: 'instant' })}><span className="u-mono">{index + 1} · {part.bars} {en ? 'bars' : 'taktów'}</span><strong>{roleName(part.role)}</strong><small>{part.pattern || '—'}</small></button>)}</div>
          <p className="studio-help u-mono">{studio.song.reduce((sum, part) => sum + part.bars, 0)} {en ? 'bars in the plan' : 'taktów w planie'}</p>
        </>}
        <ol className="song-parts">{studio.song.map((part, index) => <li className="song-part" id={`song-${part.id}`} key={part.id}>
          <div className="studio-heading"><h3 className="u-label">{index + 1}. {roleName(part.role)}</h3><div className="song-order"><button className="chip" type="button" aria-label={`${en ? 'Move up' : 'Przesuń w górę'} ${index + 1}`} disabled={index === 0} onClick={() => patch({ song: moveSongPart(studio.song, index, -1) })}>↑</button><button className="chip" type="button" aria-label={`${en ? 'Move down' : 'Przesuń w dół'} ${index + 1}`} disabled={index === studio.song.length - 1} onClick={() => patch({ song: moveSongPart(studio.song, index, 1) })}>↓</button></div></div>
          <div className="song-fields"><label>{en ? 'Section' : 'Fragment'} {index + 1}<select value={part.role} onChange={e => updatePart(part.id, { role: e.target.value as SongPart['role'] })}>{songRoles.map(role => <option key={role} value={role}>{roleName(role)}</option>)}</select></label><label>{en ? 'Bars' : 'Takty'} {index + 1}<select value={part.bars} onChange={e => updatePart(part.id, { bars: Number(e.target.value) })}>{[1, 2, 4, 8, 16, 32].map(bars => <option key={bars}>{bars}</option>)}</select></label></div>
          <label>{en ? 'Pattern / variation' : 'Pattern / wariacja'} {index + 1}<input value={part.pattern} maxLength={100} placeholder={en ? 'Your SP location, e.g. A1' : 'Lokalizacja na SP, np. A1'} onChange={e => updatePart(part.id, { pattern: e.target.value })} /></label>
          <label>{en ? 'What changes?' : 'Co się zmienia?'} {index + 1}<textarea rows={2} maxLength={300} value={part.note} onChange={e => updatePart(part.id, { note: e.target.value })} /></label>
          <button className="wf-text-action" type="button" onClick={() => { setRemoved({ part, index }); patch({ song: studio.song.filter(p => p.id !== part.id) }) }}>{en ? 'Remove section' : 'Usuń fragment'} {index + 1}</button>
        </li>)}</ol>
        <div className="tool-actions"><button className="chip" type="button" disabled={studio.song.length >= 8} onClick={() => patch({ song: [...studio.song, newPart('custom')] })}>{en ? 'ADD SECTION' : 'DODAJ FRAGMENT'}</button>{removed && <button className="chip" type="button" disabled={studio.song.length >= 8} onClick={() => { const song = [...studio.song]; song.splice(Math.min(removed.index, song.length), 0, removed.part); patch({ song }); setRemoved(null) }}>{en ? 'UNDO REMOVAL' : 'COFNIJ USUNIĘCIE'}</button>}</div>
        <Link className="wf-text-action" to="/beat-block">{en ? 'Need an arrangement idea? BEAT BLOCK →' : 'Potrzebujesz pomysłu na aranżację? BEAT BLOCK →'}</Link>
      </div>
    </details>

    <details ref={abRef} className="studio-panel panel-surface kit-ab" open={abOpen} onToggle={e => setAbOpen(e.currentTarget.open)}>
      <summary><span className="u-label">A / B</span><span>{en ? 'Compare two versions' : 'Porównaj dwie wersje'}{studio.winner ? ` · ${studio.winner.toUpperCase()} ✓` : ''}</span></summary>
      <div className="studio-body">
        <p className="studio-help">{en ? 'Play both versions on your SP. Keep one change between them and note what works better.' : 'Odsłuchaj obie wersje na SP. Zmień między nimi jedną rzecz i zapisz, co działa lepiej.'}</p>
        <div className="variant-grid">{(['a', 'b'] as const).map(key => <fieldset key={key} className={studio.winner === key ? 'variant is-chosen' : 'variant'}><legend className="u-label">{en ? 'VERSION' : 'WERSJA'} {key.toUpperCase()}</legend><label>{en ? 'Location on SP' : 'Lokalizacja na SP'} {key.toUpperCase()}<input maxLength={100} value={studio.variants[key].location} onChange={e => patch({ variants: { ...studio.variants, [key]: { ...studio.variants[key], location: e.target.value } } })} /></label><label>{en ? 'Changes / sound' : 'Zmiany / brzmienie'} {key.toUpperCase()}<textarea rows={3} maxLength={600} value={studio.variants[key].changes} onChange={e => patch({ variants: { ...studio.variants, [key]: { ...studio.variants[key], changes: e.target.value } } })} /></label><button className="chip" type="button" aria-pressed={studio.winner === key} onClick={() => patch({ winner: studio.winner === key ? null : key })}>{en ? 'CHOOSE' : 'WYBIERAM'} {key.toUpperCase()}{studio.winner === key ? ' ✓' : ''}</button></fieldset>)}</div>
        <label>{en ? 'Why this version?' : 'Dlaczego ta wersja?'}<textarea rows={2} maxLength={600} value={studio.decision} onChange={e => patch({ decision: e.target.value })} /></label>
      </div>
    </details>
    <p className="studio-status u-mono" role="status">{storageAvailable ? (en ? 'Saved on this device · included in backups · available offline' : 'Zapisane na tym urządzeniu · w kopii zapasowej · dostępne offline') : (en ? 'Session only · local storage unavailable' : 'Tylko ta sesja · zapis lokalny niedostępny')}</p>
  </section>
}
