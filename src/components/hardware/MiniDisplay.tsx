import { useDisplay } from '../../state/display'

/** Ekran LCD — faktycznie komunikuje stan aplikacji. */
export function MiniDisplay() {
  const { display } = useDisplay()
  return (
    <div className="lcd" role="status" aria-live="polite">
      <div className="lcd__row lcd__row--top">
        <span className="lcd__brand u-label">SP WORKFLOW</span>
        <span className="lcd__right u-mono">{display.right}</span>
      </div>
      <div key={display.title + display.sub} className="lcd__title u-label lcd__title--anim">
        {display.title}
      </div>
      <div className="lcd__sub u-mono">{display.sub}</div>
    </div>
  )
}
