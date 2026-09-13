export interface IUser {
  name: string
  email: string
  phone?: string
  passwordHash: string
  role: 'student' | 'owner' | 'admin'
  profileImage?: string
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

// Mongoose schema definition for MongoDB Atlas
export const UserSchemaDefinition = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'owner', 'admin'], default: 'student' },
  profileImage: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}
