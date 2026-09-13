// Centralized API client for Hostel Dazee
export const API_BASE = '/api'

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<{ success: boolean; data?: T; message?: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('dazee-token') : null
  const headers = new Headers(options?.headers || {})
  headers.set('Content-Type', 'application/json')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    })
    return await res.json()
  } catch (err: any) {
    console.error('API Error:', err)
    return { success: false, message: err?.message || 'Network error' }
  }
}
