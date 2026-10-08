# SP WORKFLOW R4

Offline companion for the **Roland SP-404MKII**.

Polish-first companion, English overlay for the original Roland guide, pad map on NOW, local progress. Roland terms stay in English. The new DOOM OS companion and tool explanations are in Polish.

**Live:** [sp-workflow.pages.dev](https://sp-workflow.pages.dev/) · mirror: [megabomb420.github.io/sp404-workflow](https://megabomb420.github.io/sp404-workflow/)

Look for the amber **R4** badge on the LCD.

R4 adds the official DOOM OS guide (78 controls and 3 workflows), a persistent Roland/DOOM instruction filter, screen context with knob mappings, custom ordered MY KIT sets, Groove Lab with optional synthetic audio, three method comparisons, a larger-control mode, optional screen wake lock, backup/restore including language, and honest source review / hardware-test status.

All companion data stays local. Import shows a preview before replacing existing data. Older `spw.state.v1` data migrates without losing favorites or progress. See [DOOM_OS.md](docs/DOOM_OS.md) for source versions and limitations. External manuals and firmware downloads require a connection; the integrated guide and tools work offline after caching.

Validation: `npm run typecheck`, `npm test`, `npm run build:pages:cf`, and `node scripts/companion-test.mjs` against a static preview (`COMPANION_URL`, default `http://127.0.0.1:4175`). Cloudflare deploy uses the root-domain build; GitHub Pages uses `/sp404-workflow/`.

`npm run test:tooling` separately runs the inherited app-builder template checks. They currently include unrelated failing assumptions about a generic brand identity, ignored `.grok/skills` files, the absent migrations directory, and Windows symlink/shell behavior; application and companion checks run independently.
