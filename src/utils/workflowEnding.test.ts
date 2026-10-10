import assert from 'node:assert/strict'
import test from 'node:test'
import { advanceWorkflow, workflowPosition, resolveEndingNext, workflowKitLink, kitWorkflowContext } from './workflowEnding.ts'
import { defaultStudio } from './kitStudio.ts'
import { normalizeState } from '../state/model.ts'
import { exportBackup, importBackup } from './backup.ts'
import type { Workflow } from '../data/types'

const steps = [{ id: 'record' }, { id: 'play' }, { id: 'print', optional: true }]
const progress = () => ({ activeWorkflowId: null, workflowStep: {}, doneSteps: {}, completedWorkflows: [] })
const source: Workflow = { id: 'loop', title: 'Loop', category: 'FLIP', difficulty: 'easy', steps: [], ending: { check: 'Listen', tryIt: 'Play', hintStepIds: [], next: { kind: 'workflow', id: 'variation', label: 'Make a variation' } } }
const target: Workflow = { id: 'variation', title: 'Variation', category: 'FLIP', difficulty: 'easy', steps: [] }
const catalog = { loop: source, variation: target, doom: { ...target, id: 'doom', environment: 'doom' as const } }

test('finishing includes the last confirmation without changing previous confirmations', () => {
  const done = ['record', 'play']
  const result = advanceWorkflow(steps, done, 2)
  assert.equal(result.finished, true); assert.equal(result.step, 3)
  assert.deepEqual(result.done, ['record', 'play', 'print']); assert.deepEqual(done, ['record', 'play'])
  assert.equal(result.confirmed, 2); assert.equal(result.required, 2)
})

test('skipping an optional print completes the guide without pretending the print happened', () => {
  const result = advanceWorkflow(steps, ['record', 'play'], 2, false)
  assert.equal(result.finished, true); assert.deepEqual(result.done, ['record', 'play'])
  assert.equal(workflowPosition(steps, result.done, result.step).finished, true)
  assert.equal(advanceWorkflow(steps, [], 0, false).step, 0)
})

test('a skipped required step returns before completion whether the final option was done or skipped', () => {
  for (const confirm of [true, false]) {
    const result = advanceWorkflow(steps, ['play'], 2, confirm)
    assert.equal(result.finished, false); assert.equal(result.step, 0)
    assert.equal(result.done.includes('record'), false)
  }
  assert.equal(workflowPosition(steps, ['record', 'print'], 99).step, 1)
  assert.equal(workflowPosition(steps, [], Number.NaN).step, 0)
})

test('ordinary guides still need every required step and confirmation counts ignore duplicates', () => {
  const required = steps.slice(0, 2)
  assert.equal(workflowPosition(required, ['record', 'record', 'unknown'], 2).finished, false)
  assert.equal(workflowPosition(required, ['record', 'record'], 1).confirmed, 1)
  assert.equal(advanceWorkflow(required, ['record'], 1).finished, true)
})

test('R8 and optional-print completions survive backup and normalization with the rest of the session', () => {
  for (const done of [['record', 'play'], ['record', 'play', 'print']]) {
    const state = normalizeState({ progress: { workflowStep: { bars: 3 }, doneSteps: { bars: done }, completedWorkflows: ['bars'] }, ui: { activeKitId: 'beat' }, kits: [{ id: 'beat', name: 'Beat', notes: { text: 'Keep my notes', project: '2' }, studio: { ...defaultStudio('doom'), nextStep: 'Keep the ending', variants: { a: { location: 'A1', changes: 'First' }, b: { location: 'A2', changes: 'Second' } } } }] })
    const restored = importBackup(exportBackup(state, 'en')).state
    assert.deepEqual(restored, state)
    assert.equal(workflowPosition(steps, restored.progress.doneSteps.bars, restored.progress.workflowStep.bars).finished, true)
    assert.equal(restored.kits[0].studio?.nextStep, 'Keep the ending')
  }
})

test('recommendations resume ongoing guides and send completed targets to next-step planning', () => {
  assert.equal(resolveEndingNext(source, catalog, progress(), []).target.kind, 'workflow')
  const ongoing = { ...progress(), activeWorkflowId: 'variation', workflowStep: { variation: 2 }, doneSteps: { variation: ['first'] } }
  const before = structuredClone(ongoing)
  assert.equal(resolveEndingNext(source, catalog, ongoing, []).resumeTitle, 'Variation')
  assert.deepEqual(ongoing, before)
  const completed = resolveEndingNext(source, catalog, { ...ongoing, completedWorkflows: ['variation'] }, [])
  assert.deepEqual(completed.target, { kind: 'kit', tab: 'next', label: '' }); assert.equal(completed.fallback, true)
})

test('unknown, self and opposite-firmware recommendations fall back safely', () => {
  for (const id of ['missing', 'loop', 'doom', '__proto__']) {
    const wf = { ...source, ending: { ...source.ending!, next: { kind: 'workflow' as const, id, label: 'Next' } } }
    assert.equal(resolveEndingNext(wf, catalog, progress(), []).fallback, true)
  }
  const section = { ...source, ending: { ...source.ending!, next: { kind: 'section' as const, id: 'edit', label: 'Edit' } } }
  assert.equal(resolveEndingNext(section, catalog, progress(), ['edit']).fallback, false)
  assert.equal(resolveEndingNext({ ...section, environment: 'doom' }, catalog, progress(), ['edit']).fallback, true)
  assert.equal(resolveEndingNext(section, catalog, progress(), []).fallback, true)
})

test('MY KIT links select only an unfinished active sketch of the current guide firmware', () => {
  const kit = { id: 'beat', name: 'Beat', items: [], studio: defaultStudio('roland') }
  const params = (kits: typeof kit[], active: string | null = 'beat') => new URL(workflowKitLink(source, 'ab', kits, active), 'https://app.test').searchParams
  assert.equal(params([kit]).get('set'), 'beat'); assert.equal(params([kit]).get('tab'), 'ab'); assert.equal(params([kit]).get('fromWorkflow'), 'loop')
  assert.equal(params([kit], 'gone').has('set'), false)
  assert.equal(params([{ ...kit, studio: { ...kit.studio, finished: true } }]).has('set'), false)
  assert.equal(params([{ ...kit, studio: defaultStudio('doom') }]).has('set'), false)
  assert.equal(new URL(workflowKitLink(source, 'next', [{ id: 'old', name: 'Old', items: [] }], 'old'), 'https://app.test').searchParams.has('set'), false)
})

test('set creation and selection carry only recognized tab and workflow context', () => {
  assert.deepEqual(kitWorkflowContext(new URLSearchParams('tab=song&fromWorkflow=loop&set=beat&other=1'), catalog), { tab: 'song', fromWorkflow: 'loop' })
  assert.deepEqual(kitWorkflowContext(new URLSearchParams('tab=bad&fromWorkflow=missing'), catalog), {})
  assert.deepEqual(kitWorkflowContext(new URLSearchParams('tab=ab&fromWorkflow=__proto__'), catalog), { tab: 'ab' })
  assert.deepEqual(kitWorkflowContext(new URLSearchParams('fromWorkflow=doom'), catalog), { fromWorkflow: 'doom' })
})
