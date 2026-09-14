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
          Podstawą informacji o sprzęcie jest oficjalny
          dokumentu <strong>Roland SP-404MKII Reference Manual (Version {MANUAL_VERSION})</strong> — wersja HTML
          oraz wydanie PDF v5. Odsyłacze ze stroną prowadzą do PDF v5; sekcje opisujące zmiany firmware mogą odnosić się do HTML v5.50.
        </p>
        <p>
          Kliknij etykietę źródła przy instrukcji, aby otworzyć manual. Odsyłacze wymagają internetu;
          treść aplikacji pozostaje dostępna offline po pierwszym pełnym załadowaniu. Etykieta VERIFIED oznacza odniesienie do dokumentacji, nie automatyczną kontrolę sprzętu ani gwarancję braku błędu.
        </p>
        <p><a href="https://static.roland.com/manuals/sp-404mk2_reference_v550/en-US/index.html" target="_blank" rel="noreferrer">Manual HTML v5.50 ↗</a> · <a href="https://static.roland.com/assets/media/pdf/SP-404MK2_v5_reference_eng03_W.pdf" target="_blank" rel="noreferrer">Manual PDF v5 ↗</a></p>
      </section>

      <section className="sbody">
        <h2 className="sbody__h u-label">DWA TYPY TREŚCI</h2>
        <div className="sbody__seq">
          <SourceTag kind="verified" />
          <p>
            <strong>ROLAND / VERIFIED</strong> — instrukcja opracowana na podstawie manuala (skrót, parametr, ścieżka menu, zachowanie).
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
        <p>Podczas aktualizacji 2026-09-14 ponownie sprawdzono wybrane instrukcje resamplingu patternu, routingu Mix / BOUNCE i ustawiania BPM. Nie był to ponowny audyt całej biblioteki ani test wszystkich procedur na sprzęcie. Jeśli ekran SP się nie zgadza, przerwij krok i sprawdź dokumentację swojej wersji firmware.</p>
      </section>
    </div>
  )
}
