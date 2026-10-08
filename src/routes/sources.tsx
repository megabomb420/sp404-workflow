import { createFileRoute } from '@tanstack/react-router'
import { SourcesPage } from '@/pages/SourcesPage'

export const Route = createFileRoute('/sources')({ component: SourcesPage })
