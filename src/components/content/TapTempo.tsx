import { useRef, useState } from 'react'
import { useT } from '@/i18n/useT'
import { buzz } from '@/utils/haptics'
import {
  TAP_IDLE_RESET_MS,
  TAP_MAX_INTERVALS,
  TAP_MIN_INTERVAL_MS,
  estimateTapBpm,
  formatTapBpm,
  type TapTempoEstimate,
} from '@/utils/loopFit'

/**
 * Tap tempo na LOOP FIT. Sesja stuknięć żyje tylko w komponencie (nie w spw.state.v1),
 * liczy z kliknięć — bez mikrofonu, AudioContext i bez odczytu z SP.
 */
export function TapTempo({ onUse }: { onUse: (bpm: string) => void }) {
  const t = useT()
  const taps = useRef<number[]>([])
  const [estimate, setEstimate] = useState<TapTempoEstimate | null>(null)

  const tap = () => {
    const now = performance.now()
    const last = taps.current[taps.current.length - 1]
    if (last !== undefined && now - last < TAP_MIN_INTERVAL_MS) return
    const contiguous = last !== undefined && now - last <= TAP_IDLE_RESET_MS
    taps.current = [...(contiguous ? taps.current : []), now].slice(-(TAP_MAX_INTERVALS + 1))
    buzz(10)
    const next = estimateTapBpm(taps.current)
    // Późne stuknięcie nie kasuje liczby, której użytkownik jeszcze nie wpisał.
    if (next) setEstimate(next)
  }

  const clear = () => {
    taps.current = []
    setEstimate(null)
  }

  return (
    <section className="loopfit-tap panel-surface">
      <h2 className="u-label">{t.loopfit.tapTitle}</h2>
      <p className="loopfit-tap__hint">{t.loopfit.tapHint}</p>
      <button type="button" className="loopfit-tap__btn" aria-label={t.loopfit.tapAria} onClick={tap}>
        {t.loopfit.tapButton}
      </button>
      <p className="loopfit-tap__readout" aria-live="polite">
        {estimate ? formatTapBpm(estimate.bpm) : t.loopfit.tapEmpty}
        <small className="u-mono">
          {t.loopfit.tapCount(estimate ? estimate.intervals + 1 : 0)}
          {estimate ? ` · ${estimate.stable ? t.loopfit.tapStable : t.loopfit.tapUnstable}` : ''}
        </small>
      </p>
      <small className="loopfit-tap__range">{t.loopfit.tapRange}</small>
      <div className="loopfit-tap__actions">
        <button
          type="button"
          className="loopfit-tap__use"
          aria-label={t.loopfit.tapUseAria}
          disabled={estimate === null}
          onClick={() => estimate && onUse(formatTapBpm(estimate.bpm))}
        >
          {t.loopfit.tapUse}
        </button>
        <button type="button" className="loopfit-tap__clear" onClick={clear}>
          {t.loopfit.tapClear}
        </button>
      </div>
    </section>
  )
}
