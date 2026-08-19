// Renders key screens at phone size, reports horizontal overflow, saves PNGs to reference/shots/.
import { chromium } from 'playwright'
import fs from 'fs'

const BASE = 'http://localhost:4173'
const SHOTS = 'reference/shots'
fs.mkdirSync(SHOTS, { recursive: true })

const STATE = JSON.stringify({
  settings: { reducedMotion: false, uiSound: false, haptics: true },
  favorites: { shortcuts: [], workflows: [], troubleshooting: [] },
  progress: { completedWorkflows: [], workflowStep: {}, doneSteps: {} },
  ui: { lastSection: null, recentSearches: [], onboarded: true },
})

const browser = await chromium.launch()

async function makePage(onboarded) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  const page = await ctx.newPage()
  await page.addInitScript(
    (st) => localStorage.setItem('spw.state.v1', st),
    onboarded ? STATE : JSON.stringify({ settings: {}, favorites: {}, progress: {}, ui: { onboarded: false } }),
  )
  return { ctx, page }
}

const results = []
async function shot({ page }, name, route, action) {
  await page.goto(BASE + '/#' + route, { waitUntil: 'networkidle' })
  if (action) await action(page)
  await page.waitForTimeout(350)
  const m = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    innerW: window.innerWidth,
    bodyW: document.body.scrollWidth,
    h: document.documentElement.scrollHeight,
  }))
  const path = `${SHOTS}/${name}.png`
  await page.screenshot({ path, fullPage: false })
  const ok = m.scrollW <= m.innerW + 1
  results.push({ name, route, ok, ...m })
  console.log(`${ok ? 'OK ' : 'OVERFLOW'} ${name}  sw=${m.scrollW} iw=${m.innerW} bh=${m.h}`)
}

// onboarding (not onboarded)
const ob = await makePage(false)
await shot(ob, '00-onboarding', '/onboarding')
await ob.ctx.close()

// main app
const main = await makePage(true)
await shot(main, '01-home', '/')
await shot(main, '02-sidechain', '/section/sidechain')
await shot(main, '03-pattern', '/section/pattern')
await shot(main, '04-skipback', '/section/skipback')
await shot(main, '05-workflow', '/workflow/build-a-beat')
await shot(main, '06-search', '/search', async (p) => {
  await p.fill('input[type=search]', 'sidechain')
  await p.waitForTimeout(250)
})
await shot(main, '07-shortcuts', '/shortcuts')
await shot(main, '08-muscle', '/muscle')
await shot(main, '09-kit', '/kit')
await shot(main, '10-glossary', '/glossary')
await main.ctx.close()

await browser.close()

const bad = results.filter((r) => !r.ok)
console.log(`\n=== ${results.length} screens, ${bad.length} overflow ===`)
if (bad.length) {
  bad.forEach((r) => console.log(`  FAIL ${r.name} ${r.route} sw=${r.scrollW} iw=${r.innerW}`))
}
process.exit(bad.length ? 1 : 0)
