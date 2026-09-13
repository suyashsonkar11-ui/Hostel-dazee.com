export interface IReview {
  propertyId: string
  userId?: string
  userName: string
  userRole?: string
  rating: number
  comment: string
  createdAt: Date
}

export const ReviewSchemaDefinition = {
  propertyId: { type: String, required: true },
  userId: { type: String },
  userName: { type: String, required: true },
  userRole: { type: String, default: 'Student Resident' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}
