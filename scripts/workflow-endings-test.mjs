import assert from 'node:assert/strict'
import { readFile, mkdir } from 'node:fs/promises'
import ts from 'typescript'

// Read real content IDs so fixtures survive editorial changes and test the shipped references.
async function workflowCatalog() {
  const catalog = []
  for (const [path, name] of [['../src/data/workflows.ts', 'workflows'], ['../src/data/doom.ts', 'doomWorkflows']]) {
    const file = ts.createSourceFile(path, await readFile(new URL(path, import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true)
    const literal = node => {
      if (!node) return undefined
      if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text
      if (node.kind === ts.SyntaxKind.TrueKeyword) return true
      if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal)
      if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.filter(ts.isPropertyAssignment).map(p => [p.name.text, literal(p.initializer)]))
      if (ts.isCallExpression(node) && node.expression.getText(file) === 'step') return { id: node.arguments[0].text }
    }
    const visit = node => {
      if (ts.isVariableDeclaration(node) && node.name.getText(file) === name) catalog.push(...node.initializer.elements.filter(ts.isObjectLiteralExpression).map(literal))
      ts.forEachChild(node, visit)
    }
    visit(file)
  }
  assert.equal(catalog.length, 16)
  for (const guide of catalog) {
    assert.ok(guide.outcome && guide.ending?.check && guide.ending.tryIt, `Missing ending: ${guide.id}`)
    assert.ok(guide.ending.hintStepIds.length > 0 && guide.ending.hintStepIds.length <= 2)
    for (const id of guide.ending.hintStepIds) assert.ok(guide.steps.some(step => step.id === id), `${guide.id}: unknown hint ${id}`)
    if (guide.ending.next.kind === 'workflow') {
      const target = catalog.find(item => item.id === guide.ending.next.id)
      assert.ok(target, `${guide.id}: unknown next workflow`)
      assert.equal(target.environment, guide.environment, `${guide.id}: wrong firmware`)
    }
  }
  return catalog
}

export async function testWorkflowEndings(browser, base, { locales = ['pl', 'en'], firmwares = ['roland', 'doom'] } = {}) {
  const catalog = await workflowCatalog()
  await mkdir('artifacts/companion', { recursive: true })
  for (const locale of locales) for (const firmware of firmwares) {
    const en = locale === 'en'
    const guides = catalog.filter(guide => (guide.environment ?? 'roland') === firmware)
    const first = guides.find(guide => guide.id === (firmware === 'doom' ? 'doom-first-pattern' : 'source-to-pad'))
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    context.setDefaultTimeout(10000)
    await context.addInitScript(({ locale, firmware }) => {
      if (!localStorage.getItem('spw.state.v1')) {
        localStorage.setItem('spw.locale', locale)
        localStorage.setItem('spw.state.v1', JSON.stringify({ ui: { onboarded: true }, settings: { firmware } }))
      }
    }, { locale, firmware })
    const page = await context.newPage(), errors = []
    page.on('pageerror', error => errors.push(error.message))
    const go = async path => { await page.goto(base + path, { waitUntil: 'networkidle' }); await page.locator('.shell').waitFor() }
    const stored = () => page.evaluate(() => JSON.parse(localStorage.getItem('spw.state.v1')))
    const finished = guide => ({ activeWorkflowId: null, workflowStep: { [guide.id]: guide.steps.length }, doneSteps: { [guide.id]: guide.steps.filter(step => !step.optional).map(step => step.id) }, completedWorkflows: [guide.id] })
    const kit = (mode = firmware) => ({ id: 'sketch', name: 'Keep this sketch', items: [], notes: { project: '02', bankPad: 'A3', bpm: '91', text: 'Original notes' }, studio: { firmware: mode, finished: false, nextStep: 'Keep my next step', song: [{ id: 'main', role: 'main', pattern: 'A3', bars: 4, note: 'Keep the main section' }], variants: { a: { location: 'A3', changes: 'Original' }, b: { location: 'B3', changes: 'Variant' } }, winner: 'a', decision: 'Keep this choice' } })
    const seed = async (guide = first, changes = {}, path = `/workflow/${guide.id}`) => {
      const value = { settings: { firmware }, ui: { onboarded: true, activeKitId: 'sketch' }, kits: [kit()], progress: finished(guide), ...changes }
      await page.evaluate(value => localStorage.setItem('spw.state.v1', JSON.stringify(value)), value)
      await go(path)
    }
    const waitEnding = async () => {
      await page.locator('.wf-ending').waitFor()
      await page.waitForFunction(() => document.activeElement?.id === 'wf-ending-title')
    }
    const noOverflow = async width => {
      assert.equal(await page.evaluate(() => {
        const main = document.querySelector('.shell__main')
        return document.documentElement.scrollWidth > innerWidth || main.scrollWidth > main.clientWidth + 1
      }), false, `Ending overflow ${width}px ${locale}/${firmware}`)
      assert.equal(await page.evaluate(() => document.querySelector('.dock').getBoundingClientRect().bottom <= innerHeight + 1), true)
    }
    const actionsVisible = async id => {
      const result = await page.evaluate(() => {
        const main = document.querySelector('.shell__main').getBoundingClientRect()
        return ['.wf-ending-primary', '.wf-ending-stop'].map(selector => {
          const r = document.querySelector(selector).getBoundingClientRect()
          return { selector, top: r.top, bottom: r.bottom, visible: r.top >= main.top - 1 && r.bottom <= main.bottom + 1, mainBottom: main.bottom }
        })
      })
      assert.ok(result.every(item => item.visible), `Actions below viewport: ${id} ${locale} ${JSON.stringify(result)}`)
    }
    const panelVisible = async tab => {
      if (tab === 'next') await page.waitForFunction(() => {
        const main = document.querySelector('.shell__main').getBoundingClientRect(), next = document.querySelector('.sketch-next')?.getBoundingClientRect()
        return next && next.top >= main.top - 1 && next.top <= main.top + 26
      })
      else await page.locator(tab === 'song' ? '.song-map[open]' : '.kit-ab[open]').waitFor()
    }

    try {
      await go('/')
      assert.equal(await page.locator('.lcd__rev').textContent(), 'R9')
      for (const guide of guides) {
        await seed(guide); await waitEnding()
        assert.equal(await page.locator('.wf-ending-primary').count(), 1)
        assert.equal(await page.locator('.wf-ending-task').count(), 2)
        assert.equal(await page.locator('.wf-ending-hint').getAttribute('open'), null)
        assert.equal(await page.locator('.lcd__right').textContent(), 'DONE')
        if (firmware === 'doom') assert.equal(await page.locator('.doom-context--compact').getAttribute('open'), null)
        if (en) {
          assert.doesNotMatch(await page.locator('.wf-ending').textContent(), /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/, `English ending/hints: ${guide.id}`)
          assert.notEqual(await page.locator('.wf-ending-task p').first().textContent(), guide.ending.check)
        }
        for (const width of [320, 390, 768]) {
          await page.setViewportSize({ width, height: 844 }); await noOverflow(width)
          if (width === 390) await actionsVisible(guide.id)
        }
        await page.setViewportSize({ width: 390, height: 844 })
        assert.equal(await page.evaluate(() => [...document.querySelectorAll('.wf-ending-primary, .wf-ending-session > *, .wf-ending-repeat, .wf-ending-hint > summary')].every(el => { const r = el.getBoundingClientRect(); return r.width >= 44 && r.height >= 44 })), true)
        const before = await stored()
        await page.locator('.wf-ending-hint > summary').focus(); await page.keyboard.press('Enter')
        assert.equal(await page.locator('.wf-ending-hints article').count(), guide.ending.hintStepIds.length)
        assert.notEqual(await page.evaluate(() => document.activeElement?.id), 'wf-ending-title')
        assert.deepEqual((await stored()).progress, before.progress)
        if (guide.id === first.id) {
          await page.screenshot({ path: `artifacts/companion/ending-r9-hint-${locale}-${firmware}.png` })
          await page.locator('.langsw').getByRole('button', { name: en ? 'PL' : 'EN', exact: true }).click()
          assert.deepEqual((await stored()).progress, before.progress)
          await page.locator('.langsw').getByRole('button', { name: en ? 'EN' : 'PL', exact: true }).click()
        }
        await page.locator('.wf-ending-hint > summary').click()
        if (guide.id === first.id) await page.screenshot({ path: `artifacts/companion/ending-r9-${locale}-${firmware}.png` })
        await page.locator('.wf-ending-stop').click(); await page.locator('.home-map').waitFor()
        assert.deepEqual((await stored()).kits, before.kits)
        assert.deepEqual((await stored()).beatBlock, before.beatBlock)
        assert.deepEqual((await stored()).progress, before.progress)
        assert.equal(await page.locator('.home-map .pad').count(), 16)
        await go(`/workflow/${guide.id}`); await waitEnding()
        await page.locator('.wf-ending-primary').click()
        const next = guide.ending.next
        await page.waitForURL(url => next.kind === 'kit' ? url.pathname.endsWith('/kit') : url.pathname.endsWith(`/${next.kind === 'section' ? 'section' : 'workflow'}/${next.id}`))
        if (next.kind === 'kit') {
          await panelVisible(next.tab)
          assert.deepEqual((await stored()).kits, before.kits)
        } else if (next.kind === 'workflow') {
          await page.locator('.wf-confirm').waitFor()
          assert.equal(await page.locator('.wf-progress__dot[aria-current=step]').textContent(), '1')
        } else await page.locator('.page').waitFor()
        await seed(guide, { settings: { firmware, hardwareMode: true } }); await waitEnding()
        for (const width of [320, 390, 768]) { await page.setViewportSize({ width, height: 844 }); await noOverflow(width) }
        await page.setViewportSize({ width: 390, height: 844 })
      }

      // Traverse a real guide with confirmations instead of seeding its ending.
      await seed(first, { progress: { activeWorkflowId: null, workflowStep: {}, doneSteps: {}, completedWorkflows: [] } })
      for (let i = 0; i < first.steps.length; i++) {
        await page.locator('.wf-confirm .hwbtn').first().click()
        if (i < first.steps.length - 1) await page.waitForFunction(n => document.querySelector('.wf-progress__dot[aria-current=step]')?.textContent === String(n), i + 2)
      }
      await waitEnding()
      assert.deepEqual((await stored()).progress.doneSteps[first.id], first.steps.map(step => step.id))
      await page.reload({ waitUntil: 'networkidle' }); await waitEnding()
      const repeatBefore = await stored()
      await page.locator('.wf-ending-repeat').click(); await page.locator('.wf-confirm').waitFor()
      assert.equal((await stored()).progress.completedWorkflows.includes(first.id), false)
      assert.deepEqual((await stored()).kits, repeatBefore.kits)

      const unrelated = guides.find(guide => guide.id !== first.id)
      await seed(first, { progress: { ...finished(first), activeWorkflowId: unrelated.id, workflowStep: { [first.id]: first.steps.length, [unrelated.id]: 1 }, doneSteps: { [first.id]: first.steps.map(step => step.id), [unrelated.id]: [unrelated.steps[0].id] } }, beatBlock: { phase: 'active', challengeId: 'three-sounds', firmware, step: 1, timerEnabled: false } })
      await waitEnding()
      const stopBefore = await stored()
      await page.locator('.wf-ending-stop').click(); await page.locator('.home-map').waitFor()
      assert.deepEqual(await stored(), stopBefore, 'Stopping must preserve the active beat session and other guide')

      // A recommendation resumes the target; a completed target is replaced with planning.
      const origin = guides.find(guide => guide.ending.next.kind === 'workflow')
      const target = catalog.find(guide => guide.id === origin.ending.next.id)
      const ongoing = { ...finished(origin), activeWorkflowId: target.id, workflowStep: { [origin.id]: origin.steps.length, [target.id]: 1 }, doneSteps: { [origin.id]: origin.steps.map(step => step.id), [target.id]: [target.steps[0].id] } }
      await seed(origin, { progress: ongoing }); await waitEnding()
      assert.match(await page.locator('.wf-ending-primary').textContent(), en ? /RESUME:/ : /WZNÓW:/)
      await page.locator('.wf-ending-repeat').click(); await page.locator('.wf-confirm').waitFor()
      assert.deepEqual((await stored()).progress.doneSteps[target.id], ongoing.doneSteps[target.id])
      assert.equal((await stored()).progress.workflowStep[target.id], 1)
      await seed(origin, { progress: ongoing }); await waitEnding()
      await page.locator('.wf-ending-primary').click(); await page.locator('.wf-confirm').waitFor()
      assert.equal(await page.locator('.wf-progress__dot[aria-current=step]').textContent(), '2')
      assert.deepEqual((await stored()).progress.doneSteps[target.id], [target.steps[0].id])
      await seed(origin, { progress: { ...ongoing, completedWorkflows: [origin.id, target.id] } }); await waitEnding()
      assert.match(await page.locator('.wf-ending-primary').textContent(), en ? /PLAN YOUR NEXT MOVE/ : /ZAPLANUJ KOLEJNY RUCH/)
      assert.equal(await page.locator('.wf-ending-note').count(), 0)
      await page.locator('.wf-ending-primary').click(); await panelVisible('next')

      await seed(first, { settings: { firmware: firmware === 'doom' ? 'roland' : 'doom' } }); await waitEnding()
      assert.equal(await page.locator('.firmware-notice').count(), 1)
      await page.locator('.wf-ending-note').click(); await panelVisible('next')
      assert.equal((await stored()).kits[0].studio.firmware, firmware)

      if (firmware === 'roland') {
        const bars = catalog.find(guide => guide.id === '8-bar-pattern')
        const optionalIndex = bars.steps.findIndex(step => step.optional)
        for (const skip of [true, false]) {
          await seed(bars, { progress: { activeWorkflowId: bars.id, workflowStep: { [bars.id]: optionalIndex }, doneSteps: { [bars.id]: bars.steps.slice(0, optionalIndex).map(step => step.id) }, completedWorkflows: [] } })
          assert.match(await page.locator('.wf-confirmed').textContent(), /6\/6/)
          await page.locator(skip ? '.wf-skip' : '.wf-confirm .hwbtn').first().click(); await waitEnding()
          assert.equal((await stored()).progress.doneSteps[bars.id].includes('bounce-optional'), !skip)
          await page.reload({ waitUntil: 'networkidle' }); await waitEnding()
        }
        await seed(bars, { progress: { activeWorkflowId: bars.id, workflowStep: { [bars.id]: optionalIndex }, doneSteps: { [bars.id]: bars.steps.slice(1, optionalIndex).map(step => step.id) }, completedWorkflows: [] } })
        await page.locator('.wf-skip').click(); await page.locator('.wf-confirm').waitFor()
        assert.equal(await page.locator('.wf-progress__dot[aria-current=step]').textContent(), '1')
        assert.equal((await stored()).progress.completedWorkflows.includes(bars.id), false)
      }

      // All kit destinations retain tab/context through creation, using the guide firmware.
      for (const tab of ['next', 'song', 'ab']) {
        const other = firmware === 'doom' ? 'roland' : 'doom'
        await seed(first, { settings: { firmware: other }, ui: { onboarded: true, activeKitId: null }, kits: [] }, `/kit?tab=${tab}&fromWorkflow=${first.id}`)
        await page.locator('#kit-name').fill(`R9 ${tab}`)
        await page.locator('.kit-create button[type=submit]').click(); await panelVisible(tab)
        const created = (await stored()).kits[0]
        assert.equal(created.studio.firmware, firmware)
        assert.ok(page.url().includes(`tab=${tab}`)); assert.ok(page.url().includes(`fromWorkflow=${first.id}`))
        assert.equal(created.studio.nextStep, '')
        await page.screenshot({ path: `artifacts/companion/ending-r9-kit-${tab}-${locale}-${firmware}.png` })
      }
      const chosen = kit()
      for (const mode of ['finished', 'other', 'old', 'missing']) {
        const value = mode === 'finished' ? { ...chosen, studio: { ...chosen.studio, finished: true } } : mode === 'other' ? kit(firmware === 'doom' ? 'roland' : 'doom') : mode === 'old' ? { id: chosen.id, name: chosen.name, items: [], notes: chosen.notes } : chosen
        await seed(first, { ui: { onboarded: true, activeKitId: mode === 'missing' ? null : value.id }, kits: [value] }); await waitEnding()
        const before = (await stored()).kits
        await page.locator('.wf-ending-note').click(); await page.waitForURL(url => url.pathname.endsWith('/kit'))
        assert.equal(await page.locator('.kit-studio').count(), 0)
        await page.locator('.chipbar').getByRole('button', { name: chosen.name, exact: true }).click(); await panelVisible('next')
        assert.deepEqual((await stored()).kits, before)
      }
      await seed(first, { kits: Array.from({ length: 30 }, (_, i) => ({ ...kit(), id: `set-${i}`, name: `Set ${i}` })), ui: { onboarded: true, activeKitId: null } }, `/kit?tab=ab&fromWorkflow=${first.id}`)
      await page.locator('#kit-name').fill('Extra')
      assert.equal(await page.locator('.kit-create button[type=submit]').isDisabled(), true)
      await page.locator('.chipbar').getByRole('button', { name: 'Set 0', exact: true }).click(); await panelVisible('ab')
      await seed(first, { kits: [], ui: { onboarded: true } }, '/kit?tab=bad&fromWorkflow=__proto__')
      await page.locator('#kit-name').fill('Without context'); await page.locator('.kit-create button[type=submit]').click()
      await page.locator('.kit-studio').waitFor()
      assert.equal((await stored()).kits[0].studio, undefined)
      assert.equal(await page.locator('.song-map[open], .kit-ab[open]').count(), 0)

      const unavailable = await browser.newContext({ viewport: { width: 390, height: 844 } })
      try {
        await unavailable.addInitScript(({ locale, value }) => {
          localStorage.setItem('spw.locale', locale)
          localStorage.setItem('spw.state.v1', JSON.stringify(value))
          const native = Storage.prototype.setItem
          Storage.prototype.setItem = function (key, value) {
            if (key === 'spw.state.v1') throw new DOMException('Storage unavailable', 'QuotaExceededError')
            return native.call(this, key, value)
          }
        }, { locale, value: { settings: { firmware }, ui: { onboarded: true, activeKitId: 'sketch' }, kits: [kit()], progress: finished(first) } })
        const temporary = await unavailable.newPage()
        temporary.on('pageerror', error => errors.push(error.message))
        await temporary.goto(`${base}/workflow/${first.id}`, { waitUntil: 'networkidle' })
        assert.match(await temporary.locator('.wf-done__meta').textContent(), en ? /SESSION COMPLETE/ : /SESJA ZAKOŃCZONA/)
        await temporary.locator('.wf-ending-note').click()
        await temporary.locator('.sketch-next textarea').fill('Session-only idea')
        assert.equal(await temporary.locator('.sketch-next textarea').inputValue(), 'Session-only idea')
      } finally { await unavailable.close() }

      // Real offline completion, note/pin/resume and navigation to a new guide or section.
      await seed(first, { progress: { activeWorkflowId: first.id, workflowStep: { [first.id]: first.steps.length - 1 }, doneSteps: { [first.id]: first.steps.slice(0, -1).map(step => step.id) }, completedWorkflows: [] } })
      await page.waitForFunction(() => !!navigator.serviceWorker.controller, { timeout: 30000 })
      await context.setOffline(true)
      await page.reload({ waitUntil: 'networkidle' })
      await page.locator('.wf-confirm .hwbtn').first().click(); await waitEnding()
      await page.locator('.wf-ending-note').click(); await panelVisible('next')
      const note = 'Keep this offline idea '.repeat(40)
      await page.locator('.sketch-next textarea').fill(note)
      await page.locator('.sketch-next').getByRole('button', { name: en ? 'PIN TO NOW' : 'POKAŻ NA NOW', exact: true }).click()
      await go('/'); await page.reload({ waitUntil: 'networkidle' })
      assert.equal(await page.locator('.lcd__right').textContent(), 'RESUME')
      await page.locator('.sketch-primary').click(); await panelVisible('next')
      assert.equal(await page.locator('.sketch-next textarea').inputValue(), note)
      await go(`/workflow/${first.id}`); await waitEnding()
      await page.locator('.wf-ending-hint > summary').click()
      assert.ok(await page.locator('.wf-ending-hints article').count())
      await page.locator('.wf-ending-primary').click()
      await page.waitForURL(url => first.ending.next.kind === 'workflow' ? url.pathname.endsWith(`/workflow/${first.ending.next.id}`) : url.pathname.endsWith(`/section/${first.ending.next.id}`))
      await context.setOffline(false)
      assert.deepEqual(errors, [])
      console.log(`PASS R9 ${locale}/${firmware}: all endings, mobile layouts, hints, resume, kit context and offline completion`)
    } catch (error) {
      await page.screenshot({ path: `artifacts/companion/ending-r9-failure-${locale}-${firmware}.png` })
      throw error
    } finally { await context.close() }
  }
}
