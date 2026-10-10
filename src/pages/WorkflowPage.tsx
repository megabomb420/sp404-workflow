import { Navigate, useParams } from '@/lib/rr'
import { WorkflowPlayer } from '@/components/content/WorkflowPlayer'
import { useLocalizedWorkflow } from '@/i18n/content'
import { FirmwareNotice } from '@/components/content/FirmwareSwitch'
import { DoomContext } from '@/components/content/DoomContext'
import { useStore } from '@/state/store'
import { workflowPosition } from '@/utils/workflowEnding'

export function WorkflowPage() {
  const { id } = useParams<{ id: string }>()
  const workflow = useLocalizedWorkflow(id)
  const { state } = useStore()
  if (!workflow) return <Navigate to="/workflows" replace />
  const finished = workflowPosition(workflow.steps, state.progress.doneSteps[workflow.id] ?? [], state.progress.workflowStep[workflow.id] ?? 0).finished
  return (
    <div className="page">
      <FirmwareNotice firmware={workflow.environment ?? 'roland'} />
      {workflow.environment === 'doom' && <DoomContext key={workflow.id} compact={finished} />}
      <WorkflowPlayer workflow={workflow} />
    </div>
  )
}
