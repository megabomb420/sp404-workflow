import { Pad, PadTone } from './Pad'

export interface PadConfig {
  pad: number
  label: string
  sublabel?: string
  tone?: PadTone
  active?: boolean
  onClick?: () => void
}

/** Siatka 4×4 padów. */
export function PadGrid({ items, className }: { items: PadConfig[]; className?: string }) {
  return (
    <div className={`padgrid${className ? ' ' + className : ''}`} role="list">
      {items.map((cfg) => (
        <Pad
          key={cfg.pad}
          pad={cfg.pad}
          label={cfg.label}
          sublabel={cfg.sublabel}
          tone={cfg.tone}
          active={cfg.active}
          onClick={cfg.onClick}
        />
      ))}
    </div>
  )
}
