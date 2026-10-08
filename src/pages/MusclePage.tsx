import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from '@/lib/rr'
import { ButtonSequence } from '@/components/content/ButtonSequence'
import { SourceTag } from '@/components/content/SourceTag'
import { HardwareButton } from '@/components/hardware/HardwareButton'
import { muscleCategories } from '@/data/muscleMemory'
import { type MuscleCategory, type Source, isWorkflowActionRef } from '@/data/types'
import { useLocalizedActions, useLocalizedMuscle, useLocalizedWorkflows } from '@/i18n/content'
import { useT } from '@/i18n/useT'
import { useDisplay } from '@/state/display'
import { useStore } from '@/state/store'
import { workflowReturnRoute } from '@/utils/session'
import cx from '@/utils/cx'

type Mode = 'practice' | 'review' | MuscleCategory
interface Exercise {
  id: string
  task: string
  answer?: string[]
  path?: string[]
  explanation?: string
  expected?: string
  source?: Source
  route?: string
  category?: MuscleCategory
}

export function MusclePage() {
  const { setDisplay } = useDisplay()
  const { state, dispatch } = useStore()
  const [params] = useSearchParams()
  const requested = params.get('practice')
  const requestedReview = params.get('review') === '1'
  const [mode, setMode] = useState<Mode>('practice')
  const [task, setTask] = useState<Exercise | null>(null)
  const [shown, setShown] = useState(false)
  const [session, setSession] = useState({ correct: 0, total: 0 })
  const returnRoute = workflowReturnRoute(params)
  const t = useT()
  const { list: actions, byId: actionsById } = useLocalizedActions()
  const { list: workflows } = useLocalizedWorkflows()
  const muscleTasks = useLocalizedMuscle()

  const procedures = useMemo<Exercise[]>(
    () =>
      actions
        .filter((a) => a.safety !== 'destructive')
        .map((a) => {
          const workflow = workflows.find((w) => w.steps.some((s) => isWorkflowActionRef(s) && s.actionId === a.id))
          const index = workflow?.steps.findIndex((s) => isWorkflowActionRef(s) && s.actionId === a.id)
          return {
            id: a.id,
            task: `${a.title}. ${a.startingState ?? t.muscle.prepFallback}`,
            answer: a.buttons,
            path: a.path,
            explanation: a.action,
            expected: a.expectedResult,
            source: a.source,
            route: workflow ? `/workflow/${workflow.id}?step=${index}` : undefined,
          }
        }),
    [actions, workflows, t],
  )

  const recall = useMemo(
    () =>
      muscleTasks
        .filter((item) => !/delete|format|factory|truncate|usu[nń]|kasuj/i.test(`${item.id} ${item.task}`))
        .map((item) => ({
          id: `recall:${item.id}`,
          category: item.category,
          task: item.task,
          answer: item.answer,
          path: item.path,
          explanation: item.hint,
        })),
    [muscleTasks],
  )

  const allExercises = useMemo(() => [...procedures, ...recall], [procedures, recall])
  const reviewCount = allExercises.filter((item) => state.practice[item.id]?.needsReview).length

  useEffect(() => {
    setDisplay({ title: 'MUSCLE MEMORY', sub: t.muscle.lcdSub, right: t.muscle.reviewRight(reviewCount) })
  }, [setDisplay, reviewCount, t])

  useEffect(() => {
    setTask(procedures.find((item) => item.id === requested) ?? null)
    setShown(false)
    setMode(requestedReview ? 'review' : 'practice')
  }, [requested, requestedReview, procedures])

  const pool = useMemo<Exercise[]>(() => {
    if (mode === 'practice') return procedures
    if (mode === 'review') return allExercises.filter((item) => state.practice[item.id]?.needsReview)
    return recall.filter((item) => item.category === mode)
  }, [mode, state.practice, procedures, allExercises, recall])

  const pick = (exclude = task?.id) => {
    const candidates = pool.filter((item) => item.id !== exclude)
    const choices = candidates.length ? candidates : pool
    setTask(choices[Math.floor(Math.random() * choices.length)] ?? null)
    setShown(false)
  }
  const changeMode = (next: Mode) => {
    setMode(next)
    setTask(null)
    setShown(false)
  }
  const assess = (correct: boolean) => {
    if (!task) return
    dispatch({ type: 'PRACTICE_RESULT', id: task.id, correct })
    setSession((s) => ({ correct: s.correct + Number(correct), total: s.total + 1 }))
    setTask(null)
    setShown(false)
  }

  return (
    <div className="page">
      <p className="page__lede">{t.muscle.lede}</p>
      <p className="practice-safety">{t.muscle.safety}</p>
      <div className="chipbar" role="toolbar" aria-label={t.muscle.modeAria}>
        <button className={cx('chip', mode === 'practice' && 'is-active')} onClick={() => changeMode('practice')}>{t.muscle.actions}</button>
        <button className={cx('chip', mode === 'review' && 'is-active')} onClick={() => changeMode('review')}>{t.muscle.review(reviewCount)}</button>
      </div>
      <details className="practice-categories">
        <summary>{t.muscle.flashcats}</summary>
        <div className="chipbar">
          {muscleCategories.map((cat) => (
            <button key={cat} className={cx('chip', mode === cat && 'is-active')} onClick={() => changeMode(cat)}>
              {t.muscle.cats[cat]}
            </button>
          ))}
        </div>
      </details>
      <p className="practice-score u-mono" role="status">{t.muscle.score(session.correct, session.total, reviewCount)}</p>
      {!task ? (
        <div className="muscle-start panel-surface">
          <p>{pool.length ? t.muscle.pool(pool.length) : t.muscle.poolEmpty}</p>
          {pool.length > 0 && <HardwareButton label={t.muscle.draw} tone="accent" onClick={() => pick()} />}
        </div>
      ) : (
        <article className="mtask panel-surface">
          <span className="mtask__title u-label">{t.muscle.task}</span>
          <p className="mtask__task">{task.task}</p>
          {!shown ? (
            <div className="mtask__actions">
              <HardwareButton label={t.muscle.show} tone="accent" onClick={() => setShown(true)} />
              <HardwareButton label={t.muscle.skip} onClick={() => pick()} />
            </div>
          ) : (
            <div className="mtask__answer-inner">
              <p>{task.explanation}</p>
              <ButtonSequence buttons={task.answer} path={task.path} size="md" />
              {task.expected && <p className="mtask__hint">{t.muscle.check(task.expected)}</p>}
              {actionsById[task.id]?.warning && <p className="practice-safety">{actionsById[task.id].warning}</p>}
              {task.source && <SourceTag source={task.source} />}
              <div className="mtask__actions">
                <HardwareButton label={t.muscle.gotIt} tone="accent" onClick={() => assess(true)} />
                <HardwareButton label={t.muscle.again} onClick={() => assess(false)} />
              </div>
              {task.route && <Link className="wf-text-action" to={task.route}>{t.muscle.showInWf}</Link>}
            </div>
          )}
        </article>
      )}
      {returnRoute && <Link className="rescue-return__primary u-label" to={returnRoute}>{t.muscle.returnAction}</Link>}
    </div>
  )
}
