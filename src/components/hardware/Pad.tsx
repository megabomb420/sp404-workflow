import React from 'react'
import cx from '../../utils/cx'
import { buzz } from '../../utils/haptics'
import { StatusLED } from './StatusLED'

export type PadTone = 'default' | 'accent' | 'danger'

interface PadProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** numer pada 1–16 */
  pad: number
  label: string
  sublabel?: string
  tone?: PadTone
  active?: boolean
  ledOn?: boolean
  onClick?: () => void
}

/** Pad 4×4 — główny skrót nawigacji. Liczba + nazwa + LED w rogu. */
export function Pad({ pad, label, sublabel, tone = 'default', active, ledOn, onClick, className, ...rest }: PadProps) {
  const handle = () => {
    buzz()
    onClick?.()
  }
  return (
    <button
      type="button"
      className={cx('pad', `pad--${tone}`, active && 'is-active', className)}
      onClick={handle}
      aria-label={`${pad}. ${label}${sublabel ? ' — ' + sublabel : ''}`}
      {...rest}
    >
      <span className="pad__num u-mono">{pad}</span>
      <span className="pad__label u-label">{label}</span>
      {sublabel ? <span className="pad__sub">{sublabel}</span> : null}
      <StatusLED on={ledOn ?? active} className="pad__led" />
    </button>
  )
}
