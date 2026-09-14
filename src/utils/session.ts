import { workflowsById } from '../data/workflows'

/** Only known workflows and in-range integer steps can become a return action. */
export function workflowReturnRoute(params: URLSearchParams): string | null {
  const workflow = workflowsById[params.get('from') ?? '']
  if (!workflow) return null
  const requested = Number(params.get('step') ?? 0)
  const step = Number.isInteger(requested) && requested >= 0 && requested < workflow.steps.length ? requested : 0
  return `/workflow/${workflow.id}?step=${step}`
}
