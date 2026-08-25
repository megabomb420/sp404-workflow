import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ButtonSequence } from '../components/content/ButtonSequence'
import { SearchEntry } from '../data/types'
import { searchIndex, SEARCH_SUGGESTIONS } from '../data/searchIndex'
import { useDisplay } from '../state/display'
import { useStore } from '../state/store'

const KIND_ORDER = ['action', 'tool', 'troubleshooting', 'workflow', 'shortcut', 'section', 'glossary', 'mfx'] as const
const KIND_LABEL: Record<SearchEntry['kind'], string> = {
  action: 'DO NOW · DOKŁADNA AKCJA',
  tool: 'USE NOW · OFFLINE TOOL',
  section: 'SEKCJE',
  shortcut: 'SKRÓTY',
  workflow: 'WORKFLOW',
  troubleshooting: 'FIX IT',
  glossary: 'GLOSSARY',
  mfx: 'EFFECTS · MFX',
}

export function SearchPage() {
  const { setDisplay } = useDisplay()
  const { state, dispatch } = useStore()
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => searchIndex(q, 40, state.progress.activeWorkflowId), [q, state.progress.activeWorkflowId])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setDisplay({ title: 'SEARCH', sub: q ? 'wyniki' : 'wpisz funkcję lub skrót', right: q ? String(results.length) : '' })
  }, [setDisplay, q, results.length])

  const grouped = useMemo(() => {
    const groups = KIND_ORDER.map((k) => ({ kind: k, items: results.filter((r) => r.kind === k) }))
    return groups.filter((g) => g.items.length > 0)
  }, [results])

  const record = (e: SearchEntry) => dispatch({ type: 'ADD_RECENT_SEARCH', q: e.title })

  return (
    <div className="page page--search">
      <label className="searchbox searchbox--big panel-surface">
        <span className="searchbox__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </span>
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="co chcesz zrobić albo co nie działa?"
          aria-label="szukaj w całym przewodniku"
          autoComplete="off"
          enterKeyHint="search"
        />
      </label>

      {q.trim() === '' ? (
        <div className="search-empty">
          <p className="search-empty__hint u-label">SPRÓBUJ WPISAĆ</p>
          <div className="chipbar">
            {SEARCH_SUGGESTIONS.map((s) => (
              <button key={s} type="button" className="chip" onClick={() => setQ(s)}>
                {s}
              </button>
            ))}
          </div>
          {state.ui.recentSearches.length > 0 && (
            <>
              <p className="search-empty__hint u-label">OSTATNIE</p>
              <div className="chipbar">
                {state.ui.recentSearches.map((s) => (
                  <button key={s} type="button" className="chip" onClick={() => setQ(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : results.length === 0 ? (
        <div className="search-no-results panel-surface">
          <p>Brak pewnego wyniku dla „{q}".</p>
          <Link to={`/fix-it?q=${encodeURIComponent(q)}`} className="chip">SZUKAJ PO OBJAWIE W FIX IT</Link>
        </div>
      ) : (
        grouped.map((g) => (
          <section key={g.kind} className="sgroup">
            <h2 className="sgroup__cat u-mono">{KIND_LABEL[g.kind]}</h2>
            <ul className="sgroup__list">
              {g.items.map((e) => (
                <li key={`${e.kind}-${e.id}`}>
                  <Link to={e.route} className="sresult panel-surface" onClick={() => record(e)}>
                    <span className="sresult__head">
                      <span className="sresult__title u-label">{e.title}</span>
                      <span className="sresult__src u-mono">{e.sectionLabel}</span>
                    </span>
                    {e.buttons || e.path ? <ButtonSequence buttons={e.buttons} path={e.path} size="sm" /> : null}
                    <p className="sresult__preview">{e.preview}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
