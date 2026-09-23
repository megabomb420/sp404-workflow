import { useState } from 'react'
import { PadGrid, type PadConfig } from '@/components/hardware/PadGrid'
import { useT } from '@/i18n/useT'
import { useStore } from '@/state/store'
import cx from '@/utils/cx'
import { PAD_BANKS, PAD_COUNT, padKey, padLabel } from '@/utils/pads'

/**
 * Notatnik padów: bank A–J, 16 padów, jedna etykieta na pad. Trzyma wyłącznie to,
 * co wpisze użytkownik — nie czyta zawartości SP i nie udaje, że to robi.
 */
export function MyPads() {
  const t = useT()
  const { state, dispatch } = useStore()
  const { bank, map } = state.pads
  const [selected, setSelected] = useState<number | null>(null)

  const items: PadConfig[] = Array.from({ length: PAD_COUNT }, (_, index) => index + 1).map((pad) => {
    const label = padLabel(map, bank, pad)
    return {
      pad,
      label: label ?? t.pads.empty,
      ledOn: label !== null,
      active: selected === pad,
      ariaLabel: label ? t.pads.padAria(pad, label) : t.pads.padEmptyAria(pad),
      onClick: () => setSelected(pad),
    }
  })

  const changeBank = (next: string) => {
    dispatch({ type: 'SET_PAD_BANK', bank: next })
    setSelected(null)
  }

  const assign = (label: string) => {
    if (selected === null) return
    const key = padKey(bank, selected)
    if (key) dispatch({ type: 'SET_PAD_LABEL', key, label })
    setSelected(null)
  }

  const current = selected === null ? null : padLabel(map, bank, selected)

  return (
    <section className="my-pads panel-surface" aria-labelledby="my-pads-title">
      <h2 id="my-pads-title" className="u-label">{t.pads.title}</h2>
      <p className="my-pads__hint">{t.pads.hint}</p>

      <div className="chipbar" role="toolbar" aria-label={t.pads.bankAria}>
        {PAD_BANKS.map((option) => (
          <button
            key={option}
            type="button"
            className={cx('chip', option === bank && 'is-active')}
            aria-pressed={option === bank}
            onClick={() => changeBank(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <PadGrid items={items} />

      {selected !== null && (
        <div className="my-pads__palette" role="group" aria-label={t.pads.paletteLabel}>
          <span className="u-label">{t.pads.paletteLabel}</span>
          <div className="chipbar">
            {t.pads.palette.map((role) => (
              <button
                key={role}
                type="button"
                className={cx('chip', role === current && 'is-active')}
                aria-pressed={role === current}
                onClick={() => assign(role)}
              >
                {role}
              </button>
            ))}
            <button type="button" className="chip" onClick={() => assign('')}>
              {t.pads.clear}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
