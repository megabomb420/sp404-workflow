import { useEffect } from 'react'
import { Workflow } from '../../data/types'
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

/** Tryb krok po kroku z zapisanym postępem (localStorage). */
export function WorkflowPlayer({ workflow }: WorkflowPlayerProps) {
  const { state, dispatch } = useStore()
  const { setDisplay } = useDisplay()

  const total = workflow.steps.length
  const stepIndex = Math.min(state.progress.workflowStep[workflow.id] ?? 0, total)
  const done = state.progress.doneSteps[workflow.id] ?? []
  const completed = state.progress.completedWorkflows.includes(workflow.id)
  const finished = stepIndex >= total
  const step = workflow.steps[Math.min(stepIndex, total - 1)]

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
  const next = () => {
    buzz(14)
    const target = stepIndex + 1
    dispatch({ type: 'SET_WORKFLOW_STEP', workflowId: workflow.id, step: target })
    if (target >= total) dispatch({ type: 'COMPLETE_WORKFLOW', workflowId: workflow.id })
  }
  const reset = () => {
    buzz()
    dispatch({ type: 'RESET_WORKFLOW', workflowId: workflow.id })
  }
  const toggleDone = (stepId: string) => dispatch({ type: 'TOGGLE_STEP_DONE', workflowId: workflow.id, stepId })

  if (finished) {
    return (
      <div className="wplayer">
        <div className="wf-done panel-surface">
          <div className="wf-done__led" aria-hidden="true" />
          <span className="wf-done__kick u-label">WORKFLOW UKOŃCZONY</span>
          <p className="wf-done__text">
            {workflow.title} — zrobione{completed ? ' ✓' : ''}. Zagraj całość od początku albo powtórz kroki.
          </p>
          <div className="wf-done__actions">
            <HardwareButton label="OD NOWA" tone="accent" onClick={reset} />
            <HardwareButton label="WRÓĆ DO KROKÓW" onClick={() => go(total - 1)} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wplayer">
      {/* pasek postępu + skoczki */}
      <div className="wf-progress">
        <span className="wf-progress__label u-mono">
          STEP {stepIndex + 1} / {total}
        </span>
        <div className="wf-progress__dots" role="list" aria-label="kroki workflow">
          {workflow.steps.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="listitem"
              className={cx(
                'wf-progress__dot',
                i === stepIndex && 'is-current',
                done.includes(s.id) && 'is-done',
                i < stepIndex && 'is-past',
              )}
              onClick={() => go(i)}
              aria-label={`krok ${i + 1}: ${s.title}`}
            />
          ))}
        </div>
      </div>

      <article className="wf-step panel-surface">
        <span className="wf-step__meta u-mono">KROK {stepIndex + 1}</span>
        <h2 className="wf-step__title u-label">{step.title}</h2>
        <p className="wf-step__action">{step.action}</p>

        <ButtonSequence buttons={step.buttons} path={step.path} size="md" />

        {step.explanation ? (
          <div className="wf-step__row">
            <span className="wf-step__k u-label">DLACZEGO</span>
            <p>{step.explanation}</p>
          </div>
        ) : null}

        {step.expectedResult ? (
          <div className="wf-step__row">
            <span className="wf-step__k u-label">CO SIĘ STANIE</span>
            <p>{step.expectedResult}</p>
          </div>
        ) : null}

        {step.commonMistake ? (
          <div className="wf-step__row wf-step__row--warn">
            <span className="wf-step__k u-label">TYPOWY BŁĄD</span>
            <p>{step.commonMistake}</p>
          </div>
        ) : null}

        <SourceTag source={step.source} kind={step.kind} />

        <label className="wf-step__done">
          <input
            type="checkbox"
            checked={done.includes(step.id)}
            onChange={() => toggleDone(step.id)}
          />
          <span>Oznacz krok jako wykonany</span>
        </label>
      </article>

      <div className="wf-nav">
        <HardwareButton label="← WSTECZ" onClick={() => go(stepIndex - 1)} disabled={stepIndex === 0} />
        <HardwareButton
          label={stepIndex === total - 1 ? 'KONIEC ✓' : 'DALEJ →'}
          tone="accent"
          onClick={next}
        />
      </div>
    </div>
  )
}
