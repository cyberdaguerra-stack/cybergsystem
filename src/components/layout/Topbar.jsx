import { Bell, Sun, Moon } from 'lucide-react'
import { useAuth, ROLES } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Badge } from '@/components/ui'

const ROLE_BADGE = {
  admin_geral: 'purple',
  admin:       'blue',
  funcionario: 'green',
}

export function Topbar({ title }) {
  const { user } = useAuth()
  const { theme, toggle } = useTheme()

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', height: 60,
      background: 'rgba(11,14,26,.55)',
      borderBottom: '1px solid var(--glass-border)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>
        {title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Badge variant={ROLE_BADGE[user?.role] || 'gray'}>
          {ROLES[user?.role]?.label}
        </Badge>

        {/* Notification */}
        <button style={{
          width: 34, height: 34, borderRadius: 9,
          background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--text-secondary)',
          position: 'relative', transition: 'all .15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--glass-bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--glass-bg)'}
        >
          <Bell size={15} strokeWidth={1.8} />
          <span style={{
            position: 'absolute', top: 7, right: 7,
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--c-danger)',
            border: '1.5px solid var(--bg-root)',
          }} />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all .15s',
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
