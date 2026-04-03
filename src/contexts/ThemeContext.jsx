import { createContext, useContext, useState, useEffect } from 'react'

const Ctx = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('cg_theme') || 'dark')

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark',  theme === 'dark')
    root.classList.toggle('light', theme === 'light')
    localStorage.setItem('cg_theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark')
  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>
}

export const useTheme = () => useContext(Ctx)
