import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from '@/lib/rr'
import { isWorkflowActionRef, type Workflow, type WorkflowEntry, type WorkflowStep, type ActionRecord } from '@/data/types'
import { useLocalizedActions } from '@/i18n/content'
import { useT } from '@/i18n/useT'
import { useStore } from '@/state/store'
import { useDisplay } from '@/state/display'
import { ButtonSequence } from './ButtonSequence'
import { SourceTag } from './SourceTag'
import { HardwareButton } from '../hardware/HardwareButton'
import { buzz } from '@/utils/haptics'
import cx from '@/utils/cx'

function resolveEntry(entry: WorkflowEntry, actionsById: Record<string, ActionRecord>): WorkflowStep {
  if (!isWorkflowActionRef(entry)) return entry
  const action = actionsById[entry.actionId]
  if (!action) throw new Error(`Unknown action record: ${entry.actionId}`)
  return {
    id: entry.id,
    title: action.title,
    action: entry.context ? `${entry.context} ${action.action}` : action.action,
    buttons: action.buttons,
    path: action.path,
    explanation: action.explanation,
    expectedResult: action.expectedResult,
    commonMistake: action.warning,
    source: action.source,
    kind: action.kind,
  }
}

export function WorkflowPlayer({ workflow }: { workflow: Workflow }) {
  const { state, dispatch, isFav, storageAvailable } = useStore()
  const { setDisplay } = useDisplay()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const t = useT()
  const { byId: actionsById } = useLocalizedActions()

  const steps = useMemo(() => workflow.steps.map((entry) => resolveEntry(entry, actionsById)), [workflow.steps, actionsById])
  const total = steps.length
  const storedStep = Math.max(0, Math.min(state.progress.workflowStep[workflow.id] ?? 0, total))
  const done = state.progress.doneSteps[workflow.id] ?? []
  const completed = state.progress.completedWorkflows.includes(workflow.id)
  const allConfirmed = steps.every((item) => done.includes(item.id))
  const stepIndex = storedStep >= total && !allConfirmed ? Math.max(0, steps.findIndex((item) => !done.includes(item.id))) : storedStep
  const finished = stepIndex >= total && allConfirmed
  const step = steps[Math.min(stepIndex, total - 1)]
  const rawStep = workflow.steps[Math.min(stepIndex, total - 1)]
  const actionRecord = rawStep && isWorkflowActionRef(rawStep) ? actionsById[rawStep.actionId] : undefined

  useEffect(() => {
    const requestedParam = searchParams.get('step')
    if (requestedParam !== null) {
      const requested = requestedParam.trim() === '' ? Number.NaN : Number(requestedParam)
      const nextParams = new URLSearchParams(searchParams)
      nextParams.delete('step')
      setSearchParams(nextParams, { replace: true })
      if (Number.isInteger(requested) && requested >= 0 && requested < total && requested !== stepIndex) {
        dispatch({ type: 'SET_WORKFLOW_STEP', workflowId: workflow.id, step: requested })
        return
      }
    }
    if (!finished && state.progress.activeWorkflowId !== workflow.id) {
      dispatch({ type: 'SET_ACTIVE_WORKFLOW', workflowId: workflow.id })
    }
  }, [dispatch, finished, searchParams, setSearchParams, state.progress.activeWorkflowId, stepIndex, total, workflow.id])

  useEffect(() => {
    document.querySelector('.shell__main')?.scrollTo({ top: 0, behavior: 'instant' })
  }, [stepIndex, workflow.id])

  useEffect(() => {
    setDisplay({
      title: workflow.title,
      sub: workflow.category,
      right: finished ? t.lcdDone : t.workflow.stepRight(Math.min(stepIndex + 1, total), total),
    })
  }, [workflow.title, workflow.category, stepIndex, total, finished, setDisplay, t])

  const go = (idx: number) => {
    buzz()
    dispatch({ type: 'SET_WORKFLOW_STEP', workflowId: workflow.id, step: Math.max(0, Math.min(idx, total)) })
  }

  const confirmAndNext = () => {
    buzz(14)
    if (!done.includes(step.id)) {
      dispatch({ type: 'TOGGLE_STEP_DONE', workflowId: workflow.id, stepId: step.id })
    }
    const remaining = steps.findIndex((item) => item.id !== step.id && !done.includes(item.id))
    const target = stepIndex === total - 1 && remaining >= 0 ? remaining : stepIndex + 1
    dispatch({ type: 'SET_WORKFLOW_STEP', workflowId: workflow.id, step: target })
    if (target >= total) dispatch({ type: 'COMPLETE_WORKFLOW', workflowId: workflow.id })
  }

  const openRescue = () => {
    if (actionRecord) dispatch({ type: 'QUEUE_PRACTICE', id: actionRecord.id })
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
          <span className="wf-done__kick u-label">{t.workflow.achieved}</span>
          <p className="wf-done__text">{workflow.outcome ?? t.workflow.doneFallback(workflow.title)}</p>
          <p className="wf-done__meta u-mono">{completed && storageAvailable ? t.workflow.progressSaved : t.workflow.sessionDone}</p>
          <div className="wf-done__actions">
            <HardwareButton label={t.workflow.again} onClick={reset} />
            <HardwareButton label={t.workflow.now} tone="accent" onClick={() => navigate('/')} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wplayer">
      <button className="chip" type="button" aria-pressed={isFav('workflows', workflow.id)} onClick={() => dispatch({ type: 'TOGGLE_FAV', kind: 'workflows', id: workflow.id })}>
        {isFav('workflows', workflow.id) ? t.workflow.inKit : t.workflow.saveKit}
      </button>
      <div className="wf-progress">
        <span className="wf-progress__label u-mono">{t.workflow.actionN(stepIndex + 1, total)}</span>
        <div className="wf-progress__dots" role="group" aria-label={t.workflow.stepsAria}>
          {steps.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-current={index === stepIndex ? 'step' : undefined}
              className={cx(
                'wf-progress__dot',
                index === stepIndex && 'is-current',
                done.includes(item.id) && 'is-done',
                index < stepIndex && 'is-past',
              )}
              onClick={() => go(index)}
              aria-label={t.workflow.stepAria(index + 1, item.title)}
            >{index + 1}</button>
          ))}
        </div>
      </div>
      <p className="wf-confirmed">{t.workflow.confirmed(steps.filter((item) => done.includes(item.id)).length, total)}</p>

      {stepIndex === 0 && workflow.startingState ? (
        <details className="wf-start panel-surface">
          <summary className="wf-start__k u-label">{t.workflow.beforeStart}</summary>
          <p>{workflow.startingState}</p>
        </details>
      ) : null}

      <article className="wf-step panel-surface">
        <span className="wf-step__meta u-mono">{t.workflow.doNow(stepIndex + 1)}</span>
        <h2 className="wf-step__title u-label">{step.title}</h2>
        <p className="wf-step__action">{step.action}</p>

        <ButtonSequence buttons={step.buttons} path={step.path} size="md" />

        {step.expectedResult ? (
          <div className="wf-check">
            <span className="wf-check__led" aria-hidden="true" />
            <div>
              <span className="wf-check__k u-label">{t.workflow.checkOnSp}</span>
              <p>{step.expectedResult}</p>
            </div>
          </div>
        ) : null}

        {(actionRecord?.startingState || step.explanation) && <details className="wf-step__details">
          <summary>{t.workflow.why}</summary>
          {actionRecord?.startingState && <p>{actionRecord.startingState}</p>}
          {step.explanation && <p>{step.explanation}</p>}
        </details>}

        {step.commonMistake ? (
          <div className="wf-step__row wf-step__row--warn">
            <span className="wf-step__k u-label">{t.workflow.watch}</span>
            <p>{step.commonMistake}</p>
          </div>
        ) : null}

        {actionRecord?.toolRoute ? (
          <Link to={`${actionRecord.toolRoute}?from=${encodeURIComponent(workflow.id)}&step=${stepIndex}`} className="wf-tool-link u-label">
            <span>◎</span>
            {actionRecord.toolLabel ?? t.workflow.openTool}
            <span aria-hidden="true">→</span>
          </Link>
        ) : null}

        <SourceTag source={step.source} kind={step.kind} />
      </article>

      <div className="wf-confirm">
        <HardwareButton
          label={stepIndex === total - 1 ? t.workflow.yesFinish : t.workflow.yesNext}
          sublabel={t.workflow.resultOk}
          tone="accent"
          wide
          onClick={confirmAndNext}
        />
        <HardwareButton
          label={t.workflow.didntHappen}
          sublabel={t.workflow.openRescue}
          tone="danger"
          wide
          onClick={openRescue}
        />
      </div>

      <div className="wf-nav wf-nav--quiet">
        {actionRecord && <Link className="wf-text-action" to={`/muscle?practice=${actionRecord.id}&from=${workflow.id}&step=${stepIndex}`}>{t.workflow.drill}</Link>}
        <button type="button" className="wf-text-action" onClick={() => go(stepIndex - 1)} disabled={stepIndex === 0}>
          {t.workflow.prev}
        </button>
        <button type="button" className="wf-text-action" onClick={() => navigate('/')}>
          {t.workflow.exit}
        </button>
      </div>
    </div>
  )
}
