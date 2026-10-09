import { useC } from '@/i18n/companion'
import { useEffect } from 'react'
import { Link, useSearchParams } from '@/lib/rr'
import { screenGuides as guides } from '../data/screens'
import { useLocale } from '@/i18n/locale'
import { localizeCompanion } from '@/i18n/companion'
import { localizeShortcut } from '@/i18n/content'
import { shortcutsById } from '../data/shortcuts'
import { ShortcutCard } from '../components/content/ShortcutCard'
import { SourceTag } from '../components/content/SourceTag'
import { useStore } from '../state/store'
import { useDisplay } from '../state/display'
import cx from '../utils/cx'
import { FirmwareNotice } from '@/components/content/FirmwareSwitch'

export function ScreenPage() {
  const c = useC()
  const { locale } = useLocale()
  const screenGuides = localizeCompanion(guides, locale)
  const { state } = useStore()
  const { setDisplay } = useDisplay()
  const [params, setParams] = useSearchParams()
  const screens = screenGuides.filter((screen) => screen.firmware === state.settings.firmware)
  const selected = screenGuides.find((screen) => screen.id === params.get('id')) ?? screens[0]
  useEffect(() => { setDisplay({ title: c("JESTEM NA EKRANIE"), sub: selected.title, right: state.settings.firmware === 'doom' ? 'DOOM' : 'ROLAND' }) }, [setDisplay, selected.title, state.settings.firmware, c])
  return <div className="page screen-page">
    <FirmwareNotice firmware={selected.firmware} />
    <h1 className="page__title u-label">{c("CO WIDZISZ NA SP?")}</h1>
    <p className="page__lede">{c("Wybierz ekran urządzenia. Poniżej zobaczysz pasujące pokrętła i czynności.")}</p>
    <div className="screen-picker" role="group" aria-label={c("ekran urządzenia")}>{screens.map((screen) => <button type="button" key={screen.id} className={cx('chip', selected.id === screen.id && 'is-active')} aria-pressed={selected.id === screen.id} onClick={() => setParams({ id: screen.id })}>{screen.title}</button>)}</div>
    <section className="screen-guide panel-surface">
      <h2 className="u-label">{selected.title}</h2><p>{selected.description}</p>
      {selected.knobs.length > 0 && <dl className="knob-map">{selected.knobs.map((knob, i) => <div key={i}><dt className="u-mono">CTRL {i + 1}</dt><dd>{knob}</dd></div>)}</dl>}
      <SourceTag source={selected.source} kind="verified" />
      {selected.route && <Link className="chip" to={selected.route}>{selected.routeLabel} →</Link>}
    </section>
    <div className="scardlist">{selected.controls.map((id) => shortcutsById[id]).filter(Boolean).map((shortcut) => <ShortcutCard key={shortcut.id} shortcut={localizeShortcut(shortcut, locale)} />)}</div>
  </div>
}
