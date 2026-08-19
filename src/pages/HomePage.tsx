import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PadGrid, PadConfig } from '../components/hardware/PadGrid'
import { useDisplay } from '../state/display'
import { useStore } from '../state/store'
import { homePads, sectionsById } from '../data/sections'

export function HomePage() {
  const navigate = useNavigate()
  const { setDisplay } = useDisplay()
  const { state } = useStore()

  useEffect(() => {
    setDisplay({ title: 'SP WORKFLOW', sub: state.ui.lastSection ? 'READY' : 'READY', right: '' })
  }, [setDisplay, state.ui.lastSection])

  const pads: PadConfig[] = homePads.map((p) => ({
    pad: p.pad,
    label: p.label,
    sublabel: p.sublabel,
    tone: p.tone,
    onClick: () => navigate(p.route),
  }))

  const recent = state.ui.recent.map((id) => sectionsById[id]).filter((s): s is NonNullable<typeof s> => !!s)

  return (
    <div className="page home">
      <PadGrid items={pads} />

      <div className="home__chips" role="list">
        <Link to="/section/start" className="chip u-label" role="listitem">START HERE</Link>
        <Link to="/workflows" className="chip u-label" role="listitem">QUICK WORKFLOWS</Link>
        <Link to="/muscle" className="chip u-label" role="listitem">MUSCLE MEMORY</Link>
        <Link to="/sources" className="chip u-label" role="listitem">GLOSSARY</Link>
      </div>

      {recent.length > 0 && (
        <section className="home__recent panel-surface" aria-label="ostatnio otwarte">
          <span className="home__recent-k u-label">RECENT</span>
          <div className="home__recent-list">
            {recent.map((s) => (
              <button
                key={s.id}
                type="button"
                className="home__recent-item"
                onClick={() => navigate(`/section/${s.id}`)}
              >
                <span className="u-mono">{String(s.pad).padStart(2, '0')}</span>
                <span className="u-label">{s.title}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
