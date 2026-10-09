import assert from 'node:assert/strict'
import test from 'node:test'
import { assessPractice, practiceDue, queuePractice } from './practice.ts'
import { normalizeState, DEFAULTS } from '../state/model.ts'
import { exportBackup, importBackup } from './backup.ts'

test('successful practice advances intervals and caps at 30 days', () => {
  let stat, now = 1_800_000_000_000
  for (const days of [1, 3, 7, 14, 30, 30]) {
    stat = assessPractice(stat, true, now)
    assert.equal(stat.dueAt, now + days * 86_400_000)
    assert.equal(practiceDue(stat, stat.dueAt! - 1), false)
    assert.equal(practiceDue(stat, stat.dueAt!), true)
    now = stat.dueAt!
  }
  assert.equal(stat!.correct, 6)
})
test('a missed answer waits ten minutes and resets the success streak', () => {
  const now = 1_800_000_000_000
  const stat = assessPractice(assessPractice(undefined, true, now), false, now + 5000)
  assert.equal(stat.streak, 0); assert.equal(stat.review, 1)
  assert.equal(practiceDue(stat, now + 5000), false)
  assert.equal(practiceDue(stat, now + 605000), true)
  assert.equal(assessPractice(stat, true, now + 605000).dueAt, now + 605000 + 86_400_000)
})
test('legacy failures are due now, while a queued workflow action keeps past scores', () => {
  const old = normalizeState({ practice: { old: { correct: 2, review: 1, needsReview: true }, passed: { correct: 3, needsReview: false } } }).practice
  assert.ok(practiceDue(old.old, 1)); assert.equal(practiceDue(old.passed, 1), false)
  const queued = queuePractice(old.old, 10)
  assert.equal(queued.correct, 2); assert.equal(queued.review, 1); assert.ok(practiceDue(queued, 10))
})
test('backup preserves session notes and review dates; invalid timestamps are normalised', () => {
  const stat = assessPractice(undefined, true, 1_800_000_000_000)
  const state = normalizeState({ ...DEFAULTS, kits: [{ id: 'session', name: 'Live', items: [], notes: { project: '03', bankPad: 'A1 / B4', bpm: '92', text: 'Chorus then resample' } }], practice: { 'doom-open': stat, bad: { dueAt: Number.MAX_SAFE_INTEGER, lastPracticedAt: -4 } } })
  const restored = importBackup(exportBackup(state, 'en')).state
  assert.deepEqual(restored.kits, state.kits); assert.deepEqual(restored.practice['doom-open'], stat)
  assert.equal(restored.practice.bad.dueAt, null); assert.equal(restored.practice.bad.lastPracticedAt, null)
})
