// Integration checks for firmware context, deep links, persistence, mobile layout and offline use.
import assert from 'node:assert/strict'
import { chromium } from 'playwright'

const base = (process.env.TEST_BASE_URL || 'http://localhost:4173').replace(/\/$/, '')
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
const page = await context.newPage()
const errors = []
page.on('pageerror', (error) => errors.push(error.message))
const go = async (route) => {
  await page.goto(`${base}/#${route}`, { waitUntil: 'networkidle' })
  // Hash navigation does not start a network request; allow React to commit the route.
  await page.waitForTimeout(150)
}
try {
  await go('/')
  await page.evaluate(() => localStorage.setItem('spw.state.v1', JSON.stringify({ ui: { onboarded: true } })))
  await page.reload({ waitUntil: 'networkidle' })
  await page.locator('.doom-entry').click()
  await page.locator('h1').filter({ hasText: 'DOOM OS' }).waitFor()
  assert.equal(await page.locator('.doom-page .wfcard').count(), 3)
  assert.match(await page.locator('.doom-head__version').textContent(), /0\.6\.2 alpha.*5\.52/)
  console.log('PASS home entry, version context and 3 workflows')

  await go('/search?q=doom%20nudge')
  const hits = page.locator('.sresult')
  await hits.first().waitFor()
  assert.ok(await hits.count() > 0)
  assert.ok((await hits.allTextContents()).every((text) => text.includes('DOOM OS')))
  await hits.filter({ hasText: 'MICROTIMING' }).first().click()
  await page.locator('.scard__name').filter({ hasText: 'MICROTIMING' }).waitFor()
  assert.equal(await page.locator('.scard').count(), 1)
  assert.match(await page.locator('.scard__name').textContent(), /MICROTIMING/)
  assert.match(await page.locator('.scard .srctag__pill').textContent(), /DOOM OS \/ MANUAL/)
  assert.ok(!(await page.locator('.scard').textContent()).includes('ROLAND / VERIFIED'))
  await page.locator('.scard__star').click()
  await go('/kit')
  assert.match(await page.locator('.scard').textContent(), /MICROTIMING/)
  await page.reload({ waitUntil: 'networkidle' })
  assert.equal(await page.locator('.scard').count(), 1)
  console.log('PASS search isolates explicit DOOM queries, exact deep link, accurate source and MY KIT persistence')

  await go('/doom-os?view=controls&topic=notes')
  await page.locator('[aria-label="szukaj sterowania DOOM OS"]').fill('microtiming')
  await page.waitForFunction(() => document.querySelectorAll('.scard').length === 1)
  assert.equal(await page.locator('.scard').count(), 1)
  await page.reload({ waitUntil: 'networkidle' })
  assert.equal(await page.locator('.scard').count(), 1)
  await page.getByRole('button', { name: '★ ULUBIONE', exact: true }).click()
  assert.equal(await page.locator('.scard').count(), 1)
  await page.locator('[aria-label="szukaj sterowania DOOM OS"]').fill('nieistniejące słowo')
  await page.locator('.page__empty').waitFor()
  console.log('PASS local query, topic and favorite filters survive reload and show empty state')

  await go('/shortcuts')
  await page.getByRole('button', { name: 'DOOM OS', exact: true }).click()
  await page.waitForFunction(() => document.querySelectorAll('.scard__cat').length > 50 && [...document.querySelectorAll('.scard__cat')].every((item) => item.textContent === 'DOOM OS'))
  assert.ok(await page.locator('.scard').count() > 50)
  assert.ok((await page.locator('.scard__cat').allTextContents()).every((text) => text === 'DOOM OS'))
  console.log('PASS separate DOOM filter in existing shortcut library')

  await go('/workflow/doom-first-pattern')
  await page.locator('.doom-context').waitFor()
  await page.getByRole('button', { name: /TAK — DALEJ/ }).click()
  await page.reload({ waitUntil: 'networkidle' })
  assert.match(await page.locator('.wf-progress__label').textContent(), /ACTION 2/)
  await page.getByRole('button', { name: /SPRAWDŹ STEROWANIE/ }).click()
  await page.locator('.scard__name').filter({ hasText: 'POMOC NA SPRZĘCIE' }).waitFor()
  await go('/')
  await page.locator('.continue-card').click()
  assert.match(await page.locator('.wf-progress__label').textContent(), /ACTION 2/)
  console.log('PASS workflow confirmation, saved progress, DOOM help and home resume')

  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 })
    for (const route of ['/doom-os', '/doom-os?view=controls', '/doom-os?view=install', '/workflow/doom-first-pattern']) {
      await go(route)
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `overflow at ${width}: ${route}`)
    }
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await go('/doom-os')
  await page.screenshot({ path: 'reference/shots/doom-start.png', fullPage: true })
  await go('/doom-os?view=controls&topic=notes')
  await page.screenshot({ path: 'reference/shots/doom-controls.png', fullPage: true })
  console.log('PASS no overflow at 320, 390 and 768 px; screenshots saved')

  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await page.waitForFunction(() => !!navigator.serviceWorker.controller)
  await context.setOffline(true)
  await page.reload({ waitUntil: 'networkidle' })
  assert.ok(await page.locator('.scard').count() > 0)
  await go('/doom-os?view=install')
  await page.locator('.doom-install').waitFor()
  await go('/workflow/doom-fx-automation')
  await page.locator('.wf-step').waitFor()
  await go('/search?q=doom%20mixer')
  assert.ok(await page.locator('.sresult').count() > 0)
  await go('/kit')
  assert.match(await page.locator('.scard').textContent(), /MICROTIMING/)
  assert.deepEqual(errors, [])
  console.log('PASS guide, setup, workflow, search and favorites offline; no runtime errors')
} finally {
  await browser.close()
}
