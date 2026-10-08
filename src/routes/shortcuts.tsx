import { createFileRoute } from '@tanstack/react-router'
import { ShortcutsPage } from '@/pages/ShortcutsPage'

export const Route = createFileRoute('/shortcuts')({ component: ShortcutsPage })
