import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

export async function testBeatBlock(browser, base) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  context.setDefaultTimeout(10000)
  await context.addInitScript(() => {
    if (window !== window.top) return
    if (!localStorage.getItem('spw.state.v1')) { localStorage.setItem('spw.state.v1', JSON.stringify({ ui: { onboarded: true } })); localStorage.setItem('spw.locale', 'pl') }
    Math.random = () => 0
  })
  const page = await context.newPage(), errors = []
  page.on('pageerror', error => errors.push(error.message))
  const go = async path => { await page.goto(base + path, { waitUntil: 'networkidle' }); await page.locator('.shell').waitFor() }
  const stored = () => page.evaluate(() => JSON.parse(localStorage.getItem('spw.state.v1')))
  let fixedNow = Date.now()
  const advance = async ms => { fixedNow += ms; await page.clock.setFixedTime(new Date(fixedNow)); await page.waitForTimeout(1100) }
  const layout = async () => {
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 844 })
      assert.equal(await page.evaluate(() => { const main = document.querySelector('.shell__main'); return document.documentElement.scrollWidth > innerWidth || main.scrollWidth > main.clientWidth + 1 }), false, `BEAT BLOCK overflow ${width}`)
    }
    await page.setViewportSize({ width: 390, height: 844 })
  }
  try {
    await go('/'); await page.locator('.beat-entry').click(); await page.locator('.beat-block-page').waitFor()
    assert.equal(await page.locator('.beat-reasons__grid button').count(), 4)
    await page.clock.setFixedTime(new Date(fixedNow))
    await page.getByRole('button', { name: 'Nie wiem, od czego zacząć' }).click()
    assert.equal((await stored()).beatBlock.challengeId, 'three-sounds')
    assert.equal(await page.getByRole('checkbox').isChecked(), false)
    await layout()
    await page.getByRole('checkbox').check(); await page.getByRole('button', { name: 'ZACZYNAM', exact: true }).click()
    await advance(13000); assert.equal(await page.getByRole('timer').textContent(), '7:47')
    await page.getByRole('button', { name: 'ZATRZYMAJ TIMER' }).click()
    await advance(90000); assert.equal(await page.getByRole('timer').textContent(), '7:47')
    await go('/'); assert.match(await page.locator('.beat-entry').textContent(), /WRÓĆ DO BEAT BLOCK/); await page.locator('.beat-entry').click(); await page.locator('.beat-block-page').waitFor()
    assert.equal(await page.getByRole('timer').textContent(), '7:47')
    await page.getByRole('button', { name: 'WZNÓW TIMER' }).click(); await advance(3000)
    await page.locator('.beat-steps a').first().click(); assert.ok(page.url().includes('/section/pattern'))
    await advance(5000); await go('/beat-block'); assert.equal(await page.getByRole('timer').textContent(), '7:39')
    await page.locator('.shell__modes').getByRole('button', { name: 'DOOM OS', exact: true }).click()
    assert.match(await page.locator('.firmware-notice').textContent(), /Roland/)
    assert.equal((await stored()).beatBlock.firmware, 'roland')
    await page.getByRole('button', { name: 'MAM SZKIC', exact: true }).click()
    await page.getByRole('textbox', { name: 'Pomysł do rozwinięcia' }).fill('Keep the late kick')
    await page.getByRole('textbox', { name: 'Nazwa zestawu' }).fill('BB session')
    await page.getByRole('textbox', { name: 'Projekt', exact: true }).fill('02')
    await page.getByRole('textbox', { name: 'Bank / pad', exact: true }).fill('B3')
    await page.getByRole('textbox', { name: 'BPM', exact: true }).fill('87')
    await page.reload({ waitUntil: 'networkidle' }); assert.equal(await page.getByRole('textbox', { name: 'Pomysł do rozwinięcia' }).inputValue(), 'Keep the late kick')
    await layout(); await page.getByRole('button', { name: 'ZAPISZ W MY KIT' }).click()
    assert.equal((await stored()).kits.length, 1); assert.equal((await stored()).kits[0].items[0].id, 'make-drums')
    await page.getByRole('link', { name: 'OTWÓRZ MY KIT →' }).click(); assert.equal(await page.getByRole('textbox', { name: 'Bank / pad', exact: true }).inputValue(), 'B3')
    assert.match(await page.getByRole('textbox', { name: 'Twoje uwagi' }).inputValue(), /Keep the late kick/)

    await go('/'); await page.locator('.beat-entry').click(); await page.locator('.beat-block-page').waitFor(); await page.getByRole('button', { name: 'Beat jest nudny' }).click()
    await page.getByRole('button', { name: 'INNE WYZWANIE' }).click()
    assert.equal((await stored()).beatBlock.challengeId, 'one-note')
    await page.getByRole('button', { name: 'ZACZYNAM', exact: true }).click()
    await page.getByRole('button', { name: 'NASTĘPNY KROK →', exact: true }).click()
    assert.match(await page.locator('.beat-steps li:visible').textContent(), /Trzymaj pad/)
    await page.locator('.beat-steps li:visible a').click(); assert.ok(page.url().includes('id=doom-select-note')); await go('/beat-block')
    assert.equal((await stored()).beatBlock.step, 1)
    await advance(361000); assert.equal(await page.getByRole('timer').textContent(), '0:00')
    assert.equal((await stored()).beatBlock.phase, 'active'); assert.equal((await stored()).kits.length, 1)
    await page.getByRole('button', { name: 'MAM SZKIC', exact: true }).click()
    await page.getByRole('textbox', { name: 'Pomysł do rozwinięcia' }).fill('Keep the quiet snare')
    await page.getByRole('combobox', { name: 'Zapisz do' }).selectOption((await stored()).kits[0].id)
    await page.getByRole('button', { name: 'ZAPISZ W MY KIT' }).click()
    const kit = (await stored()).kits[0]
    assert.equal((await stored()).kits.length, 1); assert.equal(kit.notes.project, '02'); assert.match(kit.notes.text, /Keep the late kick.*Keep the quiet snare/s)
    assert.equal(kit.items.length, 2)
    await page.locator('.shell__top').getByRole('button', { name: 'EN', exact: true }).click()
    await page.getByRole('button', { name: 'NEW SESSION' }).click()
    const seen = new Set()
    for (const label of ['I don’t know where to start', 'I have a loop. What next?', 'My beat feels flat', 'I keep tweaking details']) {
      await page.getByRole('button', { name: label, exact: true }).click()
      for (let i = 0; i < 3; i++) {
        const id = (await stored()).beatBlock.challengeId
        assert.ok(!seen.has(id)); seen.add(id)
        assert.doesNotMatch(await page.locator('.beat-block-page').innerText(), /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/)
        if (i < 2) await page.getByRole('button', { name: 'ANOTHER PROMPT' }).click()
      }
    }
    assert.equal(seen.size, 12)
    await mkdir('artifacts/companion', { recursive: true })
    await layout(); await page.screenshot({ path: 'artifacts/companion/beat-ready.png' })
    await page.getByRole('button', { name: 'LET’S START', exact: true }).click()
    await layout(); await page.screenshot({ path: 'artifacts/companion/beat-active.png' })
    await page.getByRole('button', { name: 'I HAVE A SKETCH', exact: true }).click()
    await layout(); await page.screenshot({ path: 'artifacts/companion/beat-finish.png' })
    await page.waitForFunction(() => !!navigator.serviceWorker.controller)
    await context.setOffline(true); await go('/beat-block')
    await page.getByRole('textbox', { name: 'Your next idea' }).fill('Offline sketch')
    await page.getByRole('button', { name: 'BACK TO PLAYING' }).click()
    await page.getByRole('button', { name: 'ANOTHER PROMPT' }).click()
    await page.locator('.beat-switch-confirm').waitFor()
    await page.getByRole('button', { name: 'KEEP THIS SESSION' }).click()
    await page.getByRole('button', { name: 'I HAVE A SKETCH' }).click()
    assert.equal(await page.getByRole('textbox', { name: 'Your next idea' }).inputValue(), 'Offline sketch')
    await page.getByRole('button', { name: 'SAVE TO MY KIT' }).click()
    assert.equal((await stored()).kits.length, 2); assert.match((await stored()).kits[1].notes.text, /Offline sketch/)
    assert.deepEqual(errors, [])
    console.log('PASS BEAT BLOCK: 12 bilingual prompts, timer/reload/pause/help, firmware context, sketch/append/draft, 320/390/768px and offline save')
  } finally { await context.close() }
}
