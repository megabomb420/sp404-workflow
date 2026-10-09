import assert from 'node:assert/strict'
import test from 'node:test'
import { beatChallenges, beatReasons, pickBeatChallenge } from '../data/beatBlock.ts'
import { defaultBeatSession, normalizeBeatSession, reduceBeatSession, beatRemaining, beatClock, saveBeatSketch } from './beatBlock.ts'
import { DEFAULTS, normalizeState } from '../state/model.ts'
import { exportBackup, importBackup } from './backup.ts'
import { defaultStudio } from './kitStudio.ts'

const now = 1_800_000_000_000
function draft(idea = 'Keep the late kick') {
  let session = reduceBeatSession(defaultBeatSession(), { type: 'BEAT_CHOOSE', id: 'three-sounds', firmware: 'doom' })
  session = reduceBeatSession(session, { type: 'BEAT_START', now })
  session = reduceBeatSession(session, { type: 'BEAT_FINISH', now: now + 10_000 })
  return reduceBeatSession(session, { type: 'BEAT_DRAFT', field: 'idea', value: idea })
}
test('each stuck point offers three distinct prompts before revisiting the oldest one', () => {
  for (const reason of beatReasons) {
    let recent: string[] = [], current: string | undefined
    for (let i = 0; i < 3; i++) {
      const next = pickBeatChallenge(reason.id, recent, current, () => 0)
      assert.equal(next.reason, reason.id); assert.ok(!recent.includes(next.id))
      current = next.id; recent.unshift(next.id)
    }
    assert.equal(pickBeatChallenge(reason.id, recent, current, () => 0).id, recent[2])
  }
  assert.equal(beatChallenges.length, 12)
})
test('the timer is optional, survives reload and pause, and resumes the remaining time', () => {
  let session = reduceBeatSession(defaultBeatSession(), { type: 'BEAT_CHOOSE', id: 'three-sounds', firmware: 'roland' })
  assert.equal(session.timerEnabled, false)
  session = reduceBeatSession(session, { type: 'BEAT_TIMER', enabled: true, now })
  session = reduceBeatSession(session, { type: 'BEAT_START', now })
  const reloaded = normalizeBeatSession(JSON.parse(JSON.stringify(session)))
  assert.equal(beatRemaining(reloaded, now + 15_000), 465_000)
  session = reduceBeatSession(reloaded, { type: 'BEAT_PAUSE', now: now + 15_000 })
  assert.equal(beatRemaining(session, now + 100_000), 465_000)
  session = reduceBeatSession(session, { type: 'BEAT_RESUME', now: now + 100_000 })
  assert.equal(beatRemaining(session, now + 110_000), 455_000)
  assert.equal(beatClock(455_000), '7:35')
  assert.equal(beatRemaining(session, now + 1_000_000), 0)
  assert.equal(session.phase, 'active')
})
test('turning the timer off keeps its remaining time and finishing pauses it', () => {
  let session = reduceBeatSession(defaultBeatSession(), { type: 'BEAT_CHOOSE', id: 'one-note', firmware: 'doom' })
  session = reduceBeatSession(session, { type: 'BEAT_TIMER', enabled: true, now })
  session = reduceBeatSession(session, { type: 'BEAT_START', now })
  session = reduceBeatSession(session, { type: 'BEAT_TIMER', enabled: false, now: now + 6000 })
  assert.equal(beatRemaining(session, now + 60_000), 354_000)
  session = reduceBeatSession(session, { type: 'BEAT_FINISH', now: now + 60_000 })
  assert.equal(session.phase, 'finish'); assert.equal(session.runningSince, null)
})
test('saving a sketch is atomic and idempotent and keeps the correct firmware guide', () => {
  const session = draft(), input = { newKitId: 'sketch-1', name: 'My phrase', note: 'Keep the late kick' }
  const saved = saveBeatSketch(session, [], input)!
  assert.equal(saved.kits.length, 1); assert.equal(saved.kits[0].notes?.text, input.note)
  assert.equal(saved.kits[0].items[0].id, 'doom-first-pattern')
  assert.equal(saved.session.phase, 'saved'); assert.equal(saved.session.savedKitId, 'sketch-1')
  assert.equal(saveBeatSketch(saved.session, saved.kits, input), null)
})
test('appending notes preserves earlier text and metadata, refuses overflow and a vanished target', () => {
  const old = { id: 'existing', name: 'Live', items: [], notes: { project: '03', bankPad: 'A1', bpm: '90', text: 'Original notes' } }
  const session = reduceBeatSession(draft(), { type: 'BEAT_DRAFT', field: 'targetKitId', value: old.id })
  const saved = saveBeatSketch(session, [old], { newKitId: 'ignored', name: 'Ignored', note: 'New idea' })!
  assert.equal(saved.kits.length, 1); assert.equal(saved.kits[0].name, 'Live')
  assert.deepEqual(saved.kits[0].notes, { project: '03', bankPad: 'A1', bpm: '90', text: 'Original notes\n\nNew idea' })
  assert.equal(saveBeatSketch(session, [], { newKitId: 'x', name: 'x', note: 'New idea' }), null)
  assert.equal(saveBeatSketch(session, [{ ...old, notes: { ...old.notes, text: 'a'.repeat(1999) } }], { newKitId: 'x', name: 'x', note: 'New idea' }), null)
  assert.equal(old.notes.text, 'Original notes')
})
test('R5 migration and backup preserve drafts; removed saved kits leave a recoverable draft', () => {
  const migrated = normalizeState({ ui: { onboarded: true }, favorites: { shortcuts: ['tr-rec'] } })
  assert.deepEqual(migrated.beatBlock, defaultBeatSession()); assert.deepEqual(migrated.favorites.shortcuts, ['tr-rec'])
  const state = normalizeState({ ...DEFAULTS, beatBlock: draft() })
  assert.deepEqual(importBackup(exportBackup(state, 'en')).state.beatBlock, state.beatBlock)
  const orphan = normalizeState({ ...state, beatBlock: { ...state.beatBlock, phase: 'saved', savedKitId: 'missing' } })
  assert.equal(orphan.beatBlock.phase, 'finish'); assert.equal(orphan.beatBlock.draft.idea, 'Keep the late kick')
  const invalid = normalizeBeatSession({ challengeId: 'not-real', phase: 'active', remainingMs: Infinity, runningSince: -1, recent: ['fake', 'three-sounds', 'three-sounds'] })
  assert.equal(invalid.phase, 'choose'); assert.equal(invalid.runningSince, null); assert.deepEqual(invalid.recent, ['three-sounds'])
})
test('saving another BEAT BLOCK idea preserves the song map and A/B comparison', () => {
  const studio = { ...defaultStudio('roland'), nextStep: 'Old next step', finished: true, song: [{ id: 'intro', role: 'intro' as const, pattern: 'A1', bars: 8, note: 'Keep intro' }], winner: 'a' as const, decision: 'Keep the swing' }
  const old = { id: 'existing', name: 'Song', items: [], studio }
  const session = reduceBeatSession(draft(), { type: 'BEAT_DRAFT', field: 'targetKitId', value: old.id })
  const saved = saveBeatSketch(session, [old], { newKitId: 'unused', name: 'unused', note: 'New session' })!
  assert.deepEqual(saved.kits[0].studio?.song, studio.song); assert.equal(saved.kits[0].studio?.winner, 'a'); assert.equal(saved.kits[0].studio?.decision, studio.decision)
  assert.equal(saved.kits[0].studio?.nextStep, 'Keep the late kick'); assert.equal(saved.kits[0].studio?.finished, false); assert.equal(saved.kits[0].studio?.firmware, 'doom')
})
test('BEAT BLOCK step survives reload and cannot leave the prompt bounds', () => {
  let session = reduceBeatSession(defaultBeatSession(), { type: 'BEAT_CHOOSE', id: 'three-sounds', firmware: 'roland' })
  session = reduceBeatSession(session, { type: 'BEAT_START', now })
  session = reduceBeatSession(session, { type: 'BEAT_STEP', step: 1 })
  assert.equal(normalizeBeatSession(session).step, 1)
  assert.equal(reduceBeatSession(session, { type: 'BEAT_STEP', step: 99 }).step, 2)
  assert.equal(reduceBeatSession(session, { type: 'BEAT_STEP', step: -2 }).step, 0)
})
test('the last R6 saved sketch gains a resume card without replacing old notes', () => {
  const migrated = normalizeState({ ui: { onboarded: true }, beatBlock: { ...draft(), phase: 'saved', savedKitId: 'r6' }, kits: [{ id: 'r6', name: 'R6 sketch', items: [], notes: { project: '03', bankPad: 'B4', bpm: '92', text: 'Original' } }] })
  assert.equal(migrated.ui.activeKitId, 'r6'); assert.equal(migrated.kits[0].studio?.nextStep, 'Keep the late kick'); assert.equal(migrated.kits[0].notes?.text, 'Original')
  const explicitlyUnpinned = normalizeState({ ...migrated, ui: { ...migrated.ui, activeKitId: null } })
  assert.equal(explicitlyUnpinned.ui.activeKitId, null)
})
