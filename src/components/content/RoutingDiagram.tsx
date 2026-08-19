import { DiagramNode } from '../../data/types'
import cx from '../../utils/cx'

function NodeView({ node }: { node: DiagramNode }) {
  if (typeof node === 'string') {
    return (
      <div className="rdiag__node rdiag__node--default">
        <span className="u-label">{node}</span>
      </div>
    )
  }
  return (
    <div className={cx('rdiag__node', `rdiag__node--${node.tone ?? 'default'}`)}>
      <span className="u-label">{node.label}</span>
      {node.sub ? <span className="rdiag__sub u-mono">{node.sub}</span> : null}
    </div>
  )
}

interface RoutingDiagramProps {
  steps: DiagramNode[]
  caption?: string
  title?: string
  className?: string
}

/** Pionowy schemat przepływu sygnału — SOURCE → INPUT → BUS → OUTPUT. */
export function RoutingDiagram({ steps, caption, title, className }: RoutingDiagramProps) {
  return (
    <figure className={cx('rdiag', className)}>
      {title ? <figcaption className="rdiag__title u-label">{title}</figcaption> : null}
      <div className="rdiag__flow">
        {steps.map((node, i) => (
          <div key={i} className="rdiag__step">
            {i > 0 && <span className="rdiag__arrow u-mono" aria-hidden="true">↓</span>}
            <NodeView node={node} />
          </div>
        ))}
      </div>
      {caption ? <figcaption className="rdiag__caption">{caption}</figcaption> : null}
    </figure>
  )
}
