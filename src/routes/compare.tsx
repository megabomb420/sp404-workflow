import { createFileRoute } from '@tanstack/react-router'
import { ComparePage } from '@/pages/ComparePage'
import { passSearch } from '@/lib/rr'
export const Route = createFileRoute('/compare')({ component: ComparePage, validateSearch: passSearch })
