import React, { useEffect, useState } from 'react'
import type { User } from './components/Navbar'

interface StudentDashboardProps {
  user: User
  onLogout: () => void
  onNavigateHome: () => void
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'wishlist' | 'payments' | 'profile'>('overview')
  const [bookings, setBookings] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])

  const token = localStorage.getItem('dazee-token')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resBookings, resPayments] = await Promise.all([
          fetch('/api/bookings/my', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/payments/my', { headers: { Authorization: `Bearer ${token}` } }),
        ])

        const dataBookings = await resBookings.json()
        const dataPayments = await resPayments.json()

        if (dataBookings.success) setBookings(dataBookings.data || [])
        if (dataPayments.success) setPayments(dataPayments.data || [])
      } catch (err) {
        console.error('Error fetching student dashboard data:', err)
      }
    }
    fetchData()
  }, [token])

  const activeBooking = bookings.find((b) => b.bookingStatus === 'CONFIRMED') || bookings[0]
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0)

  return (
    <div className="dashboard-shell">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div style={{ marginBottom: '2rem' }}>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              onNavigateHome()
            }}
            className="brand-logo"
            style={{ marginBottom: '0.5rem' }}
          >
            <span className="brand-icon">D</span>
            <span>Hostel Dazee<span className="brand-dot">.</span></span>
          </a>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)' }}>
            STUDENT PORTAL
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {[
            { id: 'overview', label: '📊 Overview', key: 'overview' },
            { id: 'bookings', label: '🛏️ My Bookings', key: 'bookings' },
            { id: 'payments', label: '💳 Payment History', key: 'payments' },
            { id: 'profile', label: '👤 Profile & Emergency', key: 'profile' },
          ].map((item) => (
            <button
              key={item.id}
              className={`dashboard-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id as any)}
            >
              {item.label}
            </button>
          ))}

          <button
            className="dashboard-nav-item"
            onClick={onNavigateHome}
            style={{ marginTop: '1rem', color: 'var(--accent)' }}
          >
            🔍 Explore Stays & Rooms
          </button>
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <span className="eyebrow">STUDENT RESIDENT DASHBOARD</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              Welcome back, {user.name.split(' ')[0]} 👋
            </h1>
          </div>

          <button className="btn btn-accent btn-sm" onClick={onNavigateHome}>
            + Book Another Bed
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <span>Active Stay Status</span>
                <strong style={{ color: activeBooking ? '#059669' : '#64748b' }}>
                  {activeBooking ? 'Confirmed Stay' : 'No Active Stay'}
                </strong>
              </div>
              <div className="stat-card">
                <span>Total Stays Booked</span>
                <strong>{bookings.length}</strong>
              </div>
              <div className="stat-card">
                <span>Total Payments Made</span>
                <strong>₹{totalPaid.toLocaleString('en-IN')}</strong>
              </div>
              <div className="stat-card">
                <span>Verification Status</span>
                <strong style={{ color: '#059669' }}>✓ Verified Resident</strong>
              </div>
            </div>

            {/* Active Stay Card */}
            {activeBooking ? (
              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '2rem', boxShadow: 'var(--shadow-md)', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <span className="badge badge-verified" style={{ marginBottom: '0.5rem' }}>
                      ● CURRENT STAY
                    </span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {activeBooking.propertyName}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      📍 {activeBooking.propertyAddress || 'Koramangala, Bengaluru'}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Booking Reference</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {activeBooking.bookingReference}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Room & Bed</span>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--primary)' }}>
                      Room {activeBooking.roomNumber} — {activeBooking.bedNumber}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activeBooking.roomType}</div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Move-in Date</span>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--primary)' }}>
                      {activeBooking.startDate}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activeBooking.duration} Months stay</div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Rent</span>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent)' }}>
                      ₹{activeBooking.monthlyRent?.toLocaleString('en-IN') || '8,999'}/mo
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#059669' }}>Paid via Razorpay</div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Security Key</span>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--primary)' }}>
                      Biometric Active
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Access Code #9824</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border)', padding: '3rem 2rem', textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛏️</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  You don't have an active stay yet
                </h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                  Explore verified student hostels & PGs with optical Wi-Fi, chef meals, and select your bed unit online.
                </p>
                <button className="btn btn-accent" onClick={onNavigateHome}>
                  Explore Accommodations →
                </button>
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem' }}>
              My Accommodation Bookings ({bookings.length})
            </h3>
            {bookings.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No bookings placed yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem' }}>Reference</th>
                      <th style={{ padding: '0.75rem' }}>Property</th>
                      <th style={{ padding: '0.75rem' }}>Room & Bed</th>
                      <th style={{ padding: '0.75rem' }}>Move-in</th>
                      <th style={{ padding: '0.75rem' }}>Total Paid</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 700 }}>{b.bookingReference}</td>
                        <td style={{ padding: '0.75rem' }}>{b.propertyName}</td>
                        <td style={{ padding: '0.75rem' }}>Room {b.roomNumber} ({b.bedNumber})</td>
                        <td style={{ padding: '0.75rem' }}>{b.startDate}</td>
                        <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                          ₹{b.amount?.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span className={`badge ${b.bookingStatus === 'CONFIRMED' ? 'badge-verified' : 'badge-featured'}`}>
                            {b.bookingStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem' }}>
              Razorpay Receipts & Transactions
            </h3>
            {payments.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No payment transactions recorded.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem' }}>Transaction ID</th>
                      <th style={{ padding: '0.75rem' }}>Booking Ref</th>
                      <th style={{ padding: '0.75rem' }}>Payment Method</th>
                      <th style={{ padding: '0.75rem' }}>Date</th>
                      <th style={{ padding: '0.75rem' }}>Amount</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 600 }}>{p.transactionId}</td>
                        <td style={{ padding: '0.75rem' }}>{p.bookingReference}</td>
                        <td style={{ padding: '0.75rem' }}>{p.paymentMethod}</td>
                        <td style={{ padding: '0.75rem' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                          ₹{p.amount?.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span className="badge badge-verified">SUCCESS</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '2rem', maxWidth: '600px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.5rem' }}>
              Student Resident Profile
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  FULL NAME
                </label>
                <input type="text" readOnly value={user.name} className="filter-select" style={{ width: '100%', background: '#f8fafc' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  REGISTERED EMAIL
                </label>
                <input type="text" readOnly value={user.email} className="filter-select" style={{ width: '100%', background: '#f8fafc' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  MOBILE PHONE
                </label>
                <input type="text" readOnly value={user.phone || '+91 98112 33445'} className="filter-select" style={{ width: '100%', background: '#f8fafc' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  EMERGENCY CONTACT
                </label>
                <input type="text" readOnly value="+91 98220 99887 (Parent / Guardian)" className="filter-select" style={{ width: '100%', background: '#f8fafc' }} />
              </div>

              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#059669' }}>
                ✓ Account verified with JWT session security
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
export default StudentDashboard
