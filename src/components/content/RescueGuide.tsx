import { useSearchParams, Link } from 'react-router-dom'
import { rescueFamilies } from '../../data/rescue'
import { troubleshootingById } from '../../data/troubleshooting'
import { TroubleshootingItem } from './TroubleshootingItem'

export function RescueGuide({ seededIds, returnRoute }: { seededIds: string[]; returnRoute: string | null }) {
  const [params, setParams] = useSearchParams()
  const family = rescueFamilies.find((f) => f.id === params.get('family'))
  const choiceIndex = Number(params.get('choice'))
  const choice = params.has('choice') && Number.isInteger(choiceIndex) ? family?.choices[choiceIndex] : undefined
  const ids = choice?.ids ?? (params.has('family') ? [] : seededIds.filter((id) => !!troubleshootingById[id]))
  const requestedCheck = Number(params.get('check') ?? 0)
  const index = Number.isInteger(requestedCheck) && requestedCheck >= 0 ? Math.min(requestedCheck, ids.length) : 0
  const item = troubleshootingById[ids[index]]
  const resolved = params.get('resolved') === 'yes'
  const select = (values: Record<string, string>) => {
    const next = new URLSearchParams(params)
    for (const key of ['family', 'choice', 'check', 'resolved']) next.delete(key)
    for (const [key, value] of Object.entries(values)) next.set(key, value)
    setParams(next)
  }
  const position = { ...(family ? { family: family.id } : {}), ...(choice ? { choice: String(choiceIndex) } : {}) }

  return <section className="rescue-guide panel-surface" aria-label="diagnoza krok po kroku">
    <h2 className="u-label">JEDEN TEST NA RAZ</h2>
    <p>Wybierz to, co obserwujesz. To możliwe przyczyny, nie pewna diagnoza. Po każdej zmianie odsłuchaj ponownie.</p>
    {resolved ? <div role="status">
      <h3 className="u-label">WEDŁUG TWOJEJ OCENY: POMOGŁO</h3>
      <p>Sprawdź jeszcze raz rezultat przerwanej akcji. Jej ukończenie potwierdzisz w workflow.</p>
      {returnRoute && <Link className="rescue-return__primary u-label" to={returnRoute}>WRÓĆ DO AKCJI →</Link>}
    </div> : item ? <>
      <p className="u-mono">SPRAWDZENIE {index + 1}/{ids.length}</p>
      <TroubleshootingItem key={item.id} item={item} defaultOpen />
      <div className="rescue-guide__choices">
        <button className="chip" onClick={() => select({ ...position, resolved: 'yes' })}>POMOGŁO</button>
        <button className="chip" onClick={() => select({ ...position, check: String(index + 1) })}>BEZ ZMIAN — DALEJ</button>
        {index > 0 && <button className="chip" onClick={() => select({ ...position, check: String(index - 1) })}>POPRZEDNI TEST</button>}
      </div>
    </> : ids.length > 0 ? <div role="status">
      <h3 className="u-label">NIE ZNALEŹLIŚMY PRZYCZYNY</h3>
      <p>Nie kasuj sampli ani nie resetuj sprzętu. Wybierz inną obserwację lub sprawdź manual. Zanotuj ekran SP, źródło sygnału i to, które testy nie pomogły.</p>
      <Link className="chip" to="/sources">MANUAL I ŹRÓDŁA</Link>
    </div> : family && !choice ? <>
      <h3>{family.question}</h3>
      <div className="rescue-guide__choices">{family.choices.map((c, i) => <button className="chip" key={c.label} onClick={() => select({ family: family.id, choice: String(i) })}>{c.label}</button>)}</div>
    </> : <div className="rescue-guide__choices">{rescueFamilies.map((f) => <button className="chip" key={f.id} onClick={() => select({ family: f.id })}>{f.title}</button>)}</div>}
    {(family || ids.length > 0 || resolved) && <button className="wf-text-action" onClick={() => select({ family: 'all' })}>← Wybierz inny objaw</button>}
  </section>
}
