import { Navigate, useParams } from 'react-router-dom'
import { WorkflowPlayer } from '../components/content/WorkflowPlayer'
import { workflowsById } from '../data/workflows'
import { DoomContext } from '../components/content/DoomContext'
import { FirmwareNotice } from '../components/content/FirmwareSwitch'

export function WorkflowPage() {
  const { id } = useParams<{ id: string }>()
  const workflow = id ? workflowsById[id] : undefined
  if (!workflow) return <Navigate to="/workflows" replace />
  return (
    <div className="page">
      <FirmwareNotice firmware={workflow.environment === 'doom' ? 'doom' : 'roland'} />
      {workflow.environment === 'doom' && <DoomContext />}
      <WorkflowPlayer workflow={workflow} />
    </div>
  )
}
