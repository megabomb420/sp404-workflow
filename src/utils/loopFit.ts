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
export function calculateLoopFit(bpm: number, bars: number, actualSeconds?: number | null): LoopFitResult {
  const safeBpm = Number.isFinite(bpm) && bpm > 0 ? bpm : 90
  const safeBars = Number.isFinite(bars) && bars > 0 ? bars : 4
  const beats = safeBars * 4
  const targetSeconds = (beats * 60) / safeBpm

  if (!actualSeconds || !Number.isFinite(actualSeconds) || actualSeconds <= 0) {
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
  const minutes = Math.floor(value / 60)
  const seconds = value - minutes * 60
  return minutes > 0 ? `${minutes}:${seconds.toFixed(3).padStart(6, '0')}` : `${seconds.toFixed(3)} s`
}
