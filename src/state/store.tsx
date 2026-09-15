import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { setHapticsEnabled } from '../utils/haptics'

/* ============================ STATE SHAPE ============================ */

export interface Settings {
  reducedMotion: boolean
  uiSound: boolean // zawsze domyślnie OFF
  haptics: boolean
}

export interface Favorites {
  shortcuts: string[]
  workflows: string[]
  troubleshooting: string[]
}

export interface Progress {
  completedWorkflows: string[]
  /** workflowId -> bieżący krok (0-based) */
  workflowStep: Record<string, number>
  /** workflowId -> id ukończonych kroków */
  doneSteps: Record<string, string[]>
  /** Ostatnia uruchomiona, nieukończona sesja — zasila CONTINUE na ekranie NOW. */
  activeWorkflowId: string | null
}

export interface UIState {
  lastSection: string | null
  /** historia ostatnio odwiedzonych sekcji (id, max 4) */
  recent: string[]
  recentSearches: string[]
  onboarded: boolean
}

export interface AppState {
  settings: Settings
  favorites: Favorites
  progress: Progress
  ui: UIState
  practice: Record<string, { correct: number; review: number; needsReview: boolean }>
  loopFit: { bpm: string; bars: number; actual: string }
}

const DEFAULTS: AppState = {
  settings: { reducedMotion: false, uiSound: false, haptics: true },
  favorites: { shortcuts: [], workflows: [], troubleshooting: [] },
  progress: { completedWorkflows: [], workflowStep: {}, doneSteps: {}, activeWorkflowId: null },
  ui: { lastSection: null, recent: [], recentSearches: [], onboarded: false },
  practice: {},
  loopFit: { bpm: '90', bars: 4, actual: '' },
}

const STORAGE_KEY = 'spw.state.v1'

const record = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
const strings = (value: unknown): string[] => Array.isArray(value) ? [...new Set(value.filter((v): v is string => typeof v === 'string'))] : []
const count = (value: unknown): number => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : 0
const nullableString = (value: unknown): string | null => typeof value === 'string' ? value : null

function loadState(): AppState {
  try {
    if (typeof localStorage === 'undefined') return DEFAULTS
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    const parsed = record(JSON.parse(raw))
    const settings = record(parsed.settings)
    const favorites = record(parsed.favorites)
    const progress = record(parsed.progress)
    const ui = record(parsed.ui)
    const loopFit = record(parsed.loopFit)
    return {
      settings: Object.fromEntries(Object.entries(DEFAULTS.settings).map(([key, fallback]) => [key, typeof settings[key] === 'boolean' ? settings[key] : fallback])) as unknown as Settings,
      favorites: { shortcuts: strings(favorites.shortcuts), workflows: strings(favorites.workflows), troubleshooting: strings(favorites.troubleshooting) },
      progress: {
        completedWorkflows: strings(progress.completedWorkflows),
        workflowStep: Object.fromEntries(Object.entries(record(progress.workflowStep)).map(([id, value]) => [id, count(value)])),
        doneSteps: Object.fromEntries(Object.entries(record(progress.doneSteps)).map(([id, value]) => [id, strings(value)])),
        activeWorkflowId: nullableString(progress.activeWorkflowId),
      },
      ui: { lastSection: nullableString(ui.lastSection), recent: strings(ui.recent).slice(0, 4), recentSearches: strings(ui.recentSearches).slice(0, 8), onboarded: ui.onboarded === true },
      practice: Object.fromEntries(Object.entries(record(parsed.practice)).map(([id, value]) => {
        const stat = record(value)
        return [id, { correct: count(stat.correct), review: count(stat.review), needsReview: stat.needsReview === true }]
      })),
      loopFit: {
        bpm: typeof loopFit.bpm === 'string' ? loopFit.bpm : '90',
        bars: typeof loopFit.bars === 'number' && [0.5, 1, 2, 4, 8, 16].includes(loopFit.bars) ? loopFit.bars : 4,
        actual: typeof loopFit.actual === 'string' ? loopFit.actual : '',
      },
    }
  } catch {
    return DEFAULTS
  }
}

/* ============================ ACTIONS ============================ */

export type Action =
  | { type: 'TOGGLE_FAV'; kind: keyof Favorites; id: string }
  | { type: 'SET_ONBOARDED'; value: boolean }
  | { type: 'SET_LAST_SECTION'; id: string }
  | { type: 'PUSH_RECENT'; id: string }
  | { type: 'ADD_RECENT_SEARCH'; q: string }
  | { type: 'SET_WORKFLOW_STEP'; workflowId: string; step: number }
  | { type: 'SET_ACTIVE_WORKFLOW'; workflowId: string }
  | { type: 'TOGGLE_STEP_DONE'; workflowId: string; stepId: string }
  | { type: 'COMPLETE_WORKFLOW'; workflowId: string }
  | { type: 'RESET_WORKFLOW'; workflowId: string }
  | { type: 'RESET_PROGRESS' }
  | { type: 'RESET_FAVORITES' }
  | { type: 'RESET_ALL' }
  | { type: 'SET_SETTING'; key: keyof Settings; value: boolean }
  | { type: 'PRACTICE_RESULT'; id: string; correct: boolean }
  | { type: 'QUEUE_PRACTICE'; id: string }
  | { type: 'SET_LOOP_FIT'; value: Partial<AppState['loopFit']> }

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_LOOP_FIT':
      return { ...state, loopFit: { ...state.loopFit, ...action.value } }
    case 'QUEUE_PRACTICE':
    case 'PRACTICE_RESULT': {
      const previous = state.practice[action.id] ?? { correct: 0, review: 0, needsReview: false }
      const assessed = action.type === 'PRACTICE_RESULT'
      const correct = assessed && action.correct
      return { ...state, practice: { ...state.practice, [action.id]: {
        correct: previous.correct + (correct ? 1 : 0),
        review: previous.review + (assessed && !correct ? 1 : 0),
        needsReview: !correct,
      } } }
    }
    case 'TOGGLE_FAV': {
      const list = toggle(state.favorites[action.kind], action.id)
      return { ...state, favorites: { ...state.favorites, [action.kind]: list } }
    }
    case 'SET_ONBOARDED':
      return { ...state, ui: { ...state.ui, onboarded: action.value } }
    case 'SET_LAST_SECTION':
      return { ...state, ui: { ...state.ui, lastSection: action.id } }
    case 'PUSH_RECENT': {
      const recent = [action.id, ...state.ui.recent.filter((x) => x !== action.id)].slice(0, 4)
      return { ...state, ui: { ...state.ui, recent } }
    }
    case 'ADD_RECENT_SEARCH': {
      const q = action.q.trim()
      if (!q) return state
      const recentSearches = [q, ...state.ui.recentSearches.filter((x) => x !== q)].slice(0, 8)
      return { ...state, ui: { ...state.ui, recentSearches } }
    }
    case 'SET_WORKFLOW_STEP':
      return {
        ...state,
        progress: {
          ...state.progress,
          workflowStep: { ...state.progress.workflowStep, [action.workflowId]: action.step },
          activeWorkflowId: action.workflowId,
        },
      }
    case 'SET_ACTIVE_WORKFLOW':
      return { ...state, progress: { ...state.progress, activeWorkflowId: action.workflowId } }
    case 'TOGGLE_STEP_DONE': {
      const current = state.progress.doneSteps[action.workflowId] ?? []
      const doneSteps = {
        ...state.progress.doneSteps,
        [action.workflowId]: current.includes(action.stepId)
          ? current.filter((s) => s !== action.stepId)
          : [...current, action.stepId],
      }
      return { ...state, progress: { ...state.progress, doneSteps } }
    }
    case 'COMPLETE_WORKFLOW': {
      const completedWorkflows = state.progress.completedWorkflows.includes(action.workflowId)
        ? state.progress.completedWorkflows
        : [...state.progress.completedWorkflows, action.workflowId]
      return {
        ...state,
        progress: {
          ...state.progress,
          completedWorkflows,
          activeWorkflowId: state.progress.activeWorkflowId === action.workflowId ? null : state.progress.activeWorkflowId,
        },
      }
    }
    case 'RESET_WORKFLOW': {
      const workflowStep = { ...state.progress.workflowStep }
      delete workflowStep[action.workflowId]
      const doneSteps = { ...state.progress.doneSteps }
      delete doneSteps[action.workflowId]
      return {
        ...state,
        progress: {
          ...state.progress,
          workflowStep,
          doneSteps,
          completedWorkflows: state.progress.completedWorkflows.filter((w) => w !== action.workflowId),
          activeWorkflowId: state.progress.activeWorkflowId === action.workflowId ? null : state.progress.activeWorkflowId,
        },
      }
    }
    case 'RESET_PROGRESS':
      return { ...state, progress: DEFAULTS.progress, practice: {} }
    case 'RESET_FAVORITES':
      return { ...state, favorites: DEFAULTS.favorites }
    case 'RESET_ALL':
      return DEFAULTS
    case 'SET_SETTING':
      return { ...state, settings: { ...state.settings, [action.key]: action.value } }
    default:
      return state
  }
}

/* ============================ CONTEXT ============================ */

interface StoreValue {
  state: AppState
  dispatch: React.Dispatch<Action>
  isFav: (kind: keyof Favorites, id: string) => boolean
  storageAvailable: boolean
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  const [storageAvailable, setStorageAvailable] = useState(true)

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      setStorageAvailable(true)
    } catch {
      setStorageAvailable(false)
    }
  }, [state])

  // sync haptics flag
  useEffect(() => {
    setHapticsEnabled(state.settings.haptics)
  }, [state.settings.haptics])

  // sync reduced-motion class
  useEffect(() => {
    document.documentElement.classList.toggle('rm-reduce', state.settings.reducedMotion)
  }, [state.settings.reducedMotion])

  const value = useMemo<StoreValue>(
    () => ({
      state,
      dispatch,
      isFav: (kind, id) => state.favorites[kind].includes(id),
      storageAvailable,
    }),
    [state, storageAvailable],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
