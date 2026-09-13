export interface IRoom {
  propertyId: string
  roomNumber: string
  floor: number
  roomType: 'Single Sharing' | 'Double Sharing' | 'Triple Sharing' | 'Four Sharing'
  rent: number
  securityDeposit?: number
  ac: boolean
  sharingCapacity: number
  features: string[]
  createdAt: Date
}

export const RoomSchemaDefinition = {
  propertyId: { type: String, required: true },
  roomNumber: { type: String, required: true },
  floor: { type: Number, default: 1 },
  roomType: { type: String, required: true },
  rent: { type: Number, required: true },
  securityDeposit: { type: Number },
  ac: { type: Boolean, default: true },
  sharingCapacity: { type: Number, required: true },
  features: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
}
