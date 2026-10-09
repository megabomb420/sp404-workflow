import { useC } from '@/i18n/companion'
import { useEffect } from 'react'
import { Link, useSearchParams } from '@/lib/rr'
import { comparisons as methods } from '../data/comparisons'
import { useLocale } from '@/i18n/locale'
import { localizeCompanion } from '@/i18n/companion'
import { SourceTag } from '../components/content/SourceTag'
import { useDisplay } from '../state/display'
import cx from '../utils/cx'

export function ComparePage() {
  const c = useC()
  const { locale } = useLocale()
  const comparisons = localizeCompanion(methods, locale)
  const { setDisplay } = useDisplay()
  const [params, setParams] = useSearchParams()
  const selected = comparisons.find((comparison) => comparison.id === params.get('goal')) ?? comparisons[0]
  useEffect(() => { setDisplay({ title: c("DWA SPOSOBY"), sub: selected.title, right: 'A / B' }) }, [setDisplay, selected.title, c])
  return <div className="page compare-page">
    <h1 className="page__title u-label">{c("TEN SAM CEL, DWIE DROGI")}</h1>
    <p className="page__lede">{c("Porównaj czynności w obu systemach i wybierz metodę pasującą do swojej sesji.")}</p>
    <div className="screen-picker" role="group" aria-label={c("cel porównania")}>{comparisons.map((comparison) => <button className={cx('chip', selected.id === comparison.id && 'is-active')} key={comparison.id} type="button" aria-pressed={selected.id === comparison.id} onClick={() => setParams({ goal: comparison.id })}>{comparison.title}</button>)}</div>
    <p className="compare-goal panel-surface">{selected.goal}</p>
    <div className="compare-methods">{[selected.roland, selected.doom].map((method) => <section className="compare-method panel-surface" key={method.label}>
      <h2 className="u-label">{method.label}</h2>
      <ol>{method.steps.map((step, index) => <li key={index}>{step}</li>)}</ol>
      <p><strong>{c("Wygodne, gdy:")}</strong> {method.strengths}</p><p><strong>{c("Uważaj:")}</strong> {method.limitation}</p>
      <SourceTag source={method.source} kind="verified" />
      <Link className="chip" to={method.route}>{c("OTWÓRZ INSTRUKCJĘ →")}</Link>
    </section>)}</div>
  </div>
}
