/** Drobna haptyka — działa tylko tam, gdzie browser + ustawienie na to pozwalają. */

let supports = typeof navigator !== 'undefined' && 'vibrate' in navigator

export function setHapticsEnabled(on: boolean): void {
  supports = typeof navigator !== 'undefined' && 'vibrate' in navigator && on
}

export function buzz(pattern: number | number[] = 12): void {
  if (supports) {
    try {
      navigator.vibrate(pattern)
    } catch {
      /* ignore */
    }
  }
}
