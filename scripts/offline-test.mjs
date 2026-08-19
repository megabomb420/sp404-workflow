// Verifies the built app works offline (service-worker precache) after a first online load.
import { chromium } from 'playwright'

const BASE = 'http://localhost:4173'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true })
const page = await ctx.newPage()

// 1. online load
await page.goto(BASE + '/#/', { waitUntil: 'networkidle' })
await page.evaluate(() =>
  localStorage.setItem(
    'spw.state.v1',
    JSON.stringify({
      settings: { reducedMotion: false, uiSound: false, haptics: true },
      favorites: { shortcuts: [], workflows: [], troubleshooting: [] },
      progress: { completedWorkflows: [], workflowStep: {}, doneSteps: {} },
      ui: { lastSection: null, recentSearches: [], onboarded: true },
    }),
  ),
)
await page.reload({ waitUntil: 'networkidle' })
await page.evaluate(async () => {
  if (navigator.serviceWorker) await navigator.serviceWorker.ready
})

// 2. cut the network, reload from precache
await ctx.setOffline(true)
await page.reload({ waitUntil: 'load' })
await page.waitForTimeout(700)

const lcd = (await page.textContent('.lcd__title'))?.trim() ?? ''
const pads = await page.locator('.pad').count()
const sw = await page.evaluate(async () => !!((await navigator.serviceWorker?.getRegistration())))

// 3. SPA hash navigation offline
await page.goto(BASE + '/#/section/sidechain', { waitUntil: 'load' })
await page.waitForTimeout(400)
const scTitle = (await page.textContent('.sechead__title'))?.trim() ?? ''

console.log('offline reload — LCD:', JSON.stringify(lcd), '| pads:', pads, '| sw:', sw)
console.log('offline section — title:', JSON.stringify(scTitle))
const ok = lcd.includes('SP WORKFLOW') && pads === 16 && sw && scTitle === 'SIDECHAIN'
console.log('OFFLINE OK =', ok)
await browser.close()
process.exit(ok ? 0 : 1)
