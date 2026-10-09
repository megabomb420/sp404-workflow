import { useC } from '@/i18n/companion'
import { useStore } from '../../state/store'
import type { Firmware } from '../../state/model'
import cx from '../../utils/cx'

export function FirmwareSwitch() {
  const c = useC()
  const { state, dispatch } = useStore()
  return <div className="firmware-switch" role="group" aria-label={c("wybierz firmware")}>
    {(['roland', 'doom'] as Firmware[]).map((firmware) => <button key={firmware} type="button" className={cx('chip u-mono', state.settings.firmware === firmware && 'is-active')} aria-pressed={state.settings.firmware === firmware} onClick={() => dispatch({ type: 'SET_FIRMWARE', value: firmware })}>{firmware === 'doom' ? 'DOOM OS' : 'ROLAND'}</button>)}
  </div>
}

export function FirmwareNotice({ firmware }: { firmware: Firmware }) {
  const c = useC()
  const { state, dispatch } = useStore()
  if (state.settings.firmware === firmware) return null
  return <aside className="firmware-notice panel-surface">
    <p>{c("Ta instrukcja dotyczy")} {firmware === 'doom' ? 'DOOM OS' : c("systemu Roland")}{c(". Wybrany filtr:")} {state.settings.firmware === 'doom' ? 'DOOM OS' : 'Roland'}.</p>
    <button type="button" className="chip" onClick={() => dispatch({ type: 'SET_FIRMWARE', value: firmware })}>{c("WYBIERZ")} {firmware === 'doom' ? 'DOOM OS' : 'ROLAND'}</button>
  </aside>
}
