import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ButtonSequence } from '../components/content/ButtonSequence'
import { SourceTag } from '../components/content/SourceTag'
import { HardwareButton } from '../components/hardware/HardwareButton'
import { actions, actionsById } from '../data/actions'
import { muscleTasks, muscleCategories } from '../data/muscleMemory'
import { MuscleCategory, Source, isWorkflowActionRef } from '../data/types'
import { workflows } from '../data/workflows'
import { useDisplay } from '../state/display'
import { useStore } from '../state/store'
import { workflowReturnRoute } from '../utils/session'
import cx from '../utils/cx'

const CAT_LABEL: Record<MuscleCategory, string> = {
  beginner: 'PODSTAWY', sampling: 'SAMPLING', sequencer: 'SEQUENCER', fx: 'FX', advanced: 'ADVANCED',
}
type Mode = 'practice' | 'review' | MuscleCategory
interface Exercise { id: string; task: string; answer?: string[]; path?: string[]; explanation?: string; expected?: string; source?: Source; route?: string }

const procedures: Exercise[] = actions.filter((a) => a.safety !== 'destructive').map((a) => {
  const workflow = workflows.find((w) => w.steps.some((s) => isWorkflowActionRef(s) && s.actionId === a.id))
  const index = workflow?.steps.findIndex((s) => isWorkflowActionRef(s) && s.actionId === a.id)
  return { id: a.id, task: `${a.title}. ${a.startingState ?? 'Przygotuj tę sytuację na projekcie ćwiczeniowym.'}`, answer: a.buttons, path: a.path,
    explanation: a.action, expected: a.expectedResult, source: a.source, route: workflow ? `/workflow/${workflow.id}?step=${index}` : undefined }
})
const recall = muscleTasks.filter((t) => !/delete|format|factory|truncate|usu[nń]|kasuj/i.test(`${t.id} ${t.task}`))
  .map((t) => ({ id: `recall:${t.id}`, category: t.category, task: t.task, answer: t.answer, path: t.path, explanation: t.hint }))
const allExercises: Exercise[] = [...procedures, ...recall]

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
  const reviewCount = allExercises.filter((t) => state.practice[t.id]?.needsReview).length

  useEffect(() => {
    setDisplay({ title: 'MUSCLE MEMORY', sub: 'trening lokalny', right: `${reviewCount} REVIEW` })
  }, [setDisplay, reviewCount])

  useEffect(() => {
    setTask(procedures.find((t) => t.id === requested) ?? null)
    setShown(false)
    setMode(requestedReview ? 'review' : 'practice')
  }, [requested, requestedReview])

  const pool = useMemo<Exercise[]>(() => {
    if (mode === 'practice') return procedures
    if (mode === 'review') return allExercises.filter((t) => state.practice[t.id]?.needsReview)
    // Destructive operations are never surprise drills.
    return recall.filter((t) => t.category === mode)
  }, [mode, state.practice])

  const pick = (exclude = task?.id) => {
    const candidates = pool.filter((t) => t.id !== exclude)
    const choices = candidates.length ? candidates : pool
    setTask(choices[Math.floor(Math.random() * choices.length)] ?? null)
    setShown(false)
  }
  const changeMode = (next: Mode) => { setMode(next); setTask(null); setShown(false) }
  const assess = (correct: boolean) => {
    if (!task) return
    dispatch({ type: 'PRACTICE_RESULT', id: task.id, correct })
    setSession((s) => ({ correct: s.correct + Number(correct), total: s.total + 1 }))
    setTask(null)
    setShown(false)
  }

  return <div className="page">
    <h1 className="page__title u-label">MUSCLE MEMORY</h1>
    <p className="page__lede">Przypomnij sobie akcję, sprawdź odpowiedź i oceń rezultat. Aplikacja nie widzi sprzętu — ocena należy do Ciebie.</p>
    <p className="practice-safety">Ćwicz na zapasowym projekcie i pustych padach. Możesz też odpowiedzieć z pamięci, bez zmieniania sprzętu.</p>
    <div className="chipbar" role="toolbar" aria-label="tryb treningu">
      <button className={cx('chip', mode === 'practice' && 'is-active')} onClick={() => changeMode('practice')}>AKCJE WORKFLOW</button>
      <button className={cx('chip', mode === 'review' && 'is-active')} onClick={() => changeMode('review')}>DO POWTÓRKI ({reviewCount})</button>
    </div>
    <details className="practice-categories"><summary>Fiszki skrótów według kategorii</summary>
      <div className="chipbar">{muscleCategories.map((cat) => <button key={cat} className={cx('chip', mode === cat && 'is-active')} onClick={() => changeMode(cat)}>{CAT_LABEL[cat]}</button>)}</div>
    </details>
    <p className="practice-score u-mono" role="status">SAMOOCENA W TEJ SESJI: {session.correct}/{session.total} · DO POWTÓRKI: {reviewCount}</p>
    {!task ? <div className="muscle-start panel-surface">
      <p>{pool.length ? `${pool.length} zadań do wyboru.` : 'Brak zadań w tej grupie. Trudności zgłoszone w workflow pojawią się tutaj.'}</p>
      {pool.length > 0 && <HardwareButton label="LOSUJ ZADANIE" tone="accent" onClick={() => pick()} />}
    </div> : <article className="mtask panel-surface">
      <span className="mtask__title u-label">ZADANIE</span>
      <p className="mtask__task">{task.task}</p>
      {!shown ? <div className="mtask__actions">
        <HardwareButton label="POKAŻ ODPOWIEDŹ" tone="accent" onClick={() => setShown(true)} />
        <HardwareButton label="POMIŃ BEZ OCENY" onClick={() => pick()} />
      </div> : <div className="mtask__answer-inner">
        <p>{task.explanation}</p>
        <ButtonSequence buttons={task.answer} path={task.path} size="md" />
        {task.expected && <p className="mtask__hint">Sprawdź: {task.expected}</p>}
        {actionsById[task.id]?.warning && <p className="practice-safety">{actionsById[task.id].warning}</p>}
        {task.source && <SourceTag source={task.source} />}
        <div className="mtask__actions">
          <HardwareButton label="UMIEM TO" tone="accent" onClick={() => assess(true)} />
          <HardwareButton label="DO POWTÓRKI" onClick={() => assess(false)} />
        </div>
        {task.route && <Link className="wf-text-action" to={task.route}>Pokaż w workflow →</Link>}
      </div>}
    </article>}
    {returnRoute && <Link className="rescue-return__primary u-label" to={returnRoute}>WRÓĆ DO PRZERWANEJ AKCJI →</Link>}
  </div>
}
