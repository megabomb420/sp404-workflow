import { useEffect } from 'react'
import { SourceTag } from '../components/content/SourceTag'
import { MANUAL_VERSION } from '../data/types'
import { useDisplay } from '../state/display'

export function SourcesPage() {
  const { setDisplay } = useDisplay()

  useEffect(() => {
    setDisplay({ title: 'SOURCES', sub: 'skąd pochodzą fakty', right: '' })
  }, [setDisplay])

  return (
    <div className="page">
      <h1 className="page__title u-label">SOURCES & VERSION</h1>

      <section className="sbody">
        <h2 className="sbody__h u-label">PODSTAWA</h2>
        <p>
          Wszystkie fakty merytoryczne (ROLAND / VERIFIED) pochodzą z oficjalnego
          dokumentu <strong>Roland SP-404MKII Reference Manual (Version {MANUAL_VERSION})</strong> — wersja HTML
          (wyd. 404 Day 2026) oraz wydanie PDF v5 (lipiec 2025), których tekst został pobrany i zweryfikowany lokalnie.
        </p>
        <p>
          Każdy fakt opatrzony jest paginacją (<span className="u-mono">RM5.50 p.X</span>) — możesz ją sprawdzić
          w manualu. Treści, których nie udało się potwierdzić, są oznaczone jako niezweryfikowane i nie są
          podawane jako fakty.
        </p>
      </section>

      <section className="sbody">
        <h2 className="sbody__h u-label">DWA TYPY TREŚCI</h2>
        <div className="sbody__seq">
          <SourceTag kind="verified" />
          <p>
            <strong>ROLAND / VERIFIED</strong> — fakt zacytowany z manuala (skrót, parametr, ścieżka menu, zachowanie).
          </p>
        </div>
        <div className="sbody__seq">
          <SourceTag kind="tip" />
          <p>
            <strong>WORKFLOW TIP</strong> — praktyczna porada workflow (np. wartości startowe presetów sidechain),
            wynikająca z typowego używania samplera. Nie jest cytatem z manuala.
          </p>
        </div>
      </section>

      <section className="sbody">
        <h2 className="sbody__h u-label">WAŻNE USTALENIA WERYFIKACJI</h2>
        <ul className="dotlist">
          <li><strong>SIDECHAIN</strong> został dodany w firmware 5.50 (404 Day 2026). Ścieżka: <span className="u-mono">SHIFT+PAD 16 → EFX SET → SIDE CHAIN</span>; parametry SOURCE/TARGET/THRESHOLD/RATIO/RELEASE/GAIN.</li>
          <li><strong>Skip Back</strong>: bufor 25 s domyślnie, maks. 40 s (SYSTEM → MARK Function: SBS Def / SBS Long).</li>
          <li><strong>Resample</strong>: opcje routingu <span className="u-mono">Mix</span> / <span className="u-mono">ExtIn</span> (RECORD SETTING → ROUTING).</li>
          <li><strong>END SNAP</strong> to przełącznik ON/OFF na <span className="u-mono">[START/END]</span>.</li>
          <li>Brak „VariPhrase" w MKII — jest <span className="u-mono">VINYL MODE</span> i <span className="u-mono">VARI MODE</span> na ekranie PITCH/SPEED.</li>
        </ul>
      </section>

      <section className="sbody">
        <h2 className="sbody__h u-label">WERYFIKACJA</h2>
        <p>Treść zweryfikowana <strong>2026-08-19</strong> względem manuala v5.50. Aplikacja działa offline i jest PWA —
          instalacja z ekranu głównego po pierwszym otwarciu.</p>
      </section>
    </div>
  )
}
