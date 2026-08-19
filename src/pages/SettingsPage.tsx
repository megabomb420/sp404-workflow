import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HardwareButton } from '../components/hardware/HardwareButton'
import { MANUAL_VERSION } from '../data/types'
import { useDisplay } from '../state/display'
import { useStore } from '../state/store'
import { buzz } from '../utils/haptics'
import { usePWAInstall } from '../utils/pwaInstall'
import cx from '../utils/cx'

function Toggle({
  label,
  sub,
  checked,
  onChange,
}: {
  label: string
  sub?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="toggle">
      <span className="toggle__text">
        <span className="toggle__label u-label">{label}</span>
        {sub ? <span className="toggle__sub">{sub}</span> : null}
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__thumb" />
      </span>
    </label>
  )
}

export function SettingsPage() {
  const { setDisplay } = useDisplay()
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const { canInstall, install, installed } = usePWAInstall()
  const [confirmReset, setConfirmReset] = useState<null | 'progress' | 'favs' | 'all'>(null)

  useEffect(() => {
    setDisplay({ title: 'SETTINGS', sub: 'ustawienia', right: '' })
  }, [setDisplay])

  const setSetting = (key: keyof typeof state.settings, value: boolean) => {
    buzz(8)
    dispatch({ type: 'SET_SETTING', key, value })
  }

  const doReset = (kind: 'progress' | 'favs' | 'all') => {
    buzz()
    if (kind === 'progress') dispatch({ type: 'RESET_PROGRESS' })
    if (kind === 'favs') dispatch({ type: 'RESET_FAVORITES' })
    if (kind === 'all') dispatch({ type: 'RESET_ALL' })
    setConfirmReset(null)
  }

  return (
    <div className="page">
      <h1 className="page__title u-label">SETTINGS</h1>

      <section className="setgroup panel-surface">
        <h2 className="setgroup__title u-label">INTERFEJS</h2>
        <Toggle
          label="HAPTYKA"
          sub="Delikatna wibracja przy padach (jeśli telefon wspiera)"
          checked={state.settings.haptics}
          onChange={(v) => setSetting('haptics', v)}
        />
        <Toggle
          label="REDUCED MOTION"
          sub="Ograniczenie animacji"
          checked={state.settings.reducedMotion}
          onChange={(v) => setSetting('reducedMotion', v)}
        />
        <Toggle
          label="DŹWIĘKI UI"
          sub="Domyślnie WYŁĄCZONE — aplikacja nie beepuje przy sprzęcie"
          checked={state.settings.uiSound}
          onChange={(v) => setSetting('uiSound', v)}
        />
      </section>

      <section className="setgroup panel-surface">
        <h2 className="setgroup__title u-label">DANE</h2>
        {confirmReset === 'progress' ? (
          <div className="setgroup__confirm">
            <p>Wyczyścić postęp tutoriali?</p>
            <HardwareButton label="TAK, WYCZYŚĆ" tone="danger" onClick={() => doReset('progress')} />
            <HardwareButton label="ANULUJ" onClick={() => setConfirmReset(null)} />
          </div>
        ) : (
          <button
            type="button"
            className={cx('setrow')}
            onClick={() => setConfirmReset('progress')}
          >
            <span className="toggle__label u-label">RESET PROGRESS</span>
            <span className="toggle__sub">Ukończone workflow i kroki</span>
          </button>
        )}

        {confirmReset === 'favs' ? (
          <div className="setgroup__confirm">
            <p>Wyczyścić ulubione?</p>
            <HardwareButton label="TAK, WYCZYŚĆ" tone="danger" onClick={() => doReset('favs')} />
            <HardwareButton label="ANULUJ" onClick={() => setConfirmReset(null)} />
          </div>
        ) : (
          <button type="button" className="setrow" onClick={() => setConfirmReset('favs')}>
            <span className="toggle__label u-label">RESET FAVORITES</span>
            <span className="toggle__sub">Wszystkie gwiazdki w MY KIT</span>
          </button>
        )}

        <button
          type="button"
          className="setrow"
          onClick={() => {
            dispatch({ type: 'SET_ONBOARDED', value: false })
            navigate('/onboarding')
          }}
        >
          <span className="toggle__label u-label">REPLAY ONBOARDING</span>
          <span className="toggle__sub">Pokaż wprowadzenie od nowa</span>
        </button>
      </section>

      <section className="setgroup panel-surface">
        <h2 className="setgroup__title u-label">INSTALACJA</h2>
        {canInstall ? (
          <div className="setgroup__confirm">
            <p>Dodaj SP WORKFLOW do ekranu głównego i korzystaj offline jak z aplikacji.</p>
            <HardwareButton label="ZAINSTALUJ APLIKACJĘ" tone="accent" onClick={install} />
          </div>
        ) : installed ? (
          <div className="setrow">
            <span className="toggle__label u-label">ZAINSTALOWANO ✓</span>
            <span className="toggle__sub">Aplikacja działa z ekranu głównego, offline.</span>
          </div>
        ) : (
          <div className="setrow">
            <span className="toggle__label u-label">INSTALACJA</span>
            <span className="toggle__sub">W przeglądarce: menu → „Dodaj do ekranu głównego" / „Zainstaluj aplikację".</span>
          </div>
        )}
      </section>

      <section className="setgroup panel-surface">
        <h2 className="setgroup__title u-label">O APLIKACJI</h2>
        <div className="setrow">
          <span className="toggle__label u-label">FIRMWARE</span>
          <span className="toggle__sub u-mono">Roland Reference Manual v{MANUAL_VERSION}</span>
        </div>
        <Link to="/sources" className="setrow">
          <span className="toggle__label u-label">SOURCES & VERSION</span>
          <span className="toggle__sub">Skąd pochodzą fakty i jak są weryfikowane</span>
        </Link>
      </section>
    </div>
  )
}
