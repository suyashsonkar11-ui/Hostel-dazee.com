import React, { useState } from 'react'
import type { Property, Room, Bed, User } from '../../types'
import { formatINR } from '../../lib/utils'

interface BookingPageProps {
  property?: Property
  room?: Room
  bed?: Bed
  user: User | null
  onNavigateHome: () => void
  onOpenAuth: (mode: 'login' | 'signup') => void
  onViewBookings?: () => void
}

export const BookingPage: React.FC<BookingPageProps> = ({
  property: propProp,
  room: propRoom,
  bed: propBed,
  user,
  onNavigateHome,
  onOpenAuth,
  onViewBookings,
}) => {
  // Fallback demo selection if accessed directly
  const property: Property = propProp || {
    id: 'prop-1',
    name: 'Hostel Dazee Premium Living',
    tagline: 'Curated student co-living with premium vibes',
    description: 'Premier student co-living in Bengaluru with meals and Wi-Fi.',
    propertyType: 'Co-living',
    genderType: 'Unisex',
    address: '4th Block, 80 Feet Road, Koramangala',
    city: 'Bengaluru',
    startingRent: 8999,
    rating: 4.8,
    reviewCount: 46,
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=85'],
    amenities: ['High-Speed Wi-Fi', 'Daily Fresh Meals', 'Air Conditioning'],
  }

  const room: Room = propRoom || {
    id: 'room-101',
    propertyId: property.id,
    roomNumber: '101',
    floor: 1,
    roomType: 'Double Sharing AC',
    rent: 8999,
    ac: true,
    sharingCapacity: 2,
  }

  const bed: Bed = propBed || {
    id: 'bed-1',
    roomId: room.id,
    bedNumber: 'Bed A',
    status: 'AVAILABLE',
  }

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [duration, setDuration] = useState<number>(6)
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    return d.toISOString().slice(0, 10)
  })

  // Student details
  const [fullName, setFullName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '+91 98112 33445')
  const [email, setEmail] = useState(user?.email || '')
  const [collegeName, setCollegeName] = useState('Christ University, Central Campus')
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98220 99887 (Father)')
  const [idType, setIdType] = useState('Aadhaar Card')
  const [idNumber, setIdNumber] = useState('XXXX-XXXX-4589')

  // Payment & Result
  const [processing, setProcessing] = useState(false)
  const [bookingResult, setBookingResult] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const monthlyRent = Number(room.rent)
  const securityDeposit = monthlyRent
  const serviceFee = 999
  const totalAmount = monthlyRent + securityDeposit + serviceFee

  const token = typeof window !== 'undefined' ? localStorage.getItem('dazee-token') : null

  const handleConfirmAndPay = async () => {
    if (!user || !token) {
      onOpenAuth('login')
      return
    }

    setProcessing(true)
    setErrorMessage('')

    try {
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyId: property.id,
          roomId: room.id,
          bedId: bed.id,
          startDate,
          duration,
          studentName: fullName || user.name,
          studentPhone: phone,
          studentEmail: email || user.email,
        }),
      })

      const bookingData = await bookingRes.json()

      if (!bookingData.success) {
        throw new Error(bookingData.message || 'Failed to lock bed reservation')
      }

      // Simulate payment verification
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: bookingData.data.booking.id,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_order_id: `order_mock_${Date.now()}`,
          razorpay_signature: 'valid_mock_signature_hash',
        }),
      })

      const verifyData = await verifyRes.json()
      if (verifyData.success) {
        setBookingResult({
          ...bookingData.data.booking,
          payment: verifyData.data.payment,
        })
        setStep(4)
      } else {
        throw new Error('Payment processing could not be completed')
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Booking encountered an error')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div style={{ padding: '3rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        {/* Progress Header */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            Instant Anti-Double Booking Checkout
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)' }}>
            Reserve Your Stay at {property.name}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Selected: <strong>Room {room.roomNumber}</strong> ({room.roomType}) · <strong>{bed.bedNumber}</strong>
          </p>

          {/* Stepper Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            {[
              { num: 1, label: 'Dates & Term' },
              { num: 2, label: 'Student KYC' },
              { num: 3, label: 'Fare & Pay' },
              { num: 4, label: 'Voucher' },
            ].map((s) => (
              <div
                key={s.num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '999px',
                  background: step === s.num ? 'var(--accent)' : step > s.num ? '#10b981' : '#e2e8f0',
                  color: step >= s.num ? '#ffffff' : '#64748b',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <span>{step > s.num ? '✓' : s.num}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            ⚠️ {errorMessage}
          </div>
        )}

        {/* STEP 1: Dates & Duration */}
        {step === 1 && (
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2.5rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem' }}>
              Step 1: Move-in Date & Stay Duration
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  Target Move-in Date
                </label>
                <input
                  type="date"
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  Stay Tenure / Commitment
                </label>
                <select
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                >
                  <option value={1}>1 Month (Flexible Trial)</option>
                  <option value={3}>3 Months (Quarterly Semester)</option>
                  <option value={6}>6 Months (Semester Package)</option>
                  <option value={11}>11 Months (Full Academic Year)</option>
                </select>
              </div>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', border: '1px solid var(--border)', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                💡 <strong>Peace-of-mind guarantee:</strong> Your selected bed is tentatively held exclusively for you during this session.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-outline" onClick={onNavigateHome}>
                Cancel
              </button>
              <button className="btn btn-accent" onClick={() => setStep(2)}>
                Continue to Student KYC →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Student Details */}
        {step === 2 && (
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2.5rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem' }}>
              Step 2: Student Identification & Emergency Contact
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.4rem' }}>
                  Full Name (as per Govt ID)
                </label>
                <input
                  type="text"
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={fullName}
                  placeholder="e.g. Suyash Sharma"
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.4rem' }}>
                  WhatsApp Mobile Number
                </label>
                <input
                  type="tel"
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.4rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={email}
                  placeholder="student@university.edu"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.4rem' }}>
                  University / College / Employer
                </label>
                <input
                  type="text"
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.4rem' }}>
                  Emergency Contact (Guardian/Parent)
                </label>
                <input
                  type="text"
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.4rem' }}>
                  Govt ID Proof Type & Number
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    className="filter-select"
                    style={{ width: '130px' }}
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                  >
                    <option>Aadhaar</option>
                    <option>Passport</option>
                    <option>Voter ID</option>
                  </select>
                  <input
                    type="text"
                    className="filter-select"
                    style={{ flex: 1 }}
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-outline" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button className="btn btn-accent" onClick={() => setStep(3)}>
                Review Breakdown & Fare →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Breakdown & Razorpay Simulation */}
        {step === 3 && (
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2.5rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem' }}>
              Step 3: Rent Summary & Payment
            </h3>

            {/* Itemized Fare Card */}
            <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                <span style={{ color: '#475569' }}>First Month Rent ({room.roomType}):</span>
                <strong style={{ color: 'var(--primary)' }}>{formatINR(monthlyRent)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                <span style={{ color: '#475569' }}>Security Deposit (100% Refundable):</span>
                <strong style={{ color: 'var(--primary)' }}>{formatINR(securityDeposit)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                <span style={{ color: '#475569' }}>Hostel Dazee Platform & Verification Fee:</span>
                <strong style={{ color: 'var(--primary)' }}>{formatINR(serviceFee)}</strong>
              </div>
              <div style={{ borderTop: '2px dashed var(--border)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>Total Due Now:</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Includes 18% GST on platform services</div>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--accent)' }}>
                  {formatINR(totalAmount)}
                </div>
              </div>
            </div>

            {/* Payment Mode Selection */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>
                PAYMENT GATEWAY (RAZORPAY SECURED)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {['UPI / GPay / PhonePe', 'Credit / Debit Card', 'Net Banking'].map((mode, idx) => (
                  <div
                    key={mode}
                    style={{
                      border: idx === 0 ? '2px solid var(--accent)' : '1px solid var(--border)',
                      background: idx === 0 ? 'rgba(16, 185, 129, 0.05)' : '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem',
                      textAlign: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {idx === 0 ? '⚡ ' : '💳 '}
                    {mode}
                  </div>
                ))}
              </div>
            </div>

            {!user && (
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                ℹ️ You need to be logged in to confirm this reservation. Clicking pay will ask you to quickly sign in.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-outline" onClick={() => setStep(2)}>
                ← Back
              </button>
              <button
                className="btn btn-accent"
                onClick={handleConfirmAndPay}
                disabled={processing}
                style={{ padding: '0.85rem 2rem' }}
              >
                {processing ? 'Locking Bed & Authorizing...' : `Pay ${formatINR(totalAmount)} & Confirm Bed →`}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Confirmed Digital Voucher */}
        {step === 4 && bookingResult && (
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '3rem 2.5rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent)', fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              ✓
            </div>

            <span className="badge badge-verified" style={{ marginBottom: '0.75rem', fontSize: '0.85rem' }}>
              RESERVATION CONFIRMED
            </span>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Welcome to Your New Home!
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Your bed has been securely locked and assigned. A confirmation copy has been sent to your email.
            </p>

            {/* Voucher Card */}
            <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '1.75rem', textAlign: 'left', maxWidth: '520px', margin: '0 auto 2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>VOUCHER REFERENCE</div>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--accent)' }}>{bookingResult.bookingReference}</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>STATUS</div>
                  <strong style={{ color: '#059669' }}>CONFIRMED</strong>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ACCOMMODATION</div>
                  <strong>{bookingResult.propertyName || property.name}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ROOM & BED</div>
                  <strong>Room {bookingResult.roomNumber || room.roomNumber} · {bookingResult.bedNumber || bed.bedNumber}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MOVE-IN DATE</div>
                  <strong>{bookingResult.startDate || startDate}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TENURE</div>
                  <strong>{bookingResult.duration || duration} Months</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>RESIDENT NAME</div>
                  <strong>{bookingResult.studentName || fullName}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AMOUNT PAID</div>
                  <strong style={{ color: 'var(--accent)' }}>{formatINR(bookingResult.amount || totalAmount)}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button className="btn btn-outline" onClick={onNavigateHome}>
                Back to Stays Home
              </button>
              {onViewBookings ? (
                <button className="btn btn-accent" onClick={onViewBookings}>
                  Open Student Dashboard →
                </button>
              ) : (
                <a href="/dashboard/student" className="btn btn-accent">
                  Open Student Dashboard →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
