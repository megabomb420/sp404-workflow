import { Navigate, useParams } from 'react-router-dom'
import { WorkflowPlayer } from '../components/content/WorkflowPlayer'
import { workflowsById } from '../data/workflows'

export function WorkflowPage() {
  const { id } = useParams<{ id: string }>()
  const workflow = id ? workflowsById[id] : undefined
  if (!workflow) return <Navigate to="/workflows" replace />
  return (
    <div className="page">
      <WorkflowPlayer workflow={workflow} />
    </div>
  )
}
