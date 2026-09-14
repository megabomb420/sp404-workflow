import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
import { chromium } from 'playwright'

const BASE = (process.env.TEST_BASE_URL || 'http://localhost:4173').replace(/\/$/, '')
let checks = 0
function check(name, condition) { assert.ok(condition, name); checks++; console.log(`PASS ${name}`) }
const compiled = ts.transpileModule(fs.readFileSync('src/utils/loopFit.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const math = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
for (const input of ['0', '-1', '90abc', '1.2.3', 'Infinity', '1e3', '']) check(`reject invalid decimal ${JSON.stringify(input)}`, math.parsePositiveDecimal(input) === null)
check('comma input', math.parsePositiveDecimal(' 90,5 ') === 90.5)
check('invalid BPM never falls back to 90', math.calculateLoopFit(-10, 4) === null)
check('invalid duration never produces a valid target', math.calculateLoopFit(90, 4, 0) === null)
check('time rounding carries minutes', math.formatLoopSeconds(59.9999) === '1:00.000')

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true })
const page = await context.newPage()
const errors = []
page.on('pageerror', (error) => errors.push(error.message))
const go = async (route) => { await page.goto(`${BASE}/#${route}`); await page.locator('.page').waitFor(); await page.waitForTimeout(80) }
const state = () => page.evaluate(() => JSON.parse(localStorage.getItem('spw.state.v1')))
const saved = (predicate) => page.waitForFunction(predicate)
try {
  await page.goto(`${BASE}/#/`)
  await page.evaluate(() => localStorage.setItem('spw.state.v1', JSON.stringify({ ui: { onboarded: true }, favorites: { shortcuts: null, workflows: 123 }, progress: { doneSteps: { bad: null }, workflowStep: { bad: -3 } }, practice: { bad: null }, loopFit: null })))
  await page.reload()
  await page.locator('.goal-card').first().waitFor()
  check('malformed persisted state recovered', (await state()).favorites.workflows.length === 0)

  await go('/workflow/source-to-pad?step=0')
  await page.getByRole('button', { name: /TAK — DALEJ/ }).click()
  await saved(() => JSON.parse(localStorage.getItem('spw.state.v1')).progress.workflowStep['source-to-pad'] === 1)
  await page.reload()
  await page.locator('.wf-step__title').waitFor()
  check('deep link consumed: refresh resumes latest step', (await state()).progress.workflowStep['source-to-pad'] === 1 && !page.url().includes('step=0'))
  await page.getByRole('button', { name: /ZAPISZ W MY KIT/ }).click()
  await saved(() => JSON.parse(localStorage.getItem('spw.state.v1')).favorites.workflows.includes('source-to-pad'))
  check('workflow can be bookmarked', (await state()).favorites.workflows.includes('source-to-pad'))
  await go('/workflow/source-to-pad?step=6')
  await page.getByRole('button', { name: /TAK — ZAKOŃCZ/ }).click()
  await saved(() => JSON.parse(localStorage.getItem('spw.state.v1')).progress.doneSteps['source-to-pad'].includes('capture-playback'))
  check('jumping to final step cannot falsely complete session', !(await state()).progress.completedWorkflows.includes('source-to-pad'))
  check('returns to first unconfirmed step', (await state()).progress.workflowStep['source-to-pad'] === 1)

  await page.getByRole('button', { name: /TO SIĘ NIE STAŁO/ }).click()
  await page.locator('.rescue-guide').waitFor()
  check('failure queues the action for practice', (await state()).practice['enable-ext-source'].needsReview)
  await page.getByRole('button', { name: 'BEZ ZMIAN — DALEJ' }).click()
  await page.reload()
  await page.locator('.rescue-guide').waitFor()
  check('rescue position survives reload', page.url().includes('check=1'))
  await page.getByRole('button', { name: 'BEZ ZMIAN — DALEJ' }).click()
  await page.getByText('NIE ZNALEŹLIŚMY PRZYCZYNY', { exact: true }).waitFor()
  check('exhausted rescue does not claim a diagnosis', await page.getByText('NIE ZNALEŹLIŚMY PRZYCZYNY', { exact: true }).isVisible())
  await page.getByRole('button', { name: /Wybierz inny objaw/ }).click()
  await page.getByRole('button', { name: 'LOOP / RYTM' }).click()
  await page.getByRole('button', { name: 'Loop stopniowo odpływa od patternu' }).click()
  await page.locator('.rescue-guide .tcard').waitFor()
  check('observation branches into tempo checks', (await page.locator('.rescue-guide').textContent()).includes('BPM SYNC'))
  await page.locator('.rescue-return > a').click()
  await page.locator('.wf-step__title').waitFor()
  check('rescue returns without confirming failed step', !(await state()).progress.doneSteps['source-to-pad'].includes('capture-monitor'))

  await go('/muscle?practice=enable-ext-source&from=source-to-pad&step=1')
  await page.getByRole('button', { name: 'POKAŻ ODPOWIEDŹ' }).click()
  check('revealing answer is not success', (await state()).practice['enable-ext-source'].correct === 0)
  await page.getByRole('button', { name: 'UMIEM TO' }).click()
  await saved(() => JSON.parse(localStorage.getItem('spw.state.v1')).practice['enable-ext-source'].correct === 1)
  check('explicit self-assessment removes weak action', !(await state()).practice['enable-ext-source'].needsReview)
  await page.getByRole('button', { name: 'LOSUJ ZADANIE' }).click()
  await page.locator('.practice-categories summary').click()
  await page.getByRole('button', { name: 'SAMPLING', exact: true }).click()
  check('changing trainer category clears old task', await page.locator('.mtask').count() === 0)

  await go('/workflow/loop-to-pattern?step=1')
  await page.locator('.wf-tool-link').click()
  await page.getByLabel('tempo projektu BPM', { exact: true }).fill('0')
  await page.getByRole('alert').waitFor()
  check('invalid loop input hides numeric result', await page.locator('.loopfit-result').count() === 0)
  await page.getByLabel('tempo projektu BPM', { exact: true }).fill('90')
  await page.getByLabel('rzeczywista długość sampla w sekundach').fill('10,9')
  await page.reload()
  await page.locator('.loopfit-metrics').waitFor()
  check('Loop Fit input persists', await page.getByLabel('rzeczywista długość sampla w sekundach').inputValue() === '10,9')
  check('Loop Fit drift calculation', (await page.locator('.loopfit-metrics dd').allTextContents())[2] === '+933 ms')
  await page.getByRole('link', { name: 'WRÓĆ DO PRZERWANEJ AKCJI →', exact: true }).click()
  await page.locator('.wf-step__title').waitFor()
  check('tool returns to actual step, not step zero', (await state()).progress.workflowStep['loop-to-pattern'] === 1)

  await go('/search?q=GATE')
  await page.locator('.sresult').first().waitFor()
  check('exact search title wins ranking', (await page.locator('.sresult__title').first().textContent()).trim() === 'GATE')
  await page.getByLabel('szukaj w całym przewodniku').fill('nie słychać USB')
  await page.waitForTimeout(100)
  const accented = await page.locator('.sresult__title').allTextContents()
  await page.getByLabel('szukaj w całym przewodniku').fill('nie slychac USB')
  await page.waitForTimeout(100)
  check('Polish accents and ł normalize equally', JSON.stringify(accented) === JSON.stringify(await page.locator('.sresult__title').allTextContents()))
  await page.getByLabel('szukaj w całym przewodniku').fill('sidechain')
  await page.locator('.sresult').first().click()
  await page.goBack()
  check('back restores search query', await page.getByLabel('szukaj w całym przewodniku').inputValue() === 'sidechain')
  await go('/search?q=REMAIN')
  const shortcut = page.locator('.sresult[href*="/shortcuts?id="]').first()
  await shortcut.click()
  await page.locator('.scard').waitFor()
  check('shortcut search opens exactly one card', await page.locator('.scard').count() === 1)
  await go('/glossary?term=GATE')
  check('glossary deep link opens matching term', await page.locator('.glist__item').count() === 1)

  // Confirm every remaining step, including the previously skipped final step.
  await go('/workflow/source-to-pad')
  for (let i = 0; i < 10 && await page.locator('.wf-confirm').count(); i++) {
    await page.locator('.wf-confirm button').first().click()
    await page.waitForTimeout(60)
  }
  await page.locator('.wf-done').waitFor()
  check('complete only after all steps confirmed', (await state()).progress.doneSteps['source-to-pad'].length === 7 && (await state()).progress.completedWorkflows.includes('source-to-pad'))
  await page.getByRole('button', { name: 'OD NOWA', exact: true }).click()
  await page.locator('.wf-step').waitFor()
  check('reset clears confirmations', !(await state()).progress.doneSteps['source-to-pad'])
  for (const route of ['/workflow/constructor', '/section/__proto__', '/fix-it?ids=constructor&from=__proto__', '/loop-fit?from=constructor']) {
    await go(route)
    check(`invalid content ID handled: ${route}`, await page.locator('.page').isVisible())
  }

  fs.mkdirSync('reference/shots', { recursive: true })
  for (const width of [320, 390, 430, 768]) {
    await page.setViewportSize({ width, height: 844 })
    await go('/')
    await page.locator('.browse summary').click()
    check(`Browse pads fit at ${width}px`, await page.evaluate(() => {
      const grid = document.querySelector('.browse .padgrid')
      return document.documentElement.scrollWidth <= window.innerWidth && grid.scrollWidth <= grid.clientWidth + 1 && [...grid.querySelectorAll('.pad')].every((pad) => pad.getBoundingClientRect().width >= 44)
    }))
    await page.locator('.browse').screenshot({ path: `reference/shots/browse-${width}.png` })
    for (const route of ['/workflow/source-to-pad', '/fix-it', '/loop-fit', '/muscle', '/search?q=loop', '/kit', '/settings']) {
      await go(route)
      check(`${route} fits at ${width}px`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1))
    }
  }
  await page.setViewportSize({ width: 390, height: 844 })
  for (const [name, route] of [['workflow-vnext', '/workflow/source-to-pad'], ['rescue-vnext', '/fix-it?family=timing'], ['trainer-vnext', '/muscle?practice=enable-ext-source'], ['loopfit-vnext', '/loop-fit']]) {
    await go(route)
    await page.screenshot({ path: `reference/shots/${name}.png`, fullPage: true })
  }
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await context.setOffline(true)
  for (const route of ['/workflow/source-to-pad', '/fix-it?family=timing&choice=0', '/muscle?practice=set-sample-bpm', '/search?q=loop', '/loop-fit']) {
    await go(route)
    await page.reload()
    await page.locator('.page').waitFor()
    check(`offline cold reload ${route}`, await page.locator('.page').isVisible())
  }
  check('no browser errors across regression suite', errors.length === 0)
  const denied = await browser.newContext()
  const deniedPage = await denied.newPage()
  await deniedPage.addInitScript(() => {
    localStorage.setItem('spw.state.v1', JSON.stringify({ ui: { onboarded: true } }))
    Storage.prototype.setItem = () => { throw new DOMException('Quota exceeded', 'QuotaExceededError') }
  })
  await deniedPage.goto(`${BASE}/#/workflow/source-to-pad`)
  await deniedPage.locator('.storage-warning').waitFor()
  await deniedPage.getByRole('button', { name: /TAK — DALEJ/ }).click()
  await deniedPage.waitForFunction(() => document.querySelector('.wf-progress__label')?.textContent.includes('ACTION 2'))
  check('storage failure warns but keeps session usable', await deniedPage.locator('.storage-warning').isVisible())
  await denied.close()
  console.log(`${checks} regression checks passed`)
} finally { await browser.close() }
