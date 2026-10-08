import { Navigate, useParams } from '@/lib/rr'
import { WorkflowPlayer } from '@/components/content/WorkflowPlayer'
import { useLocalizedWorkflow } from '@/i18n/content'
import { FirmwareNotice } from '@/components/content/FirmwareSwitch'
import { DoomContext } from '@/components/content/DoomContext'

export function WorkflowPage() {
  const { id } = useParams<{ id: string }>()
  const workflow = useLocalizedWorkflow(id)
  if (!workflow) return <Navigate to="/workflows" replace />
  return (
    <div className="page">
      <FirmwareNotice firmware={workflow.environment ?? 'roland'} />
      {workflow.environment === 'doom' && <DoomContext />}
      <WorkflowPlayer workflow={workflow} />
    </div>
  )
}
