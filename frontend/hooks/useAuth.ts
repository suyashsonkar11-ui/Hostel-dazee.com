import { useState, useEffect } from 'react'
import type { User } from '../types'
import { getCurrentUser, setAuthSession, clearAuthSession } from '../lib/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(getCurrentUser())
    setLoading(false)
  }, [])

  const login = (token: string, userData: User) => {
    setAuthSession(token, userData)
    setUser(userData)
  }

  const logout = () => {
    clearAuthSession()
    setUser(null)
  }

  return { user, loading, login, logout }
}
