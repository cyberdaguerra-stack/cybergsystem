import { useEffect } from 'react'
import { X } from 'lucide-react'

export function Modal({ open, onClose, title, children, width = 460 }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape' && open) onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position:'fixed', inset:0, zIndex:1000,
        background:'rgba(0,0,0,.55)', backdropFilter:'blur(6px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:24, animation:'fadeIn .2s ease',
      }}
    >
      <div
        className="glass anim-scale-in"
        style={{ width:'100%', maxWidth:width, boxShadow:'var(--shadow-modal)', overflow:'hidden' }}
      >
        {/* Header */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'20px 24px', borderBottom:'1px solid var(--glass-border)',
        }}>
          <h3 style={{ fontFamily:'var(--f-display)', fontSize:16, fontWeight:700, color:'var(--text-primary)' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              display:'flex', alignItems:'center', justifyContent:'center',
              width:30, height:30, borderRadius:8,
              background:'var(--glass-bg)', border:'1px solid var(--glass-border)',
              cursor:'pointer', color:'var(--text-secondary)', transition:'all .15s',
            }}
          >
            <X size={15} />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding:'24px' }}>{children}</div>
      </div>
    </div>
  )
}
