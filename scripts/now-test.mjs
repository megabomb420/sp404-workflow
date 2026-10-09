import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

export async function testNow(browser, base) {
  await mkdir('artifacts/companion', { recursive: true })
  for (const locale of ['pl', 'en']) for (const firmware of ['roland', 'doom']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    context.setDefaultTimeout(10000)
    await context.addInitScript(({ locale, firmware }) => {
      if (!localStorage.getItem('spw.state.v1')) {
        localStorage.setItem('spw.locale', locale)
        localStorage.setItem('spw.state.v1', JSON.stringify({ ui: { onboarded: true }, settings: { firmware } }))
      }
    }, { locale, firmware })
    const page = await context.newPage(), errors = []
    page.on('pageerror', e => errors.push(e.message))
    const workflowId = firmware === 'doom' ? 'doom-first-pattern' : 'source-to-pad'
    const go = async path => { await page.goto(base + path, { waitUntil: 'networkidle' }); await page.locator('.shell').waitFor() }
    const stored = () => page.evaluate(() => JSON.parse(localStorage.getItem('spw.state.v1')))
    const fixture = (options = {}) => ({
      settings: { firmware }, ui: { onboarded: true, recent: ['pattern'], activeKitId: options.sketch ? 'sketch' : null },
      progress: { activeWorkflowId: options.guide ? workflowId : null, workflowStep: { [workflowId]: 2 } },
      kits: options.sketch ? [{ id: 'sketch', name: options.long ? 'A long sketch title '.repeat(3) : 'Late beat', items: [], notes: { project: options.long ? 'Project '.repeat(12) : '03', bankPad: options.long ? 'A1 / B2 / C3 / '.repeat(6) : 'B4', bpm: '92', text: 'Original session notes' }, studio: { firmware, finished: !!options.finished, nextStep: options.long ? 'Finish the transition and keep the sample. '.repeat(20) : 'Finish the transition' } }] : [],
      beatBlock: options.beat ? { challengeId: 'three-sounds', phase: options.beat, firmware } : undefined,
    })
    const seed = async options => { await page.evaluate(value => localStorage.setItem('spw.state.v1', JSON.stringify(value)), fixture(options)); await go('/') }
    const layout = async () => {
      for (const width of [320, 390, 768]) {
        await page.setViewportSize({ width, height: 844 })
        assert.equal(await page.evaluate(() => { const main = document.querySelector('.shell__main'); return document.documentElement.scrollWidth > innerWidth || main.scrollWidth > main.clientWidth + 1 }), false, `NOW overflow ${width} ${locale}/${firmware}`)
        assert.equal(await page.locator('.home-map .pad:visible').count(), 16)
        assert.equal(await page.evaluate(() => document.querySelector('.dock').getBoundingClientRect().bottom <= innerHeight + 1), true)
      }
      await page.setViewportSize({ width: 390, height: 844 })
    }
    const topPads = async () => {
      assert.equal(await page.evaluate(() => {
        const main = document.querySelector('.shell__main').getBoundingClientRect()
        return [...document.querySelectorAll('.home-map .pad')].slice(0, 4).every(p => { const r = p.getBoundingClientRect(); return r.top >= main.top - 1 && r.bottom <= main.bottom + 1 })
      }), true, `First row below viewport ${locale}/${firmware}`)
    }
    const nextVisible = () => page.waitForFunction(() => { const main = document.querySelector('.shell__main').getBoundingClientRect(), next = document.querySelector('.sketch-next')?.getBoundingClientRect(); return next && next.top >= main.top - 1 && next.top <= main.top + 26 })
    try {
      await go('/')
      for (const [name, options, expected] of [
        ['empty', {}, 'READY'], ['guide', { guide: true }, 'RESUME'], ['sketch', { sketch: true }, 'RESUME'], ['both', { sketch: true, guide: true }, 'RESUME'],
        ['beat-ready', { beat: 'ready' }, 'RESUME'], ['beat-active', { beat: 'active' }, 'RESUME'], ['beat-finish', { beat: 'finish' }, 'RESUME'], ['finished', { sketch: true, finished: true }, 'READY'],
      ]) {
        await seed(options)
        assert.equal(await page.locator('.lcd__right').textContent(), expected, `${name} LCD`)
        assert.equal(await page.locator('.resume-sketch, .continue-card').count(), options.guide || (options.sketch && !options.finished) ? 1 : 0)
        assert.equal(await page.locator('.resume-sketch__workflow').count(), name === 'both' ? 1 : 0)
        assert.equal(await page.locator('.now-library').getAttribute('open'), null)
        assert.equal(await page.locator('.home__recent, .now-escape').count(), 0)
        assert.equal(await page.locator('.home-map .pad:visible').count(), 16)
        assert.equal(await page.evaluate(() => {
          const children = [...document.querySelector('.home--now').children]
          return children.findIndex(e => e.classList.contains('beat-entry')) < children.findIndex(e => e.classList.contains('home-map')) && children.findIndex(e => e.classList.contains('home-map')) < children.findIndex(e => e.classList.contains('now-library'))
        }), true)
        if (options.beat) assert.match(await page.locator('.beat-entry').textContent(), locale === 'en' ? /BACK TO BEAT BLOCK/ : /WRÓĆ DO BEAT BLOCK/)
        if (!options.finished) await topPads()
        if (name === 'both') {
          await layout(); await topPads()
          await page.screenshot({ path: `artifacts/companion/now-r8-${locale}-${firmware}.png` })
          await page.locator('.resume-sketch__workflow').click()
          await page.locator('.wf-confirm').waitFor()
          assert.ok(page.url().includes(`/workflow/${workflowId}`)); assert.equal((await stored()).progress.workflowStep[workflowId], 2)
          await go('/')
          await page.locator('.sketch-primary').click(); await nextVisible()
          assert.ok(page.url().includes('tab=next'))
          assert.equal(await page.getByRole('textbox', { name: locale === 'en' ? 'What will you do next?' : 'Co zrobisz przy następnej sesji?', exact: true }).inputValue(), 'Finish the transition')
        }
      }

      await seed({ sketch: true, guide: true, long: true }); await layout()
      for (const selector of ['.resume-sketch h2', '.resume-sketch__meta', '.resume-sketch__step']) assert.equal(await page.locator(selector).evaluate(el => el.getBoundingClientRect().height <= parseFloat(getComputedStyle(el).lineHeight) * 2 + 1), true, `Long preview ${selector}`)
      const full = (await stored()).kits[0]
      await page.locator('.sketch-primary').click(); await nextVisible()
      assert.equal(await page.getByRole('textbox', { name: locale === 'en' ? 'What will you do next?' : 'Co zrobisz przy następnej sesji?', exact: true }).inputValue(), full.studio.nextStep)
      assert.equal(await page.getByRole('textbox', { name: locale === 'en' ? 'Project' : 'Projekt', exact: true }).inputValue(), full.notes.project)
      await go('/kit?set=sketch&tab=song'); await page.locator('.song-map[open]').waitFor()
      await go('/kit?set=sketch&tab=ab'); await page.locator('.kit-ab[open]').waitFor()

      await seed({})
      await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('spw.state.v1')); s.practice = { 'doom-open': { needsReview: true }, 'open-input-settings': { needsReview: true }, 'recall:utylity-menu': { needsReview: true } }; localStorage.setItem('spw.state.v1', JSON.stringify(s)) })
      await go('/')
      const count = firmware === 'doom' ? 1 : 2
      assert.match(await page.locator('.home-map .pad').nth(14).textContent(), new RegExp(`${count} ${locale === 'en' ? 'to review' : 'do powtórki'}`))
      await page.locator('.home-map .pad').nth(14).click(); await page.waitForURL(url => url.pathname.endsWith('/muscle'))
      await page.locator('.muscle-start').waitFor()
      assert.match(await page.locator('.chipbar[role=toolbar] .chip.is-active').textContent(), locale === 'en' ? /REVIEW/ : /DO POWTÓRKI/)
      await go('/'); await page.locator('.home-map .pad').nth(13).click(); await page.waitForURL(url => url.pathname.endsWith('/fix-it'))
      await go('/'); await page.locator('.now-library summary').click()
      assert.equal(await page.locator('.goal-card:visible').count(), 3)
      assert.equal(await page.locator('.companion-tools a:visible').count(), 6)
      await layout()
      await page.locator('.now-library summary').scrollIntoViewIfNeeded()
      await page.screenshot({ path: `artifacts/companion/now-r8-tools-${locale}-${firmware}.png` })
      if (locale === 'en') assert.doesNotMatch(await page.locator('.now-library').innerText(), /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/)
      if (locale === 'pl') for (const path of ['/listen', '/screen', '/groove', '/compare', '/doom-os', '/loop-fit']) {
        await go('/'); await page.locator('.now-library summary').click()
        await page.locator(`.companion-tools a[href$="${path}"]`).click()
        await page.waitForURL(url => url.pathname.endsWith(path)); await page.locator('.page').waitFor()
      }
      await seed({ sketch: true, guide: true })
      await page.waitForFunction(() => !!navigator.serviceWorker.controller)
      await context.setOffline(true)
      await go('/'); assert.equal(await page.locator('.lcd__right').textContent(), 'RESUME')
      await page.locator('.sketch-primary').click(); await nextVisible()
      await page.getByRole('textbox', { name: locale === 'en' ? 'What will you do next?' : 'Co zrobisz przy następnej sesji?', exact: true }).fill('Next session, saved offline')
      await go('/'); assert.match(await page.locator('.resume-sketch__step').textContent(), /Next session, saved offline/)
      await page.locator('.now-library summary').click(); await page.locator('.companion-tools a[href$="/groove"]').click(); await page.locator('.groove-timeline').waitFor()
      assert.deepEqual(errors, [])
      console.log(`PASS R8 NOW ${locale}/${firmware}: continuation states, first pad row, two-line previews, next/song/ab links, reviews, tools, responsive layout and offline`)
    } finally { await context.close() }
  }
}
