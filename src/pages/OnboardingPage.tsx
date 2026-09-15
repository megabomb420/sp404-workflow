import { useState } from 'react'
import { useNavigate } from '@/lib/rr'
import { HardwareButton } from '@/components/hardware/HardwareButton'
import { LangSwitch } from '@/components/nav/LangSwitch'
import { APP_REV } from '@/lib/appRev'
import { useT } from '@/i18n/useT'
import { useStore } from '@/state/store'
import { buzz } from '@/utils/haptics'
import cx from '@/utils/cx'

export function OnboardingPage() {
  const [i, setI] = useState(0)
  const { dispatch } = useStore()
  const navigate = useNavigate()
  const t = useT()
  const slides = t.onboarding.slides

  const finish = () => {
    buzz()
    dispatch({ type: 'SET_ONBOARDED', value: true })
    navigate('/', { replace: true })
  }
  const next = () => {
    buzz()
    if (i === slides.length - 1) finish()
    else setI(i + 1)
  }

  const slide = slides[i]

  return (
    <div className="ob">
      <div className="ob__lcd" aria-hidden="true">
        <span className="ob__brand u-label">{t.appName}</span>
        <span className="lcd__rev u-mono">{APP_REV}</span>
        <span className="ob__kick u-mono">{slide.kick}</span>
        <span className="ob__kick u-mono">{slide.kick}</span>
      </div>
      <div className="ob__content">
        <h1 className="ob__title u-label">{slide.title}</h1>
        <p className="ob__body">{slide.body}</p>
      </div>
      <div className="ob__foot">
        {i === 0 ? <LangSwitch /> : null}
        <div className="ob__dots" aria-hidden="true">
          {slides.map((_, idx) => (
            <span key={idx} className={cx('ob__dot', idx === i && 'is-active')} />
          ))}
        </div>
        <HardwareButton label={i === slides.length - 1 ? t.onboarding.start : t.onboarding.next} tone="accent" wide onClick={next} />
        {i < slides.length - 1 && (
          <button type="button" className="ob__skip u-label" onClick={finish}>
            {t.onboarding.skip}
          </button>
        )}
      </div>
    </div>
  )
}
