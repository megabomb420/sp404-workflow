import { createFileRoute } from '@tanstack/react-router'
import { GlossaryPage } from '@/pages/GlossaryPage'

export const Route = createFileRoute('/glossary')({ component: GlossaryPage })
