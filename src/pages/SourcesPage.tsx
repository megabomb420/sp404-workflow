import { useEffect } from 'react'
import { SourceTag } from '@/components/content/SourceTag'
import { MANUAL_VERSION } from '@/data/types'
import { useT } from '@/i18n/useT'
import { useDisplay } from '@/state/display'
import { DOOM, doomSource } from '@/data/doom'
import { Link } from '@/lib/rr'
import { useLocale } from '@/i18n/locale'

export function SourcesPage() {
  const { setDisplay } = useDisplay()
  const t = useT()
  const { locale } = useLocale()

  useEffect(() => {
    setDisplay({ title: 'SOURCES', sub: t.sources.lcdSub, right: '' })
  }, [setDisplay, t])

  return (
    <div className="page">
      <section className="sbody"><h2 className="sbody__h u-label">DOOM OS · CUSTOM FIRMWARE</h2><p>{locale === 'en' ? 'The Polish and English companion guide follows the official DOOM OS manual and release notes.' : 'Przewodnik powstał na podstawie oficjalnego manuala DOOM OS i informacji o wydaniach.'}</p><p>Manual {DOOM.manualVersion} · firmware {DOOM.version} · build {DOOM.build}. {locale === 'en' ? 'The manual and current release have different version numbers. Metronome controls also differ in the release notes; check the installed build.' : 'Manual i bieżące wydanie mają różne numery wersji. Sterowanie metronomem różni się w informacjach o wydaniu; sprawdź zainstalowany build.'}</p><SourceTag source={doomSource} kind="verified" /><p><Link to="/doom-os?view=install">DOOM OS · {locale === 'en' ? 'versions and sources' : 'wersje i źródła'} →</Link></p></section>
      <section className="sbody">
        <h2 className="sbody__h u-label">{t.sources.base}</h2>
        <p>{t.sources.p1(MANUAL_VERSION)}</p>
        <p>{t.sources.p2}</p>
        <p>
          <a href="https://static.roland.com/manuals/sp-404mk2_reference_v550/en-US/index.html" target="_blank" rel="noreferrer">
            {t.sources.html}
          </a>
          {' · '}
          <a href="https://static.roland.com/assets/media/pdf/SP-404MK2_v5_reference_eng03_W.pdf" target="_blank" rel="noreferrer">
            {t.sources.pdf}
          </a>
        </p>
      </section>

      <section className="sbody">
        <h2 className="sbody__h u-label">{t.sources.two}</h2>
        <div className="sbody__seq">
          <SourceTag kind="verified" />
          <p>{t.sources.verified}</p>
        </div>
        <div className="sbody__seq">
          <SourceTag kind="tip" />
          <p>{t.sources.tip}</p>
        </div>
      </section>

      <section className="sbody">
        <h2 className="sbody__h u-label">{t.sources.findings}</h2>
        <ul className="dotlist">
          <li>{t.sources.f1}</li>
          <li>{t.sources.f2}</li>
          <li>{t.sources.f3}</li>
          <li>{t.sources.f4}</li>
          <li>{t.sources.f5}</li>
        </ul>
      </section>

      <section className="sbody">
        <h2 className="sbody__h u-label">{t.sources.verify}</h2>
        <p>{t.sources.verifyP}</p>
      </section>
    </div>
  )
}
