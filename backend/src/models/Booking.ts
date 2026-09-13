export interface IBooking {
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
  createdAt: Date
}

export const BookingSchemaDefinition = {
  bookingReference: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentPhone: { type: String },
  studentEmail: { type: String },
  propertyId: { type: String, required: true },
  propertyName: { type: String, required: true },
  propertyAddress: { type: String },
  roomId: { type: String, required: true },
  roomNumber: { type: String, required: true },
  roomType: { type: String, required: true },
  bedId: { type: String, required: true },
  bedNumber: { type: String, required: true },
  startDate: { type: String, required: true },
  duration: { type: Number, required: true },
  monthlyRent: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  serviceFee: { type: Number, required: true },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
  bookingStatus: { type: String, enum: ['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED'], default: 'PENDING' },
  transactionId: { type: String },
  createdAt: { type: Date, default: Date.now },
}
