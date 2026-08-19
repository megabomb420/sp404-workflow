interface SectionHeaderProps {
  title: string
  short: string
  /** breadcrumb: np. "SEKCJA 07 · PATTERN" */
  meta?: string
}

export function SectionHeader({ title, short, meta }: SectionHeaderProps) {
  return (
    <header className="sechead">
      {meta ? <span className="sechead__meta u-mono">{meta}</span> : null}
      <h1 className="sechead__title u-label">{title}</h1>
      <p className="sechead__short">{short}</p>
    </header>
  )
}
