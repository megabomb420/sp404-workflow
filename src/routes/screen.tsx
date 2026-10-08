import { createFileRoute } from '@tanstack/react-router'
import { ScreenPage } from '@/pages/ScreenPage'
import { passSearch } from '@/lib/rr'
export const Route = createFileRoute('/screen')({ component: ScreenPage, validateSearch: passSearch })
