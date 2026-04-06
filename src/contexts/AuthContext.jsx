import { createContext, useContext, useState, useCallback } from 'react'
import { api } from '@/lib/api'

const Ctx = createContext(null)

export const ROLES = {
  admin_geral:  { label: 'Admin Geral',   pages: ['dashboard','fluxo','servicos','estatisticas','usuarios','relatorios','configuracoes'], canManageServices: true, canManageUsers: true, canViewStats: true },
  admin:        { label: 'Administrador', pages: ['dashboard','fluxo','servicos','estatisticas','relatorios','configuracoes'], canManageServices: true, canManageUsers: false, canViewStats: true },
  funcionario:  { label: 'Funcionário',   pages: ['fluxo','servicos'], canManageServices: false, canManageUsers: false, canViewStats: false },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cg_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.post('/auth/login', { email, password })
      setUser(data.user)
      localStorage.setItem('cg_user',  JSON.stringify(data.user))
      localStorage.setItem('cg_token', data.token)
      return data.user
    } catch (err) {
      setError(err.message || 'Erro ao fazer login')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (nome, email, password, confirmPassword) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.post('/auth/register', { nome, email, password, confirmPassword })
      setUser(data.user)
      localStorage.setItem('cg_user',  JSON.stringify(data.user))
      localStorage.setItem('cg_token', data.token)
      return data.user
    } catch (err) {
      setError(err.message || 'Erro ao registar utilizador')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setError(null)
    localStorage.removeItem('cg_user')
    localStorage.removeItem('cg_token')
  }, [])

  const can    = (perm)  => !!user && (ROLES[user.role]?.[perm] ?? false)
  const access = (page)  => !!user && (ROLES[user.role]?.pages.includes(page) ?? false)

  return <Ctx.Provider value={{ user, login, register, logout, can, access, loading, error }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
