import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export const LOCALES = ['pl', 'en'] as const
export type Locale = (typeof LOCALES)[number]

const STORAGE_KEY = 'spw.locale'

function readStoredLocale(): Locale {
  try {
    if (typeof localStorage === 'undefined') return 'pl'
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'pl' || value === 'en') return value
  } catch {
    /* ignore */
  }
  return 'pl'
}

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale])
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
