import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShortcutCard } from '../components/content/ShortcutCard'
import { TroubleshootingItem } from '../components/content/TroubleshootingItem'
import { shortcutsById } from '../data/shortcuts'
import { workflowsById } from '../data/workflows'
import { troubleshootingById } from '../data/troubleshooting'
import { useDisplay } from '../state/display'
import { useStore } from '../state/store'

/** MY KIT — osobisty zestaw ulubionych: skróty, workflow, fixy. */
export function KitPage() {
  const { setDisplay } = useDisplay()
  const { state } = useStore()

  useEffect(() => {
    setDisplay({ title: 'MY KIT', sub: 'ulubione', right: '' })
  }, [setDisplay])

  const favShortcuts = state.favorites.shortcuts.map((id) => shortcutsById[id]).filter(Boolean)
  const favWorkflows = state.favorites.workflows.map((id) => workflowsById[id]).filter(Boolean)
  const favTroubles = state.favorites.troubleshooting.map((id) => troubleshootingById[id]).filter(Boolean)

  const total = favShortcuts.length + favWorkflows.length + favTroubles.length

  if (total === 0) {
    return (
      <div className="page">
        <h1 className="page__title u-label">MY KIT</h1>
        <div className="kit-empty panel-surface">
          <span className="kit-empty__star" aria-hidden="true">☆</span>
          <p>
            Twój zestaw jest pusty. Dodawaj ulubione przez ★ przy skrótach, workflow i problemach z sekcji
            FIX IT — znajdziesz je tu szybciej.
          </p>
          <Link to="/shortcuts" className="chip u-label">PRZEGLĄDAJ SKRÓTY</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <h1 className="page__title u-label">MY KIT</h1>
      <p className="page__lede">{total} {total === 1 ? 'element' : 'elementów'} w zestawie.</p>

      {favWorkflows.length > 0 && (
        <section className="wfgroup">
          <h2 className="wfgroup__cat u-mono">WORKFLOW</h2>
          <ul className="wfgroup__list">
            {favWorkflows.map((w) => (
              <li key={w.id}>
                <Link to={`/workflow/${w.id}`} className="wfcard panel-surface">
                  <span className="wfcard__title u-label">{w.title}</span>
                  <span className="wfcard__meta u-mono">{String(w.steps.length)} KROKÓW</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {favShortcuts.length > 0 && (
        <section className="wfgroup">
          <h2 className="wfgroup__cat u-mono">SKRÓTY</h2>
          <div className="scardlist">
            {favShortcuts.map((s) => (
              <ShortcutCard key={s.id} shortcut={s} />
            ))}
          </div>
        </section>
      )}

      {favTroubles.length > 0 && (
        <section className="wfgroup">
          <h2 className="wfgroup__cat u-mono">FIX IT</h2>
          <div className="tcardlist">
            {favTroubles.map((t) => (
              <TroubleshootingItem key={t.id} item={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
