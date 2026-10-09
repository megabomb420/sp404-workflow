import { useC } from '@/i18n/companion'
import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from '@/lib/rr'
import { DOOM, doomSource, doomShortcuts as controls, doomTopics as topics, doomWorkflows as workflows } from '../data/doom'
import { useLocale } from '@/i18n/locale'
import { localizeCompanion } from '@/i18n/companion'
import { localizeShortcut, localizeWorkflow } from '@/i18n/content'
import { ShortcutCard } from '../components/content/ShortcutCard'
import { ButtonSequence } from '../components/content/ButtonSequence'
import { SourceTag } from '../components/content/SourceTag'
import { useDisplay } from '../state/display'
import { useStore } from '../state/store'
import { normalizeSearch } from '../utils/search'
import cx from '../utils/cx'

export function DoomPage() {
  const c = useC()
  const { locale } = useLocale()
  const doomShortcuts = useMemo(() => controls.map(item => ({ ...item, ...localizeShortcut(item, locale) })), [locale])
  const doomTopics = useMemo(() => localizeCompanion(topics, locale), [locale])
  const doomWorkflows = useMemo(() => workflows.map(item => localizeWorkflow(item, locale)), [locale])
  const { setDisplay } = useDisplay()
  const { state } = useStore()
  const [params, setParams] = useSearchParams()
  const selected = doomShortcuts.find((item) => item.id === params.get('id'))
  const view = selected ? 'controls' : ['controls', 'install'].includes(params.get('view') ?? '') ? params.get('view')! : 'start'
  const topic = doomTopics.find((item) => item.id === params.get('topic'))
  const query = params.get('q') ?? ''
  const favorites = params.get('fav') === '1'
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('id')
    setParams(next, { replace: key === 'q' })
  }
  const changeView = (next: string) => setParams(next === 'start' ? {} : { view: next })
  const list = useMemo(() => doomShortcuts.filter((item) => {
    if (selected) return item.id === selected.id
    if (topic && item.topic !== topic.id) return false
    if (favorites && !state.favorites.shortcuts.includes(item.id)) return false
    const words = normalizeSearch(query).split(' ').filter(Boolean)
    const text = normalizeSearch([item.name, item.description, ...item.buttons, ...(item.path ?? []), ...item.tags].join(' '))
    return words.every((word) => text.includes(word))
  }), [selected, topic, favorites, query, state.favorites.shortcuts, doomShortcuts])

  useEffect(() => {
    setDisplay({ title: 'DOOM OS', sub: view === 'controls' ? c("sterowanie · osobny firmware") : view === 'install' ? c("wersja i instalacja") : 'pattern · mixer · automation', right: view === 'controls' ? String(list.length) : 'ALPHA' })
  }, [setDisplay, view, list.length, c])

  return (
    <div className="page doom-page">
      <header className="doom-head panel-surface">
        <span className="doom-head__eyebrow u-mono">CUSTOM FIRMWARE · SP-404MKII</span>
        <h1 className="page__title u-label">DOOM OS</h1>
        <p>{c("Pattern jako siatka. Mikser pod ręką. Ruchy FX zapisane w beacie.")}</p>
        <span className="doom-head__version u-mono">{DOOM.version} / ROLAND {DOOM.firmware}</span>
      </header>

      <nav className="doom-tabs" aria-label={c("przewodnik DOOM OS")}>
        {[['start', c("ZACZNIJ")], ['controls', c("STEROWANIE")], ['install', c("WERSJA / INSTALACJA")]].map(([id, label]) => (
          <button type="button" key={id} className={cx('chip u-label', view === id && 'is-active')} aria-pressed={view === id} onClick={() => changeView(id)}>{label}</button>
        ))}
      </nav>

      {view === 'start' && <>
        <section className="doom-open panel-surface" aria-labelledby="doom-open-title">
          <h2 id="doom-open-title" className="u-label">{c("WEJDŹ DO DOOM OS")}</h2>
          <ButtonSequence buttons={['REMAIN', 'SUB PAD']} note={c("Trzymaj REMAIN, naciśnij SUB PAD. EXIT z głównej siatki zamyka edytor i zapisuje zmiany.")} />
          <p>{c("Instrukcje poniżej dotyczą zainstalowanego DOOM OS. Pozostałe funkcje SP opisuje dotychczasowy przewodnik Roland.")}</p>
        </section>
        <section className="wfgroup" aria-labelledby="doom-workflows-title">
          <h2 id="doom-workflows-title" className="wfgroup__cat u-mono">{c("ZRÓB TO NA SP")}</h2>
          <ul className="wfgroup__list">
            {doomWorkflows.map((workflow) => <li key={workflow.id}>
              <Link to={`/workflow/${workflow.id}`} className="wfcard panel-surface">
                <span className="wfcard__head"><span className="wfcard__title u-label">{workflow.title.replace('DOOM OS · ', '')}</span>{state.progress.completedWorkflows.includes(workflow.id) && <span className="wfcard__done u-mono">✓</span>}</span>
                <p className="wfcard__blurb">{workflow.blurb}</p>
                <span className="wfcard__meta u-mono">{workflow.steps.length}  {c("KROKÓW ·")} {workflow.minutes} MIN</span>
              </Link>
            </li>)}
          </ul>
        </section>
        <section className="doom-knobs panel-surface" aria-labelledby="doom-knobs-title">
          <h2 id="doom-knobs-title" className="u-label">{c("TE SAME GAŁKI, INNY KONTEKST")}</h2>
          <dl>
            <div><dt className="u-mono">{c("SIATKA")}</dt><dd>{c("CTRL 1 velocity · CTRL 2 długość · CTRL 3 nudge. Trzymaj pad kroku, aby zmienić jedną nutę. Bez pada wszystkie nuty ścieżki dostają tę samą wartość.")}</dd></div>
            <div><dt className="u-mono">{c("MIKSER")}</dt><dd>{c("CTRL 1 panorama · CTRL 2 bus B1 / B2 / DRY · CTRL 3 poziom.")}</dd></div>
            <div><dt className="u-mono">{c("STRONA FX")}</dt><dd>{c("CTRL 1–3 zmieniają parametry otwartego efektu. Tu możesz nagrać ruchy pokręteł.")}</dd></div>
          </dl>
          <Link className="chip u-label" to="/doom-os?view=controls">{c("WSZYSTKIE")} {doomShortcuts.length}  {c("CZYNNOŚCI →")}</Link>
        </section>
        <section className="doom-help panel-surface">
          <h2 className="u-label">{c("NIE WIESZ, CO ROBI PRZYCISK?")}</h2>
          <p>{c("Trzymaj SHIFT przez 3 sekundy. W trybie pomocy dotknij przycisku lub pokrętła, aby zobaczyć opis dla aktualnego ekranu. EXIT kończy pomoc.")}</p>
          <Link to="/doom-os?id=doom-help" className="chip">{c("POMOC NA SPRZĘCIE →")}</Link>
        </section>
      </>}

      {view === 'controls' && <>
        <p className="page__lede">{c("Skróty obowiązują w DOOM OS i wskazanym widoku. ★ zapisuje czynność w MY KIT.")}</p>
        {selected ? <Link className="chip u-label" to={`/doom-os?view=controls&topic=${selected.topic}`}>{c("← WSZYSTKIE W TEJ KATEGORII")}</Link> : <>
          <label className="searchbox panel-surface">
            <input type="search" value={query} onChange={(event) => update('q', event.target.value)} placeholder={c("np. nudge, solo, SHIFT, automatyka")} aria-label={c("szukaj sterowania DOOM OS")} />
          </label>
          <div className="chipbar" role="toolbar" aria-label={c("kategorie DOOM OS")}>
            <button type="button" className={cx('chip', !topic && 'is-active')} aria-pressed={!topic} onClick={() => update('topic', '')}>ALL</button>
            {doomTopics.map((item) => <button type="button" key={item.id} className={cx('chip', topic?.id === item.id && 'is-active')} aria-pressed={topic?.id === item.id} onClick={() => update('topic', item.id)}>{item.label}</button>)}
            <button type="button" className={cx('chip', favorites && 'is-active')} aria-pressed={favorites} onClick={() => update('fav', favorites ? '' : '1')}>{c("★ ULUBIONE")}</button>
          </div>
        </>}
        <p className="doom-count u-mono" aria-live="polite">{list.length}  {c("CZYNNOŚCI")}{topic ? ` · ${topic.label}` : ''}</p>
        {doomTopics.filter((item) => list.some((shortcut) => shortcut.topic === item.id)).map((item) => <section className="wfgroup" key={item.id}>
          <h2 className="wfgroup__cat u-mono">{item.label}</h2>
          <p className="page__lede">{item.description}</p>
          <div className="scardlist">{list.filter((shortcut) => shortcut.topic === item.id).map((shortcut) => <ShortcutCard key={shortcut.id} shortcut={shortcut} />)}</div>
        </section>)}
        {!list.length && <p className="page__empty">{c("Brak pasujących czynności. Zmień kategorię, zapytanie lub filtr ulubionych.")}</p>}
      </>}

      {view === 'install' && <>
        <section className="sbody">
          <h2 className="sbody__h u-label">{c("WERSJE I ZAKRES")}</h2>
          <p>{c("Sprawdzono")} {DOOM.reviewed}{c(": wydanie")} <strong>{DOOM.version}, build {DOOM.build}</strong>  {c("bazuje na Roland")} <strong>{DOOM.firmware}</strong>{c(". Quickstart autora nadal ma oznaczenie")} <strong>{DOOM.manualVersion}</strong>.</p>
          <p>{c("Wersja 0.6.2 poprawia zawieszanie skrótu AUTO TRIG na MARK i dodaje wyświetlanie sum kontrolnych w patcherze. Opis sterowania w tej aplikacji oparto na Quickstart 0.6.1. Nie sprawdzono procedur na fizycznym SP.")}</p>
          <p>{c("Quickstart i changelog różnią się opisem kolejności trybów metronomu. Dlatego wybieraj tryb, sprawdzając nazwę na ekranie urządzenia.")}</p>
          <p>{c("Patterny 5/4, 6/4 i 7/4 są w DOOM OS tylko do podglądu pierwszych 16 kroków taktu. Metrum nowego patternu ustaw w stockowym RECORD SETTING przed nagrywaniem.")}</p>
          <p><a href={DOOM.changelogUrl} target="_blank" rel="noreferrer">{c("Changelog autora ↗")}</a></p>
        </section>
        <section className="doom-install panel-surface">
          <h2 className="u-label">{c("INSTALACJA WEDŁUG AUTORA")}</h2>
          <p>{c("DOOM OS to nieoficjalna modyfikacja firmware w fazie alpha. Autor zaleca kopię danych przed instalacją; modyfikacja może wpływać na gwarancję.")}</p>
          <ol className="doom-install__steps">
            <li>{c("Zrób backup danych SP. Pobierz oficjalny system Roland 5.52 i rozpakuj go.")}</li>
            <li>{c("W patcherze autora wybierz")} <span className="u-mono">SP404MKII_APP1.bin</span>{c(". Patcher sprawdza zgodność pliku i sumy kontrolne, a przetwarzanie odbywa się w przeglądarce. APP0 nie jest potrzebny do tej procedury.")}</li>
            <li>{c("Zapisz zmodyfikowany")} <span className="u-mono">SP404MKII_APP1.bin</span>  {c("w katalogu głównym karty SD.")}</li>
            <li>{c("Włóż kartę, trzymaj SHIFT podczas włączania SP. Po pojawieniu się menu aktualizacji naciśnij VALUE.")}</li>
            <li>{c("Po zakończeniu aktualizacji wyłącz i ponownie włącz urządzenie.")}</li>
          </ol>
          <p>{c("Powrót do oryginalnego systemu: użyj procedury aktualizacji z oryginalnym firmware Roland.")}</p>
          <div className="chipbar"><a className="chip" href={DOOM.patcherUrl} target="_blank" rel="noreferrer">{c("PATCHER AUTORA ↗")}</a><a className="chip" href="https://www.roland.com/global/support/by_product/sp-404mk2/updates_drivers/" target="_blank" rel="noreferrer">FIRMWARE ROLAND ↗</a></div>
          <p><a href={DOOM.siteUrl} target="_blank" rel="noreferrer">{c("Aktualna instrukcja instalacji autora ↗")}</a></p>
        </section>
      </>}

      <footer className="doom-sources">
        <SourceTag source={doomSource} kind="verified" />
        <p>{c("Polskie opracowanie do używania obok samplera. Treść działa offline po pełnym załadowaniu aplikacji; zewnętrzne źródła wymagają internetu.")}</p>
        <p><a href={DOOM.manualUrl} target="_blank" rel="noreferrer">{c("Pełny Quickstart autora ↗")}</a> · <Link to="/sources">{c("Źródła i weryfikacja →")}</Link></p>
      </footer>
    </div>
  )
}
