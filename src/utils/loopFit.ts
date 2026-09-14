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
