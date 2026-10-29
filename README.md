# SP WORKFLOW 0.9.1

Offline companion for the **Roland SP-404MKII**.

The app combines quick access to SP shortcuts with practical learning beside the sampler. Users can look up a shortcut or follow a guide and then continue playing independently. Future changes should preserve both roles, easy access to shortcuts and a simple, carefully finished hardware-inspired interface. Version **0.9** includes the completed R9 work described below and the user's positive feedback after release.

Polish and English companion, firmware-aware pad navigation on NOW, local progress. Hardware labels stay as printed on the SP.

**Live:** [sp-workflow.pages.dev](https://sp-workflow.pages.dev/) · mirror: [megabomb420.github.io/sp404-workflow](https://megabomb420.github.io/sp404-workflow/)

Look for the amber **0.9.1** badge on the LCD.

The 0.9 visual polish adds an inset pad tray, clearer pad labels and numbering, softer LCD texture, a segmented firmware selector, a visible active navigation marker, and consistent panel and button depth. Shortcut descriptions are easier to read, and onboarding previews the same pad materials. The expanded 16-pad layout and existing workflows remain in place; all fonts and visual details work offline.

The companion includes the DOOM OS guide (114 controls and 3 workflows), a Roland/DOOM instruction filter, screen context with knob mappings, custom ordered MY KIT sets, Groove Lab with synthetic audio, three method comparisons, larger controls, optional screen wake lock, and backup/restore including language.

R5 adds guided DOOM troubleshooting that returns to the same workflow step, MY KIT session notes (project, bank/pad, BPM and free text), official Roland listening demonstrations for effects, resampling and sidechain, and practice reviews scheduled after 1/3/7/14/30 days (10 minutes after a missed answer). Reviews appear inside the app; no external notification service is used. Notes and review dates are included in backups. The full DOOM companion and new tools are available in English. The top pad-hiding toggle is removed; all 16 pads stay visible, with DOOM-specific destinations when that firmware is selected.

R6 adds **BEAT BLOCK**, entered through “UTKNĄŁEM / I’M STUCK” on NOW. Four stuck points lead to 12 creative prompts with a goal, a constraint and three practical steps. Guides follow the session’s Roland/DOOM choice. The optional timer survives leaving the page and reloading, supports pause/resume, and lets the player continue after time runs out. A sketch saves its next idea, project, bank/pad and BPM to a new or existing MY KIT set, preserving earlier notes. This saves notes; the audio remains on the sampler. Sessions, drafts and recent prompts stay local, are included in backups, and work offline in Polish and English.

All companion data stays local. Import shows a preview before replacing existing data. Older `spw.state.v1` data migrates without losing favorites or progress. See [DOOM_OS.md](docs/DOOM_OS.md) for source versions and limitations. External manuals, firmware downloads and listening videos require a connection; the integrated guide, listening notes and tools work offline after caching. Official videos load only when the user opens a player; they are streamed from their publishers and are not bundled or cached. Source reviews do not imply testing on physical hardware.

Validation: `npm run typecheck`, `npm test`, `npm run build:pages:cf`, and `node scripts/companion-test.mjs` against a static preview (`COMPANION_URL`, default `http://127.0.0.1:4175`). Cloudflare deploy uses the root-domain build; GitHub Pages uses `/sp404-workflow/`.

`npm run test:tooling` separately runs the inherited app-builder template checks. They currently include unrelated failing assumptions about a generic brand identity, ignored `.grok/skills` files, the absent migrations directory, and Windows symlink/shell behavior; application and companion checks run independently.
# R7 · szkic → utwór

MY KIT przechowuje następny krok, SONG MAP (do 8 fragmentów: kolejność, pattern/wariacja, takty, uwagi) i warianty A/B (lokalizacja na SP, zmiana, wybór i uzasadnienie). Zapis BEAT BLOCK przypina szkic do NOW z projektem, bankiem/padem i BPM. Gotowy szkic można odpiąć przez „OZNACZ GOTOWY” i ponownie otworzyć. Dane działają lokalnie, offline i są zawarte w kopiach zapasowych; starsze zestawy zachowują notatki. SONG MAP i A/B służą do planowania i odsłuchu na SP.

R7 poprawia czytelność padów i opisów, usuwa powtórzony nagłówek onboardingu i dodaje podgląd padów. BEAT BLOCK pokazuje jeden bieżący krok, zapamiętuje jego pozycję i ma bardziej zwarty timer oraz łatwiej dostępne zakończenie szkicu. Wszystkie nowe ekrany mają wersję PL/EN.

## R8 · simpler NOW

NOW shows a single continuation card: the active sketch takes priority, with a smaller link to an unfinished guide when both exist. Sketch titles, project metadata and next-step previews use at most two lines; full text remains in MY KIT. “Resume sketch” opens the next-step panel through `tab=next`; existing `tab=song` and `tab=ab` links remain supported. The LCD shows RESUME for an unfinished sketch, guide or BEAT BLOCK session.

The order is continuation, BEAT BLOCK entry, the always-expanded 16-pad map, then a closed-by-default “Paths and tools” section with suggested workflows and six companion tools. FIX IT and training remain on pads 14 and 15, with due review counts and direct review entry on pad 15. The duplicated FIX IT/training tiles and recent-section list are removed from NOW. Stored data and backup format remain compatible; PL/EN, Roland/DOOM and offline paths are covered by the browser checks.

Next iterations should address one concrete issue observed across three sessions beside the SP. Add another feature when an existing tool cannot handle a recurring need.

## R9 · keep playing after the guide

All 16 guides end with a concrete outcome, a listening check, an optional independent exercise, collapsed hints and one relevant next action. Ongoing next guides resume their saved step; completed ones lead to next-step planning. “Done for today” returns to NOW, and notes use the existing MY KIT next-step, SONG MAP and A/B panels. Creating or selecting a set keeps the requested panel; new sets use the guide’s firmware. Existing notes, arrangements and comparisons are preserved.

The final print in 8-BAR PATTERN can be skipped without counting it as performed; all required steps still need confirmation. Progress and backup formats remain compatible. DOOM version information collapses on completion to keep the next action visible on a phone. The simplified R8 NOW stays in place. Roland’s DUPLICATE and single-pattern/chain BOUNCE instructions were checked against the official 5.50 manual on 10 October 2026; the focused corrections are translated into English. See [R9 source review](docs/R9_SOURCE_REVIEW.md). Browser checks cover all endings in PL/EN, 320/390/768px layouts, larger controls, state preservation and offline completion. These are application checks; no physical-sampler test is claimed.

## 0.9.1 · DOOM OS 0.7 beta

Updated from the user-supplied beta Quickstart (reviewed 27 October 2026): instruments and kits, parameter locks, arpeggiator and printing, bounce in place, pad EQ, waveform and sidechain. All 33 new controls are available in Polish and English, search, MY KIT and offline. Existing IDs and saved progress remain compatible. The guide also corrects undo limits, recording HOLD behavior, queued pattern changes and the stock-screen-only settings shortcut. The beta patcher link is updated; its build and Roland firmware requirement remain unverified. See [source review](docs/DOOM_OS.md).

## DOOM OS 0.7.1

The companion reflects the public 0.7.1 release (E7F5, Roland 5.52), including destination selection for bounce, instrument preview, mixer pad controls, 16 VEL recording and EQ for 16 pads. The Quickstart itself is labelled 0.7; its current contents and release notes were reviewed on 29 October 2026.
