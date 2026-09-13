export interface INotification {
  userId: string
  title: string
  message: string
  type: 'booking' | 'payment' | 'approval' | 'review' | 'system'
  isRead: boolean
  createdAt: Date
}

export const NotificationSchemaDefinition = {
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['booking', 'payment', 'approval', 'review', 'system'], default: 'system' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}
