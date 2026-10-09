import type { PracticeStat } from '../utils/practice'
import { defaultBeatSession, normalizeBeatSession, type BeatSession } from '../utils/beatBlock.ts'

export type Firmware = 'roland' | 'doom'
export interface Settings {
  reducedMotion: boolean
  uiSound: boolean
  haptics: boolean
  firmware: Firmware
  hardwareMode: boolean
  keepScreenAwake: boolean
}
export type BooleanSetting = Exclude<keyof Settings, 'firmware'>
export interface Favorites { shortcuts: string[]; workflows: string[]; troubleshooting: string[] }
export interface KitItem { kind: keyof Favorites; id: string }
export interface KitNotes { project: string; bankPad: string; bpm: string; text: string }
export interface KitSet { id: string; name: string; items: KitItem[]; notes?: KitNotes }
export interface Progress {
  completedWorkflows: string[]
  workflowStep: Record<string, number>
  doneSteps: Record<string, string[]>
  activeWorkflowId: string | null
}
export interface UIState { lastSection: string | null; recent: string[]; recentSearches: string[]; onboarded: boolean }
export interface GrooveNote { on: boolean; velocity: number; nudge: number; length: number }
export interface GrooveState { bpm: number; selected: number; scope: 'note' | 'track'; notes: GrooveNote[] }
export interface AppState {
  settings: Settings
  favorites: Favorites
  progress: Progress
  ui: UIState
  practice: Record<string, PracticeStat>
  loopFit: { bpm: string; bars: number; actual: string }
  kits: KitSet[]
  groove: GrooveState
  beatBlock: BeatSession
}
export const DEFAULTS: AppState = {
  settings: { reducedMotion: false, uiSound: false, haptics: true, firmware: 'roland', hardwareMode: false, keepScreenAwake: false },
  favorites: { shortcuts: [], workflows: [], troubleshooting: [] },
  progress: { completedWorkflows: [], workflowStep: {}, doneSteps: {}, activeWorkflowId: null },
  ui: { lastSection: null, recent: [], recentSearches: [], onboarded: false },
  practice: {}, loopFit: { bpm: '90', bars: 4, actual: '' }, kits: [],
  beatBlock: defaultBeatSession(),
  groove: { bpm: 90, selected: 0, scope: 'note', notes: Array.from({ length: 16 }, (_, i) => ({ on: i % 2 === 0, velocity: i % 4 === 0 ? 110 : 72, nudge: 0, length: .5 })) },
}
export const record = (value: unknown): Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
const strings = (value: unknown): string[] => Array.isArray(value) ? [...new Set(value.filter((v): v is string => typeof v === 'string' && v.length <= 200))].slice(0, 1000) : []
const count = (value: unknown) => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : 0
const timestamp = (value: unknown): number | null => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 && value <= 8_640_000_000_000_000 ? value : null
const text = (value: unknown): string | null => typeof value === 'string' && value.length <= 200 ? value : null
const number = (value: unknown, min: number, max: number, fallback: number) => typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max ? value : fallback
export function normalizeState(value: unknown): AppState {
  const parsed = record(value), settings = record(parsed.settings), favorites = record(parsed.favorites)
  const progress = record(parsed.progress), ui = record(parsed.ui), loop = record(parsed.loopFit), groove = record(parsed.groove)
  const kits: KitSet[] = []
  for (const raw of (Array.isArray(parsed.kits) ? parsed.kits : []).slice(0, 30)) {
    const set = record(raw)
    if (typeof set.id !== 'string' || !/^[a-zA-Z0-9-]{1,100}$/.test(set.id) || typeof set.name !== 'string' || !set.name.trim() || kits.some((k) => k.id === set.id)) continue
    const items: KitItem[] = []
    for (const item of (Array.isArray(set.items) ? set.items : []).slice(0, 200)) {
      const entry = record(item)
      if (['shortcuts', 'workflows', 'troubleshooting'].includes(String(entry.kind)) && text(entry.id) && !items.some((i) => i.kind === entry.kind && i.id === entry.id)) items.push({ kind: entry.kind as keyof Favorites, id: entry.id as string })
    }
    const notes = record(set.notes)
    const noteText = (key: string, max: number) => typeof notes[key] === 'string' ? (notes[key] as string).slice(0, max) : ''
    kits.push({ id: set.id, name: set.name.trim().slice(0, 60), items, ...(set.notes ? { notes: { project: noteText('project', 100), bankPad: noteText('bankPad', 100), bpm: noteText('bpm', 20), text: noteText('text', 2000) } } : {}) })
  }
  const bool = (key: BooleanSetting) => typeof settings[key] === 'boolean' ? settings[key] as boolean : DEFAULTS.settings[key]
  const beatBlock = normalizeBeatSession(parsed.beatBlock)
  if (beatBlock.phase === 'saved' && !kits.some(kit => kit.id === beatBlock.savedKitId)) { beatBlock.phase = 'finish'; beatBlock.savedKitId = null }
  return {
    settings: { reducedMotion: bool('reducedMotion'), uiSound: bool('uiSound'), haptics: bool('haptics'), hardwareMode: bool('hardwareMode'), keepScreenAwake: bool('keepScreenAwake'), firmware: settings.firmware === 'doom' ? 'doom' : 'roland' },
    favorites: { shortcuts: strings(favorites.shortcuts), workflows: strings(favorites.workflows), troubleshooting: strings(favorites.troubleshooting) },
    progress: { completedWorkflows: strings(progress.completedWorkflows), workflowStep: Object.fromEntries(Object.entries(record(progress.workflowStep)).map(([id, v]) => [id, count(v)])), doneSteps: Object.fromEntries(Object.entries(record(progress.doneSteps)).map(([id, v]) => [id, strings(v)])), activeWorkflowId: text(progress.activeWorkflowId) },
    ui: { lastSection: text(ui.lastSection), recent: strings(ui.recent).slice(0, 4), recentSearches: strings(ui.recentSearches).slice(0, 8), onboarded: ui.onboarded === true },
    practice: Object.fromEntries(Object.entries(record(parsed.practice)).map(([id, v]) => { const stat = record(v); return [id, { correct: count(stat.correct), review: count(stat.review), needsReview: stat.needsReview === true, streak: count(stat.streak), lastPracticedAt: timestamp(stat.lastPracticedAt), dueAt: timestamp(stat.dueAt) }] })),
    loopFit: { bpm: typeof loop.bpm === 'string' ? loop.bpm.slice(0, 100) : '90', bars: typeof loop.bars === 'number' && [.5, 1, 2, 4, 8, 16].includes(loop.bars) ? loop.bars : 4, actual: typeof loop.actual === 'string' ? loop.actual.slice(0, 100) : '' },
    kits,
    beatBlock,
    groove: { bpm: number(groove.bpm, 40, 200, 90), selected: Math.floor(number(groove.selected, 0, 15, 0)), scope: groove.scope === 'track' ? 'track' : 'note', notes: Array.from({ length: 16 }, (_, i) => {
      const note = record(Array.isArray(groove.notes) ? groove.notes[i] : undefined), fallback = DEFAULTS.groove.notes[i]
      return { on: typeof note.on === 'boolean' ? note.on : fallback.on, velocity: Math.round(number(note.velocity, 1, 127, fallback.velocity)), length: number(note.length, .125, 16, fallback.length), nudge: number(note.nudge, -.45, .45, 0) }
    }) },
  }
}
