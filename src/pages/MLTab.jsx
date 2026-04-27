import { useState, useCallback } from 'react'
import { calcML, calcFreteML, fmt, fmtP, margemInfo } from '../lib/calc'
import { ResultRows } from '../components/ResultRows'

export default function MLTab({ onSave }) {
  const [seg, setSeg] = useState('classic')
  const [f, setF] = useState({
    name: '', price1: '', price2: '', cost: '',
    comm: '11.5', antec: '4.2', desc: '5', imp: '10',
    c: '', l: '', a: '', peso: '',
    frete: '', freteManual: false
  })
  const [result, setResult] = useState(null)
  const [volInfo, setVolInfo] = useState(null)

  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }))

  const handleSeg = (s) => {
    setSeg(s)
    setF(prev => ({ ...prev, comm: s === 'classic' ? '11.5' : '16.5' }))
  }

  const compute = useCallback((overrideFrete) => {
    const p = parseFloat(f.price2) || 0
    const cost = parseFloat(f.cost) || 0
    const comm = parseFloat(f.comm) || 0
    const antec = parseFloat(f.antec) || 0
    const desc = parseFloat(f.desc) || 0
    const imp = parseFloat(f.imp) || 0
    const c = parseFloat(f.c) || 0
    const l = parseFloat(f.l) || 0
    const a = parseFloat(f.a) || 0
    const peso = parseFloat(f.peso) || 0

    // Frete volumétrico
    const fi = calcFreteML(c, l, a, peso)
    if (fi) {
      setVolInfo(fi)
      if (!f.freteManual && overrideFrete !== false) {
        setF(prev => ({ ...prev, frete: fi.frete.toFixed(2) }))
      }
    } else {
      setVolInfo(null)
    }

    const frete = overrideFrete !== undefined ? parseFloat(overrideFrete) || 0 : parseFloat(f.frete) || (fi?.frete || 0)
    if (!p) { setResult(null); return }

    const r = calcML({ price: p, cost, comm, antec, desc, imp, frete })
    setResult(r)
    return r
  }, [f])

  const handleFreteChange = (v) => {
    setF(prev => ({ ...prev, frete: v, freteManual: true }))
    setTimeout(() => compute(), 0)
  }

  const rows = result ? [
    { label: `Comissão ML (${fmtP(f.comm)})`, value: '-' + fmt(result.cv) },
    { label: `Antecipação (${fmtP(f.antec)})`, value: '-' + fmt(result.av) },
    { label: `Desconto (${fmtP(f.desc)})`, value: '-' + fmt(result.dv) },
    { label: `Imposto (${fmtP(f.imp)})`, value: '-' + fmt(result.iv) },
    { label: 'Frete', value: '-' + fmt(result.frete) },
    { label: 'Custo', value: '-' + fmt(result.cost) },
    { label: 'Lucro líquido', value: fmt(result.lucro), total: true },
    { label: 'Margem', value: fmtP(result.margem) + ' · ' + result.label, total: true, cls: result.cls },
  ] : []

  const handleSave = () => {
    const r = compute()
    if (!r) { alert('Preencha o preço antes de salvar.'); return }
    const p = parseFloat(f.price2) || 0
    onSave({
      type: 'ml', seg,
      name: f.name || 'Produto ML',
      price: p,
      price1: parseFloat(f.price1) || 0,
      cost: parseFloat(f.cost) || 0,
      comm: parseFloat(f.comm) || 0,
      antec: parseFloat(f.antec) || 0,
      desc: parseFloat(f.desc) || 0,
      imp: parseFloat(f.imp) || 0,
      frete: parseFloat(f.frete) || 0,
      lucro: r.lucro,
      margem: r.margem,
    })
  }

  return (
    <div className="tc on">
      {/* Segment */}
      <div className="seg">
        <div className={`sg${seg === 'classic' ? ' on' : ''}`} onClick={() => handleSeg('classic')}>
          Clássico<span>11,5% comissão</span>
        </div>
        <div className={`sg${seg === 'premium' ? ' on' : ''}`} onClick={() => handleSeg('premium')}>
          Premium<span>16,5% comissão</span>
        </div>
      </div>

      {/* Produto */}
      <div className="card">
        <div className="card-title">Produto</div>
        <div className="frow">
          <label>Nome</label>
          <input type="text" value={f.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Coluna Bluetooth" />
        </div>
        <div className="frow">
          <label>Preço s/ desconto</label>
          <div className="frow-val"><span className="unit">R$</span><input type="number" step="0.01" placeholder="0,00" value={f.price1} onChange={e => { set('price1', e.target.value); compute() }} /></div>
        </div>
        <div className="frow">
          <label>Preço c/ desconto</label>
          <div className="frow-val"><span className="unit">R$</span><input type="number" step="0.01" placeholder="0,00" value={f.price2} onChange={e => { set('price2', e.target.value); setTimeout(compute, 0) }} /></div>
        </div>
        <div className="frow">
          <label>Custo do produto</label>
          <div className="frow-val"><span className="unit">R$</span><input type="number" step="0.01" placeholder="0,00" value={f.cost} onChange={e => { set('cost', e.target.value); setTimeout(compute, 0) }} /></div>
        </div>
      </div>

      {/* Taxas */}
      <div className="card">
        <div className="card-title">Taxas</div>
        {[
          { label: 'Comissão ML', key: 'comm', unit: '%' },
          { label: 'Antecipação', key: 'antec', unit: '%' },
          { label: 'Desconto', key: 'desc', unit: '%' },
          { label: 'Imposto', key: 'imp', unit: '%' },
        ].map(({ label, key, unit }) => (
          <div className="frow" key={key}>
            <label>{label}</label>
            <div className="frow-val">
              <input type="number" step="0.1" value={f[key]} onChange={e => { set(key, e.target.value); setTimeout(compute, 0) }} />
              <span className="unit">{unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Frete */}
      <div className="card">
        <div className="card-title">Embalagem & Frete Automático</div>
        <div className="dim-grid">
          {[['c','Comp. (cm)'],['l','Larg. (cm)'],['a','Alt. (cm)']].map(([k, lbl]) => (
            <div className="dim-block" key={k}>
              <label>{lbl}</label>
              <input type="number" placeholder="0" value={f[k]} onChange={e => { set(k, e.target.value); setTimeout(compute, 0) }} />
            </div>
          ))}
        </div>
        <div className="frow">
          <label>Peso físico</label>
          <div className="frow-val"><input type="number" step="0.1" placeholder="0.5" value={f.peso} onChange={e => { set('peso', e.target.value); setTimeout(compute, 0) }} /><span className="unit">kg</span></div>
        </div>
        {volInfo && (
          <div className="volinfo">
            Peso vol: <b>{volInfo.pesoVol.toFixed(3)} kg</b> · Cobrado: <b>{volInfo.pesoCobrado.toFixed(3)} kg</b> · Sugerido: <b>{fmt(volInfo.frete)}</b>
          </div>
        )}
        <div className="frow">
          <label>Frete <span style={{ fontSize: 10, color: 'var(--text3)' }}>(editável)</span></label>
          <div className="frow-val"><span className="unit">R$</span><input type="number" step="0.01" placeholder="auto" value={f.frete} onChange={e => handleFreteChange(e.target.value)} /></div>
        </div>
      </div>

      {/* Result */}
      <div className="result-card">
        <div className="result-header">Resultado — Mercado Livre</div>
        <ResultRows rows={rows} />
      </div>
      <button className="calcbtn ml" onClick={() => compute()}>Calcular</button>
      <button className="savebtn" onClick={handleSave}>Salvar simulação</button>
    </div>
  )
}
