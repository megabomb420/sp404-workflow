import { sourceLabel, Source, VerifiedKind } from '../../data/types'

interface SourceTagProps {
  source?: Source
  kind?: VerifiedKind
}

/** Mała pilka źródła + typ treści (ROLAND/VERIFIED vs WORKFLOW TIP). */
export function SourceTag({ source, kind }: SourceTagProps) {
  if (!source && !kind) return null
  const label = source ? sourceLabel(source) : null
  const doom = source?.manual.startsWith('DOOM')
  const href = source?.url ?? (doom ? 'https://klangfeldlabs.com/doom-os/manual/' : source?.page
    ? `https://static.roland.com/assets/media/pdf/SP-404MK2_v5_reference_eng03_W.pdf#page=${source.page}`
    : 'https://static.roland.com/manuals/sp-404mk2_reference_v550/en-US/index.html')
  return (
    <div className="source-evidence">
    <span className="srctag" aria-label={`Źródło: ${label ?? ''}${kind ? ' — ' + kind : ''}`}>
      {kind === 'tip' && <span className="srctag__pill srctag__pill--tip">WORKFLOW TIP</span>}
      {kind === 'verified' && <span className="srctag__pill srctag__pill--verified">{doom ? 'DOOM OS / MANUAL' : 'ROLAND / VERIFIED'}</span>}
      {label && <a className="srctag__src u-mono" href={href} target="_blank" rel="noreferrer" title={`Otwórz ${doom ? 'dokumentację DOOM OS' : 'manual Rolanda'} (wymaga internetu)`}>{label} ↗</a>}
    </span>
    {source && <details className="source-review">
      <summary className="u-mono">{source.hardwareTestedAt ? 'POTWIERDZONE NA SPRZĘCIE' : 'Z DOKUMENTACJI'} · STATUS INSTRUKCJI</summary>
      <dl>
        <div><dt>Wersja</dt><dd>{source.firmwareVersion ?? (doom ? `DOOM OS ${source.manual.replace('DOOM', '')} alpha · Roland 5.52` : 'Roland · Reference Manual 5.50')}</dd></div>
        <div><dt>Przegląd źródła</dt><dd>{source.reviewedAt ?? 'Data nie zapisana dla tej czynności'}</dd></div>
        <div><dt>Test na samplerze</dt><dd>{source.hardwareTestedAt ?? 'Brak potwierdzenia testu na sprzęcie'}</dd></div>
      </dl>
    </details>}
    </div>
  )
}
