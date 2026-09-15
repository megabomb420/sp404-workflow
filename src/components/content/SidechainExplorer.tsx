import { useMemo, useState } from 'react'
import { useT } from '@/i18n/useT'
import { Knob } from './Knob'

export function SidechainExplorer() {
  const [threshold, setThreshold] = useState(120)
  const [ratio, setRatio] = useState(100)
  const [release, setRelease] = useState(80)
  const [gain, setGain] = useState(3)
  const t = useT()

  const path = useMemo(() => {
    const W = 320
    const H = 96
    const base = 16
    const amp = 58
    const kicks = 8
    const step = W / kicks
    const kickLen = step * 0.14
    const trigger = 0.35 + 0.65 * (threshold / 255)
    const depth = Math.min(0.92, 0.18 + (ratio / 255) * 0.74) * trigger
    const recover = 0.004 + (1 - release / 255) * 0.11

    const pts: number[][] = []
    let level = 1
    for (let x = 0; x <= W; x += 2) {
      const k = Math.floor(x / step)
      const local = x - k * step
      if (local < kickLen) {
        level = Math.min(level, 1 - depth)
      } else {
        level = Math.min(1, level + recover)
      }
      const y = base + (1 - level) * amp
      pts.push([x, y])
    }
    const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
    const area = `${line} L ${W} ${H} L 0 ${H} Z`
    return { line, area, kickLen }
  }, [threshold, ratio, release])

  const kicksX = useMemo(() => {
    const W = 320
    const kicks = 8
    const step = W / kicks
    return Array.from({ length: kicks }, (_, i) => Math.round(i * step))
  }, [])

  return (
    <div className="scex panel-surface">
      <div className="scex__head">
        <span className="scex__title u-label">{t.explorer.title}</span>
        <span className="scex__tag u-mono">{t.explorer.tag}</span>
      </div>

      <div className="scex__vis">
        <svg viewBox="0 0 320 96" width="100%" height="auto" role="img" aria-label={t.explorer.chart}>
          <line x1="0" y1="16" x2="320" y2="16" stroke="#3a3d44" strokeWidth="1" strokeDasharray="4 4" />
          {kicksX.map((x) => (
            <line key={x} x1={x} y1="6" x2={x} y2="12" stroke="#58c05a" strokeWidth="1.5" />
          ))}
          <path d={path.area} fill="rgba(232,150,44,0.16)" />
          <path d={path.line} fill="none" stroke="#e8962c" strokeWidth="2" />
        </svg>
        <div className="scex__legend">
          <span className="scex__legend-item"><span className="scex__dot scex__dot--src" />{t.explorer.src}</span>
          <span className="scex__legend-item"><span className="scex__dot scex__dot--tgt" />{t.explorer.tgt}</span>
        </div>
      </div>

      <div className="scex__knobs">
        <Knob label="THRESHOLD" value={threshold} min={0} max={255} onChange={setThreshold} />
        <Knob label="RATIO" value={ratio} min={0} max={255} onChange={setRatio} />
        <Knob label="RELEASE" value={release} min={0} max={255} onChange={setRelease} />
        <Knob label="GAIN" value={gain} min={0} max={6} step={0.5} display={`${gain.toFixed(1)} dB`} onChange={setGain} />
      </div>

      <p className="scex__note">
        {ratio > 150 ? t.explorer.high : ratio > 90 ? t.explorer.mid : t.explorer.low}
      </p>
    </div>
  )
}
