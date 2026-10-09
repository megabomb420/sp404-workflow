export const songRoles = ['intro', 'main', 'break', 'return', 'outro', 'custom'] as const
export type SongRole = typeof songRoles[number]
export interface SongPart { id: string; role: SongRole; pattern: string; bars: number; note: string }
export interface KitVariant { location: string; changes: string }
export interface KitStudio {
  firmware: 'roland' | 'doom'; nextStep: string; finished: boolean
  song: SongPart[]; variants: { a: KitVariant; b: KitVariant }; winner: 'a' | 'b' | null; decision: string
}
const record = (v: unknown): Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : {}
const text = (v: unknown, max: number) => typeof v === 'string' ? v.slice(0, max) : ''
export const defaultStudio = (firmware: KitStudio['firmware'] = 'roland'): KitStudio => ({ firmware, nextStep: '', finished: false, song: [], variants: { a: { location: '', changes: '' }, b: { location: '', changes: '' } }, winner: null, decision: '' })
export function normalizeStudio(value: unknown): KitStudio {
  const raw = record(value), variants = record(raw.variants), song: SongPart[] = []
  for (const value of (Array.isArray(raw.song) ? raw.song : []).slice(0, 8)) {
    const part = record(value)
    if (typeof part.id !== 'string' || !/^[a-zA-Z0-9-]{1,100}$/.test(part.id) || song.some(p => p.id === part.id)) continue
    song.push({ id: part.id, role: songRoles.includes(part.role as SongRole) ? part.role as SongRole : 'custom', pattern: text(part.pattern, 100), bars: [1, 2, 4, 8, 16, 32].includes(Number(part.bars)) ? Number(part.bars) : 4, note: text(part.note, 300) })
  }
  const variant = (key: string): KitVariant => { const v = record(variants[key]); return { location: text(v.location, 100), changes: text(v.changes, 600) } }
  return { firmware: raw.firmware === 'doom' ? 'doom' : 'roland', nextStep: text(raw.nextStep, 1000), finished: raw.finished === true, song, variants: { a: variant('a'), b: variant('b') }, winner: raw.winner === 'a' || raw.winner === 'b' ? raw.winner : null, decision: text(raw.decision, 600) }
}
export function moveSongPart(song: SongPart[], index: number, direction: -1 | 1): SongPart[] {
  const to = index + direction
  if (index < 0 || index >= song.length || to < 0 || to >= song.length) return song
  const result = [...song]; [result[index], result[to]] = [result[to], result[index]]; return result
}
