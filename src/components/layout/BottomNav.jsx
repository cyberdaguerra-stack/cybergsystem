import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, ArrowLeftRight, Wrench, BarChart3, Users,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const NAV_ITEMS = [
  { to: '/dashboard',     label: 'Dashboard',       icon: LayoutDashboard, page: 'dashboard'     },
  { to: '/fluxo',         label: 'Fluxo',           icon: ArrowLeftRight,  page: 'fluxo'         },
  { to: '/servicos',      label: 'Serviços',        icon: Wrench,          page: 'servicos'      },
  { to: '/estatisticas',  label: 'Análise',         icon: BarChart3,       page: 'estatisticas'  },
  { to: '/usuarios',      label: 'Usuários',        icon: Users,           page: 'usuarios'      },
]

export function BottomNav() {
  const { access } = useAuth()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: 'auto', minHeight: 80, zIndex: 50,
      background: 'linear-gradient(180deg, rgba(11,14,26,0) 0%, rgba(11,14,26,.98) 40%)',
      borderTop: '1px solid var(--glass-border)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      paddingTop: 12,
      paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0))',
      paddingLeft: 8,
      paddingRight: 8,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        gap: 6, height: '100%', maxWidth: 1200, margin: '0 auto',
      }}>
        {NAV_ITEMS.map(item => {
          if (!access(item.page)) return null
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                flex: 1,
                minWidth: 60,
                maxWidth: 80,
                gap: 4, 
                textDecoration: 'none',
                padding: '8px 4px',
                borderRadius: 12,
                color: isActive ? 'var(--text-primary)' : 'rgba(220,225,255,.55)',
                fontSize: 11, 
                fontWeight: isActive ? 600 : 500,
                transition: 'all .25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                background: isActive ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
                position: 'relative',
              })}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)'
                e.currentTarget.style.color = 'rgba(220,225,255,.8)'
              }}
              onMouseLeave={({ isActive }, e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'rgba(220,225,255,.55)'
                }
              }}
            >
              {({ isActive }) => (
                <>
                  <div style={{
                    width: 40, height: 40,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 10,
                    background: isActive ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                    transition: 'all .25s ease',
                  }}>
                    <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                  </div>
                  <span style={{
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                    whiteSpace: 'nowrap',
                  }}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div style={{
                      position: 'absolute', bottom: -6,
                      width: 4, height: 4,
                      borderRadius: '50%',
                      background: 'var(--grad-primary)',
                      boxShadow: '0 0 8px var(--grad-primary)',
                    }} />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
