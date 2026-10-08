import { useEffect, useMemo } from 'react'
import { useSearchParams } from '@/lib/rr'
import { SourceTag } from '@/components/content/SourceTag'
import { useLocalizedGlossary } from '@/i18n/content'
import { useT } from '@/i18n/useT'
import { useDisplay } from '@/state/display'
import { normalizeSearch } from '@/utils/search'

export function GlossaryPage() {
  const { setDisplay } = useDisplay()
  const [params, setParams] = useSearchParams()
  const q = params.get('term') ?? ''
  const setQ = (term: string) => setParams(term ? { term } : {}, { replace: true })
  const t = useT()
  const glossary = useLocalizedGlossary()

  useEffect(() => {
    setDisplay({ title: 'GLOSSARY', sub: t.glossary.lcdSub, right: String(glossary.length) })
  }, [setDisplay, t, glossary.length])

  const list = useMemo(() => {
    const query = normalizeSearch(q)
    if (!query) return glossary
    const exact = glossary.find((g) => normalizeSearch(g.term) === query)
    if (exact) return [exact]
    return glossary.filter(
      (g) =>
        normalizeSearch(g.term).includes(query) ||
        normalizeSearch(g.definition).includes(query) ||
        g.tags.some((tag) => normalizeSearch(tag).includes(query)),
    )
  }, [q, glossary])

  return (
    <div className="page">
      <label className="searchbox panel-surface">
        <span className="searchbox__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </span>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.glossary.placeholder} aria-label={t.glossary.aria} />
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
      {list.length === 0 && <p className="page__empty">{t.glossary.empty}</p>}
    </div>
  )
}
