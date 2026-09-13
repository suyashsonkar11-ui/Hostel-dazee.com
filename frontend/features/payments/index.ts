import { apiFetch } from '../../lib/api'
import type { Payment } from '../../types'

export interface CreateOrderPayload {
  bookingId: string
  amount: number
}

export async function createPaymentOrder(payload: CreateOrderPayload) {
  return apiFetch<{ order: any; razorpayKeyId: string }>('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function verifyPayment(payload: {
  bookingId: string
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}) {
  return apiFetch<{ payment: Payment }>('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
