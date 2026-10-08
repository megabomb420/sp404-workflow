import type { Locale } from './locale'

export function pick<T>(locale: Locale, base: T, overlay?: object): T {
  if (locale === 'pl' || !overlay) return base
  return { ...base, ...overlay }
}

export function pickStr(locale: Locale, pl: string, en?: string): string {
  return locale === 'en' && en ? en : pl
}
