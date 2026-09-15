import { createFileRoute } from '@tanstack/react-router'
import { MusclePage } from '@/pages/MusclePage'

export const Route = createFileRoute('/muscle')({ component: MusclePage })
