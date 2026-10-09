import { SearchEntry, isWorkflowActionRef } from './types'
import { actions } from './actions'
import { shortcuts } from './shortcuts'
import { sections } from './sections'
import { workflows } from './workflows'
import { troubleshooting } from './troubleshooting'
import { glossary } from './glossary'
import { mfxEffects } from './mfx'
import { doomShortcuts, DOOM } from './doom'
import type { Firmware } from '../state/model'
import { actionsEn } from '../i18n/en/actions'
import { glossaryEn } from '../i18n/en/glossary'
import { shortcutsEn } from '../i18n/en/shortcuts'
import { troubleshootingEn } from '../i18n/en/troubleshooting'
import { workflowsEn } from '../i18n/en/workflows'
import { doomControlsEn } from '../i18n/en/doom'
import { companionText } from '../i18n/companion'
import { normalizeSearch as normalize } from '../utils/search'
import { beatChallenges, beatReasons } from './beatBlock'


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
  idx.push({ kind: 'tool', id: 'beat-block', title: 'BEAT BLOCK', preview: 'Utknąłeś? Krótkie wyzwanie, szkic i pomysł do rozwinięcia.', route: '/beat-block', sectionLabel: 'OFFLINE TOOL', tags: ['beat block', 'writers block', 'writer block', 'creative block', 'utknąłem', 'brak pomysłu', 'nudny beat', 'wyzwanie', 'challenge', 'inspiration', 'inspiracja', ...beatReasons.flatMap(reason => [...reason.label]), ...beatChallenges.flatMap(challenge => [...challenge.title, ...challenge.goal])] })
  idx.push({ kind: 'tool', id: 'listen', title: 'ODSŁUCH SP', preview: 'Publiczne demonstracje FX, resamplingu i sidechainu Rolanda.', route: '/listen', sectionLabel: 'ONLINE AUDIO', tags: ['listen', 'audio', 'demo', 'roland', 'fx', 'effects', 'resample', 'sidechain', 'odsłuch', 'przed po', 'before after'] })
  idx.push({ kind: 'tool', id: 'doom-os', title: 'DOOM OS', preview: `Manual ${DOOM.manualVersion} · sterowanie, patterny i automatyka`, route: '/doom-os', sectionLabel: 'DOOM OS', tags: ['doom', 'doom os', 'custom firmware', 'klangfeld', 'manual', 'mixer', 'automation'] })
  idx.push({ kind: 'tool', id: 'screen', title: 'JESTEM NA EKRANIE', preview: 'Wybierz ekran SP i znajdź pokrętła oraz czynności.', route: '/screen', sectionLabel: 'OFFLINE TOOL', tags: ['ekran', 'screen', 'ctrl', 'pokrętła', 'knobs', 'tr rec', 'mixer'] })
  idx.push({ kind: 'tool', id: 'groove', title: 'GROOVE LAB', preview: 'Velocity, nudge i długość nuty w interaktywnej siatce.', route: '/groove', sectionLabel: 'OFFLINE TOOL', tags: ['groove', 'velocity', 'nudge', 'length', 'timing', 'długość nuty'] })
  idx.push({ kind: 'tool', id: 'compare', title: 'ROLAND ↔ DOOM OS', preview: 'Porównaj sposoby wykonania tego samego zadania.', route: '/compare', sectionLabel: 'OFFLINE TOOL', tags: ['porównaj', 'compare', 'roland', 'doom', 'tr rec', 'live', 'fx'] })

  idx.push({
    kind: 'tool',
    id: 'loop-fit',
    title: 'LOOP FIT LAB',
    preview: 'Policz oczekiwaną długość loopa, wykryj drift i przejdź do właściwej akcji na SP.',
    route: '/loop-fit',
    sectionLabel: 'OFFLINE TOOL',
    tags: ['loop fit', 'długość sampla', 'sekundy', 'BPM', 'drift', 'tempo', 'pętla nie trzyma', 'ile taktów'],
  })

  const actionLocations = new Map<string, { workflowId: string; step: number }>()
  for (const workflow of [...workflows].sort((a, b) => Number(!!b.featured) - Number(!!a.featured))) {
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
      tags: [action.title, action.action, action.startingState ?? '', action.expectedResult, ...action.tags, ...stringValues(actionsEn[action.id])],
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

  for (const sc of [...shortcuts, ...doomShortcuts]) {
    idx.push({
      kind: 'shortcut',
      id: sc.id,
      title: sc.name,
      preview: sc.description,
      route: `${sc.category === 'DOOM OS' ? '/doom-os' : '/shortcuts'}?id=${encodeURIComponent(sc.id)}`,
      buttons: sc.buttons,
      path: sc.path,
      sectionLabel: sc.category,
      tags: [sc.name, sc.nameEn ?? '', ...sc.tags, shortcutsEn[sc.id]?.description ?? '', ...stringValues(doomControlsEn[sc.id])],
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
      tags: [w.title, w.category, workflowsEn[w.id]?.title ?? '', workflowsEn[w.id]?.blurb ?? '', companionText(w.title, 'en'), companionText(w.blurb ?? '', 'en')],
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
      tags: [t.symptom, ...t.tags, troubleshootingEn[t.id]?.symptom ?? '', troubleshootingEn[t.id]?.cause ?? ''],
    })
  }

  for (const g of glossary) {
    idx.push({
      kind: 'glossary',
      id: g.term,
      title: g.term,
      preview: g.definition,
      route: `/glossary?term=${encodeURIComponent(g.term)}`,
      sectionLabel: 'GLOSSARY',
      tags: [g.term, ...g.tags, glossaryEn[g.term]?.definition ?? ''],
    })
  }

  for (const m of mfxEffects) {
    idx.push({
      kind: 'mfx',
      id: m,
      title: m,
      preview: 'MFX effect — BUS or FX button',
      route: '/section/effects',
      sectionLabel: 'EFFECTS · MFX',
      tags: [m],
    })
  }

  cache = idx
  return cache
}

function stringValues(value: object | undefined): string[] {
  if (!value) return []
  return Object.values(value).filter((item): item is string => typeof item === 'string')
}

const REWRITES: Array<[RegExp, string]> = [
  [/nie (slychac|ma dzwieku)|no (sound|audio)|silent|silence/g, 'brak dzwieku cisza'],
  [/telefon|laptop|komputer|phone|computer/g, 'usb zrodlo input'],
  [/suchy|bez efektu|dry|no effect/g, 'dry routing bus fx'],
  [/plywa|rozjezdza|nie trzyma|drift|off tempo/g, 'drift tempo bpm sync'],
  [/potnij|pociac|pokroic|chop|slice/g, 'chop markery assign to pad'],
  [/nagraj|nagrywac|record|sample/g, 'sampling record rec'],
  [/zamroz|wydrukuj|print|bounce|freeze/g, 'print resample bounce'],
]

function expandedQuery(value: string): string {
  const query = normalize(value)
  const expansions = REWRITES.filter(([pattern]) => new RegExp(pattern.source).test(query)).map(([, replacement]) => replacement)
  return [query, ...expansions].join(' ')
}

export function searchIndex(query: string, limit = 40, contextWorkflowId?: string | null, firmware: Firmware = 'roland'): SearchEntry[] {
  const q = normalize(query)
  if (!q) return []
  const targetFirmware = q.includes('doom') ? 'doom' : firmware
  const idx = buildSearchIndex()
  const scored: Array<{ e: SearchEntry; score: number }> = []
  const stop = new Set(['jak', 'na', 'do', 'to', 'sie', 'mi', 'jest', 'chce', 'nie', 'co', 'albo', 'ze'])
  const queryTokens = [...new Set(q.split(' ').filter((token) => token.length > 1 && !stop.has(token)))]
  const aliases = [...new Set(expandedQuery(query).split(' ').filter((token) => token.length > 1 && !stop.has(token) && !queryTokens.includes(token)))]

  for (const e of idx) {
    const isDoom = e.id.startsWith('doom-') || e.route.startsWith('/doom-os')
    const shared = e.kind === 'tool' && e.id !== 'doom-os'
    if (!shared && isDoom !== (targetFirmware === 'doom')) continue
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

    const words = `${title} ${haystack}`.split(' ')
    const matches = (token: string) => words.some((word) => word === token || (token.length >= 4 && word.startsWith(token)))
    const hits = queryTokens.filter(matches).length
    const aliasHits = aliases.filter(matches).length
    const coverage = hits / Math.max(1, queryTokens.length)
    if (coverage >= 0.5 || (hits > 0 && aliasHits > 0)) score = Math.min(score, 5 + 3 * (1 - coverage) - Math.min(aliasHits, 3) * 0.2)
    else if (aliasHits >= 2) score = Math.min(score, 9 - Math.min(aliasHits, 4) * 0.2)
    if (score === Infinity) continue
    if (e.kind === 'action') score -= 0.75
    if (e.kind === 'troubleshooting') score -= 0.35
    if (contextWorkflowId && e.route.includes(`/workflow/${contextWorkflowId}`) && title !== q) score -= 0.4
    scored.push({ e, score })
  }

  scored.sort((a, b) => a.score - b.score)
  return scored.slice(0, limit).map((x) => x.e)
}
