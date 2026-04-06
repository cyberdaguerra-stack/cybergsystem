import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sun, Moon } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useToast } from '@/contexts/ToastContext'
import { Button, Input } from '@/components/ui'

export default function Login() {
  const { login, register } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const toast = useToast()
  
  // States
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmitLogin = async () => {
    if (!email || !password) { toast('Preencha email e senha', 'error'); return }
    setLoading(true)
    try {
      await login(email, password)
      toast('Login realizado com sucesso', 'success')
      navigate('/dashboard')
    } catch (err) {
      toast(err.message || 'Credenciais inválidas', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitRegister = async () => {
    if (!nome || !email || !password || !confirmPassword) {
      toast('Preencha todos os campos', 'error')
      return
    }
    if (password.length < 8) {
      toast('Senha deve ter pelo menos 8 caracteres', 'error')
      return
    }
    if (password !== confirmPassword) {
      toast('As senhas não correspondem', 'error')
      return
    }
    
    setLoading(true)
    try {
      await register(nome, email, password, confirmPassword)
      toast('Conta criada com sucesso! Bem-vindo!', 'success')
      navigate('/dashboard')
    } catch (err) {
      toast(err.message || 'Erro ao registar', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24, position:'relative', zIndex:1 }}>

      {/* Controls */}
      <div style={{ position:'fixed', top:16, left:16, right:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <button onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'none', cursor:'pointer', fontSize:13.5, color:'var(--text-secondary)', fontFamily:'var(--f-body)', transition:'color .15s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={15} strokeWidth={2} /> Voltar
        </button>
        <button onClick={toggle} style={{ width:34, height:34, borderRadius:9, background:'var(--glass-bg)', border:'1px solid var(--glass-border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text-secondary)', transition:'all .15s' }}>
          {theme === 'dark' ? <Sun size={15} strokeWidth={1.8} /> : <Moon size={15} strokeWidth={1.8} />}
        </button>
      </div>

      {/* Card */}
      <div className="glass anim-scale-in" style={{ width:'100%', maxWidth:400, padding:'36px 32px', boxShadow:'var(--shadow-modal)' }}>

        {/* Logo */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, marginBottom:28, textAlign:'center' }}>
          <div style={{ width:44, height:44, borderRadius:13, background:'var(--grad-primary)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 28px var(--glow-purple)' }}>
            <span style={{ color:'#fff', fontFamily:'var(--f-display)', fontWeight:800, fontSize:13 }}>CG</span>
          </div>
          <div>
            <div style={{ fontFamily:'var(--f-display)', fontSize:20, fontWeight:800 }}>
              {mode === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}
            </div>
            <div style={{ fontSize:13, color:'var(--text-secondary)', marginTop:4 }}>
              {mode === 'login' ? 'Aceda ao painel de gestão' : 'Junte-se ao sistema CyberG'}
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:20 }}>
          {mode === 'register' && (
            <Input label="Nome completo" type="text" placeholder="João Silva" value={nome} onChange={e => setNome(e.target.value)} />
          )}
          <Input label="Email" type="email" placeholder="admin@cyberg.ao" value={email} onChange={e => setEmail(e.target.value)} />
          <Input label="Senha" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleSubmitLogin() : handleSubmitRegister())} />
          {mode === 'register' && (
            <Input label="Confirmar Senha" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmitRegister()} />
          )}
          <Button variant="primary" disabled={loading} onClick={mode === 'login' ? handleSubmitLogin : handleSubmitRegister} style={{ justifyContent:'center' }}>
            {loading ? (mode === 'login' ? 'A entrar...' : 'A criar...') : (mode === 'login' ? 'Entrar' : 'Criar conta')}
          </Button>
        </div>

        {/* Toggle mode */}
        <div style={{ textAlign:'center', marginBottom:20, fontSize:13 }}>
          <span style={{ color:'var(--text-secondary)' }}>
            {mode === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
          </span>
          <button 
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setNome(''); setEmail(''); setPassword(''); setConfirmPassword('') }}
            style={{ background:'none', border:'none', color:'var(--text-primary)', fontWeight:600, cursor:'pointer', textDecoration:'underline' }}
          >
            {mode === 'login' ? 'Registar' : 'Fazer login'}
          </button>
        </div>

        {mode === 'login' && (
          <>
          </>
        )}
      </div>
    </div>
  )
}
