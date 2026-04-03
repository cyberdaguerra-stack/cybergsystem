const config = {
  green:  { bg:'rgba(52,211,153,.12)',  color:'#34d399', border:'rgba(52,211,153,.25)' },
  red:    { bg:'rgba(251,113,133,.12)', color:'#fb7185', border:'rgba(251,113,133,.25)' },
  blue:   { bg:'rgba(96,165,250,.12)',  color:'#60a5fa', border:'rgba(96,165,250,.25)' },
  purple: { bg:'rgba(167,139,250,.12)', color:'#a78bfa', border:'rgba(167,139,250,.25)' },
  orange: { bg:'rgba(251,191,36,.12)',  color:'#fbbf24', border:'rgba(251,191,36,.25)' },
  gray:   { bg:'rgba(255,255,255,.06)', color:'var(--text-secondary)', border:'var(--glass-border)' },
  cyan:   { bg:'rgba(34,211,238,.12)',  color:'#22d3ee', border:'rgba(34,211,238,.25)' },
}

export function Badge({ variant = 'gray', children, style }) {
  const c = config[variant] || config.gray
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'3px 10px', borderRadius:99,
      fontSize:11.5, fontWeight:600, letterSpacing:'.04em',
      background: c.bg, color: c.color, border:`1px solid ${c.border}`,
      ...style,
    }}>
      {children}
    </span>
  )
}
