import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

export async function testDoomBeta(browser, base) {
  await mkdir('artifacts/companion', { recursive: true })
  for (const locale of ['pl', 'en']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    await context.addInitScript(locale => {
      if (!localStorage.getItem('spw.state.v1')) {
        localStorage.setItem('spw.locale', locale)
        localStorage.setItem('spw.state.v1', JSON.stringify({ ui: { onboarded: true }, settings: { firmware: 'doom' } }))
      }
    }, locale)
    const page = await context.newPage(), errors = []
    page.on('pageerror', error => errors.push(error.message))
    const go = path => page.goto(base + path, { waitUntil: 'networkidle' })
    try {
      await go('/doom-os')
      assert.match(await page.locator('.doom-head__version').textContent(), /0\.7 beta/)
      await page.screenshot({ path: `artifacts/companion/doom07-home-${locale}.png` })
      for (const topic of ['bounce', 'instruments', 'locks', 'arp', 'eq', 'sidechain']) {
        await go('/doom-os')
        await page.locator(`a[href$="topic=${topic}"]`).first().click()
        assert.ok(await page.locator('.scard').count() >= 3)
        if (locale === 'en') assert.doesNotMatch(await page.locator('.scardlist').innerText(), /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/)
        if (topic === 'arp') await page.screenshot({ path: `artifacts/companion/doom07-arp-${locale}.png` })
      }
      await go('/doom-os?id=doom-settings')
      assert.match(await page.locator('.scard').textContent(), /EXIT.*SHIFT.*13/s)
      await go('/doom-os?id=doom-kit-load')
      assert.match(await page.locator('.scard').textContent(), /OVERWRITE BANK/)
      await page.locator('.scard__star').click()
      assert.ok(await page.evaluate(() => JSON.parse(localStorage.getItem('spw.state.v1')).favorites.shortcuts.includes('doom-kit-load')))
      await go('/search?q=PRINT%20ARP')
      assert.ok((await page.locator('.sresult').allTextContents()).some(text => /PRINT ARP/.test(text)))
      for (const id of ['doom-instrument', 'doom-locks', 'doom-arp', 'doom-eq', 'doom-sidechain']) {
        await go(`/screen?id=${id}`)
        assert.ok(await page.locator('.scard').count() >= 3)
        for (const width of [320, 390, 768]) {
          await page.setViewportSize({ width, height: 844 })
          assert.equal(await page.evaluate(() => { const main = document.querySelector('.shell__main'); return main.scrollWidth > main.clientWidth + 1 }), false)
        }
      }
      await page.setViewportSize({ width: 390, height: 844 })
      await go('/doom-os?view=install')
      assert.ok(await page.locator('a[href="https://klangfeldlabs.com/doom-os/beta/patcher/"]').count())
      assert.doesNotMatch(await page.locator('.sbody').innerText(), /3824/)
      await go('/doom-os?view=controls')
      assert.equal(await page.locator('.scard').count(), 111)
      await page.waitForFunction(() => !!navigator.serviceWorker.controller)
      await context.setOffline(true)
      await go('/doom-os?id=doom-eq-save')
      assert.match(await page.locator('.scard').textContent(), /EXPORT.*BACKUP/s)
      await go('/doom-os?id=doom-locks-reset')
      assert.match(await page.locator('.scard').textContent(), /4096.*64.*126/s)
      assert.ok(await page.evaluate(() => JSON.parse(localStorage.getItem('spw.state.v1')).favorites.shortcuts.includes('doom-kit-load')))
      assert.deepEqual(errors, [])
      console.log(`PASS DOOM 0.7 ${locale}: new categories, screens, search, favorites, limits and offline`)
    } finally { await context.close() }
  }
}
