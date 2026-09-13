import { apiFetch } from '../../lib/api'
import type { Booking } from '../../types'

export interface CreateBookingPayload {
  propertyId: string
  roomId: string
  bedId: string
  startDate: string
  duration: number
  studentName?: string
  studentPhone?: string
  studentEmail?: string
}

export async function createBooking(payload: CreateBookingPayload) {
  return apiFetch<{ booking: Booking }>('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function fetchUserBookings() {
  return apiFetch<Booking[]>('/bookings/my')
}
