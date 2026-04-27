import { useState, useCallback } from 'react'
import { calcShopee, shopRate, fmt, fmtP } from '../lib/calc'
import { ResultRows } from '../components/ResultRows'

export default function ShopeeTab({ onSave }) {
  const [f, setF] = useState({
    name: '', price1: '', price2: '', cost: '',
    antec: '6', desc: '5', imp: '10', outros: '0',
    frete: '', freteOn: false
  })
  const [result, setResult] = useState(null)
  const [taxaInfo, setTaxaInfo] = useState('')

  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }))

  const compute = useCallback(() => {
    const p = parseFloat(f.price2) || 0
    const cost = parseFloat(f.cost) || 0
    const antec = parseFloat(f.antec) || 0
    const desc = parseFloat(f.desc) || 0
    const imp = parseFloat(f.imp) || 0
    const outros = parseFloat(f.outros) || 0
    const frete = f.freteOn ? (parseFloat(f.frete) || 0) : 0

    if (p) {
      const taxa = shopRate(p)
      const taxaPct = (taxa / p) * 100
      setTaxaInfo(`Taxa: ${fmt(taxa)} (${fmtP(taxaPct)} do preço de venda)`)
    } else {
      setTaxaInfo('')
    }

    if (!p) { setResult(null); return }
    const r = calcShopee({ price: p, cost, antec, desc, imp, outros, frete })
    setResult(r)
    return r
  }, [f])

  const rows = result ? [
    { label: `Taxa Shopee (${fmtP(result.taxaPct)})`, value: '-' + fmt(result.taxa) },
    { label: `Antecipação (${fmtP(f.antec)})`, value: '-' + fmt(result.av) },
    { label: `Desconto (${fmtP(f.desc)})`, value: '-' + fmt(result.dv) },
    { label: `Imposto (${fmtP(f.imp)})`, value: '-' + fmt(result.iv) },
    ...(parseFloat(f.outros) > 0 ? [{ label: `Outros (${fmtP(f.outros)})`, value: '-' + fmt(result.ov) }] : []),
    ...(f.freteOn ? [{ label: 'Frete', value: '-' + fmt(result.frete) }] : []),
    { label: 'Custo', value: '-' + fmt(result.cost) },
    { label: 'Lucro líquido', value: fmt(result.lucro), total: true },
    { label: 'Margem', value: fmtP(result.margem) + ' · ' + result.label, total: true, cls: result.cls },
  ] : []

  const handleSave = () => {
    const r = compute()
    if (!r) { alert('Preencha o preço antes de salvar.'); return }
    const p = parseFloat(f.price2) || 0
    onSave({
      type: 'sh',
      name: f.name || 'Produto Shopee',
      price: p,
      price1: parseFloat(f.price1) || 0,
      cost: parseFloat(f.cost) || 0,
      antec: parseFloat(f.antec) || 0,
      desc: parseFloat(f.desc) || 0,
      imp: parseFloat(f.imp) || 0,
      outros: parseFloat(f.outros) || 0,
      frete: f.freteOn ? (parseFloat(f.frete) || 0) : 0,
      freteOn: f.freteOn,
      lucro: r.lucro,
      margem: r.margem,
    })
  }

  const upd = (k, v) => { set(k, v); setTimeout(compute, 0) }

  return (
    <div className="tc on">
      <div className="card">
        <div className="card-title">Produto</div>
        <div className="frow">
          <label>Nome</label>
          <input type="text" value={f.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Coluna Bluetooth" />
        </div>
        <div className="frow">
          <label>Preço s/ desconto</label>
          <div className="frow-val"><span className="unit">R$</span><input type="number" step="0.01" placeholder="0,00" value={f.price1} onChange={e => upd('price1', e.target.value)} /></div>
        </div>
        <div className="frow">
          <label>Preço c/ desconto</label>
          <div className="frow-val"><span className="unit">R$</span><input type="number" step="0.01" placeholder="0,00" value={f.price2} onChange={e => upd('price2', e.target.value)} /></div>
        </div>
        <div className="frow">
          <label>Custo do produto</label>
          <div className="frow-val"><span className="unit">R$</span><input type="number" step="0.01" placeholder="0,00" value={f.cost} onChange={e => upd('cost', e.target.value)} /></div>
        </div>
        <div className="frow">
          <label>Antecipação <span style={{ fontSize: 10, color: 'var(--text3)' }}>(incl. 2,5% spike)</span></label>
          <div className="frow-val"><input type="number" step="0.1" value={f.antec} onChange={e => upd('antec', e.target.value)} /><span className="unit">%</span></div>
        </div>
        <div className="frow">
          <label>Desconto</label>
          <div className="frow-val"><input type="number" step="0.1" value={f.desc} onChange={e => upd('desc', e.target.value)} /><span className="unit">%</span></div>
        </div>
        <div className="frow">
          <label>Imposto</label>
          <div className="frow-val"><input type="number" step="0.1" value={f.imp} onChange={e => upd('imp', e.target.value)} /><span className="unit">%</span></div>
        </div>
        <div className="frow">
          <label>Outros</label>
          <div className="frow-val"><input type="number" step="0.1" value={f.outros} onChange={e => upd('outros', e.target.value)} /><span className="unit">%</span></div>
        </div>

        {/* Frete opcional */}
        <div className="opt-toggle">
          <label>Incluir frete?</label>
          <label className="toggle">
            <input type="checkbox" checked={f.freteOn} onChange={e => upd('freteOn', e.target.checked)} />
            <span className="slider"></span>
          </label>
        </div>
        {f.freteOn && (
          <div className="frow">
            <label>Frete</label>
            <div className="frow-val"><span className="unit">R$</span><input type="number" step="0.01" placeholder="0,00" value={f.frete} onChange={e => upd('frete', e.target.value)} /></div>
          </div>
        )}
      </div>

      {/* Taxa box */}
      <div className="taxa-box">
        <div className="card-title" style={{ marginBottom: '.3rem' }}>Taxa Shopee — automática</div>
        <div className="taxa-val">{taxaInfo || 'Preencha o preço para ver a taxa.'}</div>
        <div className="taxa-exp">
          A Shopee cobra uma taxa fixa + % sobre o preço:<br />
          ≤R$79 → 20% &nbsp;·&nbsp; R$80–99 → 14%+R$16 &nbsp;·&nbsp; R$100–199 → 14%+R$20 &nbsp;·&nbsp; R$200+ → 14%+R$26
        </div>
      </div>

      <div className="result-card">
        <div className="result-header">Resultado — Shopee</div>
        <ResultRows rows={rows} />
      </div>
      <button className="calcbtn sh" onClick={compute}>Calcular</button>
      <button className="savebtn" onClick={handleSave}>Salvar simulação</button>
    </div>
  )
}
