import { Navigate, useParams } from '@/lib/rr'
import { WorkflowPlayer } from '@/components/content/WorkflowPlayer'
import { useLocalizedWorkflow } from '@/i18n/content'

export function WorkflowPage() {
  const { id } = useParams<{ id: string }>()
  const workflow = useLocalizedWorkflow(id)
  if (!workflow) return <Navigate to="/workflows" replace />
  return (
    <div className="page">
      <WorkflowPlayer workflow={workflow} />
    </div>
  )
}
