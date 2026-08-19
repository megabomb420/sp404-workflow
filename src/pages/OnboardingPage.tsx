import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HardwareButton } from '../components/hardware/HardwareButton'
import { useStore } from '../state/store'
import { buzz } from '../utils/haptics'
import cx from '../utils/cx'

const SLIDES = [
  {
    kick: 'SP WORKFLOW',
    title: 'MANUAL, KTÓREGO UŻYJESZ NAPRAWDĘ',
    body: 'Przewodnik po Roland SP-404MKII do czytania przy robieniu beatu, nie na kanapie wieczorem.',
  },
  {
    kick: 'SEARCH',
    title: 'ZNAJDŹ KAŻDĄ FUNKCJĘ SZYBKO',
    body: 'Wpisz sidechain, skipback, chop, USB — wynik z dokładną ścieżką przycisków w sekundę.',
  },
  {
    kick: 'PADS',
    title: 'NAUCZ SIĘ PRZYCISKÓW',
    body: 'Workflow krok po kroku i trainer muscle memory. Otwórz SIDECHAIN bez myślenia.',
  },
  {
    kick: 'OFFLINE',
    title: 'DZIAŁA OFFLINE',
    body: 'Pobierz raz, dodaj do ekranu głównego, korzystaj bez internetu obok sprzętu.',
  },
] as const

export function OnboardingPage() {
  const [i, setI] = useState(0)
  const { dispatch } = useStore()
  const navigate = useNavigate()

  const finish = () => {
    buzz()
    dispatch({ type: 'SET_ONBOARDED', value: true })
    navigate('/', { replace: true })
  }
  const next = () => {
    buzz()
    if (i === SLIDES.length - 1) finish()
    else setI(i + 1)
  }

  const slide = SLIDES[i]

  return (
    <div className="ob">
      <div className="ob__lcd" aria-hidden="true">
        <span className="ob__brand u-label">SP WORKFLOW</span>
        <span className="ob__kick u-mono">{slide.kick}</span>
      </div>
      <div className="ob__content">
        <h1 className="ob__title u-label">{slide.title}</h1>
        <p className="ob__body">{slide.body}</p>
      </div>
      <div className="ob__foot">
        <div className="ob__dots" aria-hidden="true">
          {SLIDES.map((_, idx) => (
            <span key={idx} className={cx('ob__dot', idx === i && 'is-active')} />
          ))}
        </div>
        <HardwareButton label={i === SLIDES.length - 1 ? 'START' : 'DALEJ →'} tone="accent" wide onClick={next} />
        {i < SLIDES.length - 1 && (
          <button type="button" className="ob__skip u-label" onClick={finish}>
            POMIŃ
          </button>
        )}
      </div>
    </div>
  )
}
