import { sourceLabel, Source, VerifiedKind } from '../../data/types'

interface SourceTagProps {
  source?: Source
  kind?: VerifiedKind
}

/** Mała pilka źródła + typ treści (ROLAND/VERIFIED vs WORKFLOW TIP). */
export function SourceTag({ source, kind }: SourceTagProps) {
  if (!source && !kind) return null
  const label = source ? sourceLabel(source) : null
  const href = source?.url ?? (source?.page
    ? `https://static.roland.com/assets/media/pdf/SP-404MK2_v5_reference_eng03_W.pdf#page=${source.page}`
    : 'https://static.roland.com/manuals/sp-404mk2_reference_v550/en-US/index.html')
  return (
    <span className="srctag" aria-label={`Źródło: ${label ?? ''}${kind ? ' — ' + kind : ''}`}>
      {kind === 'tip' && <span className="srctag__pill srctag__pill--tip">WORKFLOW TIP</span>}
      {kind === 'verified' && <span className="srctag__pill srctag__pill--verified">ROLAND / VERIFIED</span>}
      {label && <a className="srctag__src u-mono" href={href} target="_blank" rel="noreferrer" title="Otwórz manual Rolanda (wymaga internetu)">{label} ↗</a>}
    </span>
  )
}
