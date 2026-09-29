const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('dazee-token') : null
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || `Request failed with status ${response.status}`)
  return data.data !== undefined ? data.data : data
}
