import { LOCALES, useLocale } from '@/i18n/locale'
import { useT } from '@/i18n/useT'
import cx from '@/utils/cx'

export function LangSwitch({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLocale()
  const t = useT()
  return (
    <div className={cx('langsw', compact && 'langsw--compact')} role="group" aria-label={t.lang.aria}>
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          className={cx('langsw__btn', locale === code && 'is-active')}
          aria-pressed={locale === code}
          onClick={() => setLocale(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
