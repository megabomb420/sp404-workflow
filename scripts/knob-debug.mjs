import { chromium } from 'playwright'
const BASE = 'http://localhost:4173'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
const page = await ctx.newPage()
await page.goto(BASE + '/#/', { waitUntil: 'networkidle' })
await page.evaluate(() => localStorage.setItem('spw.state.v1', JSON.stringify({settings:{reducedMotion:false,uiSound:false,haptics:true},favorites:{shortcuts:[],workflows:[],troubleshooting:[]},progress:{completedWorkflows:[],workflowStep:{},doneSteps:{}},ui:{lastSection:null,recent:[],recentSearches:[],onboarded:true}})))
await page.reload({ waitUntil: 'networkidle' })
await page.goto(BASE + '/#/section/sidechain', { waitUntil: 'networkidle' })

const read = () => page.locator('.knob').first().getAttribute('aria-valuenow')

// keyboard
await page.locator('.knob').first().focus()
await page.keyboard.press('ArrowRight')
console.log('keyboard:', await read())

// wheel
const box = await page.locator('.knob').first().boundingBox()
await page.mouse.move(box.x + box.width/2, box.y + box.height/2)
await page.mouse.wheel(0, -100)
console.log('wheel:', await read())

// dispatched pointer events
await page.dispatchEvent('.knob:first-child', 'pointerdown', { pointerId: 1, clientY: 100, clientX: 100, bubbles: true })
await page.dispatchEvent('.knob:first-child', 'pointermove', { pointerId: 1, clientY: 40, clientX: 100, bubbles: true })
await page.dispatchEvent('.knob:first-child', 'pointerup', { pointerId: 1, bubbles: true })
console.log('dispatched pointer:', await read())
await browser.close()
