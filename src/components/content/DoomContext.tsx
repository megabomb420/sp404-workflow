import { useC } from '@/i18n/companion'
import { Link } from '@/lib/rr'
import { DOOM } from '../../data/doom'

export function DoomContext({ compact = false }: { compact?: boolean }) {
  const c = useC()
  const version = <>DOOM OS {DOOM.version}</>
  const body = <>
    <p>{c("Te czynności wykonuj w DOOM OS. Opis sterowania pochodzi z Quickstart")} {DOOM.manualVersion}{c("; projekt jest nieoficjalnym firmware.")}</p>
    <Link to="/doom-os" className="doom-context__link">{c("Przewodnik DOOM OS →")}</Link>
  </>
  if (compact) return <details className="doom-context doom-context--compact panel-surface" aria-label={c("wersja i kontekst DOOM OS")}>
    <summary className="u-mono">{version}</summary>
    {body}
  </details>
  return (
    <aside className="doom-context panel-surface" aria-label={c("wersja i kontekst DOOM OS")}>
      <strong className="u-mono">{version}</strong>
      {body}
    </aside>
  )
}
