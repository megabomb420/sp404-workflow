import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { workflows } from '../data/workflows'
import { useDisplay } from '../state/display'
import { useStore } from '../state/store'

export function WorkflowsPage() {
  const { setDisplay } = useDisplay()
  const { state } = useStore()

  useEffect(() => {
    setDisplay({ title: 'WORKFLOW', sub: 'tryby krok po kroku', right: String(workflows.length) })
  }, [setDisplay])

  const groups = useMemo(() => {
    const map = new Map<string, typeof workflows>()
    for (const w of workflows) {
      const list = map.get(w.category) ?? []
      list.push(w)
      map.set(w.category, list)
    }
    return [...map.entries()]
  }, [])

  return (
    <div className="page">
      <h1 className="page__title u-label">WORKFLOW</h1>
      <p className="page__lede">Gotowe procedury krok po kroku — uruchom obok samplera i przechodź dalej.</p>

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
                      {String(w.steps.length).padStart(2, '0')} KROKÓW · {w.minutes ?? '—'} MIN ·{' '}
                      {w.difficulty.toUpperCase()}
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
