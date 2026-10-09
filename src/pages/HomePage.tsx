import { useEffect } from 'react'
import { Link, useNavigate } from '@/lib/rr'
import { PadGrid, type PadConfig } from '@/components/hardware/PadGrid'
import { useLocalizedHomePads, useLocalizedWorkflows } from '@/i18n/content'
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
  const now = usePracticeClock()
  const reviewCount = Object.entries(state.practice).filter(([id, stat]) => practiceDue(stat, now) && (state.settings.firmware === 'doom' ? doomPracticeIds.has(id) : (actionsById[id] && actionsById[id].safety !== 'destructive') || muscleTasks.some((item) => `recall:${item.id}` === id && !/delete|format|factory|truncate|usu[nń]|kasuj/i.test(`${item.id} ${item.task}`)))).length
  const activeId = state.progress.activeWorkflowId
  const active = activeId && !state.progress.completedWorkflows.includes(activeId) ? workflowsById[activeId] : undefined
  const sketch = state.kits.find(kit => kit.id === state.ui.activeKitId && !kit.studio?.finished)
  const activeStep = active ? Math.min(state.progress.workflowStep[active.id] ?? 0, active.steps.length - 1) : 0
  const resumeBeat = ['ready', 'active', 'finish'].includes(state.beatBlock.phase)
  const canResume = !!sketch || !!active || resumeBeat

  useEffect(() => {
    setDisplay({
      title: t.home.lcdTitle,
      sub: t.home.lcdSub,
      right: canResume ? t.lcdResume : t.lcdReady,
    })
  }, [setDisplay, canResume, t])

  const pads: PadConfig[] = (state.settings.firmware === 'doom' ? localizeCompanion(doomPads, locale) : padsSource).map((pad) => ({
    pad: pad.pad,
    label: pad.label,
    sublabel: pad.pad === 15 && reviewCount ? t.home.practiceReview(reviewCount) : pad.sublabel,
    tone: pad.tone,
    onClick: () => navigate(pad.pad === 15 && reviewCount ? '/muscle?review=1' : pad.route),
  }))

  return (
    <div className="page home home--now">
      {sketch ? <section className="resume-sketch panel-surface" aria-label={locale === 'en' ? 'Resume your beat' : 'Wróć do mojego beatu'}>
        <span className="u-label">{locale === 'en' ? 'BACK TO MY BEAT' : 'WRÓĆ DO MOJEGO BEATU'}</span>
        <h2>{sketch.name}</h2>
        <p className="resume-sketch__meta u-mono">{[sketch.studio?.firmware === 'doom' ? 'DOOM OS' : 'ROLAND', sketch.notes?.project && `${locale === 'en' ? 'Project' : 'Projekt'} ${sketch.notes.project}`, sketch.notes?.bankPad, sketch.notes?.bpm && `${sketch.notes.bpm} BPM`].filter(Boolean).join(' · ')}</p>
        <p className="resume-sketch__step">{sketch.studio?.nextStep || (locale === 'en' ? 'Choose the next step for this sketch.' : 'Wybierz następny krok dla tego szkicu.')}</p>
        <div className="tool-actions"><Link className="chip sketch-primary" to={`/kit?set=${sketch.id}&tab=next`}>{locale === 'en' ? 'RESUME SKETCH →' : 'WRÓĆ DO SZKICU →'}</Link><Link className="chip" to={`/kit?set=${sketch.id}&tab=song`}>SONG MAP →</Link></div>
        {active && <Link className="resume-sketch__workflow" to={`/workflow/${active.id}`}><span className="u-label">{t.home.resumeInstruction} →</span><span>{active.title} · {t.home.actionOf(activeStep + 1, active.steps.length)}</span></Link>}
      </section> : active ? (
        <Link to={`/workflow/${active.id}`} className="continue-card panel-surface">
          <span className="continue-card__signal" aria-hidden="true" />
          <span className="continue-card__body">
            <span className="continue-card__k u-label">{t.home.resumeInstruction}</span>
            <strong>{active.title}</strong>
            <span className="u-mono">
              {t.home.actionOf(activeStep + 1, active.steps.length)} · {storageAvailable ? t.home.progressSaved : t.home.sessionOnly}
            </span>
          </span>
          <span className="continue-card__go" aria-hidden="true">→</span>
        </Link>
      ) : null}
      <Link className="beat-entry panel-surface" to="/beat-block" onClick={() => { if (state.beatBlock.phase === 'saved') dispatch({ type: 'BEAT_RESET' }) }}>
        <span className="u-label">{resumeBeat ? (locale === 'en' ? 'BACK TO BEAT BLOCK' : 'WRÓĆ DO BEAT BLOCK') : (locale === 'en' ? 'I’M STUCK' : 'UTKNĄŁEM')}</span>
        <span className="u-mono">BEAT BLOCK · 5–10 MIN <span aria-hidden="true">→</span></span>
      </Link>

      <section className="home-map" aria-label={t.appName}>
        <PadGrid items={pads} />
      </section>
      <details className="now-library panel-surface">
        <summary className="u-label">{t.home.library}</summary>
        <div className="now-library__body">
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

          <section className="companion-tools" aria-label={locale === 'en' ? 'Companion tools' : 'Narzędzia przy SP'}>
            {[['/listen', locale === 'en' ? 'LISTEN ON SP' : 'ODSŁUCH SP', 'FX · RESAMPLE · SIDECHAIN'], ['/screen', locale === 'en' ? 'ON THIS SCREEN' : 'JESTEM NA EKRANIE', 'CTRL 1 · 2 · 3'], ['/groove', 'GROOVE LAB', 'VELOCITY · NUDGE · LENGTH'], ['/compare', locale === 'en' ? 'COMPARE METHODS' : 'PORÓWNAJ SPOSOBY', 'ROLAND ↔ DOOM OS'], ['/doom-os', 'DOOM OS', locale === 'en' ? 'GUIDE · CONTROLS' : 'MANUAL · STEROWANIE'], ['/loop-fit', t.home.loopFit, t.home.loopFitSub]].map(([to, title, sub]) => <Link key={to} to={to} className="now-escape__item panel-surface"><span className="u-label">{title}</span><small>{sub}</small></Link>)}
          </section>
        </div>
      </details>
    </div>
  )
}
