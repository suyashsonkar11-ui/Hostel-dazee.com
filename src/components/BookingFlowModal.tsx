import React, { useState } from 'react'
import type { Property } from './ExploreListings'
import type { Room, Bed } from './RoomBedSelector'
import type { User } from './Navbar'

interface BookingFlowModalProps {
  selection: {
    property: Property
    room: Room
    bed: Bed
  }
  user: User | null
  onClose: () => void
  onSuccess: (booking: any) => void
  onOpenAuth: () => void
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  selection,
  user,
  onClose,
  onSuccess,
  onOpenAuth,
}) => {
  const { property, room, bed } = selection

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [duration, setDuration] = useState<number>(6)
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    return d.toISOString().slice(0, 10)
  })

  // Step 2 form fields
  const [fullName, setFullName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '+91 98112 33445')
  const [email, setEmail] = useState(user?.email || '')
  const [dob, setDob] = useState('2003-05-15')
  const [emergencyContact, setEmergencyContact] = useState('+91 98220 99887 (Parent)')
  const [idProofType, setIdProofType] = useState('Aadhaar Card')
  const [idProofNumber, setIdProofNumber] = useState('XXXX-XXXX-4589')

  // Booking result & payment state
  const [bookingResult, setBookingResult] = useState<any>(null)
  const [processing, setProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Pricing calculations
  const monthlyRent = Number(room.rent)
  const securityDeposit = monthlyRent // standard 1 month refundable
  const serviceFee = 999
  const totalPayable = monthlyRent + securityDeposit + serviceFee

  const token = localStorage.getItem('dazee-token')

  const handleCreateBooking = async () => {
    if (!user || !token) {
      onOpenAuth()
      return
    }

    setProcessing(true)
    setErrorMsg('')

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyId: property.id,
          roomId: room.id,
          bedId: bed.id,
          duration,
          startDate,
          studentName: fullName,
          studentPhone: phone,
          studentEmail: email,
          dob,
          emergencyContact,
          idProofType,
          idProofNumber,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to create booking')

      setBookingResult(data.data)
      setStep(4) // Move to Payment Step
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error creating booking')
    } finally {
      setProcessing(false)
    }
  }

  const handlePayRazorpay = async () => {
    if (!bookingResult) return
    setProcessing(true)
    setErrorMsg('')

    try {
      // Simulate Razorpay Gateway Verification with backend API
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: bookingResult.id,
          paymentId: `RZP_TXN_${Date.now()}`,
          paymentMethod: 'Razorpay UPI / NetBanking',
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Payment verification failed')

      setBookingResult(data.data.booking)
      setStep(5) // Confirmed!
      onSuccess(data.data.booking)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Payment error')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ×
        </button>

        {/* Multi-step Header */}
        <div className="checkout-steps-bar">
          <div className={`step-indicator ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}>
            <span className="step-number">1</span>
            <span>Room & Stay</span>
          </div>
          <div style={{ color: '#cbd5e1' }}>→</div>
          <div className={`step-indicator ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}>
            <span className="step-number">2</span>
            <span>Personal Info</span>
          </div>
          <div style={{ color: '#cbd5e1' }}>→</div>
          <div className={`step-indicator ${step === 3 ? 'active' : step > 3 ? 'done' : ''}`}>
            <span className="step-number">3</span>
            <span>Summary</span>
          </div>
          <div style={{ color: '#cbd5e1' }}>→</div>
          <div className={`step-indicator ${step >= 4 ? 'active' : ''}`}>
            <span className="step-number">{step === 5 ? '✓' : '4'}</span>
            <span>Payment</span>
          </div>
        </div>

        <div style={{ padding: '1.75rem' }}>
          {errorMsg && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Room & Bed Confirmation */}
          {step === 1 && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <span className="eyebrow">STEP 1 OF 4</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                  Confirm Room & Stay Duration
                </h3>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                  {property.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  📍 {property.address}, {property.city}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-verified">
                    Room {room.roomNumber} ({room.roomType})
                  </span>
                  <span className="badge badge-featured">
                    Selected Bed: {bed.bedNumber}
                  </span>
                  <span className="badge badge-gender">
                    Floor {room.floor}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    MOVE-IN DATE
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="filter-select"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    MINIMUM STAY DURATION
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="filter-select"
                    style={{ width: '100%' }}
                  >
                    <option value={1}>1 Month (Trial / Flexible)</option>
                    <option value={3}>3 Months (Quarterly)</option>
                    <option value={6}>6 Months (Semester standard)</option>
                    <option value={11}>11 Months (Full Academic Year)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button className="btn btn-outline" onClick={onClose}>
                  Cancel
                </button>
                <button className="btn btn-accent" onClick={() => setStep(2)}>
                  Next: Personal Details →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Personal Details */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <span className="eyebrow">STEP 2 OF 4</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                  Resident Profile Details
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Required for rental agreement generation and building security access.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="filter-select"
                    style={{ width: '100%' }}
                    placeholder="e.g. Aarav Mehta"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    PHONE NUMBER *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="filter-select"
                    style={{ width: '100%' }}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="filter-select"
                    style={{ width: '100%' }}
                    placeholder="student@example.com"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    DATE OF BIRTH
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="filter-select"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    EMERGENCY CONTACT
                  </label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="filter-select"
                    style={{ width: '100%' }}
                    placeholder="Parent / Guardian contact"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    GOVERNMENT ID TYPE
                  </label>
                  <select
                    value={idProofType}
                    onChange={(e) => setIdProofType(e.target.value)}
                    className="filter-select"
                    style={{ width: '100%' }}
                  >
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="College Student ID">College Student ID</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    GOVERNMENT ID NUMBER
                  </label>
                  <input
                    type="text"
                    value={idProofNumber}
                    onChange={(e) => setIdProofNumber(e.target.value)}
                    className="filter-select"
                    style={{ width: '100%' }}
                    placeholder="Enter document / ID number"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button
                  className="btn btn-accent"
                  onClick={() => {
                    if (!fullName || !phone || !email) {
                      setErrorMsg('Please fill in your name, phone and email.')
                      return
                    }
                    setStep(3)
                  }}
                >
                  Review Booking →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review Booking & Pricing Breakdown */}
          {step === 3 && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <span className="eyebrow">STEP 3 OF 4</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                  Booking Review & Fare Breakdown
                </h3>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Property:</span>
                  <strong>{property.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Room & Bed:</span>
                  <strong>Room {room.roomNumber} ({room.roomType}) — {bed.bedNumber}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Move-in Date:</span>
                  <strong>{startDate}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Stay Duration:</span>
                  <strong>{duration} Months</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Resident:</span>
                  <strong>{fullName} ({phone})</strong>
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                  <span>1st Month Rent:</span>
                  <span>₹{monthlyRent.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                  <span>Refundable Security Deposit (1 Month):</span>
                  <span>₹{securityDeposit.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem' }}>
                  <span>Platform Verification & Hygiene Kit Fee:</span>
                  <span>₹{serviceFee.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '2px dashed var(--border)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                  <span>Total Payable Now:</span>
                  <span style={{ color: 'var(--accent)' }}>₹{totalPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {!user && (
                <div style={{ background: '#eff6ff', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#1e40af' }}>
                  ℹ️ You will be prompted to log in or register before completing payment.
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button className="btn btn-outline" onClick={() => setStep(2)}>
                  ← Back
                </button>
                <button
                  className="btn btn-accent"
                  disabled={processing}
                  onClick={handleCreateBooking}
                >
                  {processing ? 'Reserving Bed...' : 'Proceed to Payment →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Razorpay Payment Gateway Simulation */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem' }}>
                💳
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                Razorpay Secure Checkout
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Booking Ref: <strong>{bookingResult?.bookingReference}</strong> · Amount: <strong>₹{totalPayable.toLocaleString('en-IN')}</strong>
              </p>

              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', maxWidth: '380px', margin: '0 auto 1.5rem', textAlign: 'left' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.75rem' }}>
                  Supported Payment Methods:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                  <div>⚡ UPI (Google Pay, PhonePe, Paytm, BHIM)</div>
                  <div>🏦 NetBanking (HDFC, ICICI, SBI, Axis)</div>
                  <div>💳 Credit & Debit Cards (Visa, Mastercard, RuPay)</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button
                  className="btn btn-accent"
                  style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}
                  disabled={processing}
                  onClick={handlePayRazorpay}
                >
                  {processing ? 'Verifying with Bank...' : `Pay ₹${totalPayable.toLocaleString('en-IN')} with Razorpay`}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Booking Confirmed Celebration Slip */}
          {step === 5 && bookingResult && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2rem' }}>
                🎉
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                Booking Confirmed!
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Congratulations! Your stay at <strong>{bookingResult.propertyName}</strong> has been secured.
              </p>

              {/* Digital Booking Voucher */}
              <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '2px solid var(--border)', textAlign: 'left', marginBottom: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)' }}>
                    HOSTEL DAZEE CONFIRMATION
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {bookingResult.bookingReference}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Resident:</span><br />
                    <strong>{bookingResult.studentName}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Property:</span><br />
                    <strong>{bookingResult.propertyName}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Room & Bed:</span><br />
                    <strong>Room {bookingResult.roomNumber} ({bookingResult.roomType}) — {bookingResult.bedNumber}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Move-in Date:</span><br />
                    <strong>{bookingResult.startDate}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span><br />
                    <strong style={{ color: 'var(--accent)' }}>₹{bookingResult.amount?.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Status:</span><br />
                    <span className="badge badge-verified">CONFIRMED & OCCUPIED</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button
                  className="btn btn-outline"
                  onClick={() => window.print()}
                >
                  🖨️ Print Confirmation
                </button>
                <button
                  className="btn btn-accent"
                  onClick={() => {
                    onClose()
                    window.history.pushState({}, '', '/student/dashboard')
                    window.dispatchEvent(new PopStateEvent('popstate'))
                  }}
                >
                  Go to Student Dashboard →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
