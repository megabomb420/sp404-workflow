import { useEffect, useMemo, useState } from 'react'
import { TroubleshootingItem } from '../components/content/TroubleshootingItem'
import { troubleshooting } from '../data/troubleshooting'
import { useDisplay } from '../state/display'

const normalize = (s: string) => s.toLowerCase().trim()

export function FixItPage() {
  const { setDisplay } = useDisplay()
  const [q, setQ] = useState('')

  useEffect(() => {
    setDisplay({ title: 'FIX IT', sub: 'troubleshooting', right: String(troubleshooting.length) })
  }, [setDisplay])

  const list = useMemo(() => {
    const query = normalize(q)
    if (!query) return troubleshooting
    return troubleshooting.filter(
      (t) =>
        normalize(t.symptom).includes(query) ||
        normalize(t.cause).includes(query) ||
        normalize(t.fix).includes(query) ||
        t.tags.some((tag) => normalize(tag).includes(query)),
    )
  }, [q])

  return (
    <div className="page">
      <h1 className="page__title u-label">FIX IT</h1>
      <p className="page__lede">Problem → dlaczego → fix. Szybko, przy sprzęcie.</p>

      <label className="searchbox panel-surface">
        <span className="searchbox__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="np. clipping, brak dźwięku, loop click…"
          aria-label="szukaj problemu"
        />
      </label>

      <div className="tcardlist">
        {list.map((t) => (
          <TroubleshootingItem key={t.id} item={t} />
        ))}
      </div>
      {list.length === 0 && <p className="page__empty">Brak wyników.</p>}
    </div>
  )
}
