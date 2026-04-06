import { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar.jsx'
import { Topbar } from './Topbar.jsx'
import { BottomNav } from './BottomNav.jsx'

export function AppShell({ title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fechar sidebar ao redimensionar para desktop
  useEffect(() => {
    if (!isMobile) setSidebarOpen(false)
  }, [isMobile])

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative', zIndex: 1, flexDirection: 'column' }}>
      <Topbar title={title} onMenuClick={() => setSidebarOpen(!sidebarOpen)} isMobile={isMobile} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={isMobile} />
        <main style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: 'clamp(16px, 5vw, 28px)', 
          paddingBottom: isMobile ? 'calc(clamp(16px, 5vw, 28px) + 90px)' : 'clamp(16px, 5vw, 28px)',
          WebkitOverflowScrolling: 'touch' 
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
      {isMobile && <BottomNav />}
    </div>
  )
}
