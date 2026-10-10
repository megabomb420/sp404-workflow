import { useEffect, useRef } from 'react'
import { Link, useNavigate } from '@/lib/rr'
import type { Workflow, WorkflowStep } from '@/data/types'
import { sectionsById } from '@/data/sections'
import { useLocalizedWorkflows } from '@/i18n/content'
import { useT } from '@/i18n/useT'
import { useStore } from '@/state/store'
import { resolveEndingNext, workflowKitLink } from '@/utils/workflowEnding'
import { HardwareButton } from '../hardware/HardwareButton'
import { ButtonSequence } from './ButtonSequence'
import { SourceTag } from './SourceTag'

export function WorkflowEnding({ workflow, steps, onRepeat, saved }: { workflow: Workflow; steps: WorkflowStep[]; onRepeat: () => void; saved: boolean }) {
  const t = useT()
  const navigate = useNavigate()
  const { state } = useStore()
  const { byId } = useLocalizedWorkflows()
  const heading = useRef<HTMLHeadingElement>(null)
  const ending = workflow.ending
  const next = resolveEndingNext(workflow, byId, state.progress, Object.keys(sectionsById))
  const kitLink = (tab: 'next' | 'song' | 'ab') => workflowKitLink(workflow, tab, state.kits, state.ui.activeKitId)
  const target = next.target
  const route = target.kind === 'workflow' ? `/workflow/${target.id}` : target.kind === 'section' ? `/section/${target.id}` : kitLink(target.tab)
  const label = next.fallback ? t.workflow.planNext : next.resumeTitle ? t.workflow.resumeNext(next.resumeTitle) : target.label
  const hints = ending?.hintStepIds.flatMap(id => { const step = steps.find(item => item.id === id); return step ? [step] : [] }) ?? []

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true })
      document.querySelector('.shell__main')?.scrollTo({ top: 0, behavior: 'instant' })
    })
    return () => cancelAnimationFrame(frame)
  }, [workflow.id])

  return <div className="wplayer">
    <section className="wf-done wf-ending panel-surface" aria-labelledby="wf-ending-title">
      <h1 id="wf-ending-title" ref={heading} tabIndex={-1} className="wf-done__kick u-label">{t.workflow.achieved}</h1>
      <p className="wf-done__text">{workflow.outcome ?? t.workflow.doneFallback(workflow.title)}</p>
      {ending && <>
        <div className="wf-ending-task"><h2 className="u-label">{t.workflow.endingCheck}</h2><p>{ending.check}</p></div>
        <div className="wf-ending-task"><h2 className="u-label">{t.workflow.endingTry} <span>· {t.workflow.optional}</span></h2><p>{ending.tryIt}</p><SourceTag kind="tip" /></div>
        {hints.length > 0 && <details className="wf-ending-hint">
          <summary className="u-label">{t.workflow.hint}</summary>
          <div className="wf-ending-hints">{hints.map(step => <article key={step.id}>
            <h3 className="u-label">{step.title}</h3>
            <p>{step.action}</p>
            <ButtonSequence buttons={step.buttons} path={step.path} size="md" />
            {step.commonMistake && <p className="wf-ending-warning">{step.commonMistake}</p>}
            <SourceTag source={step.source} kind={step.kind} />
          </article>)}</div>
        </details>}
        <div className="wf-ending-next">
          {target.preparation && !next.fallback && <p>{target.preparation}</p>}
          <HardwareButton className="wf-ending-primary" label={`${label} →`} tone="accent" wide onClick={() => navigate(route)} />
        </div>
      </>}
      <div className="wf-ending-session">
        {(!ending || target.kind !== 'kit' || target.tab !== 'next') && <Link className="wf-ending-note" to={kitLink('next')}>{t.workflow.noteNext}</Link>}
        <button className="wf-ending-stop" type="button" onClick={() => navigate('/')}>{t.workflow.stopToday}</button>
      </div>
      <button className="wf-ending-repeat" type="button" onClick={onRepeat}>{t.workflow.repeatGuide}</button>
      <p className="wf-done__meta u-mono">{saved ? t.workflow.progressSaved : t.workflow.sessionDone}</p>
    </section>
  </div>
}
