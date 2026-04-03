import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import { ArrowRight, BarChart3, ArrowLeftRight, Wrench, Users, FileText, Shield, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui'

const FEATURES = [
  { icon: ArrowLeftRight, label: 'Fluxo de Caixa',     desc: 'Registo diário de entradas e saídas com histórico completo.' },
  { icon: Wrench,         label: 'Gestão de Serviços', desc: 'Catálogo com controlo de preços e permissões por perfil.' },
  { icon: BarChart3,      label: 'Estatísticas',        desc: 'Indicadores financeiros e rendimento mensal em tempo real.' },
  { icon: Users,          label: 'Utilizadores',        desc: 'Três níveis de acesso — Admin Geral, Admin e Funcionário.' },
  { icon: FileText,       label: 'Relatórios',          desc: 'Relatórios semanais e mensais exportáveis em PDF e Excel.' },
  { icon: Shield,         label: 'Segurança por Role',  desc: 'Permissões granulares por módulo e por tipo de operação.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', position:'relative', zIndex:1 }}>

      {/* Nav */}
      <nav style={{
        position:'sticky', top:0, zIndex:50,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 48px', height:64,
        background:'rgba(11,14,26,.6)',
        borderBottom:'1px solid var(--glass-border)',
        backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
      }}>
        <LogoMark />
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={toggle} style={{ width:34, height:34, borderRadius:9, background:'var(--glass-bg)', border:'1px solid var(--glass-border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text-secondary)', transition:'all .15s' }}>
            {theme === 'dark' ? <Sun size={15} strokeWidth={1.8} /> : <Moon size={15} strokeWidth={1.8} />}
          </button>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Entrar no Sistema <ArrowRight size={14} strokeWidth={2.5} />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'96px 24px 64px', gap:28 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', borderRadius:99, background:'var(--glass-bg)', border:'1px solid var(--glass-border)', fontSize:11.5, fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(167,139,250,1)' }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'rgba(167,139,250,1)', animation:'pulseDot 2s ease infinite' }} />
          Sistema de Gestão Interno v2.0
        </div>

        <h1 style={{ fontFamily:'var(--f-display)', fontSize:'clamp(40px,7vw,80px)', fontWeight:800, letterSpacing:'-.04em', lineHeight:1.04, maxWidth:820 }}>
          Controle total do seu{' '}
          <span style={{ background:'var(--grad-primary)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            fluxo financeiro
          </span>
        </h1>

        <p style={{ fontSize:17, color:'var(--text-secondary)', maxWidth:520, lineHeight:1.7 }}>
          Plataforma integrada para o Cyber G e Netfacil — moderna, rápida e com controlo de acessos por perfil de utilizador.
        </p>

        <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
          <Button variant="primary" size="lg" onClick={() => navigate('/login')}>
            Acessar o Sistema <ArrowRight size={16} strokeWidth={2.5} />
          </Button>
          <Button variant="ghost" size="lg" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior:'smooth' })}>
            Ver Funcionalidades
          </Button>
        </div>
      </section>

      {/* Stats band */}
      <div style={{ margin:'0 48px 64px' }}>
        <div className="glass" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
          {[
            { num:'3',    label:'Níveis de acesso' },
            { num:'5',    label:'Módulos integrados' },
            { num:'100%', label:'Web-based' },
            { num:'∞',    label:'Registos suportados' },
          ].map((s, i) => (
            <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'28px', borderRight: i < 3 ? '1px solid var(--glass-border)' : 'none', gap:4 }}>
              <span style={{ fontFamily:'var(--f-display)', fontSize:32, fontWeight:800, background:'var(--grad-primary)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{s.num}</span>
              <span style={{ fontSize:12, color:'var(--text-secondary)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" style={{ padding:'0 48px 80px' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ fontSize:11.5, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(167,139,250,1)', marginBottom:8 }}>Funcionalidades</div>
          <h2 style={{ fontFamily:'var(--f-display)', fontSize:'clamp(26px,4vw,38px)', fontWeight:800, letterSpacing:'-.03em' }}>Tudo num só lugar</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:14, maxWidth:1000, margin:'0 auto' }}>
          {FEATURES.map(f => {
            const Icon = f.icon
            return (
              <div key={f.label} className="glass" style={{ padding:22, display:'flex', flexDirection:'column', gap:12, transition:'transform .2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <div style={{ width:40, height:40, borderRadius:11, background:'var(--glass-bg)', border:'1px solid var(--glass-border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={17} strokeWidth={1.8} color="rgba(167,139,250,1)" />
                </div>
                <div style={{ fontFamily:'var(--f-display)', fontSize:14, fontWeight:700 }}>{f.label}</div>
                <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.65 }}>{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:'1px solid var(--glass-border)', padding:'20px 48px', display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:12.5, color:'var(--text-muted)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <LogoMark small />
          <span>© 2025 Cyber G × Netfacil. Todos os direitos reservados.</span>
        </div>
        <span>Angola</span>
      </footer>
    </div>
  )
}

function LogoMark({ small }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ width:small?26:32, height:small?26:32, borderRadius:small?7:9, background:'var(--grad-primary)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 18px var(--glow-purple)' }}>
        <span style={{ color:'#fff', fontFamily:'var(--f-display)', fontWeight:800, fontSize:small?9:11 }}>CG</span>
      </div>
      {!small && (
        <div>
          <div style={{ fontFamily:'var(--f-display)', fontWeight:700, fontSize:14, lineHeight:1.1 }}>Cyber G</div>
          <div style={{ fontSize:9.5, color:'var(--text-muted)', letterSpacing:'.08em', textTransform:'uppercase', marginTop:1 }}>× Netfacil</div>
        </div>
      )}
    </div>
  )
}
