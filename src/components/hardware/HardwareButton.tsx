import React from 'react'
import cx from '../../utils/cx'
import { buzz } from '../../utils/haptics'
import { StatusLED } from './StatusLED'

export type KeyTone = 'default' | 'accent' | 'danger' | 'mod' | 'path'

interface HardwareButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  sublabel?: string
  tone?: KeyTone
  active?: boolean
  led?: boolean
  wide?: boolean
}

/** Sprzętowy klawisz: płaski face, 1–2px travel, LED w rogu, subtelny cień. */
export function HardwareButton({
  label,
  sublabel,
  tone = 'default',
  active,
  led,
  wide,
  className,
  onClick,
  children,
  ...rest
}: HardwareButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    buzz()
    onClick?.(e)
  }
  return (
    <button
      type="button"
      className={cx(
        'hwbtn',
        `hwbtn--${tone}`,
        active && 'is-active',
        wide && 'hwbtn--wide',
        className,
      )}
      onClick={handleClick}
      aria-pressed={active}
      {...rest}
    >
      <span className="hwbtn__face">
        <span className="hwbtn__label u-label">{label}</span>
        {sublabel ? <span className="hwbtn__sub">{sublabel}</span> : null}
        {children}
      </span>
      {led ? <StatusLED on={active} className="hwbtn__led" /> : null}
    </button>
  )
}
