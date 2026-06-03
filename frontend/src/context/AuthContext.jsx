import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.defaults.withCredentials = true

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('shrtnr_user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await axios.post('/user/login', { email, password })
    setUser(res.data.user)
    localStorage.setItem('shrtnr_user', JSON.stringify(res.data.user))
    return res.data
  }

  const signup = async (name, email, password) => {
    const res = await axios.post('/user', { name, email, password })
    setUser(res.data.user)
    localStorage.setItem('shrtnr_user', JSON.stringify(res.data.user))
    return res.data
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('shrtnr_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)