import type { KitItem } from '../state/model'
import { shortcutsById } from './shortcuts'
import { workflowsById } from './workflows'
import { troubleshootingById } from './troubleshooting'

export function kitItemInfo(item: KitItem): { title: string; route: string } | null {
  if (item.kind === 'shortcuts') {
    const value = shortcutsById[item.id]
    return value ? { title: value.name, route: value.category === 'DOOM OS' ? `/doom-os?id=${encodeURIComponent(item.id)}` : `/shortcuts?id=${encodeURIComponent(item.id)}` } : null
  }
  if (item.kind === 'workflows') { const value = workflowsById[item.id]; return value ? { title: value.title, route: `/workflow/${encodeURIComponent(item.id)}` } : null }
  const value = troubleshootingById[item.id]
  return value ? { title: value.symptom, route: `/fix-it?ids=${encodeURIComponent(item.id)}` } : null
}
