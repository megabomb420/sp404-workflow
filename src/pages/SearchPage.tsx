import { useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams } from '@/lib/rr'
import { ButtonSequence } from '@/components/content/ButtonSequence'
import type { SearchEntry } from '@/data/types'
import { searchIndex } from '@/data/searchIndex'
import { useT } from '@/i18n/useT'
import { useLocale } from '@/i18n/locale'
import { localizeAction, localizeGlossary, localizeShortcut, localizeTrouble, localizeWorkflow, localizeSection } from '@/i18n/content'
import { actionsById } from '@/data/actions'
import { glossary } from '@/data/glossary'
import { shortcutsById } from '@/data/shortcuts'
import { troubleshootingById } from '@/data/troubleshooting'
import { workflowsById } from '@/data/workflows'
import { sectionsById } from '@/data/sections'
import { useDisplay } from '@/state/display'
import { useStore } from '@/state/store'

function localizeEntry(entry: SearchEntry, locale: ReturnType<typeof useLocale>['locale'], t: ReturnType<typeof useT>): SearchEntry {
  if (locale === 'pl') {
    if (entry.kind === 'tool') return { ...entry, preview: t.search.toolPreview }
    if (entry.kind === 'mfx') return { ...entry, preview: t.search.mfxPreview }
    return entry
  }
  if (entry.kind === 'action' && actionsById[entry.id]) {
    const item = localizeAction(actionsById[entry.id], locale)
    return { ...entry, title: item.title, preview: item.expectedResult }
  }
  if (entry.kind === 'shortcut' && shortcutsById[entry.id]) {
    const item = localizeShortcut(shortcutsById[entry.id], locale)
    return { ...entry, preview: item.description }
  }
  if (entry.kind === 'troubleshooting' && troubleshootingById[entry.id]) {
    const item = localizeTrouble(troubleshootingById[entry.id], locale)
    return { ...entry, title: item.symptom, preview: item.cause }
  }
  if (entry.kind === 'workflow' && workflowsById[entry.id]) {
    const item = localizeWorkflow(workflowsById[entry.id], locale)
    return { ...entry, title: item.title, preview: item.blurb ?? entry.preview }
  }
  if (entry.kind === 'section' && sectionsById[entry.id]) {
    const item = localizeSection(sectionsById[entry.id], locale)
    return {
      ...entry,
      title: item.title,
      preview: item.short,
      sectionLabel: t.search.sectionLabel(String(item.pad).padStart(2, '0')),
    }
  }
  if (entry.kind === 'glossary') {
    const term = glossary.find((g) => g.term === entry.id)
    if (term) return { ...entry, preview: localizeGlossary(term, locale).definition }
  }
  if (entry.kind === 'tool') return { ...entry, preview: t.search.toolPreview }
  if (entry.kind === 'mfx') return { ...entry, preview: t.search.mfxPreview }
  return entry
}

export function SearchPage() {
  const { setDisplay } = useDisplay()
  const { state, dispatch } = useStore()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const setQ = (value: string) => setParams(value ? { q: value } : {}, { replace: true })
  const inputRef = useRef<HTMLInputElement>(null)
  const t = useT()
  const { locale } = useLocale()

  const results = useMemo(
    () => searchIndex(q, 40, state.progress.activeWorkflowId).map((entry) => localizeEntry(entry, locale, t)),
    [q, state.progress.activeWorkflowId, locale, t],
  )

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setDisplay({ title: 'SEARCH', sub: q ? t.search.lcdResults : t.search.lcdSub, right: q ? String(results.length) : '' })
  }, [setDisplay, q, results.length, t])

  const grouped = useMemo(() => {
    const groups: Array<{ kind: SearchEntry['kind']; items: SearchEntry[] }> = []
    for (const entry of results) {
      const last = groups[groups.length - 1]
      if (last?.kind === entry.kind) last.items.push(entry)
      else groups.push({ kind: entry.kind, items: [entry] })
    }
    return groups
  }, [results])

  const record = () => dispatch({ type: 'ADD_RECENT_SEARCH', q })

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
          placeholder={t.search.placeholder}
          aria-label={t.search.aria}
          autoComplete="off"
          enterKeyHint="search"
        />
      </label>

      {q.trim() === '' ? (
        <div className="search-empty">
          <p className="search-empty__hint u-label">{t.search.try}</p>
          <div className="chipbar">
            {t.search.suggestions.map((s) => (
              <button key={s} type="button" className="chip" onClick={() => setQ(s)}>
                {s}
              </button>
            ))}
          </div>
          {state.ui.recentSearches.length > 0 && (
            <>
              <p className="search-empty__hint u-label">{t.search.recent}</p>
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
          <p>{t.search.none(q)}</p>
          <Link to={`/fix-it?q=${encodeURIComponent(q)}`} className="chip">{t.search.fixIt}</Link>
        </div>
      ) : (
        grouped.map((g, index) => (
          <section key={`${g.kind}-${index}`} className="sgroup">
            <h2 className="sgroup__cat u-mono">{t.search.kinds[g.kind]}</h2>
            <ul className="sgroup__list">
              {g.items.map((e) => (
                <li key={`${e.kind}-${e.id}`}>
                  <Link to={e.route} className="sresult panel-surface" onClick={record}>
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
