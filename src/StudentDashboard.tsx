import React, { useEffect, useMemo, useState } from 'react'
import type { User } from './components/Navbar'

interface StudentDashboardProps {
  user: User
  onLogout: () => void
  onNavigateHome: () => void
  onNavigateExplore?: () => void
}

type Tab = 'explore' | 'offers' | 'bookings' | 'wishlist' | 'payments' | 'settings'

const money = (value = 0) => `₹${Number(value).toLocaleString('en-IN')}`

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  onLogout,
  onNavigateHome,
  onNavigateExplore,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('explore')
  const [bookings, setBookings] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('All')

  const token = localStorage.getItem('dazee-token')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resBookings, resPayments, resProperties] = await Promise.all([
          fetch('/api/bookings/my', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/payments/my', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/properties'),
        ])
        const [dataBookings, dataPayments, dataProperties] = await Promise.all([
          resBookings.json(),
          resPayments.json(),
          resProperties.json(),
        ])
        if (dataBookings.success) setBookings(dataBookings.data || [])
        if (dataPayments.success) setPayments(dataPayments.data || [])
        if (dataProperties.success) setProperties(dataProperties.data || [])
      } catch (err) {
        console.error('Student portal load failed:', err)
      }
    }
    fetchData()
  }, [token])

  const activeBooking = bookings.find((b) => b.bookingStatus === 'CONFIRMED')
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const cities = useMemo(() => ['All', ...Array.from(new Set(properties.map((p) => p.city).filter(Boolean)))], [properties])
  const filteredProperties = useMemo(() => {
    const q = search.trim().toLowerCase()
    return properties.filter((p) => {
      const matchesCity = city === 'All' || p.city === city
      const haystack = `${p.name || ''} ${p.city || ''} ${p.address || ''} ${p.propertyType || ''}`.toLowerCase()
      return matchesCity && (!q || haystack.includes(q))
    })
  }, [properties, search, city])

  const nav = [
    { id: 'explore', icon: '⌕', label: 'Explore Rooms' },
    { id: 'offers', icon: '✦', label: 'Offers & Deals' },
    { id: 'bookings', icon: '▣', label: 'My Bookings' },
    { id: 'wishlist', icon: '♡', label: 'Wishlist' },
    { id: 'payments', icon: '₹', label: 'Payments' },
  ] as const

  const openProperty = (property: any) => {
    window.history.pushState({}, '', `/properties/${property.id}`)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <div className="dashboard-shell student-app-shell">
      <aside className="dashboard-sidebar student-app-sidebar">
        <div className="student-brand-block">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              onNavigateHome()
            }}
            className="brand-logo"
          >
            <span className="brand-icon">D</span>
            <span>Hostel Dazee<span className="brand-dot">.</span></span>
          </a>
          <div className="student-portal-label">STUDENT APP</div>
        </div>

        <div className="student-sidebar-search">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setActiveTab('explore')
            }}
            placeholder="Search rooms, PGs..."
          />
        </div>

        <nav className="student-app-nav">
          {nav.map((item) => (
            <button
              key={item.id}
              className={`dashboard-nav-item student-app-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="student-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="student-sidebar-bottom">
          <button
            className={`dashboard-nav-item student-app-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="student-nav-icon">⚙</span>
            <span>Settings</span>
          </button>

          <div className="student-user-card">
            <div className="student-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div className="student-user-copy">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
            <button aria-label="Sign out" className="student-logout-icon" onClick={onLogout}>↪</button>
          </div>
        </div>
      </aside>

      <main className="dashboard-main student-app-main">
        <header className="student-app-header">
          <div>
            <span className="eyebrow">HOSTEL DAZEE • STUDENT</span>
            <h1>
              {activeTab === 'explore' ? `Find your next stay, ${user.name.split(' ')[0]}.` :
               activeTab === 'offers' ? 'Offers made for students.' :
               activeTab === 'bookings' ? 'Your bookings.' :
               activeTab === 'wishlist' ? 'Saved stays.' :
               activeTab === 'payments' ? 'Payments & receipts.' : 'Account settings.'}
            </h1>
            {activeTab === 'explore' && <p>Rooms, PGs and hostels — compare, select your bed and book online.</p>}
          </div>
          <div className="student-header-actions">
            <button className="student-header-link" onClick={onNavigateHome}>View Website</button>
            <button className="btn btn-accent btn-sm" onClick={() => setActiveTab('explore')}>+ Book a Stay</button>
          </div>
        </header>

        {activeTab === 'explore' && (
          <>
            <section className="student-welcome-strip">
              <div>
                <span>Student housing, simplified</span>
                <strong>Choose a room. Pick a bed. Pay securely.</strong>
              </div>
              <div className="student-mini-stats">
                <span><b>{properties.length}</b> stays</span>
                <span><b>{bookings.length}</b> bookings</span>
                <span><b>{money(totalPaid)}</b> paid</span>
              </div>
            </section>

            <section className="student-explore-toolbar">
              <div className="student-city-pills">
                {cities.slice(0, 6).map((c) => (
                  <button key={c} className={city === c ? 'active' : ''} onClick={() => setCity(c)}>{c}</button>
                ))}
              </div>
              {onNavigateExplore && (
                <button className="student-outline-action" onClick={onNavigateExplore}>Open full Explore ↗</button>
              )}
            </section>

            <section>
              <div className="student-section-heading">
                <div>
                  <span className="eyebrow">CURATED FOR YOU</span>
                  <h2>Explore rooms & stays</h2>
                </div>
                <span>{filteredProperties.length} available</span>
              </div>

              {filteredProperties.length === 0 ? (
                <div className="student-empty-state">
                  <div>⌕</div>
                  <h3>No stays found</h3>
                  <p>Try another city or search term.</p>
                </div>
              ) : (
                <div className="student-property-grid">
                  {filteredProperties.map((property) => (
                    <article className="student-property-card" key={property.id}>
                      <div className="student-property-image">
                        <img src={property.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80'} alt={property.name} />
                        <span className="student-property-type">{property.propertyType || 'Stay'}</span>
                        <button className="student-heart" aria-label="Save property">♡</button>
                      </div>
                      <div className="student-property-body">
                        <div className="student-rating">★ {property.rating || 'New'} <span>• {property.city || 'India'}</span></div>
                        <h3>{property.name}</h3>
                        <p>{property.address || 'Verified student accommodation'}</p>
                        <div className="student-property-bottom">
                          <div><strong>{money(property.startingRent)}</strong><span>/month</span></div>
                          <button className="btn btn-accent btn-sm" onClick={() => openProperty(property)}>View Rooms</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="student-buying-steps">
              <div><span>01</span><strong>Explore</strong><small>Compare verified properties</small></div>
              <div><span>02</span><strong>Choose</strong><small>Select room & available bed</small></div>
              <div><span>03</span><strong>Book</strong><small>Complete secure checkout</small></div>
              <div><span>04</span><strong>Move in</strong><small>Get confirmation & details</small></div>
            </section>
          </>
        )}

        {activeTab === 'offers' && (
          <section>
            <div className="student-section-heading"><div><span className="eyebrow">DAZEE OFFERS</span><h2>Exclusive student deals</h2></div></div>
            <div className="student-offers-grid">
              {[
                ['WELCOME10', '10% OFF', 'First booking for new students', 'Apply at checkout'],
                ['MOVEIN500', '₹500 OFF', 'On eligible long-term stays', 'Selected properties'],
                ['REFERDAZEE', '₹300 CREDIT', 'Refer a friend who books', 'After successful move-in'],
              ].map(([code, value, title, note]) => (
                <article className="student-offer-card" key={code}>
                  <div className="student-offer-icon">✦</div>
                  <div><span>{code}</span><strong>{value}</strong><h3>{title}</h3><p>{note}</p></div>
                  <button onClick={() => navigator.clipboard?.writeText(code)}>Copy code</button>
                </article>
              ))}
            </div>
            <div className="student-offer-note">Offers are displayed as platform promotions; eligibility can vary by property and checkout.</div>
          </section>
        )}

        {activeTab === 'bookings' && (
          <section className="student-panel">
            <div className="student-section-heading"><div><span className="eyebrow">YOUR STAYS</span><h2>My bookings</h2></div><span>{bookings.length} total</span></div>
            {activeBooking && (
              <div className="student-current-booking">
                <div><span className="badge badge-verified">● CONFIRMED</span><h3>{activeBooking.propertyName}</h3><p>{activeBooking.propertyAddress}</p></div>
                <div><strong>Room {activeBooking.roomNumber}</strong><span>{activeBooking.bedNumber}</span><small>Move-in {activeBooking.startDate}</small></div>
                <div><strong>{money(activeBooking.monthlyRent || activeBooking.amount)}/mo</strong><span>{activeBooking.duration} months</span></div>
              </div>
            )}
            {bookings.length === 0 ? <div className="student-empty-state"><div>▣</div><h3>No bookings yet</h3><p>Explore a room and select an available bed to start.</p><button className="btn btn-accent" onClick={() => setActiveTab('explore')}>Explore Rooms</button></div> : (
              <div className="student-booking-list">
                {bookings.map((b) => <div className="student-booking-row" key={b.id}><div><strong>{b.propertyName}</strong><span>Room {b.roomNumber} • {b.bedNumber}</span></div><span>{b.bookingReference}</span><b>{b.bookingStatus}</b><strong>{money(b.amount)}</strong></div>)}
              </div>
            )}
          </section>
        )}

        {activeTab === 'wishlist' && (
          <section className="student-panel">
            <div className="student-section-heading"><div><span className="eyebrow">YOUR SHORTLIST</span><h2>Wishlist</h2></div></div>
            <div className="student-empty-state"><div>♡</div><h3>Your saved stays will appear here</h3><p>Save properties while exploring so you can compare them later.</p><button className="btn btn-accent" onClick={() => setActiveTab('explore')}>Explore & Save</button></div>
          </section>
        )}

        {activeTab === 'payments' && (
          <section className="student-panel">
            <div className="student-section-heading"><div><span className="eyebrow">TRANSACTIONS</span><h2>Payments & receipts</h2></div><strong>{money(totalPaid)} total</strong></div>
            {payments.length === 0 ? <div className="student-empty-state"><div>₹</div><h3>No payments yet</h3><p>Your booking payments and receipts will appear here.</p></div> : (
              <div className="student-booking-list">{payments.map((p) => <div className="student-booking-row" key={p.id}><div><strong>{p.bookingReference || 'Dazee Payment'}</strong><span>{p.paymentMethod || 'Online'} • {new Date(p.createdAt).toLocaleDateString()}</span></div><span>{p.transactionId}</span><b className="student-success">SUCCESS</b><strong>{money(p.amount)}</strong></div>)}</div>
            )}
          </section>
        )}

        {activeTab === 'settings' && (
          <section className="student-settings-layout">
            <div className="student-settings-menu">
              <div className="student-settings-profile"><div className="student-avatar large">{user.name.charAt(0).toUpperCase()}</div><strong>{user.name}</strong><span>{user.email}</span></div>
              {['Account & Profile', 'Notifications', 'Privacy & Security', 'Help & Support'].map((item, i) => <button key={item} className={i === 0 ? 'active' : ''}>{item}<span>›</span></button>)}
              <button className="danger" onClick={onLogout}>Sign out</button>
            </div>
            <div className="student-panel student-settings-panel">
              <span className="eyebrow">SETTINGS</span>
              <h2>Account & Profile</h2>
              <div className="student-form-grid">
                <label>Full name<input readOnly value={user.name} /></label>
                <label>Email<input readOnly value={user.email} /></label>
                <label>Mobile<input readOnly value={user.phone || ''} placeholder="+91 Mobile number" /></label>
                <label>Account type<input readOnly value="Student Resident" /></label>
              </div>
              <div className="student-security-row"><span>✓</span><div><strong>Verified student account</strong><p>Your account is protected with an authenticated session.</p></div></div>
              <div className="student-settings-divider" />
              <h3>Emergency contact</h3>
              <div className="student-form-grid"><label>Parent / Guardian<input value="+91 98220 99887" readOnly /></label><label>Relationship<input value="Parent / Guardian" readOnly /></label></div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default StudentDashboard
