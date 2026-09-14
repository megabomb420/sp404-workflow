import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ButtonSequence } from '../components/content/ButtonSequence'
import { useDisplay } from '../state/display'
import { calculateLoopFit, formatLoopSeconds, parsePositiveDecimal } from '../utils/loopFit'
import { useStore } from '../state/store'
import { workflowReturnRoute } from '../utils/session'
import { actionsById } from '../data/actions'
import { SourceTag } from '../components/content/SourceTag'
import cx from '../utils/cx'

const BAR_OPTIONS = [0.5, 1, 2, 4, 8, 16]

const STATUS_COPY = {
  'target-only': { label: 'TARGET READY', text: 'Wpisz rzeczywistą długość sampla, żeby policzyć drift.', tone: 'info' },
  tight: { label: 'RÓŻNICA ≤ 20 ms', text: 'Długości są bliskie matematycznie. Potwierdź rytm odsłuchem — to nie ocena jakości pętli.', tone: 'good' },
  close: { label: 'CLOSE', text: 'Mała różnica może narastać po kilku powtórzeniach.', tone: 'warn' },
  adjust: { label: 'SPRAWDŹ TEMPO / CIĘCIE', text: 'Długości różnią się. Zweryfikuj liczbę taktów, punkty START/END i źródłowe BPM.', tone: 'danger' },
} as const

export function LoopFitPage() {
  const { setDisplay } = useDisplay()
  const { state, dispatch } = useStore()
  const { bpm, bars, actual } = state.loopFit
  const setBpm = (bpm: string) => dispatch({ type: 'SET_LOOP_FIT', value: { bpm } })
  const setBars = (bars: number) => dispatch({ type: 'SET_LOOP_FIT', value: { bars } })
  const setActual = (actual: string) => dispatch({ type: 'SET_LOOP_FIT', value: { actual } })
  const [params] = useSearchParams()
  const returnRoute = workflowReturnRoute(params)
  const bpmValid = parsePositiveDecimal(bpm) !== null
  const actualValid = !actual.trim() || parsePositiveDecimal(actual) !== null

  const result = useMemo(
    () => calculateLoopFit(parsePositiveDecimal(bpm) ?? NaN, bars, actual.trim() ? parsePositiveDecimal(actual) ?? NaN : null),
    [actual, bars, bpm],
  )
  const status = STATUS_COPY[result?.status ?? 'target-only']

  useEffect(() => {
    setDisplay({ title: 'LOOP FIT', sub: 'timing lab · local', right: `${bars} BAR` })
  }, [bars, setDisplay])

  const differenceMs = result?.differenceSeconds == null ? null : result.differenceSeconds * 1000
  const driftMs = result?.driftAfterFourSeconds == null ? null : result.driftAfterFourSeconds * 1000

  return (
    <div className="page loopfit">
      <header>
        <span className="loopfit__eyebrow u-mono">4/4 · BEZ WYSYŁANIA DANYCH</span>
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
              aria-invalid={!bpmValid}
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
              placeholder={result?.targetSeconds.toFixed(3) ?? 'np. 10,667'}
              aria-label="rzeczywista długość sampla w sekundach"
              aria-invalid={!actualValid}
            />
            <small>SEC</small>
          </span>
          <small>Użyj długości pliku lub odczytu sampla. Możesz wpisać przecinek.</small>
        </label>
      </section>

      {!result && <p className="loopfit-error" role="alert">Wpisz dodatnie liczby: BPM i opcjonalną długość w sekundach. Użyj kropki lub przecinka, bez jednostek.</p>}
      {result && <section className="loopfit-result panel-surface" aria-live="polite">
        <span className="loopfit-result__k u-label">IDEALNA DŁUGOŚĆ</span>
        <strong>{formatLoopSeconds(result.targetSeconds)}</strong>
        <span className="loopfit-result__formula u-mono">{result.beats} BEATS × 60 ÷ {parsePositiveDecimal(bpm)} BPM</span>

        <div className={`loopfit-status loopfit-status--${status.tone}`}>
          <span className="u-label">{status.label}</span>
          <p>{status.text}</p>
        </div>

        {result.actualSeconds !== null ? (
          <dl className="loopfit-metrics">
            <div>
              <dt>SZACOWANE BPM</dt>
              <dd>{result.inferredBpm?.toFixed(2)}</dd>
            </div>
            <div>
              <dt>RÓŻNICA / LOOP</dt>
              <dd>{differenceMs && differenceMs > 0 ? '+' : ''}{differenceMs?.toFixed(0)} ms</dd>
            </div>
            <div>
              <dt>DRIFT BEZ SYNC PO 4×</dt>
              <dd>{driftMs && driftMs > 0 ? '+' : ''}{driftMs?.toFixed(0)} ms</dd>
            </div>
          </dl>
        ) : null}
      </section>}
      <p className="loopfit-assumptions">Obliczenia zakładają 4/4 i dokładnie {bars} taktów, bez ciszy oraz ogona efektów poza frazą. Drift dotyczy swobodnie powtarzanego loopa bez synchronizacji i bez ponownego wyzwalania z patternu. BPM SYNC lub retrigger zmieniają ten scenariusz. Progi kolorów są orientacyjne.</p>

      <section className="loopfit-actions" aria-labelledby="loopfit-next">
        <h2 id="loopfit-next" className="now-section-title u-label">ZRÓB TO NA SP</h2>
        <article className="loopfit-action panel-surface">
          <span className="loopfit-action__n u-mono">01</span>
          <div>
            <strong className="u-label">USTAW BPM SAMPLA</strong>
            <p>
              {actionsById['set-sample-bpm'].action}
            </p>
            <ButtonSequence buttons={actionsById['set-sample-bpm'].buttons} path={actionsById['set-sample-bpm'].path} size="sm" />
            <SourceTag source={actionsById['set-sample-bpm'].source} />
          </div>
        </article>
        <article className="loopfit-action panel-surface">
          <span className="loopfit-action__n u-mono">02</span>
          <div>
            <strong className="u-label">WŁĄCZ BPM SYNC</strong>
            <p>{actionsById['enable-bpm-sync'].action} Sprawdź kilka powtórzeń.</p>
            <ButtonSequence buttons={actionsById['enable-bpm-sync'].buttons} size="sm" />
            <SourceTag source={actionsById['enable-bpm-sync'].source} />
          </div>
        </article>
      </section>

      <div className="loopfit-links">
        <Link to={returnRoute ?? '/workflow/loop-to-pattern'} className="rescue-return__primary u-label">{returnRoute ? 'WRÓĆ DO PRZERWANEJ AKCJI →' : 'URUCHOM LOOP → CHOPY → PATTERN'}</Link>
        <Link to={`/fix-it?ids=bpm-sync-bez-tempa,sample-bpm-vs-pattern-bpm${returnRoute ? `&from=${encodeURIComponent(params.get('from')!)}&step=${returnRoute.split('step=')[1]}` : ''}`} className="rescue-return__secondary">Loop nadal odpływa? Otwórz Rescue</Link>
      </div>
    </div>
  )
}
