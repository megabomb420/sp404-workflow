import { Section } from '../types'
import { section as s01 } from './01'
import { section as s02 } from './02'
import { section as s03 } from './03'
import { section as s04 } from './04'
import { section as s05 } from './05'
import { section as s06 } from './06'
import { section as s07 } from './07'
import { section as s08 } from './08'
import { section as s09 } from './09'
import { section as s10 } from './10'
import { section as s11 } from './11'
import { section as s12 } from './12'

export const sections: Section[] = [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12]

export const sectionsById: Record<string, Section> = Object.fromEntries(sections.map((s) => [s.id, s]))

export type PadTone = 'default' | 'accent' | 'danger'

export interface HomePad {
  pad: number
  label: string
  sublabel: string
  route: string
  tone?: PadTone
  sectionId?: string
}

export const homePads: HomePad[] = [
  { pad: 1, label: 'START HERE', sublabel: 'podstawy', route: '/section/start', sectionId: 'start' },
  { pad: 2, label: 'SAMPLING', sublabel: 'nagrywanie', route: '/section/sampling', sectionId: 'sampling' },
  { pad: 3, label: 'SAMPLE EDIT', sublabel: 'chop · pitch', route: '/section/edit', sectionId: 'edit' },
  { pad: 4, label: 'INPUTS & ROUTING', sublabel: 'USB · EXT SOURCE', route: '/section/inputs', sectionId: 'inputs' },
  { pad: 5, label: 'RESAMPLING', sublabel: 'destroy', route: '/section/resample', sectionId: 'resample' },
  { pad: 6, label: 'SKIP BACK', sublabel: 'złap moment', route: '/section/skipback', sectionId: 'skipback' },
  { pad: 7, label: 'PATTERN', sublabel: 'sequencer', route: '/section/pattern', sectionId: 'pattern' },
  { pad: 8, label: 'PATTERN VS RESAMPLE', sublabel: 'wybór drogi', route: '/section/pattern-vs-resample', sectionId: 'pattern-vs-resample' },
  { pad: 9, label: 'EFFECTS', sublabel: 'BUS 1–4', route: '/section/effects', sectionId: 'effects' },
  { pad: 10, label: 'SIDECHAIN', sublabel: 'ducking 5.50', route: '/section/sidechain', sectionId: 'sidechain', tone: 'accent' },
  { pad: 11, label: 'BUILD A BEAT', sublabel: 'pełny workflow', route: '/section/beat', sectionId: 'beat' },
  { pad: 12, label: 'QUICK WORKFLOWS', sublabel: 'szybkie ruchy', route: '/section/quick', sectionId: 'quick' },
  { pad: 13, label: 'SHORTCUTS', sublabel: 'cheat sheet', route: '/shortcuts' },
  { pad: 14, label: 'FIX IT', sublabel: 'problemy', route: '/fix-it', tone: 'danger' },
  { pad: 15, label: 'MUSCLE MEMORY', sublabel: 'trainer', route: '/muscle' },
  { pad: 16, label: 'SEARCH', sublabel: 'znajdź funkcję', route: '/search' },
]
