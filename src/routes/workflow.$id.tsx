import { createFileRoute } from '@tanstack/react-router'
import { WorkflowPage } from '@/pages/WorkflowPage'

export const Route = createFileRoute('/workflow/$id')({ component: WorkflowPage })
