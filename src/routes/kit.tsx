import { createFileRoute } from '@tanstack/react-router'
import { KitPage } from '@/pages/KitPage'

export const Route = createFileRoute('/kit')({ component: KitPage })
