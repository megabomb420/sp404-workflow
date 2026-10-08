import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { setHapticsEnabled } from '../utils/haptics'

import { DEFAULTS, normalizeState } from './model'
import type { AppState, BooleanSetting, Favorites, Firmware, GrooveState, KitItem, KitSet } from './model'
export type { AppState, Settings, Favorites, Progress, UIState, KitItem, KitSet, Firmware } from './model'

const STORAGE_KEY = 'spw.state.v1'
function loadState(): AppState {
  try { return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')) }
  catch { return DEFAULTS }
}

/* ============================ ACTIONS ============================ */

export type Action =
  | { type: 'SET_FIRMWARE'; value: Firmware }
  | { type: 'IMPORT_STATE'; state: AppState }
  | { type: 'CREATE_KIT'; kit: KitSet }
  | { type: 'RENAME_KIT'; id: string; name: string }
  | { type: 'DELETE_KIT'; id: string }
  | { type: 'TOGGLE_KIT_ITEM'; kitId: string; item: KitItem }
  | { type: 'MOVE_KIT_ITEM'; kitId: string; index: number; direction: -1 | 1 }
  | { type: 'SET_GROOVE'; value: Partial<GrooveState> }
  | { type: 'SET_FIRMWARE'; value: Firmware }
  | { type: 'IMPORT_STATE'; state: AppState }
  | { type: 'CREATE_KIT'; kit: KitSet }
  | { type: 'RENAME_KIT'; id: string; name: string }
  | { type: 'DELETE_KIT'; id: string }
  | { type: 'TOGGLE_KIT_ITEM'; kitId: string; item: KitItem }
  | { type: 'MOVE_KIT_ITEM'; kitId: string; index: number; direction: -1 | 1 }
  | { type: 'SET_GROOVE'; value: Partial<GrooveState> }
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
  | { type: 'SET_SETTING'; key: BooleanSetting; value: boolean }
  | { type: 'PRACTICE_RESULT'; id: string; correct: boolean }
  | { type: 'QUEUE_PRACTICE'; id: string }
  | { type: 'SET_LOOP_FIT'; value: Partial<AppState['loopFit']> }

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_FIRMWARE': return { ...state, settings: { ...state.settings, firmware: action.value } }
    case 'IMPORT_STATE': return normalizeState(action.state)
    case 'SET_GROOVE': return { ...state, groove: { ...state.groove, ...action.value } }
    case 'CREATE_KIT': return state.kits.length >= 30 ? state : { ...state, kits: [...state.kits, action.kit] }
    case 'RENAME_KIT': return { ...state, kits: state.kits.map((kit) => kit.id === action.id ? { ...kit, name: action.name.trim().slice(0, 60) || kit.name } : kit) }
    case 'DELETE_KIT': return { ...state, kits: state.kits.filter((kit) => kit.id !== action.id) }
    case 'TOGGLE_KIT_ITEM': return { ...state, kits: state.kits.map((kit) => {
      if (kit.id !== action.kitId) return kit
      const has = kit.items.some((item) => item.kind === action.item.kind && item.id === action.item.id)
      return { ...kit, items: has ? kit.items.filter((item) => item.kind !== action.item.kind || item.id !== action.item.id) : [...kit.items, action.item].slice(0, 200) }
    }) }
    case 'MOVE_KIT_ITEM': return { ...state, kits: state.kits.map((kit) => {
      if (kit.id !== action.kitId) return kit
      const to = action.index + action.direction
      if (action.index < 0 || to < 0 || action.index >= kit.items.length || to >= kit.items.length) return kit
      const items = [...kit.items]; [items[action.index], items[to]] = [items[to], items[action.index]]
      return { ...kit, items }
    }) }
    case 'SET_FIRMWARE': return { ...state, settings: { ...state.settings, firmware: action.value } }
    case 'IMPORT_STATE': return normalizeState(action.state)
    case 'SET_GROOVE': return { ...state, groove: { ...state.groove, ...action.value } }
    case 'CREATE_KIT': return state.kits.length >= 30 ? state : { ...state, kits: [...state.kits, action.kit] }
    case 'RENAME_KIT': return { ...state, kits: state.kits.map((kit) => kit.id === action.id ? { ...kit, name: action.name.trim().slice(0, 60) || kit.name } : kit) }
    case 'DELETE_KIT': return { ...state, kits: state.kits.filter((kit) => kit.id !== action.id) }
    case 'TOGGLE_KIT_ITEM': return { ...state, kits: state.kits.map((kit) => {
      if (kit.id !== action.kitId) return kit
      const has = kit.items.some((item) => item.kind === action.item.kind && item.id === action.item.id)
      return { ...kit, items: has ? kit.items.filter((item) => item.kind !== action.item.kind || item.id !== action.item.id) : [...kit.items, action.item].slice(0, 200) }
    }) }
    case 'MOVE_KIT_ITEM': return { ...state, kits: state.kits.map((kit) => {
      if (kit.id !== action.kitId) return kit
      const to = action.index + action.direction
      if (action.index < 0 || to < 0 || action.index >= kit.items.length || to >= kit.items.length) return kit
      const items = [...kit.items]; [items[action.index], items[to]] = [items[to], items[action.index]]
      return { ...kit, items }
    }) }
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
      return { ...state, favorites: DEFAULTS.favorites, kits: [] }
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

  return <StoreContext.Provider value={value}>{!storageAvailable && <p className="storage-warning" role="alert">Zapis lokalny jest niedostępny. Postęp tej sesji może zniknąć po zamknięciu aplikacji.</p>}{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}import { DEFAULTS, normalizeState } from './model'
import type { AppState, BooleanSetting, Favorites, Firmware, GrooveState, KitItem, KitSet } from './model'
export type { AppState, Settings, Favorites, Progress, UIState, KitItem, KitSet, Firmware } from './model'

const STORAGE_KEY = 'spw.state.v1'
function loadState(): AppState {
  try { return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')) }
  catch { return DEFAULTS }
}

/* ============================ ACTIONS ============================ */

export type Action =
  | { type: 'SET_FIRMWARE'; value: Firmware }
  | { type: 'IMPORT_STATE'; state: AppState }
  | { type: 'CREATE_KIT'; kit: KitSet }
  | { type: 'RENAME_KIT'; id: string; name: string }
  | { type: 'DELETE_KIT'; id: string }
  | { type: 'TOGGLE_KIT_ITEM'; kitId: string; item: KitItem }
  | { type: 'MOVE_KIT_ITEM'; kitId: string; index: number; direction: -1 | 1 }
  | { type: 'SET_GROOVE'; value: Partial<GrooveState> }
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
  | { type: 'SET_SETTING'; key: BooleanSetting; value: boolean }
  | { type: 'PRACTICE_RESULT'; id: string; correct: boolean }
  | { type: 'QUEUE_PRACTICE'; id: string }
  | { type: 'SET_LOOP_FIT'; value: Partial<AppState['loopFit']> }

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_FIRMWARE': return { ...state, settings: { ...state.settings, firmware: action.value } }
    case 'IMPORT_STATE': return normalizeState(action.state)
    case 'SET_GROOVE': return { ...state, groove: { ...state.groove, ...action.value } }
    case 'CREATE_KIT': return state.kits.length >= 30 ? state : { ...state, kits: [...state.kits, action.kit] }
    case 'RENAME_KIT': return { ...state, kits: state.kits.map((kit) => kit.id === action.id ? { ...kit, name: action.name.trim().slice(0, 60) || kit.name } : kit) }
    case 'DELETE_KIT': return { ...state, kits: state.kits.filter((kit) => kit.id !== action.id) }
    case 'TOGGLE_KIT_ITEM': return { ...state, kits: state.kits.map((kit) => {
      if (kit.id !== action.kitId) return kit
      const has = kit.items.some((item) => item.kind === action.item.kind && item.id === action.item.id)
      return { ...kit, items: has ? kit.items.filter((item) => item.kind !== action.item.kind || item.id !== action.item.id) : [...kit.items, action.item].slice(0, 200) }
    }) }
    case 'MOVE_KIT_ITEM': return { ...state, kits: state.kits.map((kit) => {
      if (kit.id !== action.kitId) return kit
      const to = action.index + action.direction
      if (action.index < 0 || to < 0 || action.index >= kit.items.length || to >= kit.items.length) return kit
      const items = [...kit.items]; [items[action.index], items[to]] = [items[to], items[action.index]]
      return { ...kit, items }
    }) }
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
      return { ...state, favorites: DEFAULTS.favorites, kits: [] }
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

  return <StoreContext.Provider value={value}>{!storageAvailable && <p className="storage-warning" role="alert">Zapis lokalny jest niedostępny. Postęp tej sesji może zniknąć po zamknięciu aplikacji.</p>}{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
