interface StatusLEDProps {
  on?: boolean
  tone?: 'green' | 'amber' | 'red'
  className?: string
  /** aria-hidden — dekoracja */
}

export function StatusLED({ on = false, tone = 'green', className }: StatusLEDProps) {
  return (
    <span
      className={`led led--${tone}${on ? ' led--on' : ''}${className ? ' ' + className : ''}`}
      aria-hidden="true"
    />
  )
}
