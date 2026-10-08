import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { comparisons } from '../data/comparisons'
import { SourceTag } from '../components/content/SourceTag'
import { useDisplay } from '../state/display'
import cx from '../utils/cx'

export function ComparePage() {
  const { setDisplay } = useDisplay()
  const [params, setParams] = useSearchParams()
  const selected = comparisons.find((comparison) => comparison.id === params.get('goal')) ?? comparisons[0]
  useEffect(() => { setDisplay({ title: 'DWA SPOSOBY', sub: selected.title, right: 'A / B' }) }, [setDisplay, selected.title])
  return <div className="page compare-page">
    <h1 className="page__title u-label">TEN SAM CEL, DWIE DROGI</h1>
    <p className="page__lede">Porównaj czynności w obu systemach i wybierz metodę pasującą do swojej sesji.</p>
    <div className="screen-picker" role="group" aria-label="cel porównania">{comparisons.map((comparison) => <button className={cx('chip', selected.id === comparison.id && 'is-active')} key={comparison.id} type="button" aria-pressed={selected.id === comparison.id} onClick={() => setParams({ goal: comparison.id })}>{comparison.title}</button>)}</div>
    <p className="compare-goal panel-surface">{selected.goal}</p>
    <div className="compare-methods">{[selected.roland, selected.doom].map((method) => <section className="compare-method panel-surface" key={method.label}>
      <h2 className="u-label">{method.label}</h2>
      <ol>{method.steps.map((step, index) => <li key={index}>{step}</li>)}</ol>
      <p><strong>Wygodne, gdy:</strong> {method.strengths}</p><p><strong>Uważaj:</strong> {method.limitation}</p>
      <SourceTag source={method.source} kind="verified" />
      <Link className="chip" to={method.route}>OTWÓRZ INSTRUKCJĘ →</Link>
    </section>)}</div>
  </div>
}
