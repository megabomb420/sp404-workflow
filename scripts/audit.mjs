// Functional + UX audit of the built app at 390px (headless Chromium).
import { chromium } from 'playwright'

const BASE = 'http://localhost:4173'
const results = []
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '   — ' + detail : ''}`)
}

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
const page = await ctx.newPage()

const STATE = {
  settings: { reducedMotion: false, uiSound: false, haptics: true },
  favorites: { shortcuts: [], workflows: [], troubleshooting: [] },
  progress: { completedWorkflows: [], workflowStep: {}, doneSteps: {} },
  ui: { lastSection: null, recentSearches: [], onboarded: true },
}

// Seed localStorage once (NOT via addInitScript, so reloads preserve saved state).
await page.goto(BASE + '/#/', { waitUntil: 'networkidle' })
await page.evaluate((st) => localStorage.setItem('spw.state.v1', JSON.stringify(st)), STATE)
await page.reload({ waitUntil: 'networkidle' })

// --- fonts ---
await page.goto(BASE + '/#/', { waitUntil: 'networkidle' })
const fonts = await page.evaluate(async () => {
  await document.fonts.ready
  return ['Archivo', 'Inter', 'JetBrains Mono'].filter((f) => document.fonts.check(`12px "${f}"`))
})
check('fonts loaded', fonts.length >= 2, fonts.join(', '))

// --- LCD ---
const lcd = (await page.textContent('.lcd__title'))?.trim() ?? ''
check('LCD shows SP WORKFLOW on home', lcd.includes('SP WORKFLOW'), lcd)

// --- pads ---
const pad = await page.evaluate(() => {
  const p = [...document.querySelectorAll('.pad')]
  const sizes = p.map((el) => Math.min(el.getBoundingClientRect().width, el.getBoundingClientRect().height))
  return { count: p.length, min: Math.min(...sizes) }
})
check('16 pads on home', pad.count === 16, String(pad.count))
check('all pads ≥ 44px', pad.min >= 44, `min=${Math.round(pad.min)}px`)

// --- dock ---
const dockMin = await page.evaluate(() =>
  Math.min(...[...document.querySelectorAll('.dock__tab')].map((t) => Math.min(t.getBoundingClientRect().width, t.getBoundingClientRect().height))),
)
check('dock tabs ≥ 44px', dockMin >= 44, `min=${Math.round(dockMin)}px`)

// --- pad 10 → SIDECHAIN ---
await page.click('.padgrid .pad:nth-child(10)')
await page.waitForTimeout(250)
check('pad 10 navigates to SIDECHAIN', new URL(page.url()).hash === '#/section/sidechain', page.url())

// --- search ---
await page.goto(BASE + '/#/search', { waitUntil: 'networkidle' })
await page.fill('input[type=search]', 'sidechain')
await page.waitForTimeout(300)
const n = await page.locator('.sresult').count()
check('search "sidechain" returns results', n > 0, `${n} results`)
const firstHit = (await page.textContent('.sresult:first-child .sresult__title'))?.trim()
check('search shows title + preview', !!firstHit, firstHit)

// --- workflow: NEXT advances + persists ---
await page.goto(BASE + '/#/workflow/build-a-beat', { waitUntil: 'networkidle' })
const s1 = (await page.textContent('.wf-progress__label'))?.trim()
await page.click('text=DALEJ')
await page.waitForTimeout(250)
const s2 = (await page.textContent('.wf-progress__label'))?.trim()
check('workflow NEXT advances', /STEP 2/.test(s2 ?? ''), `${s1} → ${s2}`)
await page.reload({ waitUntil: 'networkidle' })
const s3 = (await page.textContent('.wf-progress__label'))?.trim()
check('workflow progress persists after reload', /STEP 2/.test(s3 ?? ''), s3)

// --- favorite → KIT ---
await page.goto(BASE + '/#/shortcuts', { waitUntil: 'networkidle' })
await page.click('.scard:first-child .scard__star')
await page.goto(BASE + '/#/kit', { waitUntil: 'networkidle' })
const kit = await page.locator('.scard').count()
check('favorite shows in MY KIT', kit >= 1, `${kit} shortcut(s)`)

// --- service worker ---
const sw = await page.evaluate(async () => !!((await navigator.serviceWorker?.getRegistration())))
check('service worker registered', sw)

await browser.close()
const fails = results.filter((r) => !r.ok)
console.log(`\n${results.length - fails.length}/${results.length} checks passed`)
process.exit(fails.length ? 1 : 0)
