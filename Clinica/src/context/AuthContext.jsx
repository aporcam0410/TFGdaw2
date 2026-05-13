import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi, setNavigate } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(!!localStorage.getItem('token'))
  const navigate = useNavigate()

  useEffect(() => { setNavigate(navigate) }, [navigate])

  useEffect(() => {
    if (!localStorage.getItem('token')) return
    authApi.me()
      .then(res => setUsuario(res.data))
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
      })
      .finally(() => setLoading(false))
  }, [])

  const persistSession = ({ token, usuario }) => {
    localStorage.setItem('token', token)
    setUsuario(usuario)
  }

  const login = async (email, password) => {
    const res = await authApi.login({ email, password })
    persistSession(res.data)
    return res.data.usuario
  }

  const register = async (data) => {
    const res = await authApi.register(data)
    persistSession(res.data)
    return res.data.usuario
  }

  const logout = async () => {
    try { await authApi.logout() } catch {}
    localStorage.removeItem('token')
    setUsuario(null)
  }

  const updateUsuario = (data) => setUsuario(prev => ({ ...prev, ...data }))

  return (
    <AuthContext.Provider value={{ usuario, loading, login, register, logout, updateUsuario }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
