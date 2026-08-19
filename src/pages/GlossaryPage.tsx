import { useEffect, useMemo, useState } from 'react'
import { SourceTag } from '../components/content/SourceTag'
import { glossary } from '../data/glossary'
import { useDisplay } from '../state/display'

export function GlossaryPage() {
  const { setDisplay } = useDisplay()
  const [q, setQ] = useState('')

  useEffect(() => {
    setDisplay({ title: 'GLOSSARY', sub: 'słownik pojęć', right: String(glossary.length) })
  }, [setDisplay])

  const list = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return glossary
    return glossary.filter(
      (g) =>
        g.term.toLowerCase().includes(query) ||
        g.definition.toLowerCase().includes(query) ||
        g.tags.some((t) => t.toLowerCase().includes(query)),
    )
  }, [q])

  return (
    <div className="page">
      <h1 className="page__title u-label">GLOSSARY</h1>
      <label className="searchbox panel-surface">
        <span className="searchbox__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </span>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Project, Bank, Pad, BPM SYNC…" aria-label="szukaj w słowniku" />
      </label>
      <dl className="glist">
        {list.map((g) => (
          <div key={g.term} className="glist__item panel-surface">
            <dt className="glist__term u-label">{g.term}</dt>
            <dd className="glist__def">{g.definition}</dd>
            <SourceTag source={g.source} />
          </div>
        ))}
      </dl>
      {list.length === 0 && <p className="page__empty">Brak haseł.</p>}
    </div>
  )
}
