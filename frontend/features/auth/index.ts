import { apiFetch } from '../../lib/api'
import { setAuthSession, clearAuthSession, getCurrentUser } from '../../lib/auth'
import type { User, Role } from '../../types'

export async function loginUser(credentials: { email: string; password: string }) {
  const res = await apiFetch<{ token: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  if (res.success && res.data) {
    setAuthSession(res.data.token, res.data.user)
  }
  return res
}

export async function registerUser(payload: {
  name: string
  email: string
  phone: string
  password: string
  role: Role
}) {
  const res = await apiFetch<{ token: string; user: User }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (res.success && res.data) {
    setAuthSession(res.data.token, res.data.user)
  }
  return res
}

export function logoutUser() {
  clearAuthSession()
}

export { getCurrentUser }
