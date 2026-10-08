import assert from 'node:assert/strict'
import test from 'node:test'
import { DEFAULTS, normalizeState } from './model.ts'
import { exportBackup, importBackup } from '../utils/backup.ts'

test('R3 data migrates without losing user favorites, progress, practice or settings', () => {
  const state = normalizeState({ favorites: { shortcuts: ['tr-rec', 'tr-rec'], workflows: ['phone-to-pad'] }, progress: { workflowStep: { 'phone-to-pad': 2 }, doneSteps: { 'phone-to-pad': ['input'] }, completedWorkflows: ['print'], activeWorkflowId: 'phone-to-pad' }, ui: { onboarded: true, recent: ['pattern'] }, settings: { haptics: false, reducedMotion: true }, practice: { input: { correct: 2, review: 1, needsReview: true } }, loopFit: { bpm: '120', bars: 2, actual: '4.002' } })
  assert.deepEqual(state.favorites.shortcuts, ['tr-rec']); assert.equal(state.progress.workflowStep['phone-to-pad'], 2)
  assert.deepEqual(state.progress.doneSteps['phone-to-pad'], ['input']); assert.equal(state.ui.onboarded, true)
  assert.equal(state.settings.haptics, false); assert.equal(state.settings.reducedMotion, true)
  assert.equal(state.settings.firmware, 'roland'); assert.equal(state.kits.length, 0)
  assert.equal(state.practice.input.correct, 2); assert.equal(state.loopFit.actual, '4.002'); assert.equal(state.groove.notes.length, 16)
})
test('malformed stored values cannot inject invalid sets or nonfinite groove parameters', () => {
  const state = normalizeState({ settings: { firmware: 'other', hardwareMode: 'yes' }, kits: [{ id: '../bad', name: 'bad' }, { id: 'valid', name: '  Live  ', items: [{ kind: 'unknown', id: 'x' }, { kind: 'shortcuts', id: 'tr-rec' }, { kind: 'shortcuts', id: 'tr-rec' }] }, { id: 'valid', name: 'duplicate' }], groove: { bpm: Infinity, selected: -1, notes: [{ velocity: 500, nudge: NaN, length: -1 }] } })
  assert.equal(state.settings.firmware, 'roland'); assert.equal(state.settings.hardwareMode, false)
  assert.deepEqual(state.kits, [{ id: 'valid', name: 'Live', items: [{ kind: 'shortcuts', id: 'tr-rec' }] }])
  assert.equal(state.groove.bpm, 90); assert.equal(state.groove.selected, 0); assert.deepEqual(state.groove.notes[0], DEFAULTS.groove.notes[0])
})
test('a backup round trip preserves ordered mixed-firmware sets and locale', () => {
  const state = normalizeState({ ...DEFAULTS, settings: { ...DEFAULTS.settings, firmware: 'doom' }, kits: [{ id: 'live', name: 'Session', items: [{ kind: 'shortcuts', id: 'doom-nudge' }, { kind: 'workflows', id: 'phone-to-pad' }] }] })
  const result = importBackup(exportBackup(state, 'en'))
  assert.deepEqual(result.state, state); assert.equal(result.locale, 'en'); assert.ok(Date.parse(result.createdAt))
})
test('restore rejects malformed, wrong-app, unsupported, incomplete and oversized files', () => {
  for (const raw of ['{', '{}', JSON.stringify({ app: 'Other', version: 1 }), JSON.stringify({ app: 'SP Workflow', version: 2, state: DEFAULTS }), JSON.stringify({ app: 'SP Workflow', version: 1, state: { settings: {} } }), ' '.repeat(2_000_001)]) assert.throws(() => importBackup(raw))
})
