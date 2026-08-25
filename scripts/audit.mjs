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
  progress: { completedWorkflows: [], workflowStep: {}, doneSteps: {}, activeWorkflowId: null },
  ui: { lastSection: null, recent: [], recentSearches: [], onboarded: true },
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
check('LCD shows NOW on goal-first home', lcd.includes('NOW'), lcd)

// --- goal-first home + Browse ---
const goals = await page.locator('.goal-card').count()
check('home exposes 3 golden paths', goals === 3, String(goals))
await page.click('.browse summary')
const pad = await page.evaluate(() => {
  const p = [...document.querySelectorAll('.pad')]
  const sizes = p.map((el) => Math.min(el.getBoundingClientRect().width, el.getBoundingClientRect().height))
  return { count: p.length, min: Math.min(...sizes) }
})
check('Browse exposes 16-pad knowledge map', pad.count === 16, String(pad.count))
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

// --- executable workflow: confirms observable result + persists ---
await page.goto(BASE + '/#/workflow/source-to-pad', { waitUntil: 'networkidle' })
const s1 = (await page.textContent('.wf-progress__label'))?.trim()
const checkpoint = await page.locator('.wf-check').count()
check('workflow shows observable hardware checkpoint', checkpoint === 1)
await page.click('text=TAK — DALEJ')
await page.waitForTimeout(250)
const s2 = (await page.textContent('.wf-progress__label'))?.trim()
check('confirmed result advances workflow', /ACTION 2/.test(s2 ?? ''), `${s1} → ${s2}`)
await page.reload({ waitUntil: 'networkidle' })
const s3 = (await page.textContent('.wf-progress__label'))?.trim()
check('workflow progress persists after reload', /ACTION 2/.test(s3 ?? ''), s3)

// --- contextual Rescue + return ---
await page.click('text=TO SIĘ NIE STAŁO')
await page.waitForTimeout(200)
check('failed checkpoint opens contextual Rescue', new URL(page.url()).hash.startsWith('#/fix-it?'), page.url())
check('Rescue carries workflow context', (await page.locator('.rescue-context').count()) === 1)
await page.click('text=NAPRAWIONE — WRÓĆ DO AKCJI')
await page.waitForTimeout(200)
check('Rescue returns to interrupted action', new URL(page.url()).hash.includes('/workflow/source-to-pad?step=1'), page.url())

// --- action-centric, intent-aware search ---
await page.goto(BASE + '/#/search', { waitUntil: 'networkidle' })
await page.fill('input[type=search]', 'resample jest suchy')
await page.waitForTimeout(200)
const doNow = await page.locator('.sgroup').first().textContent()
check('vague symptom search surfaces an action', doNow?.includes('DO NOW') ?? false, doNow?.slice(0, 90) ?? '')

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
