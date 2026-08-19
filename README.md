# SP WORKFLOW

Interaktywny, offline-first przewodnik workflow po **Roland SP-404MKII** w formie PWA.
Wygląda i działa jak companion app do samplera — nie jak strona dokumentacyjna.

- **Język:** polski (etykiety sprzętowe/menu SP w oryginalnej pisowni angielskiej)
- **Priorytet:** mobile-first (~390–430 px), iPhone-safe-area, działa offline
- **Treść:** weryfikowana względem **Roland SP-404MKII Reference Manual v5.50**
  (fakty z paginacją `RM5.50 p.X`; porady oznaczone jako **WORKFLOW TIP**)

## Funkcje

- 16 padów → 12 sekcji merytorycznych + SHORTCUTS / FIX IT / MUSCLE MEMORY / SEARCH
- MiniDisplay (LCD) komunikujący stan aplikacji (sekcja, krok, BPM, READY)
- Wyszukiwarka offline z aliasami (sidechain, ducking, pump, skipback…)
- Workflow krok po kroku z zapisanym postępem (localStorage)
- Cheat sheet skrótów z filtrami + MY KIT (ulubione)
- Trainer muscle memory (losowanie zadań, POKAŻ ODPOWIEDŹ)
- Sekcja SIDECHAIN (firmware 5.50) z prawdziwymi parametrami + 3 presetami startowymi
- Instalacja jako PWA, praca offline po pierwszym załadowaniu

## Rozwój

```bash
npm install
npm run dev        # dev server
npm run build      # tsc + vite build (w dist/)
npm run preview    # podgląd buildu
npm run icons      # regeneracja ikon (PowerShell/System.Drawing)
python scripts/fetch-fonts.py   # re-vendoring fontów (woff2)
```

## Struktura

```
src/
  app/          # shell, router, onboarding gate
  components/   # hardware UI (Pad, MiniDisplay, ButtonSequence…) i content
  data/         # cała treść (types + shortcuts/sections/workflows/…)
  pages/        # ekrany
  state/        # store + localStorage, display context
  styles/       # tokens, base, components, pages
scripts/        # generate-icons.ps1, fetch-fonts.py
reference/      # lokalne kopie manuala (nie publikowane)
```

Treść dodaje się w `src/data/*` bez zmian w komponentach.

## Audit (testy weryfikacyjne)

Wymagają działającego serwera (`npm run preview`) i headless Chromium
(instalacja: `npx playwright install chromium`):

```bash
npm run audit          # 12 kontroli funkcjonalnych przy 390 px
npm run shots          # screenshoty ekranów do reference/shots/ + kontrola overflow
npm run offline-test   # działanie offline po pierwszym załadowaniu
```

## Źródła

Wszystkie fakty **ROLAND / VERIFIED** pochodzą z oficjalnego manuala
(Roland SP-404MKII Reference Manual, wersja 5.50 — edycja HTML 404 Day 2026
oraz PDF v5 z 07.2025). Szczegóły w sekcji **SOURCES & VERSION** w aplikacji.
