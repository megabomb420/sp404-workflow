# SP WORKFLOW — design (PWA companion dla Roland SP-404MKII)

Data: 2026-08-19 · Status: zaakceptowany do implementacji · Język aplikacji: **polski** (etykiety sprzętowe/menu SP w oryginalnej pisowni angielskiej)

---

## 1. Cel

Interaktywny, offline-first przewodnik workflow po samplerze Roland SP-404MKII, działający jako PWA na telefonie (priorytet 390–430 px), używany **obok** sprzętu. Nie jest dokumentacją — jest companion app + cheat sheet + trainer muscle memory.

Priorytety (za briefem): 1) poprawność techniczna, 2) szybkie znajdowanie, 3) workflow i sekwencje przycisków, 4) wygoda na telefonie, 5) look samplera, 6) animacje.

## 2. Źródła i weryfikacja treści

- **Główne źródło:** Roland SP-404MKII Reference Manual v5.50 (edycja HTML, 404 Day 2026) + Reference Manual v5 (PDF `SP-404MK2_v5_reference_eng03_W.pdf`, wyd. 07.2025) — tekst obu pobrany lokalnie do `reference/`.
- **Metoda:** każdy fakt merytoryczny wyekstrahowany dosłownie (verbatim quote) z manuala, z paginacją (`RM5.50 p.X`). Treść niezweryfikowana nigdy nie jest podawana jako fakt.
- **Dwa typy treści, zawsze rozdzielone w UI:**
  - `ROLAND / VERIFIED` — fakt z manuala (z paginacją),
  - `WORKFLOW TIP` — praktyczna porada workflow (oznaczona), nie wynikająca wprost z manuala.

### Kluczowe ustalenia weryfikacji (korekty względem briefu)

| Temat briefu | Stan faktyczny (RM 5.50) |
|---|---|
| SIDECHAIN | **ISTNIEJE w firmware 5.50** (dodany 404 Day 2026). Ścieżka: `SHIFT+PAD 13 → UTILITY MENU → EFX SET` (bezpośrednio `SHIFT+PAD 16`), zakładka **SIDE CHAIN** (EFX SET ma 6 zakładek: FAVORITE, BUS 3, BUS 4, SIDE CHAIN, DIRECT, OTHER). Parametry: **SOURCE** (DRY, BUS 1–4), **TARGET** (OFF, DRY, BUS 1–4), **THRESHOLD** 0–255, **RATIO** 0–255, **RELEASE** 0–255, **GAIN** 0.0–6.0 dB. TARGET ≠ OFF = sidechain aktywny. |
| VariPhrase | NIE występuje w MKII (to termin innych maszyn Roland). MKII ma: **VINYL MODE** (No/Yes) + **VARI MODE** (Off/Backing/Ensemble) na ekranie PITCH/SPEED. |
| Skip Back | Bufor: **25 s default**, maks. **40 s** (SYSTEM → MARK Function: `SBS Def`/`SBS Long`/`Looper`). Nagrywa się automatycznie gdy poziom przekracza **Auto Trig Level** (1–10); `[MARK]` miga podczas nagrywania. `[MARK]` otwiera bufor → `[REC]` → wybór pada. |
| END SNAP | Prosty **ON/OFF** przełącznik na `[START/END]` (nie tryby AUTO/MANUAL). |
| Resample routing | Opcje ekranowe **`Mix`** / **`ExtIn`** (RECORD SETTING → ROUTING). |
| RECORD SETTING | Parametry: **REC BPM**, **ROUTING**, **PAN**, **LEVEL** (+ długość sampla CTRL2, taktowanie SHIFT+CTRL2). |
| Shuffle / Swing | Nie ma osobnej „swing". Jest parametr **SHUFFLE** (−50..+50) przy nagraniu oraz opcje quantize **SHUFFLE 16 / SHUFFLE 8**. |
| AUTO MARK | **Jest**: TIME DIVISION (2–16), LEVEL (1–10), TRANSIENT (HARD/MID/SOFT). |
| Envelope | Tylko **ATTACK / HOLD / RELEASE**. |
| Process menu | Dokładnie: **TRUNCATE, NORMALIZE, EMPHASIS, CANCEL** (brak pozycji „GAIN"). |
| MFX list | 46 efektów (nazwy verbatim, np. 404 VinylSim, SBF, To-Gu-Ro, ...). |
| FAVORITE | To preset **konfiguracji busów** (Routing TYPE A/B + BUS 3/4 combos, sloty 1–16), nie preset pojedynczego efektu. |
| MUTE BUS | `SHIFT + [BUS FX]`. EFFECT GRAB = przytrzymaj `[VALUE]` + przycisk efektu. |
| BPM | Sample: PITCH/SPEED → BPM SET (AUTO/MANU/MANU-F). Bank/projekt + tap tempo: `SHIFT+PAD 11` (TEMPO SEL). Przycisk `[BPM SYNC]`; `SHIFT+BPM SYNC` = cały bank. |
| Pattern | TR-REC parametry: SUBSTEP, HOLD STEP, PITCH, PITCH MODE, VELOCITY, BPM, SHUFFLE, START, MODE (TRIG/HOLD STEP). Długość 1–64 takty; edit 1/2/4/8/16/32/64. |
| USB AUDIO | USB-C (class-compliant USB Audio 2.0, bez sterownika). Aby usłyszeć audio komputera: `[EXT SOURCE]`. SYSTEM → USB IN: `LINE IN` / `MIX OUT`. |

## 3. Stack i narzędzia

- Vite + React + TypeScript **strict**, plain CSS (design tokens + CSS Modules), brak bibliotek UI, brak backendu.
- Router: **HashRouter** (react-router-dom) — działa offline i po odświeżeniu bez reguł serwera.
- Stan: lekki store (React Context + useReducer) + `localStorage`.
- PWA: **vite-plugin-pwa** (Workbox) — manifest, service worker, precache, standalone, offline.
- Ikony: skrypt **PowerShell + System.Drawing** (`scripts/generate-icons.ps1`) → PNG 192/512/maskable + apple-touch-icon 180 (zero zależności natywnych).
- Fonty self-hosted (woff2 vendored): **Archivo Condensed** (etykiety sprzętowe), **Inter** (treść), **JetBrains Mono** (wartości/LCD).

## 4. Struktura projektu

```
sp404-workflow/
  index.html
  public/ (ikony, fonty)
  src/
    main.tsx
    app/            — shell, router, layout, onboarding gate
    components/
      hardware/     — HardwareButton, Pad, PadGrid, MiniDisplay, StatusLED, Knob, SegLED
      content/      — ButtonSequence, RoutingDiagram, WorkflowStep, WorkflowPlayer,
                      ShortcutCard, TroubleshootingItem, SectionHeader, SourceTag,
                      StepSequencer, PresetCard, SearchOverlay
      nav/          — BottomDock, TopBar
    data/           — types.ts + shortcuts.ts, workflows.ts, troubleshooting.ts,
                      glossary.ts, muscleMemory.ts, sections/*.ts, mfx.ts, searchIndex.ts
    state/          — store.tsx, useLocalStorage.ts, settings.ts, favorites.ts, progress.ts
    pages/          — Home, Section, Search, Workflows, Shortcuts, FixIt, Kit, Muscle,
                      Settings, Sources, Onboarding
    styles/         — tokens.css, base.css, components
    utils/          — haptics.ts, cx.ts, normalize.ts
  vite.config.ts
  scripts/generate-icons.ps1
```

## 5. Model danych (src/data/types.ts)

```ts
type Source = { manual: 'RM5.50'; page?: number; section?: string };
type VerifiedKind = 'verified' | 'tip';          // ROLAND/VERIFIED vs WORKFLOW TIP

interface Shortcut {
  id: string; name: string;                      // PL
  nameEn?: string;                               // oficjalna nazwa EN
  category: ShortcutCategory;                    // SAMPLING | EDIT | PATTERN | RESAMPLE | FX | ROUTING | SKIP BACK | COPY | MUTE | UNDO | CHROMATIC | UTILITY
  buttons: string[];                             // np. ['SHIFT','PAD 16']
  path?: string[];                               // np. ['EFX SET','SIDE CHAIN']
  description: string;                           // PL
  source: Source; kind: VerifiedKind;
  tags: string[];                                // aliasy PL+EN+slang (sidechain, ducking, pump...)
}

interface WorkflowStep {
  id: string; title: string;                     // PL
  action?: string;                               // co robimy
  buttons?: string[];
  explanation?: string;                          // dlaczego
  expectedResult?: string;                       // co powinno się stać
  commonMistake?: string;
  source?: Source; kind?: VerifiedKind;
}

interface Workflow {
  id: string; title: string; category: string;
  difficulty: 'easy'|'medium'|'hard'; minutes?: number;
  steps: WorkflowStep[];
}

interface Troubleshooting { id: string; symptom: string; cause: string; fix: string;
  related: string[]; tags: string[]; source?: Source; }

interface GlossaryTerm { term: string; definition: string; tags: string[]; source?: Source; }

interface MuscleTask { id: string; category: 'beginner'|'sampling'|'sequencer'|'fx'|'advanced';
  task: string; answer: string[]; path?: string[]; hint?: string; }

interface Section { id: string; pad?: number; title: string; short: string; icon?: string;
  body: SectionBlock[]; }                        // bloki treści (patrz niżej)
```

- Treść sekcji: deklaratywne bloki (`markdown`-like): `intro`, `sequence` (ButtonSequence), `steps` (WorkflowPlayer), `diagram` (RoutingDiagram), `pro`, `con`, `tip`, `table`, `preset`, `compare`, `list`.
- **Dodawanie treści bez zmian w komponentach** = nowe bloki/obiekty w plikach `data/`.

## 6. IA / routing (HashRouter)

- `/` Home (MiniDisplay + PadGrid 4×4 + RECENT)
- `/onboarding`
- `/section/:id` — 16 sekcji
- `/search`
- `/workflows` — lista wszystkich workflow
- `/workflow/:id` — WorkflowPlayer
- `/shortcuts` — cheat sheet z filtrem
- `/fix-it`
- `/kit` — MY KIT (ulubione)
- `/muscle` — Muscle Memory trainer
- `/settings`, `/sources`

### Mapa 16 padów (Home)

```
01 START HERE    02 SAMPLING      03 SAMPLE EDIT   04 INPUTS & ROUTING
05 RESAMPLING    06 SKIP BACK     07 PATTERN       08 PATTERN VS RESAMPLE
09 EFFECTS       10 SIDECHAIN     11 BUILD A BEAT  12 QUICK WORKFLOWS
13 SHORTCUTS     14 FIX IT        15 MUSCLE MEMORY 16 SEARCH
```
CHOP i USB AUDIO mieszkają wewnątrz sekcji SAMPLE EDIT / INPUTS. GLOSSARY dostępny z wyszukiwarki i utlity. MY KIT = zakładka docku.

## 7. Design system (tokens)

| Token | Wartość | Użycie |
|---|---|---|
| `--bg-chassis` | `#121315` | tło urządzenia |
| `--bg-panel` | `#1a1b1e` | panele |
| `--surface` | `#24262b` | face przycisków |
| `--surface-raised` | `#2d2f35` | podświetlone |
| `--hairline` | `#3a3d44` | obrysy |
| `--ink` | `#e8e4d8` | kremowy tekst |
| `--ink-dim` | `#8f8d86` | tekst wtórny |
| `--accent` | `#e8962c` | amber akcent |
| `--led` | `#58c05a` | zielone LED |
| `--danger` | `#e05a4a` | clipping/błąd |

Tekstura: subtelny noise (SVG data-uri) + brushed metal (repeating-linear-gradient). Mały radius (6–8 px), ostre cienie + 1–2 px travel. Zero glassmorphismu, zero dużych gradientów.

## 8. Komponenty hardware

- `Pad` — number + nazwa, LED w rogu, press: translateY(1–2px) + zmiana cienia, active state.
- `PadGrid` — 4×4.
- `MiniDisplay` — LCD: seg-ny text (mono, ink na ciemno-zielonym/grafie), pokazuje sekcję, krok `x / y`, BPM, breadcrumb, READY, status SEARCH. Sterowany realnym stanem.
- `ButtonSequence` — `[SHIFT] + [PAD 16]` jako fizyczne klawisze, ↓ między etapami, obsługa `path`.
- `HardwareButton` — uniwersalny klawisz sprzętowy.
- `RoutingDiagram` — CSS/SVG boxy + strzałki (BUS 1–4, DRY, INPUT, USB).
- `WorkflowPlayer` — krok po kroku, NEXT/BACK, bezpośredni skok, „zrobione", reset, postęp w localStorage, `navigator.vibrate(10)`.
- `StepSequencer` — 16 kroków wizualnych (sekcja PATTERN; bez audio).
- `ShortcutCard`, `TroubleshootingItem`, `SourceTag`, `SectionHeader`, `Knob`, `StatusLED`, `SearchOverlay`, `BottomDock`.

## 9. Interakcje i dostępność

- Haptyka: `navigator.vibrate(10)` przy padach — przełącznik w Settings.
- UI sound: **domyślnie OFF** (brak BEEP przy sprzęcie).
- `prefers-reduced-motion` + ustawienie reduced motion.
- Touch targets ≥ 44 px, focus-visible, semantic HTML, kontrast WCAG AA, keyboard nav na desktopie.

## 10. Stan (localStorage)

- `spw.settings` — reducedMotion, uiSound, haptics
- `spw.progress` — ukończone workflow, aktualny krok per workflow, zaznaczone kroki
- `spw.favorites` — shortcuts/workflows/troubleshooting ids
- `spw.ui` — lastSection, recentSearches, onboarded

## 11. Wyszukiwarka

- Klient-side, offline, budowana w runtime z `data/*` (flat index `SearchEntry[]`).
- Pola: title, tags (aliasy PL/EN/slang), buttons, menu path, sekcja.
- Ranking: exact title > tag > button/path > partial. Preview + ścieżka w wynikach.

## 12. PWA

- manifest: name „SP Workflow", short_name „SP Workflow", display standalone, theme `#121315`, bg `#121315`, ikony PNG (192/512/maskable + apple 180).
- Workbox precache wszystkich assetów builda (małe), offline po pierwszym załadowaniu.
- safe-area-insets (viewport-fit=cover, env(safe-area-inset-*)), portrait-first, brak poziomego scrolla.

## 13. Sekcje (16) + zawartość

Każda sekcja: intro (microcopy PL), bloki merytoryczne ROLAND/VERIFIED, WORKFLOW TIP-y, ButtonSequence, SourceTag. Sekcje wg briefu; SIDECHAIN z prawdziwymi parametrami 5.50 + 3 presety startowe (KICK→BASS, KICK→SAMPLE, WHOLE BEAT PUMP) oparte na zaleceniach manuala i oznaczone jako WORKFLOW TIP z wartościami startowymi.

## 14. Kolejność budowy

1. Scaffold Vite+React+TS + tokens + fonty + ikony
2. Typy danych + szkielet `data/`
3. Komponenty hardware (Pad, MiniDisplay, ButtonSequence, ...)
4. Shell: router, layout, MiniDisplay, BottomDock
5. Home (PadGrid), onboarding
6. Sekcje 16
7. Search + index
8. WorkflowPlayer + workflow (BUILD A BEAT 11 kroków, QUICK WORKFLOWS, 8-bar pattern)
9. Shortcuts cheat sheet + FIX IT + GLOSSARY
10. Muscle Memory trainer
11. MY KIT (favorites) + Settings + Sources
12. PWA/offline (vite-plugin-pwa, ikony, manifest)
13. Responsive + UX audit (390 px, safe areas, brak h-scroll, offline, refresh, install, progress)
