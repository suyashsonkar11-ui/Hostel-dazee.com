import { useEffect, useState } from 'react'
import type { User } from '../types'
import { getStoredUser, setStoredSession, clearStoredSession } from '../lib/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => getStoredUser())

  useEffect(() => {
    setUser(getStoredUser())
  }, [])

  const login = (token: string, newUser: User) => {
    setStoredSession(token, newUser)
    setUser(newUser)
  }

  const logout = () => {
    clearStoredSession()
    setUser(null)
  }

  return { user, login, logout }
}
