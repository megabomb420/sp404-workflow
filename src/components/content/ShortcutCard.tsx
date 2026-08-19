import { Shortcut } from '../../data/types'
import { useStore } from '../../state/store'
import { ButtonSequence } from './ButtonSequence'
import { SourceTag } from './SourceTag'

interface ShortcutCardProps {
  shortcut: Shortcut
}

/** Karta skrótu — sekwencja, opis, kategoria, ulubione. */
export function ShortcutCard({ shortcut }: ShortcutCardProps) {
  const { isFav, dispatch } = useStore()
  const fav = isFav('shortcuts', shortcut.id)
  const toggle = () => dispatch({ type: 'TOGGLE_FAV', kind: 'shortcuts', id: shortcut.id })

  return (
    <article className="scard panel-surface">
      <div className="scard__head">
        <span className="scard__cat u-mono">{shortcut.category}</span>
        <button
          type="button"
          className={`scard__star${fav ? ' is-fav' : ''}`}
          onClick={toggle}
          aria-pressed={fav}
          aria-label={fav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.7 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"
              fill={fav ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <h3 className="scard__name u-label">{shortcut.name}</h3>
      <ButtonSequence buttons={shortcut.buttons} path={shortcut.path} size="sm" />
      <p className="scard__desc">{shortcut.description}</p>
      <SourceTag source={shortcut.source} kind={shortcut.kind} />
    </article>
  )
}
