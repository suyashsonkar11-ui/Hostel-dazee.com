export interface IProperty {
  ownerId: string
  name: string
  tagline?: string
  description: string
  propertyType: 'PG' | 'Hostel' | 'Co-living'
  genderType: 'Unisex' | 'Girls only' | 'Boys only'
  location: {
    address: string
    city: string
    state: string
    pincode: string
    landmark?: string
    latitude?: number
    longitude?: number
  }
  images: string[]
  amenities: string[]
  houseRules: string[]
  startingRent: number
  rating: number
  reviewCount: number
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export const PropertySchemaDefinition = {
  ownerId: { type: String, required: true },
  name: { type: String, required: true },
  tagline: { type: String, default: '' },
  description: { type: String, required: true },
  propertyType: { type: String, enum: ['PG', 'Hostel', 'Co-living'], default: 'PG' },
  genderType: { type: String, enum: ['Unisex', 'Girls only', 'Boys only'], default: 'Unisex' },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    landmark: { type: String, default: '' },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  images: [{ type: String }],
  amenities: [{ type: String }],
  houseRules: [{ type: String }],
  startingRent: { type: Number, required: true },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  rejectionReason: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}
