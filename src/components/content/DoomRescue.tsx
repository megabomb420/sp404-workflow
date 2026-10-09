import { useEffect } from 'react'
import { Link, useSearchParams } from '@/lib/rr'
import { doomProblems } from '@/data/doomRescue'
import { doomSource } from '@/data/doom'
import { useLocale } from '@/i18n/locale'
import { useDisplay } from '@/state/display'
import { workflowReturnRoute } from '@/utils/session'
import { FirmwareNotice } from './FirmwareSwitch'
import { SourceTag } from './SourceTag'
import { ShortcutCard } from './ShortcutCard'
import { shortcutsById } from '@/data/shortcuts'
import { localizeShortcut } from '@/i18n/content'

export function DoomRescue() {
  const [params, setParams] = useSearchParams(), { locale } = useLocale(), en = locale === 'en', lang = en ? 1 : 0
  const { setDisplay } = useDisplay(), returnRoute = workflowReturnRoute(params)
  const problem = doomProblems.find(item => item.id === params.get('problem'))
  const requested = Number(params.get('check') ?? 0)
  const index = Number.isInteger(requested) && requested >= 0 ? Math.min(requested, problem?.checks.length ?? 0) : 0
  const check = problem?.checks[index], resolved = params.get('resolved') === 'yes'
  const update = (problemId?: string, next = 0, done = false) => { const copy = new URLSearchParams(params); for (const key of ['problem', 'check', 'resolved']) copy.delete(key); copy.set('firmware', 'doom'); if (problemId) { copy.set('problem', problemId); copy.set('check', String(next)) } if (done) copy.set('resolved', 'yes'); setParams(copy) }
  useEffect(() => { setDisplay({ title: 'FIX IT · DOOM OS', sub: en ? 'one check at a time' : 'jedno sprawdzenie naraz', right: check ? `${index + 1}/${problem?.checks.length}` : '' }) }, [setDisplay, en, index, check, problem])
  return <div className="page doom-rescue"><FirmwareNotice firmware="doom" />
    <h1 className="page__title u-label">FIX IT · DOOM OS</h1>
    <p className="page__lede">{en ? 'Choose what you observe. Make one check, then listen or inspect the screen before continuing.' : 'Wybierz to, co widzisz lub słyszysz. Wykonaj jedno sprawdzenie i oceń rezultat przed kolejnym.'}</p>
    {returnRoute && <p className="rescue-context panel-surface">{en ? 'Your workflow position is saved.' : 'Pozycja w workflow jest zachowana.'}</p>}
    <section className="rescue-guide panel-surface">
      {resolved ? <div role="status"><h2>{en ? 'That helped' : 'To pomogło'}</h2><p>{en ? 'Check the result once more, then return to your session.' : 'Sprawdź rezultat jeszcze raz i wróć do sesji.'}</p></div> : check ? <>
        <p className="u-mono">{index + 1} / {problem!.checks.length}</p><h2 className="u-label">{check.title[lang]}</h2><p>{check.action[lang]}</p>
        <div className="wf-check"><p>{check.expected[lang]}</p></div><SourceTag source={doomSource} kind="verified" />
        <div className="tool-actions"><button className="chip" onClick={() => update(problem!.id, index, true)}>{en ? 'THIS HELPED' : 'TO POMOGŁO'}</button><button className="chip" onClick={() => update(problem!.id, index + 1)}>{en ? 'NO CHANGE · NEXT' : 'BEZ ZMIANY · DALEJ'}</button>{index > 0 && <button className="chip" onClick={() => update(problem!.id, index - 1)}>{en ? 'PREVIOUS CHECK' : 'POPRZEDNIE SPRAWDZENIE'}</button>}</div>
        <details className="rescue-reference"><summary>{en ? 'Related controls' : 'Powiązane przyciski'}</summary>{check.controls.map(id => <ShortcutCard key={id} shortcut={localizeShortcut(shortcutsById[id], locale)} />)}</details>
      </> : problem ? <div role="status"><h2>{en ? 'Checks finished' : 'Sprawdzenia zakończone'}</h2><p>{en ? 'The cause is still unclear. Use on-device help in the current screen and consult the source manual. Avoid clearing tracks or automation to diagnose this.' : 'Przyczyna nadal jest niejasna. Użyj pomocy na sprzęcie w bieżącym ekranie i sprawdź manual. Nie kasuj ścieżek ani automatyki podczas szukania przyczyny.'}</p><Link className="chip" to="/doom-os?id=doom-help">{en ? 'ON-DEVICE HELP' : 'POMOC NA SPRZĘCIE'}</Link></div> : <div className="rescue-guide__choices">{doomProblems.map(item => <button className="chip" key={item.id} onClick={() => update(item.id)}>{item.title[lang]}</button>)}</div>}
      {problem && <button className="wf-text-action" onClick={() => update()}>{en ? 'Choose another symptom' : 'Wybierz inny objaw'}</button>}
    </section>
    {returnRoute && <Link className="rescue-return__primary u-label" to={returnRoute}>{en ? 'RETURN TO THE SAME STEP' : 'WRÓĆ DO TEGO SAMEGO KROKU'}</Link>}
  </div>
}
