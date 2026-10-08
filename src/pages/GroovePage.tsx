import { useEffect, useRef, useState } from 'react'
import { Link } from '@/lib/rr'
import { useStore } from '../state/store'
import { useDisplay } from '../state/display'
import { DEFAULTS } from '../state/model'
import type { GrooveNote } from '../state/model'
import { SourceTag } from '../components/content/SourceTag'
import { doomSource } from '../data/doom'
import cx from '../utils/cx'

export function GroovePage() {
  const { state, dispatch } = useStore()
  const { setDisplay } = useDisplay()
  const groove = state.groove, note = groove.notes[groove.selected]
  const [playing, setPlaying] = useState(false), [sound, setSound] = useState(false), [cursor, setCursor] = useState(0), [message, setMessage] = useState('')
  const context = useRef<AudioContext | null>(null)
  const notes = useRef(groove.notes)
  useEffect(() => { notes.current = groove.notes }, [groove.notes])
  useEffect(() => { setDisplay({ title: 'GROOVE LAB', sub: 'velocity · nudge · length', right: `${groove.bpm} BPM` }) }, [setDisplay, groove.bpm])
  const stop = () => { setPlaying(false); const audio = context.current; context.current = null; if (audio) void audio.close().catch(() => {}) }
  const prepareAudio = async () => {
    try { if (!context.current) context.current = new AudioContext(); await context.current.resume(); return true }
    catch { setMessage('Odsłuch dźwięku jest niedostępny. Nadal możesz korzystać z wizualizacji.'); return false }
  }
  useEffect(() => {
    if (!playing) { setCursor(0); return }
    let frame = 0
    const start = performance.now(), duration = 240_000 / groove.bpm, stepSeconds = 15 / groove.bpm
    let nextBar = (context.current?.currentTime ?? 0) + .05
    const tick = () => {
      setCursor(((performance.now() - start) % duration) / duration * 16)
      const audio = context.current
      if (sound && audio && audio.state === 'running' && audio.currentTime + .15 >= nextBar) {
        notes.current.forEach((n, i) => {
          if (!n.on) return
          const at = nextBar + ((i + n.nudge + 16) % 16) * stepSeconds
          const oscillator = audio.createOscillator(), gain = audio.createGain(), length = Math.max(.025, n.length * stepSeconds)
          oscillator.type = 'sine'; oscillator.frequency.value = 500
          gain.gain.setValueAtTime(.0001, at); gain.gain.linearRampToValueAtTime(n.velocity / 127 * .16, at + .004); gain.gain.exponentialRampToValueAtTime(.0001, at + length)
          oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(at); oscillator.stop(at + length + .01)
          oscillator.onended = () => { oscillator.disconnect(); gain.disconnect() }
        })
        nextBar += duration / 1000
      }
      frame = requestAnimationFrame(tick)
    }
    tick()
    const hidden = () => { if (document.visibilityState === 'hidden') stop() }
    document.addEventListener('visibilitychange', hidden)
    return () => { cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', hidden) }
  }, [playing, groove.bpm, sound])
  useEffect(() => () => { if (context.current) void context.current.close().catch(() => {}) }, [])
  const edit = (key: 'velocity' | 'length' | 'nudge', value: number) => dispatch({ type: 'SET_GROOVE', value: { notes: groove.notes.map((n, i) => groove.scope === 'track' || i === groove.selected ? { ...n, [key]: value } : n) } })
  const x = (i: number, n: GrooveNote) => 24 + (((i + n.nudge + 16) % 16) / 16) * 832

  return <div className="page groove-page">
    <h1 className="page__title u-label">GROOVE LAB</h1>
    <p className="page__lede">Zobacz i odsłuchaj wpływ velocity, przesunięcia i długości nuty. To model edukacyjny z syntetycznym dźwiękiem. Zmiany zapisują się lokalnie.</p>
    <section className="groove-timeline panel-surface">
      <svg viewBox="0 0 880 180" role="img" aria-label={`Siatka 16 kroków. Wybrany krok ${groove.selected + 1}, velocity ${note.velocity}, przesunięcie ${Math.round(note.nudge * 15000 / groove.bpm)} milisekund, długość ${note.length} kroku.`}>
        <defs><clipPath id="groove-clip"><rect x="24" y="0" width="832" height="180" /></clipPath></defs>
        {Array.from({ length: 17 }, (_, i) => <line key={i} x1={24 + i * 52} x2={24 + i * 52} y1="12" y2="146" stroke={i % 4 === 0 ? 'var(--ink-faint)' : 'var(--hairline)'} strokeDasharray={i % 4 ? '3 4' : undefined} />)}
        <g clipPath="url(#groove-clip)">{groove.notes.map((n, i) => n.on && <g key={i} fill={i === groove.selected ? 'var(--accent)' : 'var(--led)'}>
          <rect className="groove-velocity" x={x(i, n)} y={85 - n.velocity / 127 * 62} width="9" height={n.velocity / 127 * 62} rx="2" opacity={i === groove.selected ? 1 : .6} />
          <circle cx={x(i, n) + 4.5} cy="97" r={i === groove.selected ? 5 : 3} />
          <rect className="groove-length" x={x(i, n)} y={114 + i % 4 * 7} width={n.length * 52} height="4" rx="2" opacity={i === groove.selected ? 1 : .45} />
          {x(i, n) + n.length * 52 > 856 && <rect x="24" y={114 + i % 4 * 7} width={x(i, n) + n.length * 52 - 856} height="4" rx="2" opacity=".45" />}
        </g>)}</g>
        {playing && <line className="groove-playhead" x1={24 + cursor * 52} x2={24 + cursor * 52} y1="8" y2="146" stroke="var(--ink)" strokeWidth="2" />}
        {[1, 2, 3, 4].map((beat, i) => <text key={beat} x={24 + i * 208} y="168" fill="var(--ink-dim)" fontSize="16">BEAT {beat}</text>)}
      </svg>
      <p className="groove-legend">Słupek = velocity · punkt = timing · linia = długość</p>
      <div className="tool-actions">
        <button className="chip" type="button" onClick={async () => { if (playing) stop(); else if (!sound || await prepareAudio()) setPlaying(true) }}>{playing ? 'STOP' : 'ODTWÓRZ'}</button>
        <button className="chip" type="button" aria-pressed={sound} onClick={async () => { stop(); if (sound) setSound(false); else if (await prepareAudio()) setSound(true) }}>DŹWIĘK {sound ? 'ON' : 'OFF'}</button>
        <button className="chip" type="button" onClick={() => { stop(); dispatch({ type: 'SET_GROOVE', value: DEFAULTS.groove }) }}>WZÓR STARTOWY</button>
      </div>
      {message && <p role="status">{message}</p>}
    </section>
    <div className="groove-steps" role="group" aria-label="wybór kroku">{groove.notes.map((n, i) => <button key={i} className={cx('groove-step', n.on && 'is-on', i === groove.selected && 'is-selected')} type="button" aria-pressed={i === groove.selected} aria-label={`wybierz krok ${i + 1}${n.on ? ', nuta włączona' : ', pusty'}`} onClick={() => dispatch({ type: 'SET_GROOVE', value: { selected: i } })}>{i + 1}</button>)}</div>
    <section className="groove-controls panel-surface">
      <h2 className="u-label">KROK {groove.selected + 1}</h2>
      <div className="tool-actions"><button className="chip" type="button" aria-pressed={note.on} onClick={() => dispatch({ type: 'SET_GROOVE', value: { notes: groove.notes.map((n, i) => i === groove.selected ? { ...n, on: !n.on } : n) } })}>{note.on ? 'NUTA ON' : 'NUTA OFF'}</button><button className="chip" type="button" aria-pressed={groove.scope === 'track'} onClick={() => dispatch({ type: 'SET_GROOVE', value: { scope: groove.scope === 'note' ? 'track' : 'note' } })}>{groove.scope === 'track' ? 'WSZYSTKIE NUTY' : 'TYLKO TA NUTA'}</button></div>
      {groove.scope === 'track' && <p className="groove-scope">Zmiana parametru nada wszystkim nutom tę samą wartość — jak gałka w siatce DOOM OS bez trzymania pada.</p>}
      <label className="lab-slider">TEMPO <output>{groove.bpm} BPM</output><input type="range" aria-label="tempo laboratorium" min="40" max="200" value={groove.bpm} onChange={(e) => { stop(); dispatch({ type: 'SET_GROOVE', value: { bpm: Number(e.target.value) } }) }} /></label>
      <label className="lab-slider">VELOCITY <output>{note.velocity}</output><input type="range" aria-label="velocity nuty" min="1" max="127" value={note.velocity} onChange={(e) => edit('velocity', Number(e.target.value))} /></label>
      <label className="lab-slider">NUDGE <output>{Math.round(note.nudge * 15000 / groove.bpm)} ms</output><input type="range" aria-label="przesunięcie nuty" min="-.45" max=".45" step=".01" value={note.nudge} onChange={(e) => edit('nudge', Number(e.target.value))} /></label>
      <label className="lab-slider">DŁUGOŚĆ <output>{note.length} kroku</output><input type="range" aria-label="długość nuty" min=".125" max="16" step=".125" value={note.length} onChange={(e) => edit('length', Number(e.target.value))} /></label>
      <p className="page__lede">1 takt 4/4, 16 kroków. Ujemny nudge wyprzedza siatkę, dodatni opóźnia. Rzeczywisty czas wybrzmienia sampla zależy też od jego długości i trybu odtwarzania na SP.</p>
      <SourceTag source={doomSource} kind="tip" />
      <Link className="chip" to="/screen?id=grid">POKRĘTŁA NA PRAWDZIWYM SP →</Link>
    </section>
  </div>
}
