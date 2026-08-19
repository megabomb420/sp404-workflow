// Checks the SIDECHAIN explorer renders + knobs respond (keyboard + pointer drag).
// Uses the verified-working dispatch sequence from knob-debug.mjs.
import { chromium } from 'playwright'
const BASE = 'http://localhost:4173'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
const page = await ctx.newPage()
await page.goto(BASE + '/#/', { waitUntil: 'networkidle' })
await page.evaluate(() => localStorage.setItem('spw.state.v1', JSON.stringify({
  settings:{reducedMotion:false,uiSound:false,haptics:true},favorites:{shortcuts:[],workflows:[],troubleshooting:[]},
  progress:{completedWorkflows:[],workflowStep:{},doneSteps:{}},ui:{lastSection:null,recent:[],recentSearches:[],onboarded:true}})))
await page.reload({ waitUntil: 'networkidle' })
await page.goto(BASE + '/#/section/sidechain', { waitUntil: 'networkidle' })

const knobs = await page.locator('.knob').count()
const vis = await page.locator('.scex__vis svg').count()

// keyboard on THRESHOLD
const kb0 = Number(await page.locator('.knob').first().getAttribute('aria-valuenow'))
await page.locator('.knob').first().focus()
await page.keyboard.press('ArrowRight')
const kb1 = Number(await page.locator('.knob').first().getAttribute('aria-valuenow'))

// pointer drag on THRESHOLD (mirroring knob-debug's working sequence)
const box = await page.locator('.knob').first().boundingBox()
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
await page.mouse.wheel(0, -100)
const d0 = Number(await page.locator('.knob').first().getAttribute('aria-valuenow'))
await page.dispatchEvent('.knob:first-child', 'pointerdown', { pointerId: 1, clientY: 100, clientX: 100, bubbles: true })
await page.dispatchEvent('.knob:first-child', 'pointermove', { pointerId: 1, clientY: 40, clientX: 100, bubbles: true })
await page.dispatchEvent('.knob:first-child', 'pointerup', { pointerId: 1, bubbles: true })
const d1 = Number(await page.locator('.knob').first().getAttribute('aria-valuenow'))

console.log('explorer knobs:', knobs, '| svg:', vis, '| kb:', kb0, '->', kb1, '| drag:', d0, '->', d1)
const ok = knobs === 4 && vis === 1 && kb1 > kb0 && d1 > d0
console.log('EXPLORER OK =', ok)
await browser.close()
process.exit(ok ? 0 : 1)
