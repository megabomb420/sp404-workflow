import { useEffect } from 'react'
import { Link } from '@/lib/rr'
import { ShortcutCard } from '@/components/content/ShortcutCard'
import { TroubleshootingItem } from '@/components/content/TroubleshootingItem'
import { useLocalizedShortcuts, useLocalizedTroubleshooting, useLocalizedWorkflows } from '@/i18n/content'
import { useT } from '@/i18n/useT'
import { useDisplay } from '@/state/display'
import { useStore } from '@/state/store'

export function KitPage() {
  const { setDisplay } = useDisplay()
  const { state } = useStore()
  const t = useT()
  const { byId: shortcutsById } = useLocalizedShortcuts()
  const { byId: workflowsById } = useLocalizedWorkflows()
  const { byId: troubleshootingById } = useLocalizedTroubleshooting()

  useEffect(() => {
    setDisplay({ title: 'MY KIT', sub: t.kit.lcdSub, right: '' })
  }, [setDisplay, t])

  const favShortcuts = state.favorites.shortcuts.map((id) => shortcutsById[id]).filter(Boolean)
  const favWorkflows = state.favorites.workflows.map((id) => workflowsById[id]).filter(Boolean)
  const favTroubles = state.favorites.troubleshooting.map((id) => troubleshootingById[id]).filter(Boolean)
  const total = favShortcuts.length + favWorkflows.length + favTroubles.length

  if (total === 0) {
    return (
      <div className="page">
        <div className="kit-empty panel-surface">
          <span className="kit-empty__star" aria-hidden="true">☆</span>
          <p>{t.kit.empty}</p>
          <Link to="/shortcuts" className="chip u-label">{t.kit.browse}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <p className="page__lede">{t.kit.count(total)}</p>

      {favWorkflows.length > 0 && (
        <section className="wfgroup">
          <h2 className="wfgroup__cat u-mono">WORKFLOW</h2>
          <ul className="wfgroup__list">
            {favWorkflows.map((w) => (
              <li key={w.id}>
                <Link to={`/workflow/${w.id}`} className="wfcard panel-surface">
                  <span className="wfcard__title u-label">{w.title}</span>
                  <span className="wfcard__meta u-mono">{t.kit.steps(w.steps.length)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {favShortcuts.length > 0 && (
        <section className="wfgroup">
          <h2 className="wfgroup__cat u-mono">{t.kit.shortcuts}</h2>
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
            {favTroubles.map((item) => (
              <TroubleshootingItem key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
