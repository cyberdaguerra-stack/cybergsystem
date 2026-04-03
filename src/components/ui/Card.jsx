export function Card({ children, style, className, gradient }) {
  return (
    <div
      className={`glass anim-fade-up ${className || ''}`}
      style={{
        padding: '20px',
        ...(gradient ? { background: gradient, border: 'none' } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function StatCard({ label, value, change, changeUp, icon: Icon, gradient, style }) {
  return (
    <div
      className="glass anim-fade-up"
      style={{
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        position: 'relative',
        overflow: 'hidden',
        ...(gradient ? { background: gradient, border: 'none' } : {}),
        ...style,
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 120, height: 120, borderRadius: '50%',
        background: 'rgba(255,255,255,.07)', filter: 'blur(30px)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'rgba(255,255,255,.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {Icon && <Icon size={17} color={gradient ? '#fff' : 'var(--text-primary)'} strokeWidth={1.8} />}
        </div>
        {change !== undefined && (
          <span style={{
            fontSize: 12, fontWeight: 600,
            color: gradient ? 'rgba(255,255,255,.8)' : (changeUp ? 'var(--c-success)' : 'var(--c-danger)'),
          }}>
            {changeUp ? '↑' : '↓'} {change}
          </span>
        )}
      </div>

      <div>
        <div style={{
          fontFamily: 'var(--f-display)', fontSize: 24, fontWeight: 800,
          color: gradient ? '#fff' : 'var(--text-primary)',
          letterSpacing: '-.02em', lineHeight: 1.1,
        }}>
          {value}
        </div>
        <div style={{
          fontSize: 12.5, marginTop: 4,
          color: gradient ? 'rgba(255,255,255,.7)' : 'var(--text-secondary)',
        }}>
          {label}
        </div>
      </div>
    </div>
  )
}

export function ProgressBar({ value = 0, color = 'var(--grad-primary)', label, showPct }) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {(label || showPct) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label && <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{label}</span>}
          {showPct && <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{pct}%</span>}
        </div>
      )}
      <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,.07)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: 99,
          background: color, transition: 'width .7s cubic-bezier(.4,0,.2,1)',
        }} />
      </div>
    </div>
  )
}
