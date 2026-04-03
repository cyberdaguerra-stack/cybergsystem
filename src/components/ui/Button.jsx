import { cn } from '@/lib/utils'

const variants = {
  primary: {
    background: 'var(--grad-primary)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 20px rgba(139,92,246,.35)',
  },
  ghost: {
    background: 'var(--glass-bg)',
    color: 'var(--text-primary)',
    border: '1px solid var(--glass-border)',
    backdropFilter: 'blur(12px)',
  },
  danger: {
    background: 'rgba(251,113,133,.15)',
    color: 'var(--c-danger)',
    border: '1px solid rgba(251,113,133,.3)',
  },
  subtle: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: 'none',
  },
}

const sizes = {
  sm:   { padding: '6px 14px',  fontSize: 12.5, borderRadius: 8  },
  md:   { padding: '9px 20px',  fontSize: 13.5, borderRadius: 10 },
  lg:   { padding: '13px 28px', fontSize: 15,   borderRadius: 12 },
  icon: { width: 34, height: 34, padding: 0, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' },
}

export function Button({ variant = 'ghost', size = 'md', className, style, children, disabled, onClick, type = 'button' }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn('btn-base', className)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        fontFamily: 'var(--f-body)', fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? .45 : 1, transition: 'all .18s ease',
        ...variants[variant],
        ...sizes[size],
        ...style,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '.82'; e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none' }}
    >
      {children}
    </button>
  )
}
