import { useEffect, useMemo, useState } from 'react'
import { ShortcutCard } from '@/components/content/ShortcutCard'
import { shortcutCategories } from '@/data/shortcuts'
import { useLocalizedShortcuts } from '@/i18n/content'
import { useT } from '@/i18n/useT'
import { useDisplay } from '@/state/display'
import { useStore } from '@/state/store'
import cx from '@/utils/cx'
import { useSearchParams } from '@/lib/rr'

type Filter = 'ALL' | (typeof shortcutCategories)[number]

export function ShortcutsPage() {
  const { setDisplay } = useDisplay()
  const { isFav } = useStore()
  const [filter, setFilter] = useState<Filter>('ALL')
  const [favOnly, setFavOnly] = useState(false)
  const [params, setParams] = useSearchParams()
  const t = useT()
  const { list: shortcuts } = useLocalizedShortcuts()
  const selected = shortcuts.find((s) => s.id === params.get('id'))

  useEffect(() => {
    setDisplay({ title: 'SHORTCUTS', sub: t.shortcuts.lcdSub, right: String(shortcuts.length) })
  }, [setDisplay, t, shortcuts.length])

  const list = useMemo(() => {
    return shortcuts.filter((s) => {
      if (selected) return s.id === selected.id
      if (favOnly && !isFav('shortcuts', s.id)) return false
      if (filter !== 'ALL' && s.category !== filter) return false
      return true
    })
  }, [filter, favOnly, isFav, selected, shortcuts])

  return (
    <div className="page">
      <p className="page__lede">{t.shortcuts.lede}</p>

      {selected && (
        <button className="chip" onClick={() => { setParams({}); setFilter('ALL'); setFavOnly(false) }}>
          {t.shortcuts.allShortcuts}
        </button>
      )}
      {!selected && (
        <div className="chipbar" role="toolbar" aria-label={t.shortcuts.filtersAria}>
          <button type="button" className={cx('chip', filter === 'ALL' && 'is-active')} onClick={() => setFilter('ALL')}>
            {t.shortcuts.all}
          </button>
          {shortcutCategories.map((c) => (
            <button key={c} type="button" className={cx('chip', filter === c && 'is-active')} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
          <button type="button" className={cx('chip', favOnly && 'is-active')} onClick={() => setFavOnly((f) => !f)} aria-pressed={favOnly}>
            {t.shortcuts.fav}
          </button>
        </div>
      )}

      <div className="scardlist">
        {list.map((s) => (
          <ShortcutCard key={s.id} shortcut={s} />
        ))}
      </div>
      {list.length === 0 && <p className="page__empty">{t.shortcuts.empty}</p>}
    </div>
  )
}
