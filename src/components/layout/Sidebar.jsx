import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, ArrowLeftRight, Wrench, BarChart3,
  Users, FileText, Settings, LogOut,
} from 'lucide-react'
import { useAuth, ROLES } from '@/contexts/AuthContext'

const NAV_ITEMS = [
  { to: '/dashboard',     label: 'Dashboard',       icon: LayoutDashboard, page: 'dashboard'     },
  { to: '/fluxo',         label: 'Fluxo de Caixa',  icon: ArrowLeftRight,  page: 'fluxo'         },
  { to: '/servicos',      label: 'Serviços',         icon: Wrench,          page: 'servicos'      },
  null,
  { to: '/estatisticas',  label: 'Estatísticas',     icon: BarChart3,       page: 'estatisticas'  },
  { to: '/usuarios',      label: 'Utilizadores',     icon: Users,           page: 'usuarios'      },
  { to: '/relatorios',    label: 'Relatórios',        icon: FileText,        page: 'relatorios'    },
  null,
  { to: '/configuracoes', label: 'Configurações',    icon: Settings,        page: 'configuracoes' },
]

const ROLE_GRAD = {
  admin_geral: 'linear-gradient(135deg,#7c3aed,#3b82f6)',
  admin:       'linear-gradient(135deg,#3b82f6,#06b6d4)',
  funcionario: 'linear-gradient(135deg,#10b981,#06b6d4)',
}

export function Sidebar() {
  const { user, logout, access } = useAuth()

  return (
    <aside style={{
      width: 220,
      flexShrink: 0,
      height: '100vh',
      position: 'sticky',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--sidebar-bg)',
      borderRight: '1px solid var(--sidebar-border)',
      backdropFilter: 'blur(28px) saturate(200%)',
      WebkitBackdropFilter: 'blur(28px) saturate(200%)',
      zIndex: 40,
    }}>

      {/* Logo */}
      <div style={{ padding: '22px 18px 18px', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'var(--grad-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px var(--glow-purple)',
          }}>
            <span style={{ color: '#fff', fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 11 }}>CG</span>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.1 }}>Cyber G</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '.08em', textTransform: 'uppercase', marginTop: 1 }}>× Netfacil</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map((item, i) => {
          if (item === null) return (
            <div key={`sep-${i}`} style={{ height: 1, background: 'var(--glass-border)', margin: '8px 8px' }} />
          )
          if (!access(item.page)) return null
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 10,
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                color: isActive ? '#fff' : 'rgba(220,225,255,.6)',
                background: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
                border: isActive ? '1px solid var(--sidebar-active-border)' : '1px solid transparent',
                textDecoration: 'none',
                transition: 'all .17s ease',
                backdropFilter: isActive ? 'blur(10px)' : 'none',
              })}
              onMouseEnter={e => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.background = 'rgba(255,255,255,.06)'
                  e.currentTarget.style.color = 'rgba(220,225,255,.9)'
                }
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.style.border.includes('var(--sidebar-active-border)')) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              {({ isActive }) => (
                <>
                  <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10,
          background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
          marginBottom: 6,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: ROLE_GRAD[user?.role] || 'var(--grad-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff',
          }}>
            {user?.nome?.charAt(0) || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.nome}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
              {ROLES[user?.role]?.label}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', borderRadius: 9, fontSize: 12.5,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(251,113,133,.7)', transition: 'all .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(251,113,133,.08)'; e.currentTarget.style.color = 'var(--c-danger)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(251,113,133,.7)' }}
        >
          <LogOut size={14} />
          Terminar sessão
        </button>
      </div>
    </aside>
  )
}
