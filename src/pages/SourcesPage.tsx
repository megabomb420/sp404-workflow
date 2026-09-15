import { useEffect } from 'react'
import { SourceTag } from '@/components/content/SourceTag'
import { MANUAL_VERSION } from '@/data/types'
import { useT } from '@/i18n/useT'
import { useDisplay } from '@/state/display'

export function SourcesPage() {
  const { setDisplay } = useDisplay()
  const t = useT()

  useEffect(() => {
    setDisplay({ title: 'SOURCES', sub: t.sources.lcdSub, right: '' })
  }, [setDisplay, t])

  return (
    <div className="page">
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
