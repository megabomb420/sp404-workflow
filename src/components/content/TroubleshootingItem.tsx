import { useState } from 'react'
import type { Troubleshooting } from '@/data/types'
import { useT } from '@/i18n/useT'
import { useStore } from '@/state/store'
import { SourceTag } from './SourceTag'
import cx from '@/utils/cx'

export function TroubleshootingItem({ item, defaultOpen = false, order }: { item: Troubleshooting; defaultOpen?: boolean; order?: number }) {
  const [open, setOpen] = useState(defaultOpen)
  const { isFav, dispatch } = useStore()
  const fav = isFav('troubleshooting', item.id)
  const t = useT()

  return (
    <article className="tcard panel-surface">
      <button type="button" className="tcard__trigger" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="tcard__symptom u-label">
          {order ? <span className="tcard__order u-mono">{String(order).padStart(2, '0')}</span> : null}
          {item.symptom}
        </span>
        <span className={cx('tcard__chev', open && 'is-open')} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="tcard__body">
          <div className="tcard__row">
            <span className="tcard__k u-label">{t.trouble.why}</span>
            <p>{item.cause}</p>
          </div>
          <div className="tcard__row">
            <span className="tcard__k u-label">{t.trouble.fix}</span>
            <p>{item.fix}</p>
          </div>
          <div className="tcard__foot">
            <button
              type="button"
              className={`tcard__star${fav ? ' is-fav' : ''}`}
              onClick={() => dispatch({ type: 'TOGGLE_FAV', kind: 'troubleshooting', id: item.id })}
              aria-pressed={fav}
            >
              {fav ? t.fav.inFav : t.fav.addShort}
            </button>
            <SourceTag source={item.source} kind={item.kind} />
          </div>
        </div>
      )}
    </article>
  )
}
