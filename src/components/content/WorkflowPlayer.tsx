import { useEffect, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { actionsById, resolveWorkflowEntry } from '../../data/actions'
import { Workflow, isWorkflowActionRef } from '../../data/types'
import { useStore } from '../../state/store'
import { useDisplay } from '../../state/display'
import { ButtonSequence } from './ButtonSequence'
import { SourceTag } from './SourceTag'
import { HardwareButton } from '../hardware/HardwareButton'
import { buzz } from '../../utils/haptics'
import cx from '../../utils/cx'

interface WorkflowPlayerProps {
  workflow: Workflow
}

/** Jedna czynność, obserwowalny rezultat, kontekstowe Rescue i lokalny zapis pozycji. */
export function WorkflowPlayer({ workflow }: WorkflowPlayerProps) {
  const { state, dispatch } = useStore()
  const { setDisplay } = useDisplay()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const appliedDeepLink = useRef<string | null>(null)

  const steps = useMemo(() => workflow.steps.map(resolveWorkflowEntry), [workflow.steps])
  const total = steps.length
  const stepIndex = Math.min(state.progress.workflowStep[workflow.id] ?? 0, total)
  const done = state.progress.doneSteps[workflow.id] ?? []
  const completed = state.progress.completedWorkflows.includes(workflow.id)
  const finished = stepIndex >= total
  const step = steps[Math.min(stepIndex, total - 1)]
  const rawStep = workflow.steps[Math.min(stepIndex, total - 1)]
  const actionRecord = rawStep && isWorkflowActionRef(rawStep) ? actionsById[rawStep.actionId] : undefined

  useEffect(() => {
    const deepLinkKey = `${workflow.id}:${searchParams.get('step') ?? ''}`
    if (appliedDeepLink.current !== deepLinkKey) {
      appliedDeepLink.current = deepLinkKey
      const requestedParam = searchParams.get('step')
      const requested = requestedParam === null ? Number.NaN : Number(requestedParam)
      if (Number.isInteger(requested) && requested >= 0 && requested < total && requested !== stepIndex) {
        dispatch({ type: 'SET_WORKFLOW_STEP', workflowId: workflow.id, step: requested })
        return
      }
    }
    if (!finished && state.progress.activeWorkflowId !== workflow.id) {
      dispatch({ type: 'SET_ACTIVE_WORKFLOW', workflowId: workflow.id })
    }
  }, [dispatch, finished, searchParams, state.progress.activeWorkflowId, stepIndex, total, workflow.id])

  useEffect(() => {
    setDisplay({
      title: workflow.title,
      sub: workflow.category,
      right: finished ? 'DONE' : `STEP ${Math.min(stepIndex + 1, total)}/${total}`,
    })
  }, [workflow.title, workflow.category, stepIndex, total, finished, setDisplay])

  const go = (idx: number) => {
    buzz()
    dispatch({ type: 'SET_WORKFLOW_STEP', workflowId: workflow.id, step: Math.max(0, Math.min(idx, total)) })
  }

  const confirmAndNext = () => {
    buzz(14)
    if (!done.includes(step.id)) {
      dispatch({ type: 'TOGGLE_STEP_DONE', workflowId: workflow.id, stepId: step.id })
    }
    const target = stepIndex + 1
    dispatch({ type: 'SET_WORKFLOW_STEP', workflowId: workflow.id, step: target })
    if (target >= total) dispatch({ type: 'COMPLETE_WORKFLOW', workflowId: workflow.id })
  }

  const openRescue = () => {
    const ids = actionRecord?.recoveryIds ?? []
    const params = new URLSearchParams()
    if (ids.length) params.set('ids', ids.join(','))
    else params.set('q', step.title)
    params.set('from', workflow.id)
    params.set('step', String(stepIndex))
    navigate(`/fix-it?${params.toString()}`)
  }

  const reset = () => {
    buzz()
    dispatch({ type: 'RESET_WORKFLOW', workflowId: workflow.id })
  }

  if (finished) {
    return (
      <div className="wplayer">
        <div className="wf-done panel-surface">
          <div className="wf-done__led" aria-hidden="true" />
          <span className="wf-done__kick u-label">CEL OSIĄGNIĘTY</span>
          <p className="wf-done__text">{workflow.outcome ?? `${workflow.title} — zrobione.`}</p>
          <p className="wf-done__meta u-mono">{completed ? 'POSTĘP ZAPISANY OFFLINE' : 'SESJA ZAKOŃCZONA'}</p>
          <div className="wf-done__actions">
            <HardwareButton label="OD NOWA" onClick={reset} />
            <HardwareButton label="NOW" tone="accent" onClick={() => navigate('/')} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wplayer">
      <div className="wf-progress">
        <span className="wf-progress__label u-mono">ACTION {stepIndex + 1} / {total}</span>
        <div className="wf-progress__dots" role="list" aria-label="kroki workflow">
          {steps.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="listitem"
              className={cx(
                'wf-progress__dot',
                index === stepIndex && 'is-current',
                done.includes(item.id) && 'is-done',
                index < stepIndex && 'is-past',
              )}
              onClick={() => go(index)}
              aria-label={`krok ${index + 1}: ${item.title}`}
            />
          ))}
        </div>
      </div>

      {stepIndex === 0 && workflow.startingState ? (
        <aside className="wf-start panel-surface">
          <span className="wf-start__k u-label">ZANIM ZACZNIESZ</span>
          <p>{workflow.startingState}</p>
        </aside>
      ) : null}

      <article className="wf-step panel-surface">
        <span className="wf-step__meta u-mono">ZRÓB TERAZ · {stepIndex + 1}</span>
        <h2 className="wf-step__title u-label">{step.title}</h2>
        <p className="wf-step__action">{step.action}</p>

        <ButtonSequence buttons={step.buttons} path={step.path} size="md" />

        {actionRecord?.startingState ? (
          <div className="wf-step__row">
            <span className="wf-step__k u-label">STAN POCZĄTKOWY</span>
            <p>{actionRecord.startingState}</p>
          </div>
        ) : null}

        {step.explanation ? (
          <div className="wf-step__row">
            <span className="wf-step__k u-label">DLACZEGO</span>
            <p>{step.explanation}</p>
          </div>
        ) : null}

        {step.expectedResult ? (
          <div className="wf-check">
            <span className="wf-check__led" aria-hidden="true" />
            <div>
              <span className="wf-check__k u-label">SPRAWDŹ NA SP</span>
              <p>{step.expectedResult}</p>
            </div>
          </div>
        ) : null}

        {step.commonMistake ? (
          <div className="wf-step__row wf-step__row--warn">
            <span className="wf-step__k u-label">UWAŻAJ</span>
            <p>{step.commonMistake}</p>
          </div>
        ) : null}

        <SourceTag source={step.source} kind={step.kind} />
      </article>

      <div className="wf-confirm">
        <HardwareButton
          label={stepIndex === total - 1 ? 'TAK — ZAKOŃCZ ✓' : 'TAK — DALEJ →'}
          sublabel="rezultat zgadza się"
          tone="accent"
          wide
          onClick={confirmAndNext}
        />
        <HardwareButton
          label="TO SIĘ NIE STAŁO"
          sublabel="otwórz Rescue w tym kontekście"
          tone="danger"
          wide
          onClick={openRescue}
        />
      </div>

      <div className="wf-nav wf-nav--quiet">
        <button type="button" className="wf-text-action" onClick={() => go(stepIndex - 1)} disabled={stepIndex === 0}>
          ← poprzednia akcja
        </button>
        <button type="button" className="wf-text-action" onClick={() => navigate('/')}>
          wyjdź bez utraty postępu
        </button>
      </div>
    </div>
  )
}
