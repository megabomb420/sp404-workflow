import { useEffect, useMemo, useState } from 'react'
import { ShortcutCard } from '../components/content/ShortcutCard'
import { shortcuts, shortcutCategories } from '../data/shortcuts'
import { useDisplay } from '../state/display'
import { useStore } from '../state/store'
import cx from '../utils/cx'

type Filter = 'ALL' | (typeof shortcutCategories)[number]

export function ShortcutsPage() {
  const { setDisplay } = useDisplay()
  const { isFav } = useStore()
  const [filter, setFilter] = useState<Filter>('ALL')
  const [favOnly, setFavOnly] = useState(false)

  useEffect(() => {
    setDisplay({ title: 'SHORTCUTS', sub: 'cheat sheet', right: String(shortcuts.length) })
  }, [setDisplay])

  const list = useMemo(() => {
    return shortcuts.filter((s) => {
      if (favOnly && !isFav('shortcuts', s.id)) return false
      if (filter !== 'ALL' && s.category !== filter) return false
      return true
    })
  }, [filter, favOnly, isFav])

  return (
    <div className="page">
      <h1 className="page__title u-label">SHORTCUTS</h1>
      <p className="page__lede">Każda funkcja, dokładne przyciski. Filtruj po kategorii lub pokaż tylko ulubione.</p>

      <div className="chipbar" role="toolbar" aria-label="filtry kategorii">
        <button
          type="button"
          className={cx('chip', filter === 'ALL' && 'is-active')}
          onClick={() => setFilter('ALL')}
        >
          ALL
        </button>
        {shortcutCategories.map((c) => (
          <button
            key={c}
            type="button"
            className={cx('chip', filter === c && 'is-active')}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
        <button
          type="button"
          className={cx('chip', favOnly && 'is-active')}
          onClick={() => setFavOnly((f) => !f)}
          aria-pressed={favOnly}
        >
          ★ ULUBIONE
        </button>
      </div>

      <div className="scardlist">
        {list.map((s) => (
          <ShortcutCard key={s.id} shortcut={s} />
        ))}
      </div>
      {list.length === 0 && (
        <p className="page__empty">Brak skrótów w tym filtrze.</p>
      )}
    </div>
  )
}
