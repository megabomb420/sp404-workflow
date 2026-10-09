import { useC } from '@/i18n/companion'
import { Link } from '@/lib/rr'
import { DOOM } from '../../data/doom'

export function DoomContext() {
  const c = useC()
  return (
    <aside className="doom-context panel-surface" aria-label={c("wersja i kontekst DOOM OS")}>
      <strong className="u-mono">DOOM OS {DOOM.version} · ROLAND {DOOM.firmware}</strong>
      <p>{c("Te czynności wykonuj w DOOM OS. Opis sterowania pochodzi z Quickstart")} {DOOM.manualVersion}{c("; projekt jest nieoficjalnym firmware.")}</p>
      <Link to="/doom-os" className="doom-context__link">{c("Przewodnik DOOM OS →")}</Link>
    </aside>
  )
}
