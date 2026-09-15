import { createFileRoute } from '@tanstack/react-router'
import { FixItPage } from '@/pages/FixItPage'

export const Route = createFileRoute('/fix-it')({ component: FixItPage })
