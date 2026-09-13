import { apiFetch } from '../../lib/api'
import type { Property } from '../../types'

export async function fetchProperties(params?: { city?: string; type?: string; gender?: string; maxRent?: number }) {
  const query = new URLSearchParams()
  if (params?.city && params.city !== 'All') query.set('city', params.city)
  if (params?.type && params.type !== 'All') query.set('type', params.type)
  if (params?.gender && params.gender !== 'All') query.set('gender', params.gender)
  if (params?.maxRent) query.set('maxRent', String(params.maxRent))

  const qs = query.toString() ? `?${query.toString()}` : ''
  return apiFetch<Property[]>(`/properties${qs}`)
}

export async function fetchPropertyById(id: string) {
  return apiFetch<Property>(`/properties/${id}`)
}
