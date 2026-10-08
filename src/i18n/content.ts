import { useMemo } from 'react'
import type {
  ActionRecord,
  GlossaryTerm,
  MuscleTask,
  Section,
  SectionBlock,
  Shortcut,
  Troubleshooting,
  Workflow,
  WorkflowEntry,
  WorkflowStep,
} from '@/data/types'
import { isWorkflowActionRef } from '@/data/types'
import { actions } from '@/data/actions'
import { glossary } from '@/data/glossary'
import { muscleTasks } from '@/data/muscleMemory'
import { rescueFamilies } from '@/data/rescue'
import { homePads, sections, type HomePad } from '@/data/sections'
import { shortcuts } from '@/data/shortcuts'
import { troubleshooting } from '@/data/troubleshooting'
import { workflows } from '@/data/workflows'
import { byId } from '@/utils/byId'
import { actionsEn } from './en/actions'
import { glossaryEn } from './en/glossary'
import { muscleEn } from './en/muscle'
import { padsEn } from './en/pads'
import { rescueEn } from './en/rescue'
import { sectionsEn } from './en/sections'
import { shortcutsEn } from './en/shortcuts'
import { troubleshootingEn } from './en/troubleshooting'
import { workflowsEn } from './en/workflows'
import { useLocale, type Locale } from './locale'
import { pick } from './localize'

export function localizeAction(action: ActionRecord, locale: Locale): ActionRecord {
  return pick(locale, action, actionsEn[action.id])
}

export function localizeShortcut(item: Shortcut, locale: Locale): Shortcut {
  const overlay = shortcutsEn[item.id]
  return locale === 'en' && overlay ? { ...item, description: overlay.description } : item
}

export function localizeTrouble(item: Troubleshooting, locale: Locale): Troubleshooting {
  return pick(locale, item, troubleshootingEn[item.id])
}

export function localizeGlossary(item: GlossaryTerm, locale: Locale): GlossaryTerm {
  const overlay = glossaryEn[item.term]
  return locale === 'en' && overlay ? { ...item, definition: overlay.definition } : item
}

export function localizeMuscle(item: MuscleTask, locale: Locale): MuscleTask {
  const overlay = muscleEn[item.id]
  if (locale !== 'en' || !overlay) return item
  return { ...item, task: overlay.task, hint: overlay.hint ?? item.hint }
}

function localizeStep(step: WorkflowStep, overlay?: { title?: string; action?: string; explanation?: string; expectedResult?: string; commonMistake?: string }): WorkflowStep {
  if (!overlay) return step
  return {
    ...step,
    title: overlay.title ?? step.title,
    action: overlay.action ?? step.action,
    explanation: overlay.explanation ?? step.explanation,
    expectedResult: overlay.expectedResult ?? step.expectedResult,
    commonMistake: overlay.commonMistake ?? step.commonMistake,
  }
}

export function localizeWorkflow(workflow: Workflow, locale: Locale): Workflow {
  if (locale !== 'en') return workflow
  const overlay = workflowsEn[workflow.id]
  if (!overlay) return workflow
  return {
    ...workflow,
    title: overlay.title ?? workflow.title,
    blurb: overlay.blurb ?? workflow.blurb,
    startingState: overlay.startingState ?? workflow.startingState,
    outcome: overlay.outcome ?? workflow.outcome,
    category: overlay.category ?? workflow.category,
    steps: workflow.steps.map((step) => {
      const stepOverlay = overlay.steps?.[step.id]
      if (!stepOverlay) return step
      if (isWorkflowActionRef(step)) {
        return { ...step, context: stepOverlay.context ?? step.context }
      }
      return localizeStep(step, stepOverlay)
    }),
  }
}

export function localizeHomePad(pad: HomePad, locale: Locale): HomePad {
  if (locale !== 'en') return pad
  const overlay = padsEn[String(pad.pad)] ?? padsEn[pad.route]
  if (!overlay) return pad
  return { ...pad, label: overlay.label ?? pad.label, sublabel: overlay.sublabel }
}

function mapBlock(block: SectionBlock, tr: (value: string, path: string) => string): SectionBlock {
  switch (block.kind) {
    case 'intro':
    case 'p':
    case 'tip':
    case 'note':
      return { ...block, text: tr(block.text, 'text') }
    case 'h':
      return { ...block, title: tr(block.title, 'title') }
    case 'sequence':
      return { ...block, note: block.note ? tr(block.note, 'note') : block.note }
    case 'steps':
      return {
        ...block,
        title: block.title ? tr(block.title, 'title') : block.title,
        steps: block.steps.map((step, i) => ({
          ...step,
          title: tr(step.title, `steps.${i}.title`),
          action: tr(step.action, `steps.${i}.action`),
          explanation: step.explanation ? tr(step.explanation, `steps.${i}.explanation`) : step.explanation,
          expectedResult: step.expectedResult ? tr(step.expectedResult, `steps.${i}.expectedResult`) : step.expectedResult,
          commonMistake: step.commonMistake ? tr(step.commonMistake, `steps.${i}.commonMistake`) : step.commonMistake,
        })),
      }
    case 'diagram':
      return {
        ...block,
        title: block.title ? tr(block.title, 'title') : block.title,
        caption: block.caption ? tr(block.caption, 'caption') : block.caption,
        steps: block.steps.map((node, i) =>
          typeof node === 'string'
            ? tr(node, `steps.${i}`)
            : { ...node, label: tr(node.label, `steps.${i}.label`), sub: node.sub ? tr(node.sub, `steps.${i}.sub`) : node.sub },
        ),
      }
    case 'compare':
      return {
        ...block,
        title: block.title ? tr(block.title, 'title') : block.title,
        a: { heading: tr(block.a.heading, 'a.heading'), points: block.a.points.map((p, i) => tr(p, `a.points.${i}`)) },
        b: { heading: tr(block.b.heading, 'b.heading'), points: block.b.points.map((p, i) => tr(p, `b.points.${i}`)) },
      }
    case 'pros':
    case 'list':
      return {
        ...block,
        title: block.title ? tr(block.title, 'title') : block.title,
        items: block.items.map((item, i) => tr(item, `items.${i}`)),
      }
    case 'table':
      return {
        ...block,
        headers: block.headers.map((h, i) => tr(h, `headers.${i}`)),
        rows: block.rows.map((row, r) => row.map((cell, c) => tr(cell, `rows.${r}.${c}`))),
      }
    case 'preset':
      return {
        ...block,
        title: tr(block.title, 'title'),
        whatYouHear: tr(block.whatYouHear, 'whatYouHear'),
        config: block.config.map((item, i) => ({ ...item, label: tr(item.label, `config.${i}.label`) })),
      }
    case 'task':
      return { ...block, title: tr(block.title, 'title'), task: tr(block.task, 'task') }
    case 'link':
      return { ...block, title: tr(block.title, 'title'), note: block.note ? tr(block.note, 'note') : block.note }
    case 'sequencer':
    case 'explorer':
      return { ...block, label: block.label ? tr(block.label, 'label') : block.label }
    default:
      return block
  }
}

export function localizeSection(section: Section, locale: Locale): Section {
  if (locale !== 'en') return section
  const dict = sectionsEn[section.id]
  if (!dict) return section
  const tr = (value: string, path: string) => dict[path] ?? value
  return {
    ...section,
    short: tr(section.short, 'short'),
    body: section.body.map((block, i) => mapBlock(block, (value, path) => tr(value, `${i}.${path}`))),
  }
}

export function localizeRescueFamilies(locale: Locale) {
  if (locale !== 'en') return rescueFamilies
  return rescueFamilies.map((family) => {
    const overlay = rescueEn[family.id]
    if (!overlay) return family
    return {
      ...family,
      title: overlay.title,
      question: overlay.question,
      choices: family.choices.map((choice, i) => ({ ...choice, label: overlay.choices[i] ?? choice.label })),
    }
  })
}

export function useLocalizedActions() {
  const { locale } = useLocale()
  return useMemo(() => {
    const list = actions.map((item) => localizeAction(item, locale))
    return { list, byId: byId(list) }
  }, [locale])
}

export function useLocalizedWorkflows() {
  const { locale } = useLocale()
  return useMemo(() => {
    const list = workflows.map((item) => localizeWorkflow(item, locale))
    return { list, byId: byId(list), featured: list.filter((item) => item.featured) }
  }, [locale])
}

export function useLocalizedShortcuts() {
  const { locale } = useLocale()
  return useMemo(() => {
    const list = shortcuts.map((item) => localizeShortcut(item, locale))
    return { list, byId: byId(list) }
  }, [locale])
}

export function useLocalizedTroubleshooting() {
  const { locale } = useLocale()
  return useMemo(() => {
    const list = troubleshooting.map((item) => localizeTrouble(item, locale))
    return { list, byId: byId(list) }
  }, [locale])
}

export function useLocalizedGlossary() {
  const { locale } = useLocale()
  return useMemo(() => glossary.map((item) => localizeGlossary(item, locale)), [locale])
}

export function useLocalizedMuscle() {
  const { locale } = useLocale()
  return useMemo(() => muscleTasks.map((item) => localizeMuscle(item, locale)), [locale])
}

export function useLocalizedSections() {
  const { locale } = useLocale()
  return useMemo(() => {
    const list = sections.map((item) => localizeSection(item, locale))
    return { list, byId: byId(list) }
  }, [locale])
}

export function useLocalizedHomePads() {
  const { locale } = useLocale()
  return useMemo(() => homePads.map((pad) => localizeHomePad(pad, locale)), [locale])
}

export function useLocalizedRescue() {
  const { locale } = useLocale()
  return useMemo(() => localizeRescueFamilies(locale), [locale])
}

export function useLocalizedAction(id: string | undefined) {
  const { byId } = useLocalizedActions()
  return id ? byId[id] : undefined
}

export function useLocalizedWorkflow(id: string | undefined) {
  const { byId } = useLocalizedWorkflows()
  return id ? byId[id] : undefined
}

export function useLocalizedSection(id: string | undefined) {
  const { byId } = useLocalizedSections()
  return id ? byId[id] : undefined
}
