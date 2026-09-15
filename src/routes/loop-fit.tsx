import { createFileRoute } from '@tanstack/react-router'
import { LoopFitPage } from '@/pages/LoopFitPage'

export const Route = createFileRoute('/loop-fit')({ component: LoopFitPage })
