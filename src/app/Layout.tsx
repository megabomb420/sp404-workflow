import { Outlet, useNavigate } from 'react-router-dom'
import { MiniDisplay } from '../components/hardware/MiniDisplay'
import { BottomDock } from '../components/nav/BottomDock'

/** Shell: LCD u góry, treść w środku, dock na dole (safe-area). */
export function Layout() {
  const navigate = useNavigate()
  return (
    <div className="shell">
      <header className="shell__top">
        <button
          type="button"
          className="shell__gear"
          onClick={() => navigate('/settings')}
          aria-label="ustawienia"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.6-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3h.1a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9v.1a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <MiniDisplay />
      </header>

      <main className="shell__main">
        <Outlet />
      </main>

      <BottomDock />
    </div>
  )
}
