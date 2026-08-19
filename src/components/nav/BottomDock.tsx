import { NavLink } from 'react-router-dom'
import cx from '../../utils/cx'

const TABS = [
  { to: '/', label: 'HOME', icon: 'M3 10.5L12 3l9 7.5M5 9v11h5v-6h4v6h5V9' },
  { to: '/search', label: 'SEARCH', icon: 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4.5-4.5' },
  { to: '/workflows', label: 'WORKFLOW', icon: 'M4 6h16M4 12h10M4 18h16M16 3l3 3-3 3M17 9l3 3-3 3' },
  { to: '/shortcuts', label: 'SHORTCUTS', icon: 'M6 3h12a1 1 0 011 1v16a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1zM9 9h6M9 13h6M9 17h4' },
  { to: '/kit', label: 'KIT', icon: 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.7 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z' },
] as const

/** Stały dolny dock — nawigacja jedną ręką, safe-area bottom. */
export function BottomDock() {
  return (
    <nav className="dock" aria-label="nawigacja główna">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.to === '/'}
          className={({ isActive }) => cx('dock__tab', isActive && 'is-active')}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d={t.icon} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="dock__label u-label">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
