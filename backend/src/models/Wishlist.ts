export interface IWishlist {
  userId: string
  propertyId: string
  createdAt: Date
}

export const WishlistSchemaDefinition = {
  userId: { type: String, required: true },
  propertyId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}
