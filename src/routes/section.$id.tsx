import { createFileRoute } from '@tanstack/react-router'
import { SectionPage } from '@/pages/SectionPage'

export const Route = createFileRoute('/section/$id')({ component: SectionPage })
