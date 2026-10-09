import { useEffect, useState } from 'react'
import { Link, useSearchParams } from '@/lib/rr'
import { listeningDemos, LISTENING_REVIEWED } from '@/data/listening'
import { useLocale } from '@/i18n/locale'
import { useDisplay } from '@/state/display'
import cx from '@/utils/cx'

export function ListeningPage() {
  const { locale } = useLocale(), en = locale === 'en', copy = en ? 1 : 0
  const { setDisplay } = useDisplay()
  const [params, setParams] = useSearchParams()
  const group = params.get('topic') ?? 'all'
  const [active, setActive] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const [online, setOnline] = useState(true)
  useEffect(() => {
    const update = () => { setOnline(navigator.onLine); if (!navigator.onLine) setActive(null) }
    update(); window.addEventListener('online', update); window.addEventListener('offline', update)
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update) }
  }, [])
  useEffect(() => { setDisplay({ title: en ? 'LISTEN ON SP' : 'ODSŁUCH SP', sub: 'FX · RESAMPLE · SIDECHAIN', right: 'ROLAND' }) }, [setDisplay, en])
  useEffect(() => { setActive(null); setFailed(false) }, [group])
  return <div className="page listening-page">
    <h1 className="page__title u-label">{en ? 'LISTEN TO THE REAL SP' : 'POSŁUCHAJ PRAWDZIWEGO SP'}</h1>
    <p className="page__lede">{en ? 'Public Roland demonstrations with listening prompts and a before/after exercise for your sampler. Videos use the presenter’s audio and require internet.' : 'Publiczne demonstracje Rolanda z podpowiedziami odsłuchu i ćwiczeniem przed/po na Twoim samplerze. Filmy odtwarzają dźwięk autora i wymagają internetu.'}</p>
    <div className="chipbar" role="group" aria-label={en ? 'Listening topic' : 'Temat odsłuchu'}>{[['all', 'ALL'], ['fx', 'FX'], ['resample', 'RESAMPLE'], ['sidechain', 'SIDECHAIN']].map(([id, label]) => <button key={id} className={cx('chip', group === id && 'is-active')} type="button" aria-pressed={group === id} onClick={() => setParams(id === 'all' ? {} : { topic: id })}>{label}</button>)}</div>
    {!online && <p role="status" className="practice-safety">{en ? 'You are offline. Listening notes are available; connect to play the demonstrations.' : 'Jesteś offline. Podpowiedzi odsłuchu są dostępne; połącz się, żeby odtworzyć demonstracje.'}</p>}
    {listeningDemos.filter(demo => group === 'all' || demo.group === group).map(demo => <article key={demo.id} className="listening-demo panel-surface">
      <span className="u-mono listening-demo__source">{demo.producer} · SP-404MKII · {en ? 'source reviewed' : 'źródło sprawdzone'} {LISTENING_REVIEWED}</span>
      <h2 className="u-label">{demo.title}</h2><p>{demo.focus[copy]}</p>
      <details><summary>{en ? 'Compare before / after on your SP' : 'Porównaj przed / po na swoim SP'}</summary><p>{demo.tryIt[copy]}</p></details>
      <div className="tool-actions"><button type="button" className="chip" disabled={!online} onClick={() => { setActive(active === demo.id ? null : demo.id); setFailed(false) }}>{active === demo.id ? (en ? 'CLOSE PLAYER' : 'ZAMKNIJ ODTWARZACZ') : (en ? 'OPEN DEMONSTRATION' : 'OTWÓRZ DEMONSTRACJĘ')}</button><a className="chip" href={demo.youtube ? `https://www.youtube.com/watch?v=${demo.youtube}${demo.start ? `&t=${demo.start}s` : ''}` : demo.video} target="_blank" rel="noreferrer">{en ? 'OPEN AT SOURCE ↗' : 'OTWÓRZ U ŹRÓDŁA ↗'}</a></div>
      {active === demo.id && <div className="listening-player">{demo.video ? <video key={demo.id} controls playsInline preload="none" src={demo.video} aria-label={demo.title} onError={() => setFailed(true)} /> : <iframe key={demo.id} title={`${demo.producer} · ${demo.title}`} src={`https://www.youtube-nocookie.com/embed/${demo.youtube}?start=${demo.start ?? 0}`} allow="encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />}
        <p role={failed ? 'status' : undefined}>{failed ? (en ? 'The player could not load. Use “Open at source”.' : 'Odtwarzacz nie mógł załadować filmu. Użyj „Otwórz u źródła”.') : (en ? 'If playback is blocked, use “Open at source”.' : 'Jeśli odtwarzanie jest zablokowane, użyj „Otwórz u źródła”.')}</p>
      </div>}
      <div className="chipbar"><Link className="chip" to={demo.route}>{en ? 'TRY THE WORKFLOW →' : 'PRZEJDŹ DO INSTRUKCJI →'}</Link><a href={demo.source} target="_blank" rel="noreferrer">{en ? 'Source / attribution ↗' : 'Źródło / autorstwo ↗'}</a></div>
    </article>)}
  </div>
}
