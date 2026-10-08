import { normalizeState, record } from '../state/model'
import type { AppState } from '../state/model'

export function exportBackup(state: AppState): string {
  return JSON.stringify({ app: 'SP Workflow', version: 1, createdAt: new Date().toISOString(), state }, null, 2)
}
export function importBackup(raw: string): { state: AppState; createdAt: string } {
  if (raw.length > 2_000_000) throw new Error('Plik jest za duży. Maksymalny rozmiar kopii to 2 MB.')
  let value: unknown
  try { value = JSON.parse(raw) } catch { throw new Error('Plik nie jest poprawną kopią JSON.') }
  const backup = record(value), state = record(backup.state)
  if (backup.app !== 'SP Workflow' || backup.version !== 1) throw new Error('To nie jest obsługiwana kopia SP Workflow.')
  if (!state.settings || !state.favorites || !state.progress || !state.ui || !Array.isArray(record(state.favorites).shortcuts) || !Array.isArray(record(state.favorites).workflows) || !Array.isArray(record(state.favorites).troubleshooting)) throw new Error('Kopia jest niekompletna. Obecne dane pozostają bez zmian.')
  return { state: normalizeState(state), createdAt: typeof backup.createdAt === 'string' ? backup.createdAt : '' }
}
