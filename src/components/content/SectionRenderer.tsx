import { Section, SectionBlock } from '../../data/types'
import { ButtonSequence } from './ButtonSequence'
import { SourceTag } from './SourceTag'
import { RoutingDiagram } from './RoutingDiagram'
import { StepSequencer as StepSeq } from './StepSequencer'
import { SidechainExplorer } from './SidechainExplorer'
import { Link } from 'react-router-dom'

/** Renderuje bloki treści sekcji. */
export function SectionRenderer({ section }: { section: Section }) {
  return (
    <div className="sbody">
      {section.body.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  )
}

function Block({ block }: { block: SectionBlock }) {
  switch (block.kind) {
    case 'intro':
      return <p className="sbody__intro">{block.text}</p>
    case 'p':
      return <p>{block.text}</p>
    case 'h':
      return <h2 className="sbody__h u-label">{block.title}</h2>
    case 'sequence':
      return (
        <div className="sbody__seq panel-surface">
          <ButtonSequence buttons={block.buttons} path={block.path} note={block.note} />
          <SourceTag source={block.source} />
        </div>
      )
    case 'steps':
      return (
        <div className="sbody__steps">
          {block.title ? <h3 className="sbody__h u-label">{block.title}</h3> : null}
          <ol className="wflist">
            {block.steps.map((s, i) => (
              <li key={s.id} className="wflist__item panel-surface">
                <span className="wflist__num u-mono">{String(i + 1).padStart(2, '0')}</span>
                <div className="wflist__body">
                  <span className="wflist__title u-label">{s.title}</span>
                  <p className="wflist__action">{s.action}</p>
                  <ButtonSequence buttons={s.buttons} path={s.path} size="sm" />
                  {s.expectedResult ? <p className="wflist__result">{s.expectedResult}</p> : null}
                  {s.commonMistake ? (
                    <p className="wflist__mistake">
                      <span className="u-label">BŁĄD: </span>
                      {s.commonMistake}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )
    case 'diagram':
      return <RoutingDiagram steps={block.steps} caption={block.caption} title={block.title} />
    case 'compare':
      return (
        <div className="sbody__compare">
          {block.title ? <h3 className="sbody__h u-label">{block.title}</h3> : null}
          <div className="cmp">
            <CmpCol col={block.a} tone="a" />
            <span className="cmp__vs u-label">VS</span>
            <CmpCol col={block.b} tone="b" />
          </div>
        </div>
      )
    case 'tip':
      return (
        <aside className="callout callout--tip">
          <span className="callout__k u-label">WORKFLOW TIP</span>
          <p>{block.text}</p>
        </aside>
      )
    case 'note':
      return (
        <aside className="callout callout--note">
          <span className="callout__k u-label">ROLAND / VERIFIED</span>
          <p>{block.text}</p>
          <SourceTag source={block.source} />
        </aside>
      )
    case 'pros':
      return (
        <div>
          {block.title ? <h3 className="sbody__h u-label">{block.title}</h3> : null}
          <ul className="checklist">
            {block.items.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )
    case 'list':
      return (
        <div>
          {block.title ? <h3 className="sbody__h u-label">{block.title}</h3> : null}
          <ul className="dotlist">
            {block.items.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )
    case 'table':
      return (
        <div className="sbody__table-wrap panel-surface">
          <table className="sbody__table">
            <thead>
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i} className="u-label">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((c, j) => (
                    <td key={j} className="u-mono">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'preset':
      return (
        <div className="preset panel-surface">
          <div className="preset__head">
            <span className="preset__title u-label">{block.title}</span>
            <span className="preset__badge u-mono">PRESET</span>
          </div>
          <dl className="preset__dl">
            {block.config.map((c) => (
              <div key={c.label} className="preset__row">
                <dt className="preset__k u-label">{c.label}</dt>
                <dd className="preset__v u-mono">{c.value}</dd>
              </div>
            ))}
          </dl>
          <p className="preset__hear">
            <span className="u-label">CO POWINIENEŚ USŁYSZEĆ: </span>
            {block.whatYouHear}
          </p>
          <SourceTag source={block.source} kind="tip" />
        </div>
      )
    case 'task':
      return (
        <div className="mtask panel-surface">
          <span className="mtask__title u-label">{block.title}</span>
          <p className="mtask__task">{block.task}</p>
          <details className="mtask__answer">
            <summary className="u-label">POKAŻ ODPOWIEDŹ</summary>
            <div className="mtask__answer-inner">
              <ButtonSequence buttons={block.answer} path={block.path} />
            </div>
          </details>
        </div>
      )
    case 'link':
      return (
        <Link to={block.route} className="xlink panel-surface">
          <span className="xlink__title u-label">{block.title}</span>
          {block.note ? <span className="xlink__note">{block.note}</span> : null}
          <span className="xlink__go" aria-hidden="true">→</span>
        </Link>
      )
    case 'sequencer':
      return <StepSeq label={block.label ?? 'TR-REC'} />
    case 'explorer':
      return <SidechainExplorer />
    default:
      return null
  }
}

function CmpCol({ col, tone }: { col: { heading: string; points: string[] }; tone: 'a' | 'b' }) {
  return (
    <div className={`cmp__col cmp__col--${tone}`}>
      <span className="cmp__head u-label">{col.heading}</span>
      <ul className="dotlist">
        {col.points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  )
}
