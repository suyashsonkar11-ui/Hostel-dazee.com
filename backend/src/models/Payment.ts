export interface IPayment {
  bookingId: string
  bookingReference: string
  studentId: string
  studentName: string
  amount: number
  transactionId: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  paymentMethod: string
  paymentStatus: 'SUCCESS' | 'FAILED' | 'PENDING'
  createdAt: Date
}

export const PaymentSchemaDefinition = {
  bookingId: { type: String, required: true },
  bookingReference: { type: String, required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  amount: { type: Number, required: true },
  transactionId: { type: String, required: true },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  paymentMethod: { type: String, default: 'Razorpay UPI' },
  paymentStatus: { type: String, enum: ['SUCCESS', 'FAILED', 'PENDING'], default: 'SUCCESS' },
  createdAt: { type: Date, default: Date.now },
}
