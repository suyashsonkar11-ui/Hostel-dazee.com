import type { User } from '../types'

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('dazee-user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setStoredSession(token: string, user: User) {
  if (typeof window === 'undefined') return
  localStorage.setItem('dazee-token', token)
  localStorage.setItem('dazee-user', JSON.stringify(user))
}

export function clearStoredSession() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('dazee-token')
  localStorage.removeItem('dazee-user')
}

export function hasRole(user: User | null, allowed: string[]): boolean {
  if (!user) return false
  return allowed.includes(user.role)
}
