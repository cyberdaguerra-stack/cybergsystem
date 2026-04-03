import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

const Ctx = createContext(null)

const ICONS = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertCircle,
  info:    Info,
}
const COLORS = {
  success: 'var(--c-success)',
  error:   'var(--c-danger)',
  warning: 'var(--c-warning)',
  info:    'var(--c-info)',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(p => [...p, { id, message, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4200)
  }, [])

  const dismiss = (id) => setToasts(p => p.filter(t => t.id !== id))

  return (
    <Ctx.Provider value={toast}>
      {children}
      {/* Toast container */}
      <div style={{ position:'fixed', bottom:24, right:24, zIndex:9999, display:'flex', flexDirection:'column', gap:10, pointerEvents:'none' }}>
        {toasts.map(t => {
          const Icon = ICONS[t.type] || Info
          const color = COLORS[t.type] || COLORS.info
          return (
            <div key={t.id} className="glass-sm anim-fade-up" style={{
              display:'flex', alignItems:'center', gap:12,
              padding:'13px 16px', minWidth:280, maxWidth:360,
              boxShadow:'var(--shadow-card)', pointerEvents:'all',
              borderLeft:`3px solid ${color}`,
            }}>
              <Icon size={16} style={{ color, flexShrink:0 }} />
              <span style={{ fontSize:13.5, color:'var(--text-primary)', flex:1 }}>{t.message}</span>
              <button onClick={() => dismiss(t.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:2 }}>
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)
