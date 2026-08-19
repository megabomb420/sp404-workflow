import { useRef } from 'react'

interface KnobProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  display?: string
  onChange: (v: number) => void
}

const CX = 34
const CY = 34
const R = 24

/** Punkt na okręgu: 0° = 12:00, zgodnie z ruchem wskazówek. */
function pt(angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180
  return { x: CX + R * Math.sin(a), y: CY - R * Math.cos(a) }
}

function arc(a0: number, a1: number) {
  const large = a1 - a0 > 180 ? 1 : 0
  const p0 = pt(a0)
  const p1 = pt(a1)
  return `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`
}

/** Pokrętło — drag w pionie, kółko myszy, strzałki. */
export function Knob({ label, value, min, max, step = 1, display, onChange }: KnobProps) {
  const drag = useRef<{ y: number; v: number } | null>(null)
  const moveHandler = useRef<((e: PointerEvent) => void) | null>(null)
  const upHandler = useRef<(() => void) | null>(null)

  const clamp = (v: number) => Math.max(min, Math.min(max, v))
  const snap = (v: number) => Math.round(v / step) * step
  const pct = (value - min) / (max - min)
  const angle = 135 + pct * 270

  const endDrag = () => {
    if (moveHandler.current) window.removeEventListener('pointermove', moveHandler.current)
    if (upHandler.current) window.removeEventListener('pointerup', upHandler.current)
    moveHandler.current = null
    upHandler.current = null
    drag.current = null
  }

  const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    drag.current = { y: e.clientY, v: value }
    const onMove = (ev: PointerEvent) => {
      if (!drag.current) return
      const dy = drag.current.y - ev.clientY
      onChange(clamp(snap(drag.current.v + (dy / 150) * (max - min))))
    }
    moveHandler.current = onMove
    upHandler.current = endDrag
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', endDrag)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const up = e.key === 'ArrowUp' || e.key === 'ArrowRight'
    const down = e.key === 'ArrowDown' || e.key === 'ArrowLeft'
    if (!up && !down) return
    e.preventDefault()
    onChange(clamp(snap(value + (up ? step : -step))))
  }

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
    onChange(clamp(snap(value + (e.deltaY < 0 ? step : -step))))
  }

  return (
    <div
      className="knob"
      role="slider"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={0}
      onPointerDown={startDrag}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
      style={{ touchAction: 'none' }}
    >
      <svg viewBox="0 0 68 68" width="62" height="62" aria-hidden="true">
        <path d={arc(135, 405)} fill="none" stroke="#2a2c31" strokeWidth="5" strokeLinecap="round" />
        <path d={arc(135, Math.max(135.5, angle))} fill="none" stroke="#e8962c" strokeWidth="5" strokeLinecap="round" />
        <circle cx={CX} cy={CY} r="14" fill="#1c1e22" stroke="#3a3d44" strokeWidth="1.5" />
        <line
          x1={CX}
          y1={CY}
          x2={pt(angle).x}
          y2={pt(angle).y}
          stroke="#e8e4d8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="knob__label u-label">{label}</span>
      <span className="knob__value u-mono">{display ?? value}</span>
    </div>
  )
}
