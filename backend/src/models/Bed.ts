export interface IBed {
  roomId: string
  bedNumber: string
  status: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED'
  occupantName?: string
  reservedBy?: string
  reservedUntil?: number
  bookingId?: string
}

export const BedSchemaDefinition = {
  roomId: { type: String, required: true },
  bedNumber: { type: String, required: true },
  status: { type: String, enum: ['AVAILABLE', 'RESERVED', 'OCCUPIED'], default: 'AVAILABLE' },
  occupantName: { type: String },
  reservedBy: { type: String },
  reservedUntil: { type: Number },
  bookingId: { type: String },
}
