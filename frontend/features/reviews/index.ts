import { apiFetch } from '../../lib/api'
import type { Review } from '../../types'

export async function submitReview(payload: { propertyId: string; rating: number; comment: string }) {
  return apiFetch<{ review: Review }>('/reviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
