export function Table({ children }) {
  return (
    <div style={{ overflowX:'auto', borderRadius:'var(--r-lg)', border:'1px solid var(--glass-border)' }}>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        {children}
      </table>
    </div>
  )
}

export function Thead({ children }) {
  return (
    <thead style={{ background:'var(--glass-bg)', borderBottom:'1px solid var(--glass-border)' }}>
      {children}
    </thead>
  )
}

export function Th({ children, style }) {
  return (
    <th style={{
      padding:'11px 16px', textAlign:'left',
      fontSize:11, fontWeight:600, letterSpacing:'.07em', textTransform:'uppercase',
      color:'var(--text-secondary)', whiteSpace:'nowrap', ...style,
    }}>
      {children}
    </th>
  )
}

export function Td({ children, style }) {
  return (
    <td style={{
      padding:'13px 16px', fontSize:13.5,
      borderBottom:'1px solid var(--glass-border)',
      color:'var(--text-primary)', verticalAlign:'middle', ...style,
    }}>
      {children}
    </td>
  )
}

export function Tr({ children, style }) {
  return (
    <tr
      style={{ transition:'background .15s', ...style }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--glass-bg)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {children}
    </tr>
  )
}
