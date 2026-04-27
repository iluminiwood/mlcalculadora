import { useState } from 'react'
import { calcML, calcShopee, shopRate, fmt, fmtP, margemInfo } from '../lib/calc'

function SimCard({ sim, onDelete }) {
  const [open, setOpen] = useState(false)
  const [e, setE] = useState({
    price: sim.price?.toFixed(2) || '',
    cost: sim.cost?.toFixed(2) || '',
    frete: sim.frete?.toFixed(2) || '0',
  })
  const [quickResult, setQuickResult] = useState(null)

  const set = (k, v) => setE(prev => ({ ...prev, [k]: v }))

  const recompute = (updated) => {
    const vals = { ...e, ...updated }
    const price = parseFloat(vals.price) || 0
    const cost = parseFloat(vals.cost) || 0
    const frete = parseFloat(vals.frete) || 0

    if (!price) { setQuickResult(null); return }

    let r
    if (sim.type === 'ml') {
      r = calcML({
        price, cost, frete,
        comm: sim.comm || 11.5,
        antec: sim.antec || 4.2,
        desc: sim.desc || 5,
        imp: sim.imp || 10,
      })
    } else {
      r = calcShopee({
        price, cost, frete,
        antec: sim.antec || 6,
        desc: sim.desc || 5,
        imp: sim.imp || 10,
        outros: sim.outros || 0,
      })
    }
    setQuickResult(r)
  }

  const handleChange = (k, v) => {
    set(k, v)
    recompute({ [k]: v })
  }

  const displayed = quickResult || { lucro: sim.lucro, margem: sim.margem, ...margemInfo(sim.margem) }
  const mi = margemInfo(displayed.margem)

  return (
    <div className="scard">
      <div className="sc-top">
        <span className={`sc-badge ${sim.type}`}>
          {sim.type === 'ml' ? 'Mercado Livre' + (sim.seg === 'premium' ? ' · Premium' : ' · Clássico') : 'Shopee'}
        </span>
        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
          <span className="sc-date">{sim.date}</span>
          <button className="btn-sm" onClick={() => setOpen(o => !o)}>{open ? 'Fechar' : 'Editar'}</button>
          <button className="btn-sm" style={{ borderColor: 'var(--bad)', color: 'var(--bad)' }} onClick={() => onDelete(sim.id)}>Excluir</button>
        </div>
      </div>

      <div className="sc-name">{sim.name}</div>

      <div className="sc-meta">
        <span>Preço <b>{fmt(displayed.lucro !== undefined ? parseFloat(e.price) || sim.price : sim.price)}</b></span>
        <span>Custo <b>{fmt(parseFloat(e.cost) || sim.cost)}</b></span>
        <span>Lucro <b>{fmt(displayed.lucro ?? sim.lucro)}</b></span>
        <span>Margem <b className={`rv m-${mi.cls}`}>{fmtP(displayed.margem ?? sim.margem)} · {mi.label}</b></span>
      </div>

      {open && (
        <div className="sc-edit">
          <div className="sc-edit-grid">
            <div className="sc-edit-field">
              <label>Preço venda (R$)</label>
              <input type="number" step="0.01" value={e.price} onChange={ev => handleChange('price', ev.target.value)} />
            </div>
            <div className="sc-edit-field">
              <label>Custo (R$)</label>
              <input type="number" step="0.01" value={e.cost} onChange={ev => handleChange('cost', ev.target.value)} />
            </div>
            <div className="sc-edit-field">
              <label>Frete (R$)</label>
              <input type="number" step="0.01" value={e.frete} onChange={ev => handleChange('frete', ev.target.value)} />
            </div>
          </div>
          {quickResult && (
            <div className="sc-edit-result">
              <span>Novo lucro: <b>{fmt(quickResult.lucro)}</b></span>
              <span>Nova margem: <b className={`rv m-${quickResult.cls}`}>{fmtP(quickResult.margem)} · {quickResult.label}</b></span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function HistoryTab({ sims, onDelete, onClear }) {
  if (!sims || sims.length === 0) {
    return (
      <div className="tc on">
        <div className="hist-top">
          <h2>Simulações salvas</h2>
        </div>
        <div className="hempty">Nenhuma simulação salva ainda.<br /><br />Calcule um produto e clique em "Salvar simulação".</div>
      </div>
    )
  }

  return (
    <div className="tc on">
      <div className="hist-top">
        <h2>Simulações salvas ({sims.length})</h2>
        <button className="btn-sm" onClick={onClear}>Limpar tudo</button>
      </div>
      {sims.map(sim => (
        <SimCard key={sim.id} sim={sim} onDelete={onDelete} />
      ))}
    </div>
  )
}
