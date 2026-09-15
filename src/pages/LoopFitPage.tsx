import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from '@/lib/rr'
import { ButtonSequence } from '@/components/content/ButtonSequence'
import { SourceTag } from '@/components/content/SourceTag'
import { useLocalizedActions } from '@/i18n/content'
import { useT } from '@/i18n/useT'
import { useDisplay } from '@/state/display'
import { calculateLoopFit, formatLoopSeconds, parsePositiveDecimal } from '@/utils/loopFit'
import { useStore } from '@/state/store'
import { workflowReturnRoute } from '@/utils/session'
import cx from '@/utils/cx'

const BAR_OPTIONS = [0.5, 1, 2, 4, 8, 16]
const STATUS_TONE = {
  'target-only': 'info',
  tight: 'good',
  close: 'warn',
  adjust: 'danger',
} as const

export function LoopFitPage() {
  const { setDisplay } = useDisplay()
  const { state, dispatch } = useStore()
  const { bpm, bars, actual } = state.loopFit
  const setBpm = (value: string) => dispatch({ type: 'SET_LOOP_FIT', value: { bpm: value } })
  const setBars = (value: number) => dispatch({ type: 'SET_LOOP_FIT', value: { bars: value } })
  const setActual = (value: string) => dispatch({ type: 'SET_LOOP_FIT', value: { actual: value } })
  const [params] = useSearchParams()
  const returnRoute = workflowReturnRoute(params)
  const bpmValid = parsePositiveDecimal(bpm) !== null
  const actualValid = !actual.trim() || parsePositiveDecimal(actual) !== null
  const t = useT()
  const { byId: actionsById } = useLocalizedActions()
  const setBpmAction = actionsById['set-sample-bpm']
  const syncAction = actionsById['enable-bpm-sync']

  const result = useMemo(
    () => calculateLoopFit(parsePositiveDecimal(bpm) ?? NaN, bars, actual.trim() ? parsePositiveDecimal(actual) ?? NaN : null),
    [actual, bars, bpm],
  )
  const statusKey = result?.status ?? 'target-only'
  const status = t.loopfit.status[statusKey]

  useEffect(() => {
    setDisplay({ title: 'LOOP FIT', sub: t.loopfit.lcdSub, right: t.loopfit.bar(bars) })
  }, [bars, setDisplay, t])

  const differenceMs = result?.differenceSeconds == null ? null : result.differenceSeconds * 1000
  const driftMs = result?.driftAfterFourSeconds == null ? null : result.driftAfterFourSeconds * 1000

  return (
    <div className="page loopfit">
      <header>
        <span className="loopfit__eyebrow u-mono">{t.loopfit.eyebrow}</span>
        <h1 className="page__title u-label">{t.loopfit.title}</h1>
        <p className="page__lede">{t.loopfit.lede}</p>
      </header>

      <section className="loopfit-controls panel-surface" aria-label={t.loopfit.params}>
        <label className="loopfit-field">
          <span className="u-label">{t.loopfit.tempo}</span>
          <span className="loopfit-input">
            <input type="text" inputMode="decimal" value={bpm} onChange={(event) => setBpm(event.target.value)} aria-label={t.loopfit.tempoAria} aria-invalid={!bpmValid} />
            <small>BPM</small>
          </span>
        </label>

        <fieldset className="loopfit-bars">
          <legend className="u-label">{t.loopfit.phrase}</legend>
          <div>
            {BAR_OPTIONS.map((option) => (
              <button key={option} type="button" className={cx('loopfit-bar', bars === option && 'is-active')} onClick={() => setBars(option)} aria-pressed={bars === option}>
                {option}
              </button>
            ))}
          </div>
          <small>{t.loopfit.barsHint}</small>
        </fieldset>

        <label className="loopfit-field loopfit-field--actual">
          <span className="u-label">{t.loopfit.actual} <em>{t.loopfit.optional}</em></span>
          <span className="loopfit-input">
            <input
              type="text"
              inputMode="decimal"
              value={actual}
              onChange={(event) => setActual(event.target.value)}
              placeholder={result?.targetSeconds.toFixed(3) ?? '10.667'}
              aria-label={t.loopfit.actualAria}
              aria-invalid={!actualValid}
            />
            <small>SEC</small>
          </span>
          <small>{t.loopfit.actualHint}</small>
        </label>
      </section>

      {!result && <p className="loopfit-error" role="alert">{t.loopfit.error}</p>}
      {result && (
        <section className="loopfit-result panel-surface" aria-live="polite">
          <span className="loopfit-result__k u-label">{t.loopfit.ideal}</span>
          <strong>{formatLoopSeconds(result.targetSeconds)}</strong>
          <span className="loopfit-result__formula u-mono">{t.loopfit.formula(result.beats, parsePositiveDecimal(bpm) ?? 0)}</span>

          <div className={`loopfit-status loopfit-status--${STATUS_TONE[statusKey]}`}>
            <span className="u-label">{status.label}</span>
            <p>{status.text}</p>
          </div>

          {result.actualSeconds !== null ? (
            <dl className="loopfit-metrics">
              <div>
                <dt>{t.loopfit.inferred}</dt>
                <dd>{result.inferredBpm?.toFixed(2)}</dd>
              </div>
              <div>
                <dt>{t.loopfit.diff}</dt>
                <dd>{differenceMs && differenceMs > 0 ? '+' : ''}{differenceMs?.toFixed(0)} ms</dd>
              </div>
              <div>
                <dt>{t.loopfit.drift}</dt>
                <dd>{driftMs && driftMs > 0 ? '+' : ''}{driftMs?.toFixed(0)} ms</dd>
              </div>
            </dl>
          ) : null}
        </section>
      )}
      <p className="loopfit-assumptions">{t.loopfit.assumptions(bars)}</p>

      <section className="loopfit-actions" aria-labelledby="loopfit-next">
        <h2 id="loopfit-next" className="now-section-title u-label">{t.loopfit.doOnSp}</h2>
        {setBpmAction ? (
          <article className="loopfit-action panel-surface">
            <span className="loopfit-action__n u-mono">01</span>
            <div>
              <strong className="u-label">{t.loopfit.setBpm}</strong>
              <p>{setBpmAction.action}</p>
              <ButtonSequence buttons={setBpmAction.buttons} path={setBpmAction.path} size="sm" />
              <SourceTag source={setBpmAction.source} />
            </div>
          </article>
        ) : null}
        {syncAction ? (
          <article className="loopfit-action panel-surface">
            <span className="loopfit-action__n u-mono">02</span>
            <div>
              <strong className="u-label">{t.loopfit.enableSync}</strong>
              <p>{syncAction.action} {t.loopfit.checkRepeats}</p>
              <ButtonSequence buttons={syncAction.buttons} size="sm" />
              <SourceTag source={syncAction.source} />
            </div>
          </article>
        ) : null}
      </section>

      <div className="loopfit-links">
        <Link to={returnRoute ?? '/workflow/loop-to-pattern'} className="rescue-return__primary u-label">
          {returnRoute ? t.loopfit.returnAction : t.loopfit.runLoop}
        </Link>
        <Link
          to={`/fix-it?ids=bpm-sync-bez-tempa,sample-bpm-vs-pattern-bpm${returnRoute ? `&from=${encodeURIComponent(params.get('from') ?? '')}&step=${returnRoute.split('step=')[1] ?? ''}` : ''}`}
          className="rescue-return__secondary"
        >
          {t.loopfit.stillDrifts}
        </Link>
      </div>
    </div>
  )
}
