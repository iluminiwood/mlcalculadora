import { useState, useEffect } from 'react'
import { useAuth } from './lib/AuthContext'
import { useTheme } from './lib/ThemeContext'
import { supabase } from './lib/supabase'
import AuthPage from './pages/AuthPage'
import MLTab from './pages/MLTab'
import ShopeeTab from './pages/ShopeeTab'
import HistoryTab from './pages/HistoryTab'
import CoinLogo from './components/CoinLogo'
import './styles/global.css'

export default function App() {
  const { user, loading, signOut } = useAuth()
  const { dark, toggle } = useTheme()
  const [tab, setTab] = useState('ml')
  const [sims, setSims] = useState([])

  useEffect(() => {
    if (user) loadSims()
  }, [user])

  async function loadSims() {
    const { data } = await supabase
      .from('simulations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (data) setSims(data.map(d => ({ ...d.data, id: d.id, date: new Date(d.created_at).toLocaleString('pt-BR') })))
  }

  async function handleSave(sim) {
    const payload = { user_id: user.id, type: sim.type, name: sim.name, data: sim }
    const { data, error } = await supabase.from('simulations').insert(payload).select().single()
    if (!error && data) {
      setSims(prev => [{ ...sim, id: data.id, date: new Date(data.created_at).toLocaleString('pt-BR') }, ...prev])
      setTab('hi')
    }
  }

  async function handleDelete(id) {
    await supabase.from('simulations').delete().eq('id', id)
    setSims(prev => prev.filter(s => s.id !== id))
  }

  async function handleClear() {
    if (!confirm('Limpar todas as simulações?')) return
    await supabase.from('simulations').delete().eq('user_id', user.id)
    setSims([])
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
      <CoinLogo size={48} />
    </div>
  )

  if (!user) return <AuthPage />

  return (
    <div>
      <div className="topbar">
        <div className="topbar-left">
          <CoinLogo size={30} />
          <span className="topbar-name">Preço Certo</span>
        </div>
        <div className="topbar-right">
          <span className="uname">{user.user_metadata?.name?.split(' ')[0] || user.email}</span>
          <button className="btn-icon" onClick={toggle} title="Alternar tema">{dark ? '☀️' : '🌙'}</button>
          <button className="btn-sm" onClick={signOut}>Sair</button>
        </div>
      </div>

      <div className="nav">
        <div className={`nb${tab === 'ml' ? ' on' : ''}`} onClick={() => setTab('ml')}>
          ML<span className="nb-sub">Mercado Livre</span>
        </div>
        <div className={`nb${tab === 'sh' ? ' on' : ''}`} onClick={() => setTab('sh')}>
          Shopee<span className="nb-sub">Calculadora</span>
        </div>
        <div className={`nb${tab === 'hi' ? ' on' : ''}`} onClick={() => setTab('hi')}>
          Histórico<span className="nb-sub">Simulações</span>
        </div>
      </div>

      {tab === 'ml' && <MLTab onSave={handleSave} />}
      {tab === 'sh' && <ShopeeTab onSave={handleSave} />}
      {tab === 'hi' && <HistoryTab sims={sims} onDelete={handleDelete} onClear={handleClear} />}
    </div>
  )
}
