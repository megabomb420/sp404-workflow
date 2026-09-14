import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { TroubleshootingItem } from '../components/content/TroubleshootingItem'
import { troubleshooting, troubleshootingById } from '../data/troubleshooting'
import { workflowsById } from '../data/workflows'
import { useDisplay } from '../state/display'
import { RescueGuide } from '../components/content/RescueGuide'
import { workflowReturnRoute } from '../utils/session'
import { normalizeSearch } from '../utils/search'

const normalize = normalizeSearch

export function FixItPage() {
  const { setDisplay } = useDisplay()
  const [params] = useSearchParams()
  const seededIds = useMemo(() => (params.get('ids') ?? '').split(',').filter(Boolean), [params])
  const fromWorkflow = params.get('from')
  const returnRoute = workflowReturnRoute(params)
  const fromStep = returnRoute ? Number(new URLSearchParams(returnRoute.split('?')[1]).get('step')) : 0
  const [q, setQ] = useState(params.get('q') ?? '')
  const contextual = seededIds.length > 0 || Boolean(fromWorkflow)

  useEffect(() => {
    setDisplay({
      title: contextual ? 'RESCUE' : 'FIX IT',
      sub: contextual ? 'sprawdź po kolei' : 'zacznij od objawu',
      right: contextual ? 'CONTEXT' : String(troubleshooting.length),
    })
  }, [contextual, setDisplay])

  const list = useMemo(() => {
    if (seededIds.length) {
      return seededIds.map((id) => troubleshootingById[id]).filter((item): item is NonNullable<typeof item> => Boolean(item))
    }
    const query = normalize(q)
    if (!query) return troubleshooting
    return troubleshooting.filter(
      (item) =>
        normalize(item.symptom).includes(query) ||
        normalize(item.cause).includes(query) ||
        normalize(item.fix).includes(query) ||
        item.tags.some((tag) => normalize(tag).includes(query)),
    )
  }, [q, seededIds])

  const sourceWorkflow = fromWorkflow ? workflowsById[fromWorkflow] : undefined

  return (
    <div className="page">
      <h1 className="page__title u-label">{contextual ? 'RESCUE' : 'FIX IT'}</h1>
      <p className="page__lede">
        {sourceWorkflow
          ? `Pomoc do sesji „${sourceWorkflow.title}”. Twój krok pozostaje zachowany.`
          : 'Opisz objaw, który widzisz lub słyszysz. Nie musisz znać nazwy funkcji.'}
      </p>

      {sourceWorkflow ? (
        <aside className="rescue-context panel-surface">
          <span className="rescue-context__led" aria-hidden="true" />
          <div>
            <span className="rescue-context__k u-label">ZAPISANA SESJA</span>
            <strong>{sourceWorkflow.title}</strong>
            <span className="u-mono">WRÓCISZ DO AKCJI {fromStep + 1}</span>
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
            placeholder="np. nie słychać USB, print jest suchy…"
            aria-label="szukaj po objawie"
          />
        </label>
      ) : (
        <p className="rescue-order u-label">SPRAWDŹ PO KOLEI</p>
      )}

      <details className="rescue-reference"><summary>Biblioteka porad ({list.length})</summary><div className="tcardlist">
        {list.map((item, index) => (
          <TroubleshootingItem
            key={item.id}
            item={item}
            order={contextual ? index + 1 : undefined}
          />
        ))}
      </div></details>

      {list.length === 0 && <p className="page__empty">Nie znaleziono tego objawu. Spróbuj opisać to, co słyszysz lub widzisz na ekranie.</p>}

      {returnRoute ? (
        <div className="rescue-return">
          <Link to={returnRoute} className="rescue-return__primary u-label">WRÓĆ DO AKCJI →</Link>
          <span className="rescue-return__secondary">Powrót nie oznacza potwierdzenia sukcesu.</span>
        </div>
      ) : null}
    </div>
  )
}
