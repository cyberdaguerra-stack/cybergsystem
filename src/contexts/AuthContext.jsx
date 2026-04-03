import { createContext, useContext, useState, useCallback } from 'react'
import { api } from '@/lib/api'

const Ctx = createContext(null)

export const ROLES = {
  admin_geral:  { label: 'Admin Geral',   pages: ['dashboard','fluxo','servicos','estatisticas','usuarios','relatorios','configuracoes'], canManageServices: true, canManageUsers: true, canViewStats: true },
  admin:        { label: 'Administrador', pages: ['dashboard','fluxo','servicos','estatisticas','relatorios','configuracoes'],            canManageServices: true, canManageUsers: false, canViewStats: true },
  funcionario:  { label: 'Funcionário',   pages: ['dashboard','fluxo','servicos'],                                                        canManageServices: false, canManageUsers: false, canViewStats: false },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cg_user')) } catch { return null }
  })

  const login = useCallback(async (email, password) => {
    const data = await api.post('/auth/login', { email, password })
    setUser(data.user)
    localStorage.setItem('cg_user',  JSON.stringify(data.user))
    localStorage.setItem('cg_token', data.token)
    return data.user
  }, [])

  const quickLogin = useCallback((role) => {
    const demos = {
      admin_geral: { id: 1, nome: 'Carlos Mendes',       email: 'carlos@cyberg.ao',  role: 'admin_geral' },
      admin:       { id: 2, nome: 'João Administrador',  email: 'joao@cyberg.ao',    role: 'admin'       },
      funcionario: { id: 3, nome: 'Maria Funcionária',   email: 'maria@cyberg.ao',   role: 'funcionario' },
    }
    const u = demos[role]
    setUser(u)
    localStorage.setItem('cg_user',  JSON.stringify(u))
    localStorage.setItem('cg_token', `demo_${role}`)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('cg_user')
    localStorage.removeItem('cg_token')
  }, [])

  const can    = (perm)  => !!user && (ROLES[user.role]?.[perm] ?? false)
  const access = (page)  => !!user && (ROLES[user.role]?.pages.includes(page) ?? false)

  return <Ctx.Provider value={{ user, login, quickLogin, logout, can, access }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
