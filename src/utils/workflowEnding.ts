import type { Workflow, WorkflowEntry, WorkflowEnding } from '../data/types'
import type { KitSet, Progress } from '../state/model'

type Step = Pick<WorkflowEntry, 'id' | 'optional'>
type Catalog = Record<string, Pick<Workflow, 'id' | 'title' | 'environment'>>
export type KitTab = 'next' | 'song' | 'ab'

/** The cursor still includes optional steps; only required confirmations gate the end. */
export function workflowPosition(steps: readonly Step[], done: readonly string[], cursor: number) {
  const total = steps.length
  const required = steps.filter(step => !step.optional)
  const missing = steps.findIndex(step => !step.optional && !done.includes(step.id))
  const bounded = Number.isFinite(cursor) ? Math.max(0, Math.min(Math.trunc(cursor), total)) : 0
  const step = bounded >= total && missing >= 0 ? missing : bounded
  return { step, finished: step >= total && missing < 0, required: required.length, confirmed: required.filter(item => done.includes(item.id)).length }
}

export function advanceWorkflow(steps: readonly Step[], done: readonly string[], cursor: number, confirm = true) {
  const current = workflowPosition(steps, done, cursor).step
  const item = steps[current]
  if (!item || (!confirm && !item.optional)) return { ...workflowPosition(steps, done, current), done: [...done] }
  const nextDone = confirm && !done.includes(item.id) ? [...done, item.id] : [...done]
  return { ...workflowPosition(steps, nextDone, current + 1), done: nextDone }
}

const catalogEntry = (catalog: Catalog, id: string) => Object.hasOwn(catalog, id) ? catalog[id] : undefined

export function resolveEndingNext(workflow: Workflow, catalog: Catalog, progress: Progress, sectionIds: readonly string[]) {
  const fallback = (): { target: WorkflowEnding['next']; resumeTitle?: string; fallback: boolean } => ({ target: { kind: 'kit', tab: 'next', label: '' }, fallback: true })
  const next = workflow.ending?.next
  if (!next) return fallback()
  if (next.kind === 'kit') return ['next', 'song', 'ab'].includes(next.tab) ? { target: next, fallback: false } : fallback()
  if (next.kind === 'section') return sectionIds.includes(next.id) && !workflow.environment ? { target: next, fallback: false } : fallback()
  const target = catalogEntry(catalog, next.id)
  if (!target || target.id === workflow.id || (target.environment ?? 'roland') !== (workflow.environment ?? 'roland') || progress.completedWorkflows.includes(target.id)) return fallback()
  const started = progress.activeWorkflowId === target.id || Object.hasOwn(progress.workflowStep, target.id) || !!progress.doneSteps[target.id]?.length
  return { target: next, fallback: false, ...(started ? { resumeTitle: target.title } : {}) }
}

export function workflowKitLink(workflow: Pick<Workflow, 'id' | 'environment'>, tab: KitTab, kits: readonly KitSet[], activeKitId: string | null) {
  const params = new URLSearchParams({ tab, fromWorkflow: workflow.id })
  const active = kits.find(kit => kit.id === activeKitId)
  if (active?.studio && !active.studio.finished && active.studio.firmware === (workflow.environment ?? 'roland')) params.set('set', active.id)
  return `/kit?${params.toString()}`
}

/** Carry only recognized navigation context through the existing set picker. */
export function kitWorkflowContext(params: URLSearchParams, catalog: Catalog): Record<string, string> {
  const context: Record<string, string> = {}
  const tab = params.get('tab')
  if (tab === 'next' || tab === 'song' || tab === 'ab') context.tab = tab
  const from = params.get('fromWorkflow')
  if (from && catalogEntry(catalog, from)) context.fromWorkflow = from
  return context
}
