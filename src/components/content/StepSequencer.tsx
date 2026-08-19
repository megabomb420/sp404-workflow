import { useState } from 'react'
import cx from '../../utils/cx'
import { buzz } from '../../utils/haptics'

interface StepSequencerProps {
  /** domyślny wzór 16 kroków */
  initial?: boolean[]
  label?: string
}

/**
 * Wizualny, interaktywny 16-krokowy sequencer (bez audio) — do nauki TR-REC.
 * Każdy krok = pad; naciśnięcie włącza/wyłącza krok.
 */
export function StepSequencer({ initial, label = 'TR-REC' }: StepSequencerProps) {
  const [steps, setSteps] = useState<boolean[]>(() => initial ?? defaultPattern())

  const toggle = (i: number) => {
    buzz(8)
    setSteps((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
  }

  const count = steps.filter(Boolean).length

  return (
    <div className="stepseq panel-surface">
      <div className="stepseq__head">
        <span className="stepseq__label u-label">{label}</span>
        <span className="stepseq__count u-mono">{count}/16 KROKÓW</span>
      </div>
      <div className="stepseq__grid">
        {steps.map((on, i) => (
          <button
            key={i}
            type="button"
            className={cx('stepseq__step', on && 'is-on')}
            onClick={() => toggle(i)}
            aria-pressed={on}
            aria-label={`krok ${i + 1}`}
          >
            <span className="stepseq__n u-mono">{i + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function defaultPattern(): boolean[] {
  // klasyczny wzór: kick na 1, 5, 9, 13; snare 5 i 13; haty co 2
  const s = Array(16).fill(false)
  ;[0, 4, 8, 12].forEach((i) => (s[i] = true))
  ;[4, 12].forEach((i) => (s[i] = true))
  for (let i = 2; i < 16; i += 2) s[i] = true
  return s
}
