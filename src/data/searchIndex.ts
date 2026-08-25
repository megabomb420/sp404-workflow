import { SearchEntry, isWorkflowActionRef } from './types'
import { actions } from './actions'
import { shortcuts } from './shortcuts'
import { sections } from './sections'
import { workflows } from './workflows'
import { troubleshooting } from './troubleshooting'
import { glossary } from './glossary'
import { mfxEffects } from './mfx'

/** Sugestie wyświetlane przy pustym polu. */
export const SEARCH_SUGGESTIONS = [
  'nagraj telefon na pad',
  'resample jest suchy',
  'loop nie trzyma tempa',
  'jak pociąć loop',
  'nie słychać USB',
  'REMAIN + PAD',
]

let cache: SearchEntry[] | null = null

export function buildSearchIndex(): SearchEntry[] {
  if (cache) return cache
  const idx: SearchEntry[] = []

  const actionLocations = new Map<string, { workflowId: string; step: number }>()
  for (const workflow of [...workflows].sort((a, b) => Number(b.featured) - Number(a.featured))) {
    workflow.steps.forEach((step, index) => {
      if (isWorkflowActionRef(step) && !actionLocations.has(step.actionId)) {
        actionLocations.set(step.actionId, { workflowId: workflow.id, step: index })
      }
    })
  }

  for (const action of actions) {
    const location = actionLocations.get(action.id)
    idx.push({
      kind: 'action',
      id: action.id,
      title: action.title,
      preview: action.expectedResult,
      route: location ? `/workflow/${location.workflowId}?step=${location.step}` : '/workflows',
      buttons: action.buttons,
      path: action.path,
      sectionLabel: 'DO NOW',
      tags: [action.title, action.action, action.startingState ?? '', action.expectedResult, ...action.tags],
    })
  }

  for (const s of sections) {
    idx.push({
      kind: 'section',
      id: s.id,
      title: s.title,
      preview: s.short,
      route: `/section/${s.id}`,
      sectionLabel: `SEKCJA ${String(s.pad).padStart(2, '0')}`,
      tags: [s.title, s.short, `pad ${s.pad}`],
    })
  }

  for (const sc of shortcuts) {
    idx.push({
      kind: 'shortcut',
      id: sc.id,
      title: sc.name,
      preview: sc.description,
      route: '/shortcuts',
      buttons: sc.buttons,
      path: sc.path,
      sectionLabel: sc.category,
      tags: [sc.name, sc.nameEn ?? '', ...sc.tags],
    })
  }

  for (const w of workflows) {
    idx.push({
      kind: 'workflow',
      id: w.id,
      title: w.title,
      preview: w.blurb ?? `${w.steps.length} kroków · ${w.difficulty}`,
      route: `/workflow/${w.id}`,
      sectionLabel: w.category,
      tags: [w.title, w.category],
    })
  }

  for (const t of troubleshooting) {
    idx.push({
      kind: 'troubleshooting',
      id: t.id,
      title: t.symptom,
      preview: t.cause,
      route: `/fix-it?ids=${encodeURIComponent(t.id)}`,
      sectionLabel: 'FIX IT',
      tags: [t.symptom, ...t.tags],
    })
  }

  for (const g of glossary) {
    idx.push({
      kind: 'glossary',
      id: g.term,
      title: g.term,
      preview: g.definition,
      route: '/glossary',
      sectionLabel: 'GLOSSARY',
      tags: [g.term, ...g.tags],
    })
  }

  for (const m of mfxEffects) {
    idx.push({
      kind: 'mfx',
      id: m,
      title: m,
      preview: 'Efekt MFX — przypisywany do BUS / przycisku efektu',
      route: '/section/effects',
      sectionLabel: 'EFFECTS · MFX',
      tags: [m],
    })
  }

  cache = idx
  return cache
}

const REWRITES: Array<[RegExp, string]> = [
  [/nie (slychac|ma dzwieku)/g, 'brak dzwieku cisza'],
  [/telefon|laptop|komputer/g, 'usb zrodlo input'],
  [/suchy|bez efektu/g, 'dry routing bus fx'],
  [/plywa|rozjezdza|nie trzyma/g, 'drift tempo bpm sync'],
  [/potnij|pociac|pokroic/g, 'chop markery assign to pad'],
  [/nagraj|nagrywac/g, 'sampling record rec'],
  [/zamroz|wydrukuj/g, 'print resample bounce'],
]

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9+]+/g, ' ')
    .trim()
}

function expandedQuery(value: string): string {
  let query = normalize(value)
  for (const [pattern, replacement] of REWRITES) query = query.replace(pattern, `${replacement} `)
  return query.replace(/\s+/g, ' ').trim()
}

export function searchIndex(query: string, limit = 40, contextWorkflowId?: string | null): SearchEntry[] {
  const q = expandedQuery(query)
  if (!q) return []
  const idx = buildSearchIndex()
  const scored: Array<{ e: SearchEntry; score: number }> = []
  const queryTokens = [...new Set(q.split(' ').filter((token) => token.length > 1))]

  for (const e of idx) {
    let score = Infinity
    const title = normalize(e.title)
    if (title === q) score = 0
    else if (title.startsWith(q)) score = 1
    else if (title.includes(q)) score = 2

    const haystack = normalize([
      ...e.tags,
      e.buttons?.join(' ') ?? '',
      e.path?.join(' ') ?? '',
      e.sectionLabel,
      e.preview,
    ].join(' '))
    if (haystack.includes(q)) score = Math.min(score, 3)

    const hits = queryTokens.filter((token) => haystack.includes(token) || title.includes(token)).length
    if (hits > 0) score = Math.min(score, 7 - Math.min(hits, 4) + (hits < queryTokens.length ? 1 : 0))
    if (score === Infinity) continue
    if (e.kind === 'action') score -= 0.75
    if (e.kind === 'troubleshooting') score -= 0.35
    if (contextWorkflowId && e.route.includes(`/workflow/${contextWorkflowId}`)) score -= 1
    scored.push({ e, score })
  }

  scored.sort((a, b) => a.score - b.score)
  return scored.slice(0, limit).map((x) => x.e)
}
