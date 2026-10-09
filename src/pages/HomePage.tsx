import { useEffect } from 'react'
import { Link, useNavigate } from '@/lib/rr'
import { PadGrid, type PadConfig } from '@/components/hardware/PadGrid'
import { useLocalizedHomePads, useLocalizedSections, useLocalizedWorkflows } from '@/i18n/content'
import { useT } from '@/i18n/useT'
import { useDisplay } from '@/state/display'
import { useStore } from '@/state/store'
import { actionsById } from '@/data/actions'
import { useLocale } from '@/i18n/locale'
import { doomPracticeIds, practiceDue } from '@/utils/practice'
import { usePracticeClock } from '@/utils/usePracticeClock'
import { muscleTasks } from '@/data/muscleMemory'
import { doomPads } from '@/data/doomPads'
import { localizeCompanion } from '@/i18n/companion'

export function HomePage() {
  const navigate = useNavigate()
  const { setDisplay } = useDisplay()
  const { state, dispatch, storageAvailable } = useStore()
  const t = useT()
  const { locale } = useLocale()
  const padsSource = useLocalizedHomePads()
  const { featured, byId: workflowsById } = useLocalizedWorkflows()
  const { byId: sectionsById } = useLocalizedSections()
  const now = usePracticeClock()
  const reviewCount = Object.entries(state.practice).filter(([id, stat]) => practiceDue(stat, now) && (state.settings.firmware === 'doom' ? doomPracticeIds.has(id) : (actionsById[id] && actionsById[id].safety !== 'destructive') || muscleTasks.some((item) => `recall:${item.id}` === id && !/delete|format|factory|truncate|usu[nń]|kasuj/i.test(`${item.id} ${item.task}`)))).length

  useEffect(() => {
    setDisplay({
      title: t.home.lcdTitle,
      sub: t.home.lcdSub,
      right: state.progress.activeWorkflowId ? t.lcdResume : t.lcdReady,
    })
  }, [setDisplay, state.progress.activeWorkflowId, t])

  const pads: PadConfig[] = (state.settings.firmware === 'doom' ? localizeCompanion(doomPads, locale) : padsSource).map((pad) => ({
    pad: pad.pad,
    label: pad.label,
    sublabel: pad.sublabel,
    tone: pad.tone,
    onClick: () => navigate(pad.route),
  }))

  const activeId = state.progress.activeWorkflowId
  const active = activeId ? workflowsById[activeId] : undefined
  const activeStep = active ? Math.min(state.progress.workflowStep[active.id] ?? 0, active.steps.length - 1) : 0
  const recent = state.ui.recent.map((id) => sectionsById[id]).filter((section): section is NonNullable<typeof section> => !!section)

  return (
    <div className="page home home--now">
      {active ? (
        <Link to={`/workflow/${active.id}`} className="continue-card panel-surface">
          <span className="continue-card__signal" aria-hidden="true" />
          <span className="continue-card__body">
            <span className="continue-card__k u-label">{t.home.continue}</span>
            <strong>{active.title}</strong>
            <span className="u-mono">
              {t.home.actionOf(activeStep + 1, active.steps.length)} · {storageAvailable ? t.home.progressSaved : t.home.sessionOnly}
            </span>
          </span>
          <span className="continue-card__go" aria-hidden="true">→</span>
        </Link>
      ) : null}
      <Link className="beat-entry panel-surface" to="/beat-block" onClick={() => { if (state.beatBlock.phase === 'saved') dispatch({ type: 'BEAT_RESET' }) }}>
        <span className="u-label">{['ready', 'active', 'finish'].includes(state.beatBlock.phase) ? (locale === 'en' ? 'BACK TO BEAT BLOCK' : 'WRÓĆ DO BEAT BLOCK') : (locale === 'en' ? 'I’M STUCK' : 'UTKNĄŁEM')}</span>
        <span className="u-mono">BEAT BLOCK · 5–10 MIN <span aria-hidden="true">→</span></span>
      </Link>

      <section className="now-goals" aria-labelledby="now-goals-title">
        <h2 id="now-goals-title" className="now-section-title u-label">{t.home.goals}</h2>
        <div className="now-goals__grid">
          {(state.settings.firmware === 'doom' ? Object.values(workflowsById).filter((w) => w.environment === 'doom') : featured).map((workflow, index) => (
            <Link key={workflow.id} to={`/workflow/${workflow.id}`} className="goal-card panel-surface">
              <span className="goal-card__n u-mono">0{index + 1}</span>
              <span className="goal-card__title u-label">{workflow.title}</span>
              <span className="goal-card__blurb">{workflow.blurb}</span>
              <span className="goal-card__meta u-mono">{t.home.minActions(workflow.minutes ?? 0, workflow.steps.length)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-map" aria-label={t.appName}>
        <PadGrid items={pads} />
      </section>
      <section className="companion-tools" aria-label={locale === 'en' ? 'Companion tools' : 'Narzędzia przy SP'}>
        {[['/listen', locale === 'en' ? 'LISTEN ON SP' : 'ODSŁUCH SP', 'FX · RESAMPLE · SIDECHAIN'], ['/screen', locale === 'en' ? 'ON THIS SCREEN' : 'JESTEM NA EKRANIE', 'CTRL 1 · 2 · 3'], ['/groove', 'GROOVE LAB', 'VELOCITY · NUDGE · LENGTH'], ['/compare', locale === 'en' ? 'COMPARE METHODS' : 'PORÓWNAJ SPOSOBY', 'ROLAND ↔ DOOM OS'], ['/doom-os', 'DOOM OS', locale === 'en' ? 'GUIDE · CONTROLS' : 'MANUAL · STEROWANIE']].map(([to, title, sub]) => <Link key={to} to={to} className="now-escape__item panel-surface"><span className="u-label">{title}</span><small>{sub}</small></Link>)}
      </section>

      <div className="now-escape">
        <Link to={reviewCount ? '/muscle?review=1' : '/muscle'} className="now-escape__item panel-surface">
          <span className="u-label">{t.home.practice}</span>
          <small>{reviewCount ? t.home.practiceReview(reviewCount) : t.home.practiceIdle}</small>
        </Link>
        <Link to="/fix-it" className="now-escape__item now-escape__item--fix panel-surface">
          <span className="u-label">{t.home.fix}</span>
          <small>{t.home.fixSub}</small>
        </Link>
        <Link to="/loop-fit" className="now-escape__item now-escape__item--tool panel-surface">
          <span className="u-label">{t.home.loopFit}</span>
          <small>{t.home.loopFitSub}</small>
        </Link>
      </div>

      {recent.length > 0 && (
        <section className="home__recent panel-surface" aria-label={t.home.recent}>
          <span className="home__recent-k u-label">{t.home.recent}</span>
          <div className="home__recent-list">
            {recent.map((section) => (
              <button
                key={section.id}
                type="button"
                className="home__recent-item"
                onClick={() => navigate(`/section/${section.id}`)}
              >
                <span className="u-mono">{String(section.pad).padStart(2, '0')}</span>
                <span className="u-label">{section.title}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
