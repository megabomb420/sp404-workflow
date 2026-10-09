import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, stat, mkdir } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { chromium } from 'playwright'

const root = resolve('dist/client')
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png' }
let server
if (!process.env.COMPANION_URL) {
  server = createServer(async (req, res) => {
    try {
      // Match Cloudflare's pretty-URL redirect when the worker caches the shell.
      if (new URL(req.url, 'http://localhost').pathname === '/index.html') { res.writeHead(308, { Location: '/' }).end(); return }
      let file = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname))
      if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return }
      try { if (!(await stat(file)).isFile()) file = resolve(root, 'index.html') } catch { file = resolve(root, 'index.html') }
      res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' }); res.end(await readFile(file))
    } catch { res.writeHead(500).end() }
  })
  await new Promise(done => server.listen(4175, '127.0.0.1', done))
}
const base = (process.env.COMPANION_URL || 'http://127.0.0.1:4175').replace(/\/$/, '')
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true })
context.setDefaultTimeout(10000)
await context.addInitScript(() => {
  if (window !== window.top) return
  if (!localStorage.getItem('spw.state.v1')) {
    localStorage.setItem('spw.state.v1', JSON.stringify({ ui: { onboarded: true, recent: ['pattern'] }, favorites: { shortcuts: ['tr-rec'], workflows: [], troubleshooting: [] }, progress: { workflowStep: { 'phone-to-pad': 2 }, completedWorkflows: ['old-workflow'] }, settings: { haptics: false } }))
    localStorage.setItem('spw.locale', 'pl')
  }
  window._wakeRequests = 0; window._wakeReleases = 0
  Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request: async () => {
    window._wakeRequests++
    const sentinel = new EventTarget(); sentinel.released = false
    sentinel.release = async () => { sentinel.released = true; window._wakeReleases++; sentinel.dispatchEvent(new Event('release')) }
    window._wakeSentinel = sentinel
    return sentinel
  } } })
})
const page = await context.newPage(), errors = []
page.on('pageerror', error => errors.push(error.message))
const go = async path => { await page.goto(`${base}${path}`, { waitUntil: 'networkidle' }); await page.locator('.shell').waitFor() }
const stored = () => page.evaluate(() => JSON.parse(localStorage.getItem('spw.state.v1')))
const mode = async value => { await page.locator('.shell__modes .firmware-switch').getByRole('button', { name: value === 'doom' ? 'DOOM OS' : 'ROLAND', exact: true }).click(); await page.waitForFunction(v => JSON.parse(localStorage.getItem('spw.state.v1')).settings.firmware === v, value) }
const range = async (label, value) => { await page.getByRole('slider', { name: label }).evaluate((el, v) => { const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; setter.call(el, String(v)); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, value); await page.waitForTimeout(80) }
try {
  await go('/')
  assert.equal((await stored()).favorites.shortcuts[0], 'tr-rec')
  assert.equal((await stored()).progress.workflowStep['phone-to-pad'], 2)
  assert.equal((await stored()).settings.firmware, 'roland')
  assert.equal(await page.locator('.companion-tools a').count(), 5)
  assert.equal(await page.locator('.shell__modes > button').count(), 0)
  assert.equal(await page.locator('.goal-card').count(), 3)
  await mode('doom')
  assert.equal(await page.locator('.home-map .pad').count(), 16)
  assert.match(await page.locator('.home-map').textContent(), /PIANO ROLL.*MIKSER.*AUTOMATYKA/s)
  await page.locator('.home-map').getByRole('button', { name: /8.*MIKSER|MIKSER.*8/ }).click()
  assert.ok(page.url().includes('/screen?id=mixer'))
  await go('/')
  assert.ok((await page.locator('.goal-card').allTextContents()).every(t => t.includes('DOOM OS')))
  await go('/shortcuts'); assert.equal(await page.locator('.scard').count(), 78)
  await go('/workflows'); assert.equal(await page.locator('.wfcard').count(), 3)
  await go('/search?q=nudge'); assert.ok((await page.locator('.sresult').allTextContents()).some(t => t.includes('MICROTIMING')))
  await mode('roland'); assert.ok(!(await page.locator('.sresult').allTextContents()).some(t => t.includes('MICROTIMING')))
  await go('/doom-os?id=doom-nudge'); assert.equal(await page.locator('.scard').count(), 1)
  await page.locator('.scard__star').click()
  await page.locator('.scard .source-review summary').click(); assert.match(await page.locator('.scard .source-review').textContent(), /2026-10-08.*nie wykonano/)
  await go('/screen?id=grid'); assert.match(await page.locator('.firmware-notice').textContent(), /DOOM OS/)
  assert.deepEqual(await page.locator('.knob-map dd').allTextContents(), ['VELOCITY', 'LENGTH', 'NUDGE'])
  await mode('doom'); await go('/screen?id=mixer'); assert.deepEqual(await page.locator('.knob-map dd').allTextContents(), ['PAN', 'BUS · B1 / B2 / DRY', 'LEVEL'])
  await go('/screen?id=automation'); assert.equal(await page.locator('.knob-map').count(), 0)
  console.log('PASS old-state migration, firmware lists/search/deep links, screen context and honest source status')

  await go('/kit'); await page.locator('#kit-name').fill('Live set'); await page.getByRole('button', { name: 'UTWÓRZ', exact: true }).click()
  await page.locator('.kit-picker summary').click()
  for (const checkbox of await page.locator('.kit-pick input').all()) await checkbox.check()
  assert.equal((await stored()).kits[0].items.length, 2)
  const first = (await stored()).kits[0].items[0].id
  await page.locator('.kit-order').nth(1).getByRole('button', { name: /przesuń w górę/ }).click()
  assert.notEqual((await stored()).kits[0].items[0].id, first)
  await page.reload({ waitUntil: 'networkidle' }); assert.equal(await page.locator('.kit-items > li').count(), 2)
  await page.getByRole('textbox', { name: 'nazwa wybranego zestawu' }).fill('Beat session'); await page.getByRole('button', { name: 'ZMIEŃ NAZWĘ' }).click()
  assert.equal((await stored()).kits[0].name, 'Beat session')
  await page.getByRole('textbox', { name: 'Projekt', exact: true }).fill('Project 03')
  await page.getByRole('textbox', { name: 'Bank / pad', exact: true }).fill('A1 / B4')
  await page.getByRole('textbox', { name: 'BPM', exact: true }).fill('92')
  await page.getByRole('textbox', { name: 'Twoje uwagi', exact: true }).fill('Chorus then resample')
  await go('/settings')
  const downloadEvent = page.waitForEvent('download'); await page.getByRole('button', { name: 'POBIERZ KOPIĘ' }).click()
  const download = await downloadEvent, backup = JSON.parse(await readFile(await download.path(), 'utf8'))
  assert.equal(backup.locale, 'pl'); assert.equal(backup.state.kits[0].items.length, 2)
  assert.equal(backup.state.kits[0].notes.text, 'Chorus then resample')
  await page.locator('input[type=file]').setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from('{') })
  assert.match(await page.locator('.backup-panel [role=status]').textContent(), /nie jest poprawną/)
  const changed = structuredClone(backup); changed.state.kits[0].name = 'Imported'; changed.locale = 'en'
  await page.locator('input[type=file]').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(changed)) })
  assert.equal((await stored()).kits[0].name, 'Beat session'); await page.locator('.backup-preview').getByRole('button', { name: 'ANULUJ' }).click()
  assert.equal((await stored()).kits[0].name, 'Beat session')
  await page.locator('input[type=file]').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(changed)) })
  await page.getByRole('button', { name: 'PRZYWRÓĆ DANE Z KOPII' }).click()
  assert.equal((await stored()).kits[0].name, 'Imported'); assert.equal(await page.locator('html').getAttribute('lang'), 'en')
  await page.locator('.shell__top').getByRole('button', { name: 'PL', exact: true }).click()
  console.log('PASS custom sets, ordering/persistence, backup download, validation, cancel, restore and language')

  await go('/groove'); await range('velocity nuty', 55); assert.equal((await stored()).groove.notes[0].velocity, 55)
  assert.equal((await stored()).groove.notes[2].velocity, 72)
  await page.getByRole('button', { name: 'TYLKO TA NUTA', exact: true }).click(); await range('velocity nuty', 90)
  assert.ok((await stored()).groove.notes.every(n => n.velocity === 90))
  await range('przesunięcie nuty', .2); await range('długość nuty', 2)
  await page.reload({ waitUntil: 'networkidle' }); assert.equal((await stored()).groove.notes[0].length, 2)
  await page.getByRole('button', { name: 'DŹWIĘK OFF', exact: true }).click(); await page.getByRole('button', { name: 'ODTWÓRZ', exact: true }).click()
  await page.locator('.groove-playhead').waitFor({ state: 'attached' }); await page.waitForTimeout(500)
  await page.getByRole('button', { name: 'STOP', exact: true }).click(); assert.equal(await page.locator('.groove-playhead').count(), 0)
  await go('/compare?goal=fx'); assert.equal(await page.locator('.compare-method').count(), 2); assert.match(await page.locator('.compare-goal').textContent(), /Pattern/)
  await go('/settings'); await page.getByText('NIE WYGASZAJ EKRANU', { exact: true }).click()
  assert.equal(await page.getByRole('checkbox', { name: /NIE WYGASZAJ EKRANU/ }).isChecked(), true)
  await page.waitForFunction(() => window._wakeRequests > 0)
  await page.evaluate(async () => { await window._wakeSentinel.release(); document.dispatchEvent(new Event('visibilitychange')) })
  await page.waitForFunction(() => window._wakeRequests === 2)
  await page.getByText('NIE WYGASZAJ EKRANU', { exact: true }).click(); await page.waitForFunction(() => window._wakeReleases === 2)
  await page.getByText('TRYB PRZY SP', { exact: true }).click(); assert.ok(await page.locator('.shell--hardware').count())
  await go('/'); await page.locator('.home-map').waitFor({ state: 'visible' })
  await go('/workflow/doom-first-pattern'); await page.locator('.wf-confirm .hwbtn').first().click()
  await page.reload({ waitUntil: 'networkidle' }); assert.equal((await stored()).progress.workflowStep['doom-first-pattern'], 1)
  await page.locator('.wf-confirm .hwbtn').nth(1).click(); await page.locator('.doom-rescue').waitFor()
  await page.locator('.rescue-guide__choices button').first().click()
  assert.match(await page.locator('.rescue-guide').textContent(), /HOLD/)
  await page.getByRole('button', { name: 'BEZ ZMIANY · DALEJ' }).click()
  assert.match(await page.locator('.rescue-guide').textContent(), /VALUE/)
  await page.getByRole('button', { name: 'TO POMOGŁO', exact: true }).click()
  await page.getByRole('link', { name: 'WRÓĆ DO TEGO SAMEGO KROKU' }).click()
  assert.equal((await stored()).progress.workflowStep['doom-first-pattern'], 1)
  console.log('PASS groove scope/parameters/persistence/audio, comparisons, wake lock release/reacquire and workflow resume/help')

  await go('/muscle?practice=doom-open')
  await page.getByRole('button', { name: 'POKAŻ ODPOWIEDŹ' }).click()
  await page.getByRole('button', { name: 'UMIEM TO' }).click()
  const practice = (await stored()).practice['doom-open']
  assert.equal(practice.streak, 1); assert.equal(practice.dueAt - practice.lastPracticedAt, 86400000)
  assert.match(await page.locator('.practice-schedule').textContent(), /Następna powtórka/)
  await go('/muscle?review=1'); assert.match(await page.locator('.muscle-start').textContent(), /Brak|Nie masz/)
  await page.evaluate(() => { const state = JSON.parse(localStorage.getItem('spw.state.v1')); state.practice['doom-open'].dueAt = Date.now() - 1000; state.practice['doom-help'] = { correct: 0, review: 1, needsReview: true, streak: 0, lastPracticedAt: Date.now(), dueAt: Date.now() + 600000 }; localStorage.setItem('spw.state.v1', JSON.stringify(state)) })
  await go('/muscle?review=1'); await page.getByRole('button', { name: 'LOSUJ ZADANIE' }).click()
  assert.match(await page.locator('.mtask__task').textContent(), /OTWÓRZ DOOM OS/)

  await page.locator('.shell__top').getByRole('button', { name: 'EN', exact: true }).click()
  for (const path of ['/', '/doom-os', '/doom-os?view=install', '/doom-os?view=controls', '/screen?id=grid', '/screen?id=mixer', '/compare?goal=pattern', '/compare?goal=live', '/compare?goal=fx', '/groove', '/kit', '/settings', '/fix-it?firmware=doom', '/workflow/doom-first-pattern', '/workflow/doom-live-record', '/workflow/doom-fx-automation']) {
    await go(path)
    const text = await page.locator('.page').innerText()
    assert.doesNotMatch(text, /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]|\bKROKÓW\b|\bCZYNNOŚCI\b|\bSprawdzono\b|\bWybierz\b/, `English copy: ${path}`)
  }
  await go('/doom-os?view=controls&q=single-note'); assert.ok(await page.locator('.scard').count() >= 3)
  await go('/search?q=select%20track'); assert.match(await page.locator('.sresult').first().textContent(), /SELECT A TRACK/)
  await go('/listen'); assert.equal(await page.locator('.listening-demo').count(), 5)
  assert.equal(await page.locator('video, iframe').count(), 0)
  await page.route('https://articles.roland.com/**/*.mp4', route => route.abort())
  await page.locator('.listening-demo').first().getByRole('button', { name: 'OPEN DEMONSTRATION' }).click()
  assert.match(await page.locator('video').getAttribute('src'), /1-DJFX-Delay/)
  assert.equal(await page.locator('video').getAttribute('autoplay'), null)
  await page.getByRole('button', { name: 'CLOSE PLAYER' }).click(); assert.equal(await page.locator('video').count(), 0)
  await go('/listen?topic=resample')
  await page.route('https://www.youtube-nocookie.com/**', route => route.abort())
  await page.getByRole('button', { name: 'OPEN DEMONSTRATION' }).click()
  assert.match(await page.locator('iframe').getAttribute('src'), /WLJcGjkbBig\?start=1173/)
  await page.getByRole('button', { name: 'SIDECHAIN', exact: true }).click(); assert.equal(await page.locator('iframe').count(), 0)
  await page.locator('.shell__top').getByRole('button', { name: 'PL', exact: true }).click()
  console.log('PASS review scheduling, English companion tools, DOOM pad navigation, notes backup and opt-in official media')

  await mkdir('artifacts/companion', { recursive: true })
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 })
    for (const path of ['/', '/doom-os?view=controls', '/screen?id=mixer', `/kit?set=${(await stored()).kits[0].id}`, '/groove', '/compare', '/settings', '/listen', '/fix-it?firmware=doom&problem=automation']) {
      await go(path)
      const bounds = await page.evaluate(() => {
        const main = document.querySelector('.shell__main'), dock = document.querySelector('.dock').getBoundingClientRect()
        return { overflow: document.documentElement.scrollWidth > innerWidth || main.scrollWidth > main.clientWidth + 1, dock: dock.bottom <= innerHeight + 1, scrollable: getComputedStyle(main).overflowY }
      })
      assert.equal(bounds.overflow, false, `${width}px ${path} overflow`); assert.equal(bounds.dock, true, `${width}px ${path} dock`)
    }
  }
  await page.setViewportSize({ width: 390, height: 844 }); await go('/groove'); await page.screenshot({ path: 'artifacts/companion/groove.png' })
  await go('/screen?id=mixer'); await page.screenshot({ path: 'artifacts/companion/screen.png' })
  await go('/listen?topic=fx'); await page.screenshot({ path: 'artifacts/companion/listening.png' })
  await go(`/kit?set=${(await stored()).kits[0].id}`); await page.locator('.kit-notes').scrollIntoViewIfNeeded(); await page.screenshot({ path: 'artifacts/companion/notes.png' })
  await go('/'); await page.locator('.home-map').scrollIntoViewIfNeeded(); await page.screenshot({ path: 'artifacts/companion/doom-pads.png' })
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, { timeout: 30000 })
  await context.setOffline(true)
  await go('/doom-os?view=controls'); assert.equal(await page.locator('.scard').count(), 78)
  await go('/compare?goal=live'); assert.equal(await page.locator('.compare-method').count(), 2)
  await go('/listen'); assert.equal(await page.locator('.listening-demo').count(), 5); assert.equal(await page.getByRole('button', { name: 'OTWÓRZ DEMONSTRACJĘ' }).first().isDisabled(), true)
  await go('/groove'); await page.getByRole('button', { name: 'ODTWÓRZ', exact: true }).click(); await page.locator('.groove-playhead').waitFor({ state: 'attached' })
  await context.setOffline(false)
  assert.deepEqual(errors, [])
  console.log('PASS 320/390/768px layouts, dock/scroll, offline reload of guide/lazy tools, zero browser exceptions')
} finally { await browser.close(); if (server) await new Promise(done => server.close(done)) }
