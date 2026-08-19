import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
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
}

const DEFAULTS: AppState = {
  settings: { reducedMotion: false, uiSound: false, haptics: true },
  favorites: { shortcuts: [], workflows: [], troubleshooting: [] },
  progress: { completedWorkflows: [], workflowStep: {}, doneSteps: {} },
  ui: { lastSection: null, recent: [], recentSearches: [], onboarded: false },
}

const STORAGE_KEY = 'spw.state.v1'

function loadState(): AppState {
  if (typeof localStorage === 'undefined') return DEFAULTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      settings: { ...DEFAULTS.settings, ...parsed.settings },
      favorites: { ...DEFAULTS.favorites, ...parsed.favorites },
      progress: { ...DEFAULTS.progress, ...parsed.progress },
      ui: { ...DEFAULTS.ui, ...parsed.ui },
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
  | { type: 'TOGGLE_STEP_DONE'; workflowId: string; stepId: string }
  | { type: 'COMPLETE_WORKFLOW'; workflowId: string }
  | { type: 'RESET_WORKFLOW'; workflowId: string }
  | { type: 'RESET_PROGRESS' }
  | { type: 'RESET_FAVORITES' }
  | { type: 'RESET_ALL' }
  | { type: 'SET_SETTING'; key: keyof Settings; value: boolean }

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
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
        },
      }
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
      return { ...state, progress: { ...state.progress, completedWorkflows } }
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
        },
      }
    }
    case 'RESET_PROGRESS':
      return { ...state, progress: DEFAULTS.progress }
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
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore quota errors */
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
    }),
    [state],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
