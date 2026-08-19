/**
 * Content data model for SP WORKFLOW.
 *
 * Treść jest w pełni zewnętrzna wobec komponentów — nowe sekcje/skróty/workflow
 * dodaje się w plikach `src/data/*`, bez zmian w UI.
 *
 * Każdy fakt merytoryczny ma `source` (Roland Reference Manual v5.50 + strona)
 * i `kind`: `'verified'` (ROLAND/VERIFIED) lub `'tip'` (WORKFLOW TIP).
 */

export const MANUAL_VERSION = '5.50'

export interface Source {
  /** identyfikator manuala */
  manual: 'RM5.50'
  /** numer strony w manualu (strony drukowane) */
  page?: number
  /** nazwa sekcji/zakładki w manualu (np. dla treści z edycji HTML 5.50) */
  section?: string
}

export type VerifiedKind = 'verified' | 'tip'

/** Etykieta źródła — wyświetlana jako mała pilka przy treści. */
export function sourceLabel(s: Source | undefined): string | null {
  if (!s) return null
  if (s.section) return `${s.manual} · ${s.section}`
  if (s.page) return `${s.manual} p.${s.page}`
  return s.manual
}

/* ============================ SHORTCUT ============================ */

export type ShortcutCategory =
  | 'SAMPLING'
  | 'EDIT'
  | 'PATTERN'
  | 'RESAMPLE'
  | 'FX'
  | 'ROUTING'
  | 'SKIP BACK'
  | 'COPY'
  | 'MUTE'
  | 'UNDO'
  | 'CHROMATIC'
  | 'UTILITY'

export interface Shortcut {
  id: string
  /** nazwa funkcji (PL, czasem oficjalna EN w nawiasie) */
  name: string
  nameEn?: string
  category: ShortcutCategory
  /** sekwencja przycisków, np. ['SHIFT', 'PAD 16'] */
  buttons: string[]
  /** ścieżka menu, np. ['EFX SET', 'SIDE CHAIN'] */
  path?: string[]
  description: string
  /** domyślnie skrót udokumentowany w manualu */
  kind?: VerifiedKind
  source?: Source
  /** aliasy wyszukiwania (PL + EN + slang) */
  tags: string[]
}

/* ============================ WORKFLOW ============================ */

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface WorkflowStep {
  id: string
  title: string
  /** co robimy — krótko, rozkazująco */
  action: string
  buttons?: string[]
  path?: string[]
  /** dlaczego to robimy */
  explanation?: string
  /** co powinno się wydarzyć */
  expectedResult?: string
  /** typowy błąd */
  commonMistake?: string
  source?: Source
  kind?: VerifiedKind
}

export interface Workflow {
  id: string
  title: string
  /** kategoria wyświetlana na liście */
  category: string
  difficulty: Difficulty
  /** szacowany czas w minutach */
  minutes?: number
  steps: WorkflowStep[]
  /** krótki opis na liście */
  blurb?: string
}

/* ============================ TROUBLESHOOTING ============================ */

export interface Troubleshooting {
  id: string
  symptom: string
  cause: string
  fix: string
  /** id powiązanych funkcji/skrótów */
  related: string[]
  tags: string[]
  source?: Source
  kind?: VerifiedKind
}

/* ============================ GLOSSARY ============================ */

export interface GlossaryTerm {
  term: string
  definition: string
  tags: string[]
  source?: Source
}

/* ============================ MUSCLE MEMORY ============================ */

export type MuscleCategory = 'beginner' | 'sampling' | 'sequencer' | 'fx' | 'advanced'

export interface MuscleTask {
  id: string
  category: MuscleCategory
  /** treść zadania */
  task: string
  /** odpowiedź — sekwencja przycisków */
  answer: string[]
  path?: string[]
  hint?: string
}

/* ============================ SECTION BLOCKS ============================ */

export type CompareColumn = {
  heading: string
  points: string[]
}

export type PresetConfigItem = { label: string; value: string }

export type DiagramNode =
  | string
  | { label: string; sub?: string; tone?: 'source' | 'bus' | 'target' | 'master' | 'default' }

export type SectionBlock =
  | { kind: 'intro'; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'h'; title: string }
  | { kind: 'sequence'; buttons: string[]; path?: string[]; note?: string; source?: Source }
  | { kind: 'steps'; title?: string; steps: WorkflowStep[] }
  | { kind: 'diagram'; title?: string; steps: DiagramNode[]; caption?: string }
  | { kind: 'compare'; title?: string; a: CompareColumn; b: CompareColumn }
  | { kind: 'tip'; text: string }
  | { kind: 'note'; text: string; source?: Source }
  | { kind: 'pros'; title?: string; items: string[] }
  | { kind: 'list'; title?: string; items: string[] }
  | { kind: 'table'; headers: string[]; rows: string[][] }
  | { kind: 'preset'; title: string; config: PresetConfigItem[]; whatYouHear: string; source?: Source }
  | { kind: 'task'; title: string; task: string; answer: string[]; path?: string[] }
  | { kind: 'link'; title: string; route: string; note?: string }
  | { kind: 'sequencer'; label?: string }
  | { kind: 'explorer'; label?: string }

export interface Section {
  id: string
  /** numer pada na Home (1–16) */
  pad: number
  title: string
  /** krótki podtytuł w jednej linii */
  short: string
  body: SectionBlock[]
}

/* ============================ SEARCH ============================ */

export type SearchKind = 'section' | 'shortcut' | 'workflow' | 'troubleshooting' | 'glossary' | 'mfx'

export interface SearchEntry {
  kind: SearchKind
  id: string
  title: string
  preview: string
  /** ścieżka nawigacji (do sekcji skrótu itp.) */
  route: string
  buttons?: string[]
  path?: string[]
  /** gdzie wpada w wynikach */
  sectionLabel: string
  tags: string[]
}

/** Płaska, przeszukiwana kolekcja — budowana w `searchIndex.ts`. */
export type SearchIndex = SearchEntry[]
