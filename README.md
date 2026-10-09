# SP WORKFLOW R5

Offline companion for the **Roland SP-404MKII**.

Polish and English companion, firmware-aware pad navigation on NOW, local progress. Hardware labels stay as printed on the SP.

**Live:** [sp-workflow.pages.dev](https://sp-workflow.pages.dev/) · mirror: [megabomb420.github.io/sp404-workflow](https://megabomb420.github.io/sp404-workflow/)

Look for the amber **R5** badge on the LCD.

The companion includes the DOOM OS guide (78 controls and 3 workflows), a Roland/DOOM instruction filter, screen context with knob mappings, custom ordered MY KIT sets, Groove Lab with synthetic audio, three method comparisons, larger controls, optional screen wake lock, and backup/restore including language.

R5 adds guided DOOM troubleshooting that returns to the same workflow step, MY KIT session notes (project, bank/pad, BPM and free text), official Roland listening demonstrations for effects, resampling and sidechain, and practice reviews scheduled after 1/3/7/14/30 days (10 minutes after a missed answer). Reviews appear inside the app; no external notification service is used. Notes and review dates are included in backups. The full DOOM companion and new tools are available in English. The top pad-hiding toggle is removed; all 16 pads stay visible, with DOOM-specific destinations when that firmware is selected.

All companion data stays local. Import shows a preview before replacing existing data. Older `spw.state.v1` data migrates without losing favorites or progress. See [DOOM_OS.md](docs/DOOM_OS.md) for source versions and limitations. External manuals, firmware downloads and listening videos require a connection; the integrated guide, listening notes and tools work offline after caching. Official videos load only when the user opens a player; they are streamed from their publishers and are not bundled or cached. Source reviews do not imply testing on physical hardware.

Validation: `npm run typecheck`, `npm test`, `npm run build:pages:cf`, and `node scripts/companion-test.mjs` against a static preview (`COMPANION_URL`, default `http://127.0.0.1:4175`). Cloudflare deploy uses the root-domain build; GitHub Pages uses `/sp404-workflow/`.

`npm run test:tooling` separately runs the inherited app-builder template checks. They currently include unrelated failing assumptions about a generic brand identity, ignored `.grok/skills` files, the absent migrations directory, and Windows symlink/shell behavior; application and companion checks run independently.
