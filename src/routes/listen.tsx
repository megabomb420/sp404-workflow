import { createFileRoute } from '@tanstack/react-router'
import { ListeningPage } from '@/pages/ListeningPage'
import { passSearch } from '@/lib/rr'
export const Route = createFileRoute('/listen')({ component: ListeningPage, validateSearch: passSearch })
