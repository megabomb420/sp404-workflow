import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from '@/lib/rr'
import { TroubleshootingItem } from '@/components/content/TroubleshootingItem'
import { RescueGuide } from '@/components/content/RescueGuide'
import { useLocalizedTroubleshooting, useLocalizedWorkflows } from '@/i18n/content'
import { useT } from '@/i18n/useT'
import { useDisplay } from '@/state/display'
import { workflowReturnRoute } from '@/utils/session'
import { normalizeSearch } from '@/utils/search'

export function FixItPage() {
  const { setDisplay } = useDisplay()
  const [params] = useSearchParams()
  const seededIds = useMemo(() => (params.get('ids') ?? '').split(',').filter(Boolean), [params])
  const fromWorkflow = params.get('from')
  const returnRoute = workflowReturnRoute(params)
  const fromStep = returnRoute ? Number(new URLSearchParams(returnRoute.split('?')[1]).get('step')) : 0
  const [q, setQ] = useState(params.get('q') ?? '')
  const contextual = seededIds.length > 0 || Boolean(fromWorkflow)
  const t = useT()
  const { list: troubleshooting, byId: troubleshootingById } = useLocalizedTroubleshooting()
  const { byId: workflowsById } = useLocalizedWorkflows()

  useEffect(() => {
    setDisplay({
      title: contextual ? t.fix.rescue : 'FIX IT',
      sub: contextual ? t.fix.lcdRescue : t.fix.lcdSub,
      right: contextual ? t.lcdContext : String(troubleshooting.length),
    })
  }, [contextual, setDisplay, t, troubleshooting.length])

  const list = useMemo(() => {
    if (seededIds.length) {
      return seededIds.map((id) => troubleshootingById[id]).filter((item): item is NonNullable<typeof item> => Boolean(item))
    }
    const query = normalizeSearch(q)
    if (!query) return troubleshooting
    return troubleshooting.filter(
      (item) =>
        normalizeSearch(item.symptom).includes(query) ||
        normalizeSearch(item.cause).includes(query) ||
        normalizeSearch(item.fix).includes(query) ||
        item.tags.some((tag) => normalizeSearch(tag).includes(query)),
    )
  }, [q, seededIds, troubleshooting, troubleshootingById])

  const sourceWorkflow = fromWorkflow ? workflowsById[fromWorkflow] : undefined

  return (
    <div className="page">
      <p className="page__lede">
        {sourceWorkflow ? t.fix.helpSession(sourceWorkflow.title) : t.fix.lede}
      </p>

      {sourceWorkflow ? (
        <aside className="rescue-context panel-surface">
          <span className="rescue-context__led" aria-hidden="true" />
          <div>
            <span className="rescue-context__k u-label">{t.fix.saved}</span>
            <strong>{sourceWorkflow.title}</strong>
            <span className="u-mono">{t.fix.backTo(fromStep + 1)}</span>
          </div>
        </aside>
      ) : null}

      <RescueGuide seededIds={seededIds} returnRoute={returnRoute} />

      {!seededIds.length ? (
        <label className="searchbox panel-surface">
          <span className="searchbox__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="search"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder={t.fix.placeholder}
            aria-label={t.fix.aria}
          />
        </label>
      ) : (
        <p className="rescue-order u-label">{t.fix.inOrder}</p>
      )}

      <details className="rescue-reference">
        <summary>{t.fix.library(list.length)}</summary>
        <div className="tcardlist">
          {list.map((item, index) => (
            <TroubleshootingItem key={item.id} item={item} order={contextual ? index + 1 : undefined} />
          ))}
        </div>
      </details>

      {list.length === 0 && <p className="page__empty">{t.fix.empty}</p>}

      {returnRoute ? (
        <div className="rescue-return">
          <Link to={returnRoute} className="rescue-return__primary u-label">{t.fix.return}</Link>
          <span className="rescue-return__secondary">{t.fix.returnNote}</span>
        </div>
      ) : null}
    </div>
  )
}
