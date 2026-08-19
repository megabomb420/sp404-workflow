import { useEffect, useMemo, useState } from 'react'
import { ButtonSequence } from '../components/content/ButtonSequence'
import { HardwareButton } from '../components/hardware/HardwareButton'
import { MuscleCategory, MuscleTask } from '../data/types'
import { muscleTasks, muscleCategories } from '../data/muscleMemory'
import { useDisplay } from '../state/display'
import { buzz } from '../utils/haptics'
import cx from '../utils/cx'

const CAT_LABEL: Record<MuscleCategory, string> = {
  beginner: 'POCZĄTKUJĄCY',
  sampling: 'SAMPLING',
  sequencer: 'SEQUENCER',
  fx: 'FX',
  advanced: 'ADVANCED',
}

export function MusclePage() {
  const { setDisplay } = useDisplay()
  const [cat, setCat] = useState<'ALL' | MuscleCategory>('ALL')
  const [task, setTask] = useState<MuscleTask | null>(null)
  const [shown, setShown] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    setDisplay({ title: 'MUSCLE MEMORY', sub: 'trainer', right: cat === 'ALL' ? 'ALL' : cat.toUpperCase() })
  }, [setDisplay, cat])

  const pool = useMemo(
    () => (cat === 'ALL' ? muscleTasks : muscleTasks.filter((t) => t.category === cat)),
    [cat],
  )

  const pick = () => {
    buzz(12)
    if (pool.length === 0) return
    let next: MuscleTask
    do {
      next = pool[Math.floor(Math.random() * pool.length)]
    } while (pool.length > 1 && task && next.id === task.id)
    setTask(next)
    setShown(false)
  }

  useEffect(() => {
    if (task && shown) setStreak((s) => s + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown])

  return (
    <div className="page">
      <h1 className="page__title u-label">MUSCLE MEMORY</h1>
      <p className="page__lede">Zadanie → zrób na sprzęcie → sprawdź. Losuj dalej.</p>

      <div className="chipbar" role="toolbar" aria-label="kategoria zadań">
        <button type="button" className={cx('chip', cat === 'ALL' && 'is-active')} onClick={() => setCat('ALL')}>
          ALL
        </button>
        {muscleCategories.map((c) => (
          <button key={c} type="button" className={cx('chip', cat === c && 'is-active')} onClick={() => setCat(c)}>
            {CAT_LABEL[c]}
          </button>
        ))}
      </div>

      {!task ? (
        <div className="muscle-start panel-surface">
          <p>Wybierz kategorię i wciśnij LOSUJ ZADANIE.</p>
          <HardwareButton label="LOSUJ ZADANIE" tone="accent" onClick={pick} />
        </div>
      ) : (
        <div className="mtask panel-surface">
          <span className="mtask__cat u-mono">{CAT_LABEL[task.category]}</span>
          <span className="mtask__title u-label">ZADANIE</span>
          <p className="mtask__task">{task.task}</p>

          {!shown ? (
            <div className="mtask__actions">
              <HardwareButton label="POKAŻ ODPOWIEDŹ" tone="accent" onClick={() => setShown(true)} />
              <HardwareButton label="PODDAJĘ SIĘ → LOSUJ" onClick={pick} />
            </div>
          ) : (
            <div className="mtask__answer-inner">
              {task.hint ? <p className="mtask__hint">{task.hint}</p> : null}
              <ButtonSequence buttons={task.answer} path={task.path} size="md" />
              <div className="mtask__actions">
                <HardwareButton label="ZROBIONE → LOSUJ" tone="accent" onClick={pick} />
              </div>
            </div>
          )}

          <span className="mtask__streak u-mono">SERIA: {streak}</span>
        </div>
      )}
    </div>
  )
}
