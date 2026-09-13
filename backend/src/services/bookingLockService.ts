export class BookingLockService {
  private static locks: Map<string, { userId: string; expiresAt: number }> = new Map()

  /**
   * Attempts to reserve a bed for 15 minutes
   */
  static acquireLock(bedId: string, userId: string, ttlMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now()
    const existing = this.locks.get(bedId)

    if (existing && existing.expiresAt > now && existing.userId !== userId) {
      // Bed is locked by another user!
      return false
    }

    this.locks.set(bedId, {
      userId,
      expiresAt: now + ttlMs,
    })
    return true
  }

  /**
   * Release lock upon cancellation or completion
   */
  static releaseLock(bedId: string, userId?: string): void {
    const existing = this.locks.get(bedId)
    if (existing) {
      if (!userId || existing.userId === userId) {
        this.locks.delete(bedId)
      }
    }
  }

  /**
   * Checks if a bed is currently locked
   */
  static isLocked(bedId: string): boolean {
    const existing = this.locks.get(bedId)
    if (!existing) return false
    if (Date.now() > existing.expiresAt) {
      this.locks.delete(bedId)
      return false
    }
    return true
  }
}
