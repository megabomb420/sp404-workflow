import { useEffect, useMemo } from 'react'
import { Link } from '@/lib/rr'
import { useLocalizedWorkflows } from '@/i18n/content'
import { useT } from '@/i18n/useT'
import { useDisplay } from '@/state/display'
import { useStore } from '@/state/store'

export function WorkflowsPage() {
  const { setDisplay } = useDisplay()
  const { state } = useStore()
  const t = useT()
  const { list: workflows } = useLocalizedWorkflows()

  useEffect(() => {
    setDisplay({ title: 'WORKFLOW', sub: t.workflows.lcdSub, right: String(workflows.length) })
  }, [setDisplay, t, workflows.length])

  const groups = useMemo(() => {
    const map = new Map<string, typeof workflows>()
    for (const w of workflows) {
      const list = map.get(w.category) ?? []
      list.push(w)
      map.set(w.category, list)
    }
    return [...map.entries()]
  }, [workflows])

  return (
    <div className="page">
      <p className="page__lede">{t.workflows.lede}</p>
      {groups.map(([cat, list]) => (
        <section key={cat} className="wfgroup">
          <h2 className="wfgroup__cat u-mono">{cat}</h2>
          <ul className="wfgroup__list">
            {list.map((w) => {
              const done = state.progress.completedWorkflows.includes(w.id)
              return (
                <li key={w.id}>
                  <Link to={`/workflow/${w.id}`} className="wfcard panel-surface">
                    <span className="wfcard__head">
                      <span className="wfcard__title u-label">{w.title}</span>
                      {done && <span className="wfcard__done u-mono">✓</span>}
                    </span>
                    {w.blurb ? <p className="wfcard__blurb">{w.blurb}</p> : null}
                    <span className="wfcard__meta u-mono">
                      {t.workflows.stepsMin(w.steps.length, String(w.minutes ?? '—'))} · {t.difficulty[w.difficulty]}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
