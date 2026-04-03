export function Input({ label, error, style, ...props }) {
  const base = {
    width: '100%',
    background: 'var(--glass-bg)',
    border: `1px solid ${error ? 'var(--c-danger)' : 'var(--glass-border)'}`,
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 13.5,
    color: 'var(--text-primary)',
    fontFamily: 'var(--f-body)',
    outline: 'none',
    transition: 'all .18s ease',
    backdropFilter: 'blur(10px)',
  }
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      {label && (
        <label style={{ fontSize:11.5, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color:'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <input
        style={{ ...base, ...style }}
        onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,.15)' }}
        onBlur={e  => { e.target.style.borderColor = error ? 'var(--c-danger)' : 'var(--glass-border)'; e.target.style.boxShadow = 'none' }}
        {...props}
      />
      {error && <span style={{ fontSize:12, color:'var(--c-danger)' }}>{error}</span>}
    </div>
  )
}

export function Select({ label, children, style, ...props }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      {label && (
        <label style={{ fontSize:11.5, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color:'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <select
        style={{
          width:'100%', background:'var(--glass-bg)', border:'1px solid var(--glass-border)',
          borderRadius:10, padding:'10px 14px', fontSize:13.5,
          color:'var(--text-primary)', fontFamily:'var(--f-body)',
          outline:'none', cursor:'pointer', backdropFilter:'blur(10px)',
          ...style,
        }}
        onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,.15)' }}
        onBlur={e  => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.boxShadow = 'none' }}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}
