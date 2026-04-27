// ── Shopee taxa ──
export function shopRate(p) {
  if (p <= 79.99) return p * 0.20 + 4
  if (p <= 99.99) return p * 0.14 + 16
  if (p <= 199.99) return p * 0.14 + 20
  return p * 0.14 + 26
}

// ── ML frete volumétrico ──
// Fator padrão Brasil = 5000
// Tabela de frete simplificada por peso cobrado (kg)
export function calcFreteML(c, l, a, pesoFisico) {
  if (!c || !l || !a || !pesoFisico) return null
  const pesoVol = (c * l * a) / 5000
  const pesoCobrado = Math.max(pesoVol, pesoFisico)

  let frete
  if (pesoCobrado <= 0.3)      frete = 9.90
  else if (pesoCobrado <= 0.5) frete = 12.90
  else if (pesoCobrado <= 1)   frete = 15.90
  else if (pesoCobrado <= 2)   frete = 19.90
  else if (pesoCobrado <= 5)   frete = 25.90
  else if (pesoCobrado <= 10)  frete = 34.90
  else if (pesoCobrado <= 20)  frete = 49.90
  else                          frete = 69.90

  return { pesoVol, pesoCobrado, frete }
}

// ── Margem classification ──
export function margemInfo(mg) {
  if (mg < 0)   return { cls: 'bad',   label: 'Prejuízo — corrija já' }
  if (mg < 10)  return { cls: 'low',   label: 'Muito baixa' }
  if (mg < 15)  return { cls: 'warn',  label: 'Atenção' }
  if (mg < 20)  return { cls: 'ok',    label: 'Saudável' }
  return              { cls: 'great', label: 'Excelente' }
}

// ── ML full calc ──
export function calcML({ price, cost, comm, antec, desc, imp, frete }) {
  if (!price) return null
  const cv  = price * (comm  / 100)
  const av  = price * (antec / 100)
  const dv  = price * (desc  / 100)
  const iv  = price * (imp   / 100)
  const lucro = price - (cv + av + dv + iv + frete + cost)
  const margem = price > 0 ? (lucro / price) * 100 : 0
  return { cv, av, dv, iv, frete, cost, lucro, margem, ...margemInfo(margem) }
}

// ── Shopee full calc ──
export function calcShopee({ price, cost, frete, antec, desc, imp, outros }) {
  if (!price) return null
  const taxa   = shopRate(price)
  const taxaPct = (taxa / price) * 100
  const av     = price * (antec  / 100)
  const dv     = price * (desc   / 100)
  const iv     = price * (imp    / 100)
  const ov     = price * (outros / 100)
  const lucro  = price - (taxa + av + dv + iv + ov + frete + cost)
  const margem = price > 0 ? (lucro / price) * 100 : 0
  return { taxa, taxaPct, av, dv, iv, ov, frete, cost, lucro, margem, ...margemInfo(margem) }
}

export const fmt  = v => 'R$ ' + Number(v).toFixed(2).replace('.', ',')
export const fmtP = v => Number(v).toFixed(2).replace('.', ',') + '%'
