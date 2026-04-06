import { Bell, Sun, Moon, Menu } from 'lucide-react'
import { useAuth, ROLES } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Badge } from '@/components/ui'

const ROLE_BADGE = {
  admin_geral: 'purple',
  admin:       'blue',
  funcionario: 'green',
}

export function Topbar({ title, onMenuClick, isMobile }) {
  const { user } = useAuth()
  const { theme, toggle } = useTheme()

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: isMobile ? '10px 14px' : 'clamp(8px, 3vw, 20px)',
      height: 'auto', minHeight: isMobile ? 56 : 60,
      background: 'rgba(11,14,26,.55)',
      borderBottom: '1px solid var(--glass-border)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      gap: 10,
    }}>
      {/* Menu toggle (mobile only) */}
      {isMobile && (
        <button
          onClick={onMenuClick}
          style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all .15s',
            flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--glass-bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--glass-bg)'}
        >
          <Menu size={16} strokeWidth={2} />
        </button>
      )}

      <h1 style={{ 
        fontFamily: 'var(--f-display)', 
        fontSize: isMobile ? '14px' : 'clamp(15px, 3vw, 17px)', 
        fontWeight: 700, 
        color: 'var(--text-primary)', 
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {!isMobile && (
          <Badge variant={ROLE_BADGE[user?.role] || 'gray'}>
            {ROLES[user?.role]?.label}
          </Badge>
        )}

        {/* Notification */}
        <button style={{
          width: 34, height: 34, borderRadius: 8,
          background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--text-secondary)',
          position: 'relative', transition: 'all .15s', flexShrink: 0,
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--glass-bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--glass-bg)'}
        >
          <Bell size={15} strokeWidth={1.8} />
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--c-danger)',
            border: '1.5px solid var(--bg-root)',
          }} />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all .15s', flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--glass-bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--glass-bg)'}
        >
          {theme === 'dark' ? <Sun size={15} strokeWidth={1.8} /> : <Moon size={15} strokeWidth={1.8} />}
        </button>
      </div>
    </header>
  )
}
