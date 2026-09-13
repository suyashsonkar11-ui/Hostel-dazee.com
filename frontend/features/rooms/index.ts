import { apiFetch } from '../../lib/api'
import type { Room } from '../../types'

export async function fetchPropertyRooms(propertyId: string) {
  return apiFetch<Room[]>(`/rooms?propertyId=${propertyId}`)
}
