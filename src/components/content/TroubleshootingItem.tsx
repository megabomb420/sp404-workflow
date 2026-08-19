import { useState } from 'react'
import { Troubleshooting } from '../../data/types'
import { useStore } from '../../state/store'
import { SourceTag } from './SourceTag'
import cx from '../../utils/cx'

interface TroubleshootingItemProps {
  item: Troubleshooting
}

/** Akordeon PROBLEM → DLACZEGO → FIX. */
export function TroubleshootingItem({ item }: TroubleshootingItemProps) {
  const [open, setOpen] = useState(false)
  const { isFav, dispatch } = useStore()
  const fav = isFav('troubleshooting', item.id)

  return (
    <article className="tcard panel-surface">
      <button
        type="button"
        className="tcard__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="tcard__symptom u-label">{item.symptom}</span>
        <span className={cx('tcard__chev', open && 'is-open')} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="tcard__body">
          <div className="tcard__row">
            <span className="tcard__k u-label">DLACZEGO</span>
            <p>{item.cause}</p>
          </div>
          <div className="tcard__row">
            <span className="tcard__k u-label">FIX</span>
            <p>{item.fix}</p>
          </div>
          <div className="tcard__foot">
            <button
              type="button"
              className={`tcard__star${fav ? ' is-fav' : ''}`}
              onClick={() => dispatch({ type: 'TOGGLE_FAV', kind: 'troubleshooting', id: item.id })}
              aria-pressed={fav}
            >
              {fav ? '★ W ulubionych' : '☆ Dodaj'}
            </button>
            <SourceTag source={item.source} kind={item.kind} />
          </div>
        </div>
      )}
    </article>
  )
}
