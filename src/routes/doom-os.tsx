import { createFileRoute } from '@tanstack/react-router'
import { DoomPage } from '@/pages/DoomPage'
import { passSearch } from '@/lib/rr'
export const Route = createFileRoute('/doom-os')({ component: DoomPage, validateSearch: passSearch })
