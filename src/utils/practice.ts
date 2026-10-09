export interface PracticeStat {
  correct: number; review: number; needsReview: boolean
  streak: number; lastPracticedAt: number | null; dueAt: number | null
}
export const doomPracticeIds = new Set(['open', 'help', 'track', 'bar', 'piano', 'piano-scroll', 'piano-track', 'mixer', 'mix-view', 'automation', 'parameter', 'auto-bar', 'stock'].map(id => `doom-${id}`))
const DAY = 86_400_000
export function assessPractice(previous: PracticeStat | undefined, correct: boolean, now: number): PracticeStat {
  const streak = correct ? (previous?.streak ?? 0) + 1 : 0
  const days = [1, 3, 7, 14, 30][Math.min(Math.max(streak - 1, 0), 4)]
  return { correct: (previous?.correct ?? 0) + Number(correct), review: (previous?.review ?? 0) + Number(!correct), needsReview: !correct, streak, lastPracticedAt: now, dueAt: now + (correct ? days * DAY : 10 * 60_000) }
}
export function practiceDue(stat: PracticeStat | undefined, now: number): boolean {
  return !!stat && (stat.dueAt === null ? stat.needsReview : stat.dueAt <= now)
}
export function queuePractice(previous: PracticeStat | undefined, now: number): PracticeStat {
  return { correct: 0, review: 0, streak: 0, lastPracticedAt: null, ...previous, needsReview: true, dueAt: now }
}
