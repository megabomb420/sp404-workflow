import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ButtonSequence } from '../components/content/ButtonSequence'
import { useDisplay } from '../state/display'
import { calculateLoopFit, formatLoopSeconds } from '../utils/loopFit'
import cx from '../utils/cx'

const BAR_OPTIONS = [0.5, 1, 2, 4, 8, 16]

const STATUS_COPY = {
  'target-only': { label: 'TARGET READY', text: 'Wpisz rzeczywistą długość sampla, żeby policzyć drift.', tone: 'info' },
  tight: { label: 'TIGHT FIT', text: 'Różnica jest pomijalna. Loop powinien wracać równo.', tone: 'good' },
  close: { label: 'CLOSE', text: 'Mała różnica może narastać po kilku powtórzeniach.', tone: 'warn' },
  adjust: { label: 'SYNC NEEDED', text: 'Loop będzie wyraźnie odpływał. Ustaw jego źródłowe BPM i użyj BPM SYNC.', tone: 'danger' },
} as const

function parseNumber(value: string): number | null {
  const parsed = Number.parseFloat(value.replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : null
}

export function LoopFitPage() {
  const { setDisplay } = useDisplay()
  const [bpm, setBpm] = useState('90')
  const [bars, setBars] = useState(4)
  const [actual, setActual] = useState('')

  const result = useMemo(
    () => calculateLoopFit(parseNumber(bpm) ?? 90, bars, parseNumber(actual)),
    [actual, bars, bpm],
  )
  const status = STATUS_COPY[result.status]

  useEffect(() => {
    setDisplay({ title: 'LOOP FIT', sub: 'timing lab · local', right: `${bars} BAR` })
  }, [bars, setDisplay])

  const differenceMs = result.differenceSeconds === null ? null : result.differenceSeconds * 1000
  const driftMs = result.driftAfterFourSeconds === null ? null : result.driftAfterFourSeconds * 1000

  return (
    <div className="page loopfit">
      <header>
        <span className="loopfit__eyebrow u-mono">DETERMINISTIC · OFFLINE</span>
        <h1 className="page__title u-label">LOOP FIT LAB</h1>
        <p className="page__lede">Sprawdź, jak długi powinien być loop i ile odpłynie po kilku powtórzeniach — zanim zaczniesz chopować.</p>
      </header>

      <section className="loopfit-controls panel-surface" aria-label="parametry loopa">
        <label className="loopfit-field">
          <span className="u-label">TEMPO PROJEKTU</span>
          <span className="loopfit-input">
            <input
              type="text"
              inputMode="decimal"
              value={bpm}
              onChange={(event) => setBpm(event.target.value)}
              aria-label="tempo projektu BPM"
            />
            <small>BPM</small>
          </span>
        </label>

        <fieldset className="loopfit-bars">
          <legend className="u-label">DŁUGOŚĆ FRAZY</legend>
          <div>
            {BAR_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={cx('loopfit-bar', bars === option && 'is-active')}
                onClick={() => setBars(option)}
                aria-pressed={bars === option}
              >
                {option}
              </button>
            ))}
          </div>
          <small>TAKTY · 4 UDERZENIA / TAKT</small>
        </fieldset>

        <label className="loopfit-field loopfit-field--actual">
          <span className="u-label">RZECZYWISTA DŁUGOŚĆ <em>OPCJONALNIE</em></span>
          <span className="loopfit-input">
            <input
              type="text"
              inputMode="decimal"
              value={actual}
              onChange={(event) => setActual(event.target.value)}
              placeholder={result.targetSeconds.toFixed(3)}
              aria-label="rzeczywista długość sampla w sekundach"
            />
            <small>SEC</small>
          </span>
          <small>Użyj długości pliku lub odczytu sampla. Możesz wpisać przecinek.</small>
        </label>
      </section>

      <section className="loopfit-result panel-surface" aria-live="polite">
        <span className="loopfit-result__k u-label">IDEALNA DŁUGOŚĆ</span>
        <strong>{formatLoopSeconds(result.targetSeconds)}</strong>
        <span className="loopfit-result__formula u-mono">{result.beats} BEATS × 60 ÷ {parseNumber(bpm) ?? 90} BPM</span>

        <div className={`loopfit-status loopfit-status--${status.tone}`}>
          <span className="u-label">{status.label}</span>
          <p>{status.text}</p>
        </div>

        {result.actualSeconds !== null ? (
          <dl className="loopfit-metrics">
            <div>
              <dt>ŹRÓDŁOWE BPM</dt>
              <dd>{result.inferredBpm?.toFixed(2)}</dd>
            </div>
            <div>
              <dt>RÓŻNICA / LOOP</dt>
              <dd>{differenceMs && differenceMs > 0 ? '+' : ''}{differenceMs?.toFixed(0)} ms</dd>
            </div>
            <div>
              <dt>DRIFT PO 4×</dt>
              <dd>{driftMs && driftMs > 0 ? '+' : ''}{driftMs?.toFixed(0)} ms</dd>
            </div>
          </dl>
        ) : null}
      </section>

      <section className="loopfit-actions" aria-labelledby="loopfit-next">
        <h2 id="loopfit-next" className="now-section-title u-label">ZRÓB TO NA SP</h2>
        <article className="loopfit-action panel-surface">
          <span className="loopfit-action__n u-mono">01</span>
          <div>
            <strong className="u-label">USTAW BPM SAMPLA</strong>
            <p>
              {result.inferredBpm
                ? `Jeżeli sample naprawdę ma ${bars} taktów, ustaw BPM SET → MANU na około ${result.inferredBpm.toFixed(2)} BPM.`
                : 'W PITCH/SPEED ustaw BPM SET na AUTO albo wpisz poprawne źródłowe tempo ręcznie.'}
            </p>
            <ButtonSequence buttons={['PITCH/SPEED']} path={['BPM SET', 'MANU']} size="sm" />
          </div>
        </article>
        <article className="loopfit-action panel-surface">
          <span className="loopfit-action__n u-mono">02</span>
          <div>
            <strong className="u-label">WŁĄCZ BPM SYNC</strong>
            <p>Odsłuchaj co najmniej cztery powtórzenia z patternem, nie tylko pierwszy obrót.</p>
            <ButtonSequence buttons={['BPM SYNC']} size="sm" />
          </div>
        </article>
      </section>

      <div className="loopfit-links">
        <Link to="/workflow/loop-to-pattern?step=0" className="rescue-return__primary u-label">URUCHOM LOOP → CHOPY → PATTERN</Link>
        <Link to="/fix-it?ids=bpm-sync-bez-tempa,sample-bpm-vs-pattern-bpm" className="rescue-return__secondary">Loop nadal odpływa? Otwórz Rescue</Link>
      </div>
    </div>
  )
}
