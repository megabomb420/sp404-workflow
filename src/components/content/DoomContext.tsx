import { Link } from 'react-router-dom'
import { DOOM } from '../../data/doom'

export function DoomContext() {
  return (
    <aside className="doom-context panel-surface" aria-label="wersja i kontekst DOOM OS">
      <strong className="u-mono">DOOM OS {DOOM.version} · ROLAND {DOOM.firmware}</strong>
      <p>Te czynności wykonuj w DOOM OS. Opis sterowania pochodzi z Quickstart {DOOM.manualVersion}; projekt jest nieoficjalnym firmware.</p>
      <Link to="/doom-os" className="doom-context__link">Przewodnik DOOM OS →</Link>
    </aside>
  )
}
