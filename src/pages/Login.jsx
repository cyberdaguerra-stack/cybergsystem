import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sun, Moon } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useToast } from '@/contexts/ToastContext'
import { Button, Input } from '@/components/ui'

const QUICK = [
  { role:'admin_geral', label:'Admin Geral',    sub:'Acesso total ao sistema',   initial:'AG', grad:'linear-gradient(135deg,#7c3aed,#3b82f6)' },
  { role:'admin',       label:'Administrador',  sub:'Gestão operacional',         initial:'AD', grad:'linear-gradient(135deg,#3b82f6,#06b6d4)' },
  { role:'funcionario', label:'Funcionário',    sub:'Acesso limitado',            initial:'FN', grad:'linear-gradient(135deg,#10b981,#06b6d4)' },
]

export default function Login() {
  const { login, quickLogin } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const toast = useToast()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) { toast('Preencha email e senha', 'error'); return }
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      toast(err.message || 'Credenciais inválidas', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleQuick = (role) => {
    quickLogin(role)
    navigate('/dashboard')
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
            <div style={{ fontFamily:'var(--f-display)', fontSize:20, fontWeight:800 }}>Bem-vindo de volta</div>
            <div style={{ fontSize:13, color:'var(--text-secondary)', marginTop:4 }}>Aceda ao painel de gestão</div>
          </div>
        </div>

        {/* Form */}
        <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:20 }}>
          <Input label="Email" type="email" placeholder="admin@cyberg.ao" value={email} onChange={e => setEmail(e.target.value)} />
          <Input label="Senha" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          <Button variant="primary" disabled={loading} onClick={handleSubmit} style={{ justifyContent:'center' }}>
            {loading ? 'A entrar...' : 'Entrar'}
          </Button>
        </div>

        {/* Divider */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
          <div style={{ flex:1, height:1, background:'var(--glass-border)' }} />
          <span style={{ fontSize:11, color:'var(--text-muted)', letterSpacing:'.06em', textTransform:'uppercase' }}>Acesso rápido</span>
          <div style={{ flex:1, height:1, background:'var(--glass-border)' }} />
        </div>

        {/* Quick login pills */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {QUICK.map(q => (
            <button key={q.role} onClick={() => handleQuick(q.role)} style={{
              display:'flex', alignItems:'center', gap:12, padding:'11px 14px',
              borderRadius:11, background:'var(--glass-bg)', border:'1px solid var(--glass-border)',
              cursor:'pointer', textAlign:'left', transition:'all .17s', width:'100%',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--glass-bg-hover)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,.3)'; e.currentTarget.style.transform = 'translateX(3px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--glass-bg)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'none' }}
            >
              <div style={{ width:34, height:34, borderRadius:9, background:q.grad, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:700, flexShrink:0 }}>
                {q.initial}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13.5, fontWeight:600, color:'var(--text-primary)' }}>{q.label}</div>
                <div style={{ fontSize:11.5, color:'var(--text-secondary)', marginTop:1 }}>{q.sub}</div>
              </div>
              <span style={{ color:'var(--text-muted)', fontSize:14 }}>→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
