export function ResultRows({ rows, empty }) {
  if (!rows || rows.length === 0) {
    return <div className="rrow"><span className="rl">{empty || 'Preencha os dados acima'}</span><span className="rv">—</span></div>
  }
  return rows.map((r, i) => (
    <div key={i} className={`rrow${r.total ? ' tot' : ''}`}>
      <span className="rl">{r.label}</span>
      <span className={`rv${r.cls ? ` m-${r.cls}` : ''}`}>{r.value}</span>
    </div>
  ))
}
