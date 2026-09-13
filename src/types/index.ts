export type Role = 'student' | 'owner' | 'admin'

export interface PropertyLocation {
  address: string
  city: string
  state: string
  pincode: string
  formattedAddress: string
  latitude: number
  longitude: number
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: Role
  isActive?: boolean
  status?: 'active' | 'suspended' | 'blocked' | 'pending'
  verificationStatus?: 'approved' | 'pending' | 'rejected'
  businessName?: string
  govId?: string
  propertiesCount?: number
  bookingsCount?: number
  rejectionReason?: string
  profileImage?: string
  createdAt?: string
}

export interface Bed {
  id: string
  roomId: string
  bedNumber: string
  status: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'MAINTENANCE'
  occupantName?: string
  reservedUntil?: number
  bookingId?: string
}

export interface Room {
  id: string
  propertyId: string
  roomNumber: string
  floor: number
  roomType: string
  rent: number
  ac: boolean
  sharingCapacity: number
  status?: string
  features?: string[]
  beds?: Bed[]
}

export interface Property {
  id: string
  ownerId?: string
  name: string
  tagline?: string
  description: string
  propertyType: string
  genderType: string
  address: string
  city: string
  state?: string
  pincode?: string
  landmark?: string
  formattedAddress?: string
  latitude?: number
  longitude?: number
  location?: PropertyLocation
  startingRent: number
  rating: number
  reviewCount: number
  status?: 'approved' | 'pending' | 'pending_review' | 'rejected' | 'suspended'
  rejectionReason?: string
  featured?: boolean
  images: string[]
  amenities: string[]
  houseRules?: string[]
  createdAt?: string
  totalRooms?: number
  totalBeds?: number
  availableBeds?: number
  rooms?: Room[]
  reviews?: Review[]
}

export interface Booking {
  id: string
  bookingReference: string
  studentId: string
  studentName: string
  studentPhone?: string
  studentEmail?: string
  propertyId: string
  propertyName: string
  propertyAddress?: string
  roomId: string
  roomNumber: string
  roomType: string
  bedId: string
  bedNumber: string
  startDate: string
  duration: number
  monthlyRent: number
  securityDeposit: number
  serviceFee: number
  amount: number
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED'
  bookingStatus: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED'
  transactionId?: string
  createdAt: string
}

export interface Payment {
  id: string
  bookingId: string
  bookingReference: string
  studentId: string
  studentName: string
  amount: number
  transactionId: string
  paymentMethod: string
  paymentStatus: 'SUCCESS' | 'FAILED' | 'PENDING'
  createdAt: string
}

export interface Review {
  id: string
  propertyId: string
  userName: string
  userRole?: string
  rating: number
  comment: string
  createdAt: string
}
