import { useEffect, useRef, useState } from 'react'
import { Link } from '@/lib/rr'
import { beatChallenges, beatReasons, pickBeatChallenge, type BeatReason } from '@/data/beatBlock'
import { beatClock, beatRemaining, type BeatDraft } from '@/utils/beatBlock'
import { useLocale } from '@/i18n/locale'
import { useDisplay } from '@/state/display'
import { useStore } from '@/state/store'
import { HardwareButton } from '@/components/hardware/HardwareButton'
import { FirmwareNotice } from '@/components/content/FirmwareSwitch'
import { SourceTag } from '@/components/content/SourceTag'
import cx from '@/utils/cx'

export function BeatBlockPage() {
  const { state, dispatch, storageAvailable } = useStore()
  const { locale } = useLocale(), en = locale === 'en', lang = en ? 1 : 0
  const { setDisplay } = useDisplay()
  const session = state.beatBlock
  const challenge = beatChallenges.find(item => item.id === session.challengeId)
  const [now, setNow] = useState(Date.now)
  const [switchPending, setSwitchPending] = useState(false)
  const challengeRef = useRef<HTMLElement>(null)
  const remaining = beatRemaining(session, now)
  const savedKit = state.kits.find(kit => kit.id === session.savedKitId)
  useEffect(() => { setSwitchPending(false) }, [session.challengeId, session.phase])
  useEffect(() => {
    if (challenge) challengeRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
    else document.querySelector('.shell__main')?.scrollTo({ top: 0, behavior: 'instant' })
  }, [challenge, session.phase])

  useEffect(() => {
    const refresh = () => setNow(Date.now())
    refresh()
    const timer = session.runningSince !== null ? window.setInterval(refresh, 1000) : null
    window.addEventListener('focus', refresh); document.addEventListener('visibilitychange', refresh)
    return () => { if (timer !== null) window.clearInterval(timer); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh) }
  }, [session.runningSince, session.remainingMs])
  useEffect(() => {
    if (session.phase === 'active' && session.runningSince !== null && remaining === 0) dispatch({ type: 'BEAT_PAUSE', now: Date.now() })
  }, [session.phase, session.runningSince, remaining, dispatch])
  useEffect(() => {
    setDisplay({ title: 'BEAT BLOCK', sub: challenge?.title[lang] ?? (en ? 'one prompt · one sketch' : 'jedno wyzwanie · jeden szkic'), right: challenge ? session.firmware.toUpperCase() : '5–10 MIN' })
  }, [setDisplay, challenge, lang, en, session.firmware])

  const choose = (reason: BeatReason) => dispatch({ type: 'BEAT_CHOOSE', id: pickBeatChallenge(reason, session.recent, session.challengeId).id, firmware: state.settings.firmware })
  const editDraft = (field: keyof BeatDraft, value: string) => dispatch({ type: 'BEAT_DRAFT', field, value })
  const note = challenge ? `BEAT BLOCK · ${challenge.title[lang]}\n${en ? 'Constraint' : 'Ograniczenie'}: ${challenge.constraint[lang]}\n${en ? 'Next idea' : 'Pomysł do rozwinięcia'}: ${session.draft.idea.trim()}` : ''
  const target = state.kits.find(kit => kit.id === session.draft.targetKitId)
  const name = session.draft.name || challenge?.title[lang] || 'BEAT BLOCK'
  const notesFull = note.length + (target?.notes?.text ? target.notes.text.length + 2 : 0) > 2000
  const kitsFull = !session.draft.targetKitId && state.kits.length >= 30
  const missingTarget = !!session.draft.targetKitId && !target

  return <div className="page beat-block-page">
    <h1 className="page__title u-label">BEAT BLOCK</h1>
    <p className="page__lede">{en ? 'A small constraint to get playing. Choose a prompt, make a short sketch and keep one idea to develop.' : 'Małe ograniczenie, żeby ruszyć z graniem. Wybierz wyzwanie, zrób krótki szkic i zachowaj jeden pomysł do rozwinięcia.'}</p>

    {(!challenge || session.phase === 'choose' || session.phase === 'ready') && <section className="beat-reasons" aria-labelledby="beat-reason-title">
      <h2 id="beat-reason-title" className="u-label">{en ? 'WHERE ARE YOU STUCK?' : 'GDZIE UTKNĄŁEŚ?'}</h2>
      <div className="beat-reasons__grid">{beatReasons.map(reason => <button type="button" key={reason.id} className={cx('beat-reason panel-surface', session.reason === reason.id && 'is-active')} aria-pressed={session.reason === reason.id} onClick={() => choose(reason.id)}>{reason.label[lang]}<span aria-hidden="true">→</span></button>)}</div>
      {!challenge && <p className="beat-small">{en ? '12 prompts · Roland and DOOM OS · available offline' : '12 wyzwań · Roland i DOOM OS · dostępne offline'}</p>}
    </section>}

    {challenge && session.phase !== 'choose' && <>
      <FirmwareNotice firmware={session.firmware} />
      <article ref={challengeRef} className={cx('beat-challenge panel-surface', session.phase !== 'ready' && 'beat-challenge--working')} aria-labelledby="beat-challenge-title">
        <div className="beat-challenge__meta u-mono"><span>{session.firmware === 'doom' ? 'DOOM OS' : 'ROLAND'} · {challenge.minutes} MIN</span><SourceTag kind="tip" /></div>
        <h2 id="beat-challenge-title" className="u-label">{challenge.title[lang]}</h2>
        {session.phase === 'ready' ? <><p className="beat-challenge__goal">{challenge.goal[lang]}</p><div className="beat-constraint"><span className="u-label">{en ? 'YOUR CONSTRAINT' : 'TWOJE OGRANICZENIE'}</span><p>{challenge.constraint[lang]}</p></div></> : session.phase === 'active' ? <details className="beat-context"><summary>{en ? 'GOAL AND CONSTRAINT' : 'CEL I OGRANICZENIE'}</summary><p className="beat-challenge__goal">{challenge.goal[lang]}</p><div className="beat-constraint"><p>{challenge.constraint[lang]}</p></div></details> : null}

        {session.phase === 'ready' && <>
          <label className="beat-timer-choice"><input type="checkbox" checked={session.timerEnabled} onChange={event => dispatch({ type: 'BEAT_TIMER', enabled: event.target.checked, now: Date.now() })} /><span>{en ? `Use a timer · ${challenge.minutes} minutes (optional)` : `Z timerem · ${challenge.minutes} minut (opcjonalnie)`}</span></label>
          <div className="beat-actions"><HardwareButton label={en ? 'LET’S START' : 'ZACZYNAM'} tone="accent" onClick={() => dispatch({ type: 'BEAT_START', now: Date.now() })} /><button className="chip" type="button" onClick={() => choose(challenge.reason)}>{en ? 'ANOTHER PROMPT' : 'INNE WYZWANIE'}</button></div>
        </>}

        {session.phase === 'active' && <>
          <section className="beat-timer" aria-label={en ? 'Session timer' : 'Timer sesji'}>
            {session.timerEnabled ? <>
              <output className="beat-timer__clock u-mono" role="timer" aria-live="off">{beatClock(remaining)}</output>
              <p className="beat-small" role="status">{remaining === 0 ? (en ? 'Time is up. Finish your sketch when you are ready.' : 'Minął czas. Domknij szkic, kiedy będziesz gotowy.') : session.runningSince === null ? (en ? 'Timer paused' : 'Timer zatrzymany') : (en ? 'The timer keeps running while you open a guide.' : 'Timer biegnie także podczas otwierania instrukcji.')}</p>
              <div className="tool-actions">{remaining > 0 && <button className="chip" type="button" onClick={() => dispatch({ type: session.runningSince === null ? 'BEAT_RESUME' : 'BEAT_PAUSE', now: Date.now() })}>{session.runningSince === null ? (en ? 'RESUME TIMER' : 'WZNÓW TIMER') : (en ? 'PAUSE TIMER' : 'ZATRZYMAJ TIMER')}</button>}<button className="wf-text-action" type="button" onClick={() => dispatch({ type: 'BEAT_TIMER', enabled: false, now: Date.now() })}>{en ? 'Continue without a timer' : 'Kontynuuj bez timera'}</button></div>
            </> : <p className="beat-small">{en ? 'No timer. Work at your own pace.' : 'Bez timera. Pracuj we własnym tempie.'}</p>}
          </section>
          <div className="beat-step-progress u-mono">{en ? 'CURRENT STEP' : 'BIEŻĄCY KROK'} · {session.step + 1}/{challenge.steps.length}</div>
          <ol className="beat-steps">{challenge.steps.map((step, index) => <li key={index} hidden={session.step !== index}>
            <span className="beat-steps__number u-mono">0{index + 1}</span><div><p>{(session.firmware === 'doom' && step.doomCopy ? step.doomCopy : step.copy)[lang]}</p><Link className="wf-text-action" to={step.help[session.firmware]}>{en ? 'OPEN THE GUIDE →' : 'OTWÓRZ INSTRUKCJĘ →'}</Link></div>
          </li>)}</ol>
          <div className="beat-step-nav"><button className="chip" type="button" disabled={session.step === 0} onClick={() => dispatch({ type: 'BEAT_STEP', step: session.step - 1 })}>{en ? 'PREVIOUS STEP' : 'POPRZEDNI KROK'}</button>{session.step < challenge.steps.length - 1 && <button className="chip" type="button" onClick={() => dispatch({ type: 'BEAT_STEP', step: session.step + 1 })}>{en ? 'NEXT STEP →' : 'NASTĘPNY KROK →'}</button>}</div>
          <div className="beat-actions beat-actions--finish"><HardwareButton label={en ? 'I HAVE A SKETCH' : 'MAM SZKIC'} tone="accent" onClick={() => dispatch({ type: 'BEAT_FINISH', now: Date.now() })} /><button className="chip" type="button" onClick={() => { if (session.draft.idea.trim()) setSwitchPending(true); else choose(challenge.reason) }}>{en ? 'ANOTHER PROMPT' : 'INNE WYZWANIE'}</button></div>
          {switchPending && <aside className="beat-switch-confirm" role="alert"><p>{en ? 'Changing the prompt will discard this unsaved note. Keep it by finishing and saving to MY KIT.' : 'Zmiana wyzwania wyczyści tę niezapisaną notatkę. Zachowasz ją po zakończeniu i zapisaniu w MY KIT.'}</p><div className="tool-actions"><button className="chip" type="button" onClick={() => choose(challenge.reason)}>{en ? 'CHANGE THE PROMPT' : 'ZMIEŃ WYZWANIE'}</button><button className="chip" type="button" onClick={() => setSwitchPending(false)}>{en ? 'KEEP THIS SESSION' : 'ZOSTAŃ W TEJ SESJI'}</button></div></aside>}
        </>}

        {session.phase === 'finish' && <form className="beat-finish" onSubmit={event => {
          event.preventDefault()
          if (!session.draft.idea.trim() || notesFull || kitsFull || missingTarget || !name.trim()) return
          dispatch({ type: 'SAVE_BEAT_SKETCH', newKitId: crypto.randomUUID(), name, note })
        }}>
          <h3 className="u-label">{en ? 'WHAT WILL YOU DEVELOP NEXT?' : 'CO CHCESZ ROZWINĄĆ DALEJ?'}</h3>
          <p className="beat-small">{en ? 'Save the idea and sample location in MY KIT. The audio stays on your SP.' : 'Zapisz pomysł i lokalizację sampla w MY KIT. Dźwięk pozostaje na Twoim SP.'}</p>
          <label>{en ? 'Your next idea' : 'Pomysł do rozwinięcia'}<textarea rows={3} required maxLength={1000} value={session.draft.idea} placeholder={en ? 'A hit, a transition, a texture worth keeping…' : 'Uderzenie, przejście, tekstura, którą warto zachować…'} onChange={event => editDraft('idea', event.target.value)} /></label>
          <label>{en ? 'Save to' : 'Zapisz do'}<select value={session.draft.targetKitId} onChange={event => editDraft('targetKitId', event.target.value)}><option value="">{en ? 'New MY KIT set' : 'Nowy zestaw MY KIT'}</option>{state.kits.map(kit => <option key={kit.id} value={kit.id}>{kit.name}</option>)}</select></label>
          {!session.draft.targetKitId && <label>{en ? 'Set name' : 'Nazwa zestawu'}<input required maxLength={60} value={name} onChange={event => editDraft('name', event.target.value)} /></label>}
          <div className="beat-finish__fields">{([['project', en ? 'Project' : 'Projekt', 100], ['bankPad', 'Bank / pad', 100], ['bpm', 'BPM', 20]] as const).map(([field, label, max]) => <label key={field}>{label}<input maxLength={max} value={session.draft[field]} onChange={event => editDraft(field, event.target.value)} /></label>)}</div>
          {target && <p className="beat-small">{en ? 'This note will be appended. Existing notes are kept; blank project fields keep the saved values.' : 'Ta notatka zostanie dopisana. Obecne uwagi zostają; puste pola projektu zachowują zapisane wartości.'}</p>}
          {notesFull && <p role="status" className="practice-safety">{en ? 'The notes would exceed 2000 characters. Choose a new set or shorten your idea.' : 'Notatki przekroczyłyby 2000 znaków. Wybierz nowy zestaw lub skróć pomysł.'}</p>}
          {(kitsFull || missingTarget) && <p role="status" className="practice-safety">{en ? 'Choose an existing set, or make room for a new one in MY KIT.' : 'Wybierz istniejący zestaw lub zrób miejsce na nowy w MY KIT.'}</p>}
          <div className="beat-actions"><HardwareButton type="submit" label={en ? 'SAVE TO MY KIT' : 'ZAPISZ W MY KIT'} tone="accent" disabled={!session.draft.idea.trim() || notesFull || kitsFull || missingTarget || !name.trim()} /><button className="chip" type="button" onClick={() => dispatch({ type: 'BEAT_BACK' })}>{en ? 'BACK TO PLAYING' : 'WRÓĆ DO GRANIA'}</button></div>
        </form>}

        {session.phase === 'saved' && <div className="beat-saved">
          <h3 className="u-label">{en ? 'SKETCH NOTED' : 'SZKIC ZAPISANY'}</h3>
          <p role="status">{en ? 'Your idea is in MY KIT' : 'Twój pomysł jest w MY KIT'}{savedKit ? ` · ${savedKit.name}` : ''}.</p>
          <div className="beat-actions"><Link className="chip" to={`/kit?set=${session.savedKitId}`}>{en ? 'OPEN MY KIT →' : 'OTWÓRZ MY KIT →'}</Link><button className="chip" type="button" onClick={() => dispatch({ type: 'BEAT_RESET' })}>{en ? 'NEW SESSION' : 'NOWA SESJA'}</button></div>
        </div>}
      </article>
      <p className="beat-small beat-persist">{storageAvailable ? (en ? 'Session saved on this device · included in backups' : 'Sesja zapisana na tym urządzeniu · zawarta w kopii zapasowej') : (en ? 'Session only · local storage unavailable' : 'Tylko ta sesja · zapis lokalny niedostępny')}</p>
    </>}
  </div>
}
