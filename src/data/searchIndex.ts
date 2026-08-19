import { SearchEntry } from './types'
import { shortcuts } from './shortcuts'
import { sections } from './sections'
import { workflows } from './workflows'
import { troubleshooting } from './troubleshooting'
import { glossary } from './glossary'
import { mfxEffects } from './mfx'

/** Sugestie wyświetlane przy pustym polu. */
export const SEARCH_SUGGESTIONS = [
  'sidechain',
  'skip back',
  'chop',
  'USB',
  'resample',
  'normalize',
  'mute',
  'undo',
  'routing',
  'EXT SOURCE',
]

let cache: SearchEntry[] | null = null

export function buildSearchIndex(): SearchEntry[] {
  if (cache) return cache
  const idx: SearchEntry[] = []

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
      route: '/fix-it',
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

export function searchIndex(query: string, limit = 40): SearchEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const idx = buildSearchIndex()
  const scored: Array<{ e: SearchEntry; score: number }> = []

  for (const e of idx) {
    let score = Infinity
    const title = e.title.toLowerCase()
    if (title === q) score = 0
    else if (title.startsWith(q)) score = 1
    else if (title.includes(q)) score = 2

    const haystacks = [
      ...e.tags.map((t) => t.toLowerCase()),
      e.buttons?.join(' ').toLowerCase() ?? '',
      e.path?.join(' ').toLowerCase() ?? '',
      e.sectionLabel.toLowerCase(),
      e.preview.toLowerCase(),
    ]
    for (const h of haystacks) {
      if (h && h.includes(q)) {
        score = Math.min(score, 3)
      }
    }
    if (score === Infinity) continue
    scored.push({ e, score })
  }

  scored.sort((a, b) => a.score - b.score)
  return scored.slice(0, limit).map((x) => x.e)
}
