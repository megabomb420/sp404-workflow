import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@/lib/rr'
import { HardwareButton } from '@/components/hardware/HardwareButton'
import { LangSwitch } from '@/components/nav/LangSwitch'
import { MANUAL_VERSION } from '@/data/types'
import { APP_REV, APP_REV_DATE } from '@/lib/appRev'
import { useT } from '@/i18n/useT'
import { useDisplay } from '@/state/display'
import { useStore } from '@/state/store'
import { buzz } from '@/utils/haptics'
import { usePWAInstall } from '@/utils/pwaInstall'
import cx from '@/utils/cx'

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
  const t = useT()

  useEffect(() => {
    setDisplay({ title: 'SETTINGS', sub: t.settings.lcdSub, right: '' })
  }, [setDisplay, t])

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
      <section className="setgroup panel-surface">
        <h2 className="setgroup__title u-label">{t.settings.ui}</h2>
        <Toggle label={t.settings.haptics} sub={t.settings.hapticsSub} checked={state.settings.haptics} onChange={(v) => setSetting('haptics', v)} />
        <Toggle label={t.settings.motion} sub={t.settings.motionSub} checked={state.settings.reducedMotion} onChange={(v) => setSetting('reducedMotion', v)} />
        <div className="setrow">
          <span>
            <span className="toggle__label u-label">{t.settings.language}</span>
            <span className="toggle__sub">{t.settings.languageSub}</span>
          </span>
          <LangSwitch />
        </div>
      </section>

      <section className="setgroup panel-surface">
        <h2 className="setgroup__title u-label">{t.settings.data}</h2>
        {confirmReset === 'progress' ? (
          <div className="setgroup__confirm">
            <p>{t.settings.resetProgressQ}</p>
            <HardwareButton label={t.settings.yesClear} tone="danger" onClick={() => doReset('progress')} />
            <HardwareButton label={t.settings.cancel} onClick={() => setConfirmReset(null)} />
          </div>
        ) : (
          <button type="button" className={cx('setrow')} onClick={() => setConfirmReset('progress')}>
            <span className="toggle__label u-label">{t.settings.resetProgress}</span>
            <span className="toggle__sub">{t.settings.resetProgressSub}</span>
          </button>
        )}

        {confirmReset === 'favs' ? (
          <div className="setgroup__confirm">
            <p>{t.settings.resetFavsQ}</p>
            <HardwareButton label={t.settings.yesClear} tone="danger" onClick={() => doReset('favs')} />
            <HardwareButton label={t.settings.cancel} onClick={() => setConfirmReset(null)} />
          </div>
        ) : (
          <button type="button" className="setrow" onClick={() => setConfirmReset('favs')}>
            <span className="toggle__label u-label">{t.settings.resetFavs}</span>
            <span className="toggle__sub">{t.settings.resetFavsSub}</span>
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
          <span className="toggle__label u-label">{t.settings.replay}</span>
          <span className="toggle__sub">{t.settings.replaySub}</span>
        </button>
      </section>

      <section className="setgroup panel-surface">
        <h2 className="setgroup__title u-label">{t.settings.install}</h2>
        {canInstall ? (
          <div className="setgroup__confirm">
            <p>{t.settings.installP}</p>
            <HardwareButton label={t.settings.installBtn} tone="accent" onClick={install} />
          </div>
        ) : installed ? (
          <div className="setrow">
            <span className="toggle__label u-label">{t.settings.installed}</span>
            <span className="toggle__sub">{t.settings.installedSub}</span>
          </div>
        ) : (
          <div className="setrow">
            <span className="toggle__label u-label">{t.settings.install}</span>
            <span className="toggle__sub">{t.settings.installHint}</span>
          </div>
        )}
      </section>

      <section className="setgroup panel-surface">
        <h2 className="setgroup__title u-label">{t.settings.about}</h2>
        <div className="setrow">
          <span>
            <span className="toggle__label u-label">{t.settings.appRev}</span>
            <span className="toggle__sub">{t.settings.appRevHint}</span>
          </span>
          <span className="setrow__rev u-mono">{t.settings.appRevSub(APP_REV, APP_REV_DATE)}</span>
        </div>
        <div className="setrow">
          <span className="toggle__label u-label">{t.settings.firmware}</span>
          <span className="toggle__sub u-mono">{t.settings.firmwareSub(MANUAL_VERSION)}</span>
        </div>
        <Link to="/glossary" className="setrow">
          <span className="toggle__label u-label">{t.settings.glossary}</span>
          <span className="toggle__sub">{t.settings.glossarySub}</span>
        </Link>
        <Link to="/sources" className="setrow">
          <span className="toggle__label u-label">{t.settings.sources}</span>
          <span className="toggle__sub">{t.settings.sourcesSub}</span>
        </Link>
      </section>
    </div>
  )
}
