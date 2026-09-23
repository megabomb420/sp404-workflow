export const PAD_BANKS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] as const
export const PAD_COUNT = 16
export const PAD_LABEL_MAX = 14

export type PadBank = (typeof PAD_BANKS)[number]

/** Klucz pada: bank A–J + numer 1–16, np. "A1", "J16". */
const PAD_KEY = /^[A-J](?:1[0-6]|[1-9])$/

export function isPadBank(value: unknown): value is PadBank {
  return typeof value === 'string' && (PAD_BANKS as readonly string[]).includes(value)
}

/** `''` dla banku lub numeru spoza zakresu — wołający nic wtedy nie zapisuje. */
export function padKey(bank: string, pad: number): string {
  if (!isPadBank(bank) || !Number.isInteger(pad) || pad < 1 || pad > PAD_COUNT) return ''
  return `${bank}${pad}`
}

export function padLabel(map: Record<string, string>, bank: string, pad: number): string | null {
  const key = padKey(bank, pad)
  return key ? map[key] ?? null : null
}

/** Piszący przycina etykietę do `PAD_LABEL_MAX`; pusty tekst usuwa przypisanie. */
export function setPadLabel(map: Record<string, string>, key: string, label: string): Record<string, string> {
  if (!PAD_KEY.test(key)) return map
  const text = cleanLabel(label).slice(0, PAD_LABEL_MAX).trim()
  if (!text) {
    if (!(key in map)) return map
    const next = { ...map }
    delete next[key]
    return next
  }
  if (map[key] === text) return map
  return { ...map, [key]: text }
}

/**
 * Mapa z `spw.state.v1` przechodzi tu przy każdym wczytaniu: klucze spoza A–J × 1–16,
 * nie-stringi, puste i prze długie etykiety wypadają. Stary wpis bez `pads` daje `{}`.
 */
export function sanitizePadMap(raw: unknown): Record<string, string> {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const next: Record<string, string> = {}
  for (const [key, value] of Object.entries(raw)) {
    if (!PAD_KEY.test(key) || typeof value !== 'string') continue
    const text = cleanLabel(value)
    if (!text || text.length > PAD_LABEL_MAX) continue
    next[key] = text
  }
  return next
}

function cleanLabel(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}
