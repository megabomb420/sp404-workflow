export type LoopFitStatus = 'target-only' | 'tight' | 'close' | 'adjust'

export interface LoopFitResult {
  beats: number
  targetSeconds: number
  actualSeconds: number | null
  inferredBpm: number | null
  differenceSeconds: number | null
  driftAfterFourSeconds: number | null
  relativeError: number | null
  status: LoopFitStatus
}

/** Czysta matematyka — działa lokalnie, bez modelu i bez sieci. */
export function calculateLoopFit(bpm: number, bars: number, actualSeconds?: number | null): LoopFitResult | null {
  if (!Number.isFinite(bpm) || bpm <= 0 || !Number.isFinite(bars) || bars <= 0) return null
  if (actualSeconds != null && (!Number.isFinite(actualSeconds) || actualSeconds <= 0)) return null
  const beats = bars * 4
  const targetSeconds = (beats * 60) / bpm
  if (!Number.isFinite(targetSeconds) || targetSeconds <= 0 || (actualSeconds != null && !Number.isFinite(beats * 60 / actualSeconds))) return null

  if (actualSeconds == null) {
    return {
      beats,
      targetSeconds,
      actualSeconds: null,
      inferredBpm: null,
      differenceSeconds: null,
      driftAfterFourSeconds: null,
      relativeError: null,
      status: 'target-only',
    }
  }

  const differenceSeconds = actualSeconds - targetSeconds
  const relativeError = Math.abs(differenceSeconds) / targetSeconds
  const status: LoopFitStatus = Math.abs(differenceSeconds) <= 0.02 ? 'tight' : relativeError <= 0.005 ? 'close' : 'adjust'

  return {
    beats,
    targetSeconds,
    actualSeconds,
    inferredBpm: (beats * 60) / actualSeconds,
    differenceSeconds,
    driftAfterFourSeconds: differenceSeconds * 4,
    relativeError,
    status,
  }
}

export const TAP_MIN_INTERVAL_MS = 200 // 300 BPM
export const TAP_MAX_INTERVAL_MS = 2000 // 30 BPM
export const TAP_IDLE_RESET_MS = 2000
export const TAP_MAX_INTERVALS = 8

export interface TapTempoEstimate {
  bpm: number
  intervals: number
  stable: boolean
}

/**
 * Szacunek BPM ze stuknięć. Punkt startowy do wpisania na SP — nie odczyt tempa z maszyny.
 * Interwały spoza 30–300 BPM są odrzucane, liczy się mediana ostatnich ośmiu.
 */
export function estimateTapBpm(timestampsMs: readonly number[]): TapTempoEstimate | null {
  if (timestampsMs.length < 2) return null
  const intervals: number[] = []
  for (let i = 1; i < timestampsMs.length; i += 1) {
    const delta = timestampsMs[i] - timestampsMs[i - 1]
    if (delta >= TAP_MIN_INTERVAL_MS && delta <= TAP_MAX_INTERVAL_MS) intervals.push(delta)
  }
  const used = intervals.slice(-TAP_MAX_INTERVALS).sort((a, b) => a - b)
  if (used.length === 0) return null
  const middle = used.length >> 1
  const median = used.length % 2 === 1 ? used[middle] : (used[middle - 1] + used[middle]) / 2
  return {
    bpm: Math.round((60000 / median) * 10) / 10,
    intervals: used.length,
    stable: used.length >= 4,
  }
}

export function formatTapBpm(bpm: number): string {
  const rounded = Math.round(bpm * 10) / 10
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

export function formatLoopSeconds(value: number): string {
  const rounded = Math.round(value * 1000) / 1000
  const minutes = Math.floor(rounded / 60)
  const seconds = rounded - minutes * 60
  return minutes > 0 ? `${minutes}:${seconds.toFixed(3).padStart(6, '0')}` : `${seconds.toFixed(3)} s`
}

export function parsePositiveDecimal(value: string): number | null {
  const text = value.trim().replace(',', '.')
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)) return null
  const parsed = Number(text)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}
