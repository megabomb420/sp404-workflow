import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PadGrid, PadConfig } from '../components/hardware/PadGrid'
import { useDisplay } from '../state/display'
import { useStore } from '../state/store'
import { homePads, sectionsById } from '../data/sections'
import { workflows, workflowsById } from '../data/workflows'

const featured = workflows.filter((workflow) => workflow.featured)

export function HomePage() {
  const navigate = useNavigate()
  const { setDisplay } = useDisplay()
  const { state } = useStore()

  useEffect(() => {
    setDisplay({ title: 'NOW', sub: 'co chcesz zrobić?', right: state.progress.activeWorkflowId ? 'RESUME' : 'READY' })
  }, [setDisplay, state.progress.activeWorkflowId])

  const pads: PadConfig[] = homePads.map((pad) => ({
    pad: pad.pad,
    label: pad.label,
    sublabel: pad.sublabel,
    tone: pad.tone,
    onClick: () => navigate(pad.route),
  }))

  const activeId = state.progress.activeWorkflowId
  const active = activeId ? workflowsById[activeId] : undefined
  const activeStep = active ? Math.min(state.progress.workflowStep[active.id] ?? 0, active.steps.length - 1) : 0
  const recent = state.ui.recent.map((id) => sectionsById[id]).filter((section): section is NonNullable<typeof section> => !!section)

  return (
    <div className="page home home--now">
      <header className="now-head">
        <span className="now-head__eyebrow u-mono">SP-404MKII · OFFLINE</span>
        <h1 className="now-head__title u-label">CO ROBISZ TERAZ?</h1>
        <p>Wybierz rezultat. Dostaniesz po jednej czynności i sprawdzisz ją od razu na SP.</p>
      </header>

      {active ? (
        <Link to={`/workflow/${active.id}`} className="continue-card panel-surface">
          <span className="continue-card__signal" aria-hidden="true" />
          <span className="continue-card__body">
            <span className="continue-card__k u-label">CONTINUE</span>
            <strong>{active.title}</strong>
            <span className="u-mono">AKCJA {activeStep + 1}/{active.steps.length} · POSTĘP ZAPISANY</span>
          </span>
          <span className="continue-card__go" aria-hidden="true">→</span>
        </Link>
      ) : null}

      <section className="now-goals" aria-labelledby="now-goals-title">
        <h2 id="now-goals-title" className="now-section-title u-label">ZACZNIJ OD CELU</h2>
        <div className="now-goals__grid">
          {featured.map((workflow, index) => (
            <Link key={workflow.id} to={`/workflow/${workflow.id}`} className="goal-card panel-surface">
              <span className="goal-card__n u-mono">0{index + 1}</span>
              <span className="goal-card__title u-label">{workflow.title}</span>
              <span className="goal-card__blurb">{workflow.blurb}</span>
              <span className="goal-card__meta u-mono">{workflow.minutes} MIN · {workflow.steps.length} AKCJI</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="now-escape">
        <Link to="/fix-it" className="now-escape__item panel-surface">
          <span className="u-label">FIX A PROBLEM</span>
          <small>zacznij od objawu</small>
        </Link>
        <Link to="/search" className="now-escape__item panel-surface">
          <span className="u-label">FIND AN ACTION</span>
          <small>cel, objaw lub przyciski</small>
        </Link>
      </div>

      <details className="browse panel-surface">
        <summary>
          <span>
            <span className="browse__title u-label">BROWSE EVERYTHING</span>
            <span className="browse__sub">pełna mapa funkcji SP Workflow</span>
          </span>
          <span className="browse__chev" aria-hidden="true">⌄</span>
        </summary>
        <div className="browse__body">
          <PadGrid items={pads} />
          <div className="home__chips" role="list">
            <Link to="/section/start" className="chip u-label" role="listitem">START HERE</Link>
            <Link to="/workflows" className="chip u-label" role="listitem">ALL WORKFLOWS</Link>
            <Link to="/muscle" className="chip u-label" role="listitem">MUSCLE MEMORY</Link>
            <Link to="/sources" className="chip u-label" role="listitem">SOURCES</Link>
          </div>
        </div>
      </details>

      {recent.length > 0 && (
        <section className="home__recent panel-surface" aria-label="ostatnio otwarte">
          <span className="home__recent-k u-label">RECENT REFERENCE</span>
          <div className="home__recent-list">
            {recent.map((section) => (
              <button
                key={section.id}
                type="button"
                className="home__recent-item"
                onClick={() => navigate(`/section/${section.id}`)}
              >
                <span className="u-mono">{String(section.pad).padStart(2, '0')}</span>
                <span className="u-label">{section.title}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
