import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { AppShell } from '@/components/layout/AppShell'

import Landing       from '@/pages/Landing'
import Login         from '@/pages/Login'
import Dashboard     from '@/pages/dashboard/index'
import FluxoCaixa    from '@/pages/fluxo/index'
import Servicos      from '@/pages/servicos/index'
import Estatisticas  from '@/pages/estatisticas/index'
import Usuarios      from '@/pages/usuarios/index'
import Relatorios    from '@/pages/relatorios/index'
import Configuracoes from '@/pages/configuracoes/index'

const TITLES = {
  '/dashboard':     'Dashboard',
  '/fluxo':         'Fluxo de Caixa',
  '/servicos':      'Serviços',
  '/estatisticas':  'Estatísticas',
  '/usuarios':      'Utilizadores',
  '/relatorios':    'Relatórios',
  '/configuracoes': 'Configurações',
}

function Protected({ page, children }) {
  const { user, access } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (page && !access(page)) return <Navigate to="/dashboard" replace />
  return children
}

function Layout({ page, children }) {
  const location = useLocation()
  return (
    <Protected page={page}>
      <AppShell title={TITLES[location.pathname] || ''}>
        {children}
      </AppShell>
    </Protected>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"              element={<Landing />} />
      <Route path="/login"         element={<Login />} />
      <Route path="/dashboard"     element={<Layout page="dashboard"><Dashboard /></Layout>} />
      <Route path="/fluxo"         element={<Layout page="fluxo"><FluxoCaixa /></Layout>} />
      <Route path="/servicos"      element={<Layout page="servicos"><Servicos /></Layout>} />
      <Route path="/estatisticas"  element={<Layout page="estatisticas"><Estatisticas /></Layout>} />
      <Route path="/usuarios"      element={<Layout page="usuarios"><Usuarios /></Layout>} />
      <Route path="/relatorios"    element={<Layout page="relatorios"><Relatorios /></Layout>} />
      <Route path="/configuracoes" element={<Layout page="configuracoes"><Configuracoes /></Layout>} />
      <Route path="*"              element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
