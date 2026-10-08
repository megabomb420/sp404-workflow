import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ShortcutCard } from '../components/content/ShortcutCard'
import { TroubleshootingItem } from '../components/content/TroubleshootingItem'
import { shortcutsById } from '../data/shortcuts'
import { workflowsById } from '../data/workflows'
import { troubleshootingById } from '../data/troubleshooting'
import { kitItemInfo } from '../data/kitCatalog'
import { useDisplay } from '../state/display'
import { useStore } from '../state/store'
import type { Favorites, KitItem } from '../state/model'
import cx from '../utils/cx'

function ItemCard({ item }: { item: KitItem }) {
  if (item.kind === 'shortcuts' && shortcutsById[item.id]) return <ShortcutCard shortcut={shortcutsById[item.id]} />
  if (item.kind === 'troubleshooting' && troubleshootingById[item.id]) return <TroubleshootingItem item={troubleshootingById[item.id]} />
  const workflow = item.kind === 'workflows' ? workflowsById[item.id] : null
  if (workflow) return <Link to={`/workflow/${workflow.id}`} className="wfcard panel-surface"><span className="wfcard__title u-label">{workflow.title}</span><span className="wfcard__meta u-mono">{workflow.environment === 'doom' ? 'DOOM OS' : 'ROLAND'} · {workflow.steps.length} KROKÓW</span></Link>
  return <p className="panel-surface kit-missing">Ta pozycja nie występuje w aktualnej bibliotece: {item.id}.</p>
}

export function KitPage() {
  const { setDisplay } = useDisplay()
  const { state, dispatch } = useStore()
  const [params, setParams] = useSearchParams()
  const selected = state.kits.find((kit) => kit.id === params.get('set'))
  const [name, setName] = useState('')
  const [rename, setRename] = useState('')
  const [remove, setRemove] = useState(false)
  const candidates: KitItem[] = (Object.keys(state.favorites) as (keyof Favorites)[]).flatMap((kind) => state.favorites[kind].map((id) => ({ kind, id }))).filter((item) => !!kitItemInfo(item))
  const items = selected ? selected.items : candidates

  useEffect(() => { setDisplay({ title: 'MY KIT', sub: selected?.name ?? 'ulubione i własne zestawy', right: String(items.length) }) }, [setDisplay, selected?.name, items.length])
  useEffect(() => { setRename(selected?.name ?? ''); setRemove(false) }, [selected?.id, selected?.name])

  return <div className="page">
    <h1 className="page__title u-label">MY KIT</h1>
    <p className="page__lede">Zapisuj czynności przez ★, potem ułóż własne zestawy do sesji lub grania na żywo. Zestaw może łączyć oba firmware.</p>
    <div className="chipbar" role="toolbar" aria-label="zestawy MY KIT">
      <button type="button" className={cx('chip', !selected && 'is-active')} aria-pressed={!selected} onClick={() => setParams({})}>WSZYSTKIE ULUBIONE</button>
      {state.kits.map((kit) => <button type="button" key={kit.id} className={cx('chip', selected?.id === kit.id && 'is-active')} aria-pressed={selected?.id === kit.id} onClick={() => setParams({ set: kit.id })}>{kit.name}</button>)}
    </div>
    <form className="kit-create panel-surface" onSubmit={(event) => {
      event.preventDefault(); if (!name.trim() || state.kits.length >= 30) return
      const id = crypto.randomUUID(); dispatch({ type: 'CREATE_KIT', kit: { id, name: name.trim(), items: [] } }); setName(''); setParams({ set: id })
    }}>
      <label htmlFor="kit-name" className="u-label">NOWY ZESTAW</label>
      <div className="tool-actions"><input id="kit-name" value={name} maxLength={60} onChange={(event) => setName(event.target.value)} placeholder="np. live set, sampling z telefonu" /><button className="chip" type="submit" disabled={!name.trim() || state.kits.length >= 30}>UTWÓRZ</button></div>
      {state.kits.length >= 30 && <p>Masz już 30 zestawów.</p>}
    </form>
    {selected && <section className="kit-editor panel-surface">
      <form className="tool-actions" onSubmit={(event) => { event.preventDefault(); if (rename.trim()) dispatch({ type: 'RENAME_KIT', id: selected.id, name: rename }) }}>
        <input aria-label="nazwa wybranego zestawu" value={rename} maxLength={60} onChange={(event) => setRename(event.target.value)} />
        <button className="chip" type="submit" disabled={!rename.trim() || rename.trim() === selected.name}>ZMIEŃ NAZWĘ</button>
      </form>
      <details className="kit-picker"><summary>DODAJ CZYNNOŚCI Z ULUBIONYCH</summary>
        {!candidates.length && <p>Zapisz najpierw skrót lub workflow przez ★. <Link to="/shortcuts">Przeglądaj skróty →</Link></p>}
        {candidates.map((item) => { const checked = selected.items.some((entry) => entry.kind === item.kind && entry.id === item.id); return <label className="kit-pick" key={`${item.kind}-${item.id}`}><input type="checkbox" checked={checked} onChange={() => dispatch({ type: 'TOGGLE_KIT_ITEM', kitId: selected.id, item })} /><span>{kitItemInfo(item)?.title}</span></label> })}
      </details>
      {remove ? <div className="tool-actions"><span>Usunąć zestaw „{selected.name}”? Ulubione zostaną.</span><button className="chip" type="button" onClick={() => { dispatch({ type: 'DELETE_KIT', id: selected.id }); setParams({}) }}>TAK, USUŃ ZESTAW</button><button className="chip" type="button" onClick={() => setRemove(false)}>ANULUJ</button></div> : <button className="kit-delete" type="button" onClick={() => setRemove(true)}>usuń ten zestaw</button>}
    </section>}
    <p className="page__lede">{items.length} pozycji{selected ? ` · ${selected.name}` : ' w ulubionych'}</p>
    {!items.length && <div className="kit-empty panel-surface"><span className="kit-empty__star" aria-hidden="true">☆</span><p>{selected ? 'Dodaj czynności z ulubionych powyżej. Potem ustaw ich kolejność strzałkami.' : 'Zapisz pierwszą czynność przez ★ przy skrócie, workflow lub poradzie FIX IT.'}</p><Link className="chip" to="/shortcuts">PRZEGLĄDAJ SKRÓTY</Link></div>}
    <ol className="kit-items">
      {items.map((item, index) => <li key={`${item.kind}-${item.id}`} className="kit-item">
        {selected && <div className="kit-order"><span className="u-mono">{index + 1} / {items.length}</span><button className="chip" type="button" aria-label={`przesuń w górę: ${kitItemInfo(item)?.title ?? item.id}`} disabled={!index} onClick={() => dispatch({ type: 'MOVE_KIT_ITEM', kitId: selected.id, index, direction: -1 })}>↑</button><button className="chip" type="button" aria-label={`przesuń w dół: ${kitItemInfo(item)?.title ?? item.id}`} disabled={index === items.length - 1} onClick={() => dispatch({ type: 'MOVE_KIT_ITEM', kitId: selected.id, index, direction: 1 })}>↓</button><button className="chip" type="button" aria-label={`usuń z zestawu: ${kitItemInfo(item)?.title ?? item.id}`} onClick={() => dispatch({ type: 'TOGGLE_KIT_ITEM', kitId: selected.id, item })}>USUŃ</button></div>}
        <ItemCard item={item} />
      </li>)}
    </ol>
  </div>
}
