import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import CoinLogo from '../components/CoinLogo'

export default function AuthPage() {
  const { signIn, signUp } = useAuth()
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', pass: '' })
  const [msg, setMsg] = useState({ text: '', ok: false })
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleLogin() {
    if (!form.email || !form.pass) { setMsg({ text: 'Preencha e-mail e senha.', ok: false }); return }
    setLoading(true)
    const { error } = await signIn(form.email, form.pass)
    setLoading(false)
    if (error) setMsg({ text: 'E-mail ou senha incorretos.', ok: false })
  }

  async function handleRegister() {
    if (!form.name || !form.email || !form.pass) { setMsg({ text: 'Preencha todos os campos.', ok: false }); return }
    if (form.pass.length < 6) { setMsg({ text: 'Senha com mínimo 6 caracteres.', ok: false }); return }
    setLoading(true)
    const { error } = await signUp(form.email, form.pass, form.name)
    setLoading(false)
    if (error) setMsg({ text: error.message, ok: false })
    else setMsg({ text: 'Conta criada! Confira seu e-mail para confirmar.', ok: true })
  }

  return (
    <div className="auth-page">
      <div className="abox">
        <div className="alogo">
          <CoinLogo size={52} />
          <h1>Preço Certo</h1>
          <p>Calculadora de marketplaces</p>
        </div>

        <div className="atabs">
          <div className={`atab${tab === 'login' ? ' on' : ''}`} onClick={() => { setTab('login'); setMsg({ text: '' }) }}>Entrar</div>
          <div className={`atab${tab === 'reg' ? ' on' : ''}`} onClick={() => { setTab('reg'); setMsg({ text: '' }) }}>Cadastrar</div>
        </div>

        {tab === 'login' ? (
          <>
            <div className="fl"><label>E-mail</label><input type="email" placeholder="seu@email.com" value={form.email} onChange={e => set('email', e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} /></div>
            <div className="fl"><label>Senha</label><input type="password" placeholder="••••••" value={form.pass} onChange={e => set('pass', e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} /></div>
            <button className="abtn" onClick={handleLogin} disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
          </>
        ) : (
          <>
            <div className="fl"><label>Nome</label><input type="text" placeholder="Seu nome" value={form.name} onChange={e => set('name', e.target.value)} /></div>
            <div className="fl"><label>E-mail</label><input type="email" placeholder="seu@email.com" value={form.email} onChange={e => set('email', e.target.value)} /></div>
            <div className="fl"><label>Senha</label><input type="password" placeholder="mín. 6 caracteres" value={form.pass} onChange={e => set('pass', e.target.value)} /></div>
            <button className="abtn" onClick={handleRegister} disabled={loading}>{loading ? 'Criando...' : 'Criar conta'}</button>
          </>
        )}
        <div className={`amsg${msg.ok ? ' ok' : ''}`}>{msg.text}</div>
      </div>
    </div>
  )
}
