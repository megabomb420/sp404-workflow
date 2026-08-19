import { useMemo, useState } from 'react'
import { Knob } from './Knob'

/**
 * Interaktywny eksplorator parametrów SIDE CHAIN (firmware 5.50).
 * Pokrętła zmieniają THRESHOLD / RATIO / RELEASE / GAIN, a wykres pokazuje
 * jak zachowuje się poziom busa TARGET względem uderzeń źródła (KICK).
 *
 * To narzędzie do NAUKI — nie steruje sprzętem.
 */
export function SidechainExplorer() {
  const [threshold, setThreshold] = useState(120)
  const [ratio, setRatio] = useState(100)
  const [release, setRelease] = useState(80)
  const [gain, setGain] = useState(3)

  const path = useMemo(() => {
    const W = 320
    const H = 96
    const base = 16
    const amp = 58
    const kicks = 8
    const step = W / kicks
    const kickLen = step * 0.14

    // wyższa wartość THRESHOLD = niższy próg = mocniejsze wyzwalanie
    const trigger = 0.35 + 0.65 * (threshold / 255)
    // głębokość ściszenia rośnie z RATIO
    const depth = Math.min(0.92, 0.18 + (ratio / 255) * 0.74) * trigger
    // szybkość powrotu: im większy RELEASE, tym wolniej wraca
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
        <span className="scex__title u-label">EKSPLORATOR SIDE CHAIN</span>
        <span className="scex__tag u-mono">nauka — nie steruje sprzętem</span>
      </div>

      <div className="scex__vis">
        <svg viewBox="0 0 320 96" width="100%" height="auto" role="img" aria-label="wykres poziomu busa TARGET przy uderzeniach źródła">
          <line x1="0" y1="16" x2="320" y2="16" stroke="#3a3d44" strokeWidth="1" strokeDasharray="4 4" />
          {kicksX.map((x) => (
            <line key={x} x1={x} y1="6" x2={x} y2="12" stroke="#58c05a" strokeWidth="1.5" />
          ))}
          <path d={path.area} fill="rgba(232,150,44,0.16)" />
          <path d={path.line} fill="none" stroke="#e8962c" strokeWidth="2" />
        </svg>
        <div className="scex__legend">
          <span className="scex__legend-item"><span className="scex__dot scex__dot--src" />ŹRÓDŁO (kick)</span>
          <span className="scex__legend-item"><span className="scex__dot scex__dot--tgt" />TARGET (bas/sample)</span>
        </div>
      </div>

      <div className="scex__knobs">
        <Knob label="THRESHOLD" value={threshold} min={0} max={255} onChange={setThreshold} />
        <Knob label="RATIO" value={ratio} min={0} max={255} onChange={setRatio} />
        <Knob label="RELEASE" value={release} min={0} max={255} onChange={setRelease} />
        <Knob label="GAIN" value={gain} min={0} max={6} step={0.5} display={`${gain.toFixed(1)} dB`} onChange={setGain} />
      </div>

      <p className="scex__note">
        {ratio > 150
          ? 'Ekstremalny RATIO — TARGET niemal znika pod źródłem (pumping).'
          : ratio > 90
            ? 'RATIO ~100 — naturalne ducking: źródło robi miejsce, mix oddycha.'
            : 'Niski RATIO — delikatne ściszenie, ledwo słyszalny ruch.'}
      </p>
    </div>
  )
}
