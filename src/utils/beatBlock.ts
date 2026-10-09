import { beatChallenges, beatReasons, type BeatReason } from '../data/beatBlock.ts'
import type { Firmware, KitSet } from '../state/model'
import { defaultStudio } from './kitStudio.ts'

export interface BeatDraft { name: string; project: string; bankPad: string; bpm: string; idea: string; targetKitId: string }
export interface BeatSession {
  reason: BeatReason | null; challengeId: string | null; firmware: Firmware
  phase: 'choose' | 'ready' | 'active' | 'finish' | 'saved'
  step: number
  timerEnabled: boolean; remainingMs: number; runningSince: number | null
  recent: string[]; draft: BeatDraft; savedKitId: string | null
}
const emptyDraft = (): BeatDraft => ({ name: '', project: '', bankPad: '', bpm: '', idea: '', targetKitId: '' })
export const defaultBeatSession = (): BeatSession => ({ reason: null, challengeId: null, firmware: 'roland', phase: 'choose', step: 0, timerEnabled: false, remainingMs: 0, runningSince: null, recent: [], draft: emptyDraft(), savedKitId: null })
const record = (v: unknown): Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : {}
const text = (v: unknown, max: number) => typeof v === 'string' ? v.slice(0, max) : ''
const validTime = (v: unknown): v is number => typeof v === 'number' && Number.isSafeInteger(v) && v >= 0 && v <= 8_640_000_000_000_000
export function normalizeBeatSession(value: unknown): BeatSession {
  const raw = record(value), base = defaultBeatSession(), challenge = beatChallenges.find(item => item.id === raw.challengeId)
  const recent = Array.isArray(raw.recent) ? [...new Set(raw.recent.filter((id): id is string => typeof id === 'string' && beatChallenges.some(item => item.id === id)))].slice(0, 12) : []
  const reason = beatReasons.find(item => item.id === raw.reason)?.id ?? null
  if (!challenge) return { ...base, reason, timerEnabled: raw.timerEnabled === true, recent }
  const phase = ['ready', 'active', 'finish', 'saved'].includes(String(raw.phase)) ? raw.phase as BeatSession['phase'] : 'ready'
  const remainingMs = validTime(raw.remainingMs) ? Math.min(raw.remainingMs, challenge.minutes * 60_000) : challenge.minutes * 60_000
  const draft = record(raw.draft)
  return {
    reason: challenge.reason, challengeId: challenge.id, firmware: raw.firmware === 'doom' ? 'doom' : 'roland', phase,
    step: typeof raw.step === 'number' && Number.isInteger(raw.step) ? Math.max(0, Math.min(raw.step, challenge.steps.length - 1)) : 0,
    timerEnabled: raw.timerEnabled === true, remainingMs,
    runningSince: phase === 'active' && raw.timerEnabled === true && remainingMs > 0 && validTime(raw.runningSince) ? raw.runningSince : null,
    recent, savedKitId: typeof raw.savedKitId === 'string' && /^[a-zA-Z0-9-]{1,100}$/.test(raw.savedKitId) ? raw.savedKitId : null,
    draft: { name: text(draft.name, 60), project: text(draft.project, 100), bankPad: text(draft.bankPad, 100), bpm: text(draft.bpm, 20), idea: text(draft.idea, 1000), targetKitId: text(draft.targetKitId, 100) },
  }
}
export function beatRemaining(session: BeatSession, now: number): number {
  return Math.max(0, session.remainingMs - (session.runningSince === null ? 0 : Math.max(0, now - session.runningSince)))
}
export function beatClock(ms: number): string {
  const seconds = Math.ceil(Math.max(0, ms) / 1000)
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}
export type BeatAction =
  | { type: 'BEAT_CHOOSE'; id: string; firmware: Firmware }
  | { type: 'BEAT_STEP'; step: number }
  | { type: 'BEAT_TIMER'; enabled: boolean; now: number }
  | { type: 'BEAT_START' | 'BEAT_PAUSE' | 'BEAT_RESUME' | 'BEAT_FINISH'; now: number }
  | { type: 'BEAT_BACK' | 'BEAT_RESET' }
  | { type: 'BEAT_DRAFT'; field: keyof BeatDraft; value: string }

export function reduceBeatSession(session: BeatSession, action: BeatAction): BeatSession {
  switch (action.type) {
    case 'BEAT_STEP': { const challenge = beatChallenges.find(c => c.id === session.challengeId); return session.phase === 'active' && challenge && Number.isInteger(action.step) ? { ...session, step: Math.max(0, Math.min(action.step, challenge.steps.length - 1)) } : session }
    case 'BEAT_CHOOSE': {
      const challenge = beatChallenges.find(item => item.id === action.id)
      if (!challenge) return session
      return { ...defaultBeatSession(), challengeId: challenge.id, reason: challenge.reason, firmware: action.firmware, phase: 'ready', timerEnabled: session.timerEnabled, remainingMs: challenge.minutes * 60_000, recent: [challenge.id, ...session.recent.filter(id => id !== challenge.id)].slice(0, 12) }
    }
    case 'BEAT_TIMER': return { ...session, timerEnabled: action.enabled, remainingMs: beatRemaining(session, action.now), runningSince: null }
    case 'BEAT_START': return session.phase !== 'ready' ? session : { ...session, phase: 'active', runningSince: session.timerEnabled ? action.now : null }
    case 'BEAT_PAUSE': return { ...session, remainingMs: beatRemaining(session, action.now), runningSince: null }
    case 'BEAT_RESUME': return session.phase !== 'active' || !session.timerEnabled || session.runningSince !== null || session.remainingMs <= 0 ? session : { ...session, runningSince: action.now }
    case 'BEAT_FINISH': return session.phase !== 'active' ? session : { ...session, phase: 'finish', remainingMs: beatRemaining(session, action.now), runningSince: null }
    case 'BEAT_BACK': return session.phase === 'finish' ? { ...session, phase: 'active' } : session
    case 'BEAT_DRAFT': return session.phase === 'finish' ? { ...session, draft: { ...session.draft, [action.field]: action.value.slice(0, action.field === 'idea' ? 1000 : action.field === 'name' ? 60 : action.field === 'bpm' ? 20 : 100) } } : session
    case 'BEAT_RESET': return { ...defaultBeatSession(), timerEnabled: session.timerEnabled, recent: session.recent }
  }
}

// Save notes and their linked guide together; the saved phase also prevents double submission.
export function saveBeatSketch(session: BeatSession, kits: KitSet[], input: { newKitId: string; name: string; note: string }): { session: BeatSession; kits: KitSet[] } | null {
  const challenge = beatChallenges.find(item => item.id === session.challengeId)
  if (session.phase !== 'finish' || !challenge || !session.draft.idea.trim() || !input.note.trim() || input.note.length > 2000) return null
  const existing = session.draft.targetKitId ? kits.find(kit => kit.id === session.draft.targetKitId) : undefined
  if (session.draft.targetKitId && !existing) return null
  if (!existing && (kits.length >= 30 || !input.name.trim() || !/^[a-zA-Z0-9-]{1,100}$/.test(input.newKitId) || kits.some(kit => kit.id === input.newKitId))) return null
  const note = [existing?.notes?.text, input.note].filter(Boolean).join('\n\n')
  if (note.length > 2000) return null
  const item = challenge.kitItem[session.firmware]
  const kit: KitSet = {
    ...existing,
    id: existing?.id ?? input.newKitId, name: existing?.name ?? input.name.trim().slice(0, 60),
    items: existing?.items.some(entry => entry.kind === item.kind && entry.id === item.id) ? existing.items : [...(existing?.items ?? []), item].slice(0, 200),
    notes: { project: session.draft.project.trim() || existing?.notes?.project || '', bankPad: session.draft.bankPad.trim() || existing?.notes?.bankPad || '', bpm: session.draft.bpm.trim() || existing?.notes?.bpm || '', text: note },
    studio: { ...(existing?.studio ?? defaultStudio(session.firmware)), firmware: session.firmware, nextStep: session.draft.idea.trim(), finished: false },
  }
  return { session: { ...session, phase: 'saved', savedKitId: kit.id }, kits: existing ? kits.map(entry => entry.id === existing.id ? kit : entry) : [...kits, kit] }
}
