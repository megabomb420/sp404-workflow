import { sourceLabel, Source, VerifiedKind } from '../../data/types'

interface SourceTagProps {
  source?: Source
  kind?: VerifiedKind
}

/** Mała pilka źródła + typ treści (ROLAND/VERIFIED vs WORKFLOW TIP). */
export function SourceTag({ source, kind }: SourceTagProps) {
  if (!source && !kind) return null
  const label = source ? sourceLabel(source) : null
  return (
    <span className="srctag" aria-label={`Źródło: ${label ?? ''}${kind ? ' — ' + kind : ''}`}>
      {kind === 'tip' && <span className="srctag__pill srctag__pill--tip">WORKFLOW TIP</span>}
      {kind === 'verified' && <span className="srctag__pill srctag__pill--verified">ROLAND / VERIFIED</span>}
      {label && <span className="srctag__src u-mono">{label}</span>}
    </span>
  )
}
