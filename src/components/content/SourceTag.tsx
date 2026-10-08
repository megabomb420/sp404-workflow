import { sourceLabel, type Source, type VerifiedKind } from '@/data/types'
import { useT } from '@/i18n/useT'
import { useLocale } from '@/i18n/locale'

export function SourceTag({ source, kind }: { source?: Source; kind?: VerifiedKind }) {
  const t = useT()
  const { locale } = useLocale()
  if (!source && !kind) return null
  const label = source ? sourceLabel(source) : null
  const href = source?.url ?? (source?.page
    ? `https://static.roland.com/assets/media/pdf/SP-404MK2_v5_reference_eng03_W.pdf#page=${source.page}`
    : 'https://static.roland.com/manuals/sp-404mk2_reference_v550/en-US/index.html')
  return (
    <div className="source-evidence"><span className="srctag" aria-label={t.tags.sourceAria(label ?? '', kind ?? '')}>
      {kind === 'tip' && <span className="srctag__pill srctag__pill--tip">{t.tags.tip}</span>}
      {kind === 'verified' && <span className="srctag__pill srctag__pill--verified">{locale === 'en' ? 'DOCUMENTED' : 'Z DOKUMENTACJI'}</span>}
      {label && (
        <a className="srctag__src u-mono" href={href} target="_blank" rel="noreferrer" title={t.tags.openManual}>
          {label} ↗
        </a>
      )}
    </span>
    {source && <details className="source-review"><summary>{source.hardwareTestedAt ? (locale === 'en' ? 'HARDWARE TESTED' : 'TEST NA SPRZĘCIE') : (locale === 'en' ? 'MANUAL STATUS' : 'STATUS INSTRUKCJI')}</summary><p>{source.firmwareVersion ?? source.manual} · {locale === 'en' ? 'Documentation reviewed: ' : 'Weryfikacja dokumentacji: '}{source.reviewedAt ?? (locale === 'en' ? 'date not recorded' : 'brak zapisanej daty')}. {locale === 'en' ? 'Hardware test: ' : 'Test na urządzeniu: '}{source.hardwareTestedAt ?? (locale === 'en' ? 'not performed' : 'nie wykonano')}.</p></details>}
    </div>
  )
}
