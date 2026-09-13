import React, { useEffect, useState } from 'react'
import type { User } from './components/Navbar'

interface OwnerDashboardProps {
  user: User
  onLogout: () => void
  onNavigateHome: () => void
}

const CITY_COORDS: Record<string, { lat: number; lng: number; state: string; pin: string }> = {
  'Bengaluru': { lat: 12.9352, lng: 77.6245, state: 'Karnataka', pin: '560034' },
  'Pune': { lat: 18.5679, lng: 73.9143, state: 'Maharashtra', pin: '411014' },
  'Delhi NCR': { lat: 28.4682, lng: 77.4981, state: 'Uttar Pradesh', pin: '201306' },
  'Hyderabad': { lat: 17.4401, lng: 78.3489, state: 'Telangana', pin: '500032' },
  'Mumbai': { lat: 19.1176, lng: 72.9060, state: 'Maharashtra', pin: '400076' },
  'Chennai': { lat: 13.0067, lng: 80.2026, state: 'Tamil Nadu', pin: '600025' },
  'Kanpur': { lat: 26.5123, lng: 80.2329, state: 'Uttar Pradesh', pin: '208016' },
  'Lucknow': { lat: 26.8500, lng: 80.9984, state: 'Uttar Pradesh', pin: '226010' },
  'Bhopal': { lat: 23.2324, lng: 77.4326, state: 'Madhya Pradesh', pin: '462011' },
  'Bilaspur': { lat: 22.1287, lng: 82.1384, state: 'Chhattisgarh', pin: '495009' },
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ user, onLogout, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'rooms' | 'bookings' | 'students' | 'analytics'>('overview')
  const [stats, setStats] = useState<any>({
    totalProperties: 0,
    totalRooms: 0,
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    occupancyRate: 0,
    totalBookings: 0,
    monthlyRevenue: 0,
  })
  const [properties, setProperties] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [propertyRooms, setPropertyRooms] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Add Property Form State with interactive location
  const [newProp, setNewProp] = useState({
    name: '',
    tagline: 'Modern student living',
    description: '',
    propertyType: 'PG',
    genderType: 'Unisex',
    address: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    latitude: 12.9352,
    longitude: 77.6245,
    formattedAddress: '',
    startingRent: 8500,
  })

  // Edit Property Modal State
  const [editingProp, setEditingProp] = useState<any | null>(null)

  // Add Room Form State
  const [selectedPropertyId, setSelectedPropertyId] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [floor, setFloor] = useState(1)
  const [roomType, setRoomType] = useState('Double Sharing')
  const [rent, setRent] = useState(7999)
  const [sharingCapacity, setSharingCapacity] = useState(2)

  // Delete Confirmation Modal
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    type: 'property' | 'room'
    id: string
    name: string
  }>({
    isOpen: false,
    type: 'property',
    id: '',
    name: '',
  })

  const token = localStorage.getItem('dazee-token')

  const loadData = async () => {
    try {
      const [resDashboard, resProps, resBookings, resStudents] = await Promise.all([
        fetch('/api/owner/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/owner/properties', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/owner/bookings', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/owner/students', { headers: { Authorization: `Bearer ${token}` } }),
      ])

      const dataDashboard = await resDashboard.json()
      const dataProps = await resProps.json()
      const dataBookings = await resBookings.json()
      const dataStudents = await resStudents.json()

      if (dataDashboard.success) setStats(dataDashboard.data)
      if (dataProps.success) {
        setProperties(dataProps.data || [])
        if (dataProps.data?.length && !selectedPropertyId) {
          setSelectedPropertyId(dataProps.data[0].id)
        }
      }
      if (dataBookings.success) setBookings(dataBookings.data || [])
      if (dataStudents.success) setStudents(dataStudents.data || [])
    } catch (err) {
      console.error('Owner dashboard load failed:', err)
    }
  }

  const loadRoomsForProperty = async (propId: string) => {
    if (!propId) return
    try {
      const res = await fetch(`/api/properties/${propId}/rooms`)
      const data = await res.json()
      if (data.success) setPropertyRooms(data.data || [])
    } catch (err) {
      console.error('Failed to load rooms for property:', err)
    }
  }

  useEffect(() => {
    loadData()
  }, [token])

  useEffect(() => {
    if (selectedPropertyId) {
      loadRoomsForProperty(selectedPropertyId)
    }
  }, [selectedPropertyId])

  // Handle City Change in Add Property Form
  const handleCityChange = (cityName: string) => {
    const coords = CITY_COORDS[cityName] || { lat: 12.9716, lng: 77.5946, state: 'Karnataka', pin: '560001' }
    setNewProp({
      ...newProp,
      city: cityName,
      state: coords.state,
      pincode: coords.pin,
      latitude: coords.lat,
      longitude: coords.lng,
    })
  }

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setErrorMessage('')

    // Location Validation Check
    if (!newProp.latitude || !newProp.longitude || !newProp.address.trim() || !newProp.city.trim()) {
      setErrorMessage('Please verify that address, city, and exact map coordinates are provided before submitting.')
      return
    }

    setLoading(true)
    try {
      const formattedAddress = `${newProp.address}, ${newProp.city}, ${newProp.state} ${newProp.pincode}`
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newProp,
          formattedAddress,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to create property')
      setMessage('Property submitted for admin approval with initial rooms!')
      setNewProp({
        name: '',
        tagline: 'Modern student living',
        description: '',
        propertyType: 'PG',
        genderType: 'Unisex',
        address: '',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560034',
        latitude: 12.9352,
        longitude: 77.6245,
        formattedAddress: '',
        startingRent: 8500,
      })
      await loadData()
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating property')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProp) return
    setMessage('')
    setErrorMessage('')
    setLoading(true)

    try {
      const formattedAddress = `${editingProp.address}, ${editingProp.city}, ${editingProp.state || 'Karnataka'} ${editingProp.pincode || '560001'}`
      const res = await fetch(`/api/properties/${editingProp.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...editingProp,
          formattedAddress,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to update property')
      setMessage('Property details and map location updated successfully!')
      setEditingProp(null)
      await loadData()
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating property')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePropertyConfirmed = async (id: string) => {
    setMessage('')
    setErrorMessage('')
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to delete property')
      setMessage('Property removed successfully.')
      setDeleteModal({ isOpen: false, type: 'property', id: '', name: '' })
      await loadData()
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not delete property')
    }
  }

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPropertyId) return
    setMessage('')
    setErrorMessage('')
    try {
      const res = await fetch(`/api/properties/${selectedPropertyId}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomNumber,
          floor,
          roomType,
          rent,
          ac: true,
          sharingCapacity,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to add room')
      setMessage(`Room ${roomNumber} added with ${sharingCapacity} bed units!`)
      setRoomNumber('')
      await loadData()
      await loadRoomsForProperty(selectedPropertyId)
    } catch (err: any) {
      setErrorMessage(err.message || 'Error adding room')
    }
  }

  const handleDeleteRoomConfirmed = async (roomId: string) => {
    try {
      const res = await fetch(`/api/rooms/${roomId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to delete room')
      setMessage('Room and associated beds removed.')
      setDeleteModal({ isOpen: false, type: 'room', id: '', name: '' })
      await loadData()
      if (selectedPropertyId) await loadRoomsForProperty(selectedPropertyId)
    } catch (err: any) {
      setErrorMessage(err.message || 'Error deleting room')
    }
  }

  const handleBedStatusChange = async (bedId: string, newStatus: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE') => {
    try {
      const res = await fetch(`/api/beds/${bedId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to update bed status')
      setMessage(`Bed status updated to ${newStatus}`)
      await loadData()
      if (selectedPropertyId) await loadRoomsForProperty(selectedPropertyId)
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update bed status')
    }
  }

  const handleBookingDecision = async (id: string, decision: 'approve' | 'reject') => {
    try {
      const res = await fetch(`/api/owner/bookings/${id}/${decision}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Action failed')
      setMessage(`Booking ${decision === 'approve' ? 'confirmed' : 'rejected'} successfully!`)
      await loadData()
      if (selectedPropertyId) await loadRoomsForProperty(selectedPropertyId)
    } catch (err: any) {
      setErrorMessage(err.message || 'Action failed')
    }
  }

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
            OWNER STUDIO
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {[
            { id: 'overview', label: '📊 Overview & KPIs' },
            { id: 'properties', label: '🏢 My Properties' },
            { id: 'rooms', label: '🛏️ Rooms & Beds' },
            { id: 'bookings', label: '📋 Booking Requests' },
            { id: 'students', label: '👥 Resident Students' },
            { id: 'analytics', label: '📈 Revenue & Occupancy' },
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
            🔍 View Live Public Website
          </button>
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
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

      {/* Main Area */}
      <main className="dashboard-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <span className="eyebrow">PROPERTY OWNER PORTAL</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              Owner Studio
            </h1>
          </div>
          <button className="btn btn-accent btn-sm" onClick={() => setActiveTab('properties')}>
            + Add New Property
          </button>
        </div>

        {/* Success Alert */}
        {message && (
          <div
            style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontWeight: 600 }}>✓ {message}</span>
            <button onClick={() => setMessage('')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 700 }}>
              ×
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontWeight: 600 }}>⚠️ {errorMessage}</span>
            <button onClick={() => setErrorMessage('')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 700 }}>
              ×
            </button>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <div className="stats-grid">
              <div className="stat-card">
                <span>Total Properties</span>
                <strong>{stats.totalProperties}</strong>
              </div>
              <div className="stat-card">
                <span>Bed Occupancy Rate</span>
                <strong style={{ color: '#059669' }}>{stats.occupancyRate}%</strong>
              </div>
              <div className="stat-card">
                <span>Available Units</span>
                <strong>{stats.availableBeds} / {stats.totalBeds}</strong>
              </div>
              <div className="stat-card">
                <span>Monthly Rental Volume</span>
                <strong style={{ color: 'var(--primary)' }}>₹{stats.monthlyRevenue?.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* Quick Action Tables */}
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '1.75rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem' }}>
                Recent Booking Requests ({bookings.length})
              </h3>
              {bookings.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No student booking requests yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem' }}>Student</th>
                        <th style={{ padding: '0.75rem' }}>Property & Room</th>
                        <th style={{ padding: '0.75rem' }}>Duration</th>
                        <th style={{ padding: '0.75rem' }}>Rent</th>
                        <th style={{ padding: '0.75rem' }}>Status</th>
                        <th style={{ padding: '0.75rem' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 600 }}>{b.studentName || 'Student'}</td>
                          <td style={{ padding: '0.75rem' }}>{b.propertyName} (Rm {b.roomNumber})</td>
                          <td style={{ padding: '0.75rem' }}>{b.duration} Mo</td>
                          <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                            ₹{b.amount?.toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span className={`badge ${b.bookingStatus === 'CONFIRMED' ? 'badge-verified' : 'badge-featured'}`}>
                              {b.bookingStatus}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            {b.bookingStatus === 'PENDING' && (
                              <div style={{ display: 'flex', gap: '0.35rem' }}>
                                <button className="btn btn-accent btn-sm" onClick={() => handleBookingDecision(b.id, 'approve')}>
                                  Approve
                                </button>
                                <button className="btn btn-outline btn-sm" onClick={() => handleBookingDecision(b.id, 'reject')}>
                                  Reject
                                </button>
                              </div>
                            )}
                            {b.bookingStatus === 'CONFIRMED' && (
                              <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>Active Stay</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PROPERTIES TAB */}
        {activeTab === 'properties' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
            {/* List */}
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem' }}>
                Your Listed Accommodations ({properties.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {properties.map((p) => {
                  const lat = p.latitude || p.location?.latitude || 12.9352
                  const lng = p.longitude || p.location?.longitude || 77.6245
                  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

                  return (
                    <div
                      key={p.id}
                      style={{
                        padding: '1.25rem',
                        background: '#f8fafc',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80'}
                          alt={p.name}
                          style={{ width: '90px', height: '70px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>{p.name}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {p.address}, {p.city}</div>
                            </div>
                            <span className={`badge ${p.status === 'approved' ? 'badge-verified' : p.status === 'suspended' ? 'badge-gender' : 'badge-featured'}`}>
                              {p.status || 'approved'}
                            </span>
                          </div>

                          {/* Coordinates & Google Maps Link */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem', fontSize: '0.75rem', color: '#64748b' }}>
                            <span>🌐 {lat.toFixed(4)}, {lng.toFixed(4)}</span>
                            <a
                              href={mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--accent)', textDecoration: 'underline', fontWeight: 600 }}
                            >
                              📍 View on Google Maps
                            </a>
                          </div>

                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)', marginTop: '0.4rem' }}>
                            Starting ₹{p.startingRent?.toLocaleString('en-IN')}/mo · {p.propertyType} ({p.genderType})
                          </div>

                          {/* Rejection / Suspension Notice */}
                          {p.status === 'rejected' && p.rejectionReason && (
                            <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', color: '#991b1b', fontSize: '0.75rem' }}>
                              <strong>Admin Feedback:</strong> {p.rejectionReason}
                            </div>
                          )}
                          {p.status === 'suspended' && (
                            <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-sm)', color: '#92400e', fontSize: '0.75rem' }}>
                              ⚠️ <strong>Notice:</strong> This property has been suspended by admin.
                            </div>
                          )}

                          {/* Edit / Delete Buttons */}
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => setEditingProp(p)}
                            >
                              ✏️ Edit Property & Location
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              style={{ borderColor: '#ef4444', color: '#b91c1c' }}
                              onClick={() => setDeleteModal({ isOpen: true, type: 'property', id: p.id, name: p.name })}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Create Form with Location & Interactive Coordinates */}
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                Add New Property
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Enter property details and exact geographic coordinates. Submitted listings require admin review.
              </p>

              <form onSubmit={handleCreateProperty} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    PROPERTY NAME *
                  </label>
                  <input
                    type="text"
                    required
                    className="filter-select"
                    style={{ width: '100%' }}
                    placeholder="e.g. Dazee Silicon Haven"
                    value={newProp.name}
                    onChange={(e) => setNewProp({ ...newProp, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      TYPE
                    </label>
                    <select
                      className="filter-select"
                      style={{ width: '100%' }}
                      value={newProp.propertyType}
                      onChange={(e) => setNewProp({ ...newProp, propertyType: e.target.value })}
                    >
                      <option>PG</option>
                      <option>Hostel</option>
                      <option>Co-living</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      GENDER
                    </label>
                    <select
                      className="filter-select"
                      style={{ width: '100%' }}
                      value={newProp.genderType}
                      onChange={(e) => setNewProp({ ...newProp, genderType: e.target.value })}
                    >
                      <option>Unisex</option>
                      <option>Girls only</option>
                      <option>Boys only</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      CITY *
                    </label>
                    <select
                      className="filter-select"
                      style={{ width: '100%' }}
                      value={newProp.city}
                      onChange={(e) => handleCityChange(e.target.value)}
                    >
                      {Object.keys(CITY_COORDS).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      BASE RENT (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      className="filter-select"
                      style={{ width: '100%' }}
                      value={newProp.startingRent}
                      onChange={(e) => setNewProp({ ...newProp, startingRent: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    STREET ADDRESS *
                  </label>
                  <input
                    type="text"
                    required
                    className="filter-select"
                    style={{ width: '100%' }}
                    placeholder="e.g. 4th Block, 80 Feet Road, Koramangala"
                    value={newProp.address}
                    onChange={(e) => setNewProp({ ...newProp, address: e.target.value })}
                  />
                </div>

                {/* MAP LOCATION SECTION */}
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                      📍 PROPERTY MAP COORDINATES *
                    </label>
                    <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>Google Maps Ready</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LATITUDE</span>
                      <input
                        type="number"
                        step="0.0001"
                        required
                        className="filter-select"
                        style={{ width: '100%', fontSize: '0.8rem' }}
                        value={newProp.latitude}
                        onChange={(e) => setNewProp({ ...newProp, latitude: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LONGITUDE</span>
                      <input
                        type="number"
                        step="0.0001"
                        required
                        className="filter-select"
                        style={{ width: '100%', fontSize: '0.8rem' }}
                        value={newProp.longitude}
                        onChange={(e) => setNewProp({ ...newProp, longitude: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => handleCityChange(newProp.city)}
                    >
                      📍 Reset to City Center
                    </button>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${newProp.latitude},${newProp.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.75rem', color: 'var(--accent)' }}
                    >
                      🗺️ Preview on Google Maps
                    </a>
                  </div>
                </div>

                <button type="submit" className="btn btn-accent" style={{ marginTop: '0.5rem' }} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Property for Admin Approval →'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ROOMS & BEDS MANAGER */}
        {activeTab === 'rooms' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
              {/* Rooms & Beds Viewer */}
              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                    Inventory for Selected Property
                  </h3>
                  <select
                    className="filter-select"
                    style={{ minWidth: '220px' }}
                    value={selectedPropertyId}
                    onChange={(e) => setSelectedPropertyId(e.target.value)}
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                    ))}
                  </select>
                </div>

                {propertyRooms.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No rooms added to this property yet. Use the generator on the right to add rooms and bed units.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {propertyRooms.map((room) => (
                      <div
                        key={room.id}
                        style={{
                          padding: '1.25rem',
                          background: '#f8fafc',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <div>
                            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
                              Room {room.roomNumber}
                            </span>
                            <span style={{ marginLeft: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                              Floor {room.floor} · {room.roomType}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <strong style={{ color: 'var(--accent)' }}>₹{room.rent?.toLocaleString('en-IN')}/mo</strong>
                            <button
                              className="btn btn-outline btn-sm"
                              style={{ borderColor: '#ef4444', color: '#b91c1c', fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                              onClick={() => setDeleteModal({ isOpen: true, type: 'room', id: room.id, name: `Room ${room.roomNumber}` })}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Beds Interactive Status Changers */}
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          BED UNITS & OCCUPANCY:
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem' }}>
                          {room.beds?.map((bed: any) => (
                            <div
                              key={bed.id}
                              style={{
                                padding: '0.65rem',
                                background: '#ffffff',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.25rem',
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{bed.bedNumber}</span>
                                <span
                                  style={{
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    padding: '0.15rem 0.4rem',
                                    borderRadius: '999px',
                                    background: bed.status === 'AVAILABLE' ? '#ecfdf5' : bed.status === 'OCCUPIED' ? '#eff6ff' : '#fef2f2',
                                    color: bed.status === 'AVAILABLE' ? '#059669' : bed.status === 'OCCUPIED' ? '#2563eb' : '#dc2626',
                                  }}
                                >
                                  {bed.status}
                                </span>
                              </div>

                              {/* Toggle Bed Status */}
                              <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                                {bed.status !== 'AVAILABLE' && (
                                  <button
                                    className="btn btn-outline btn-sm"
                                    style={{ fontSize: '0.65rem', padding: '0.15rem 0.35rem' }}
                                    onClick={() => handleBedStatusChange(bed.id, 'AVAILABLE')}
                                  >
                                    Set Avail
                                  </button>
                                )}
                                {bed.status !== 'OCCUPIED' && (
                                  <button
                                    className="btn btn-outline btn-sm"
                                    style={{ fontSize: '0.65rem', padding: '0.15rem 0.35rem' }}
                                    onClick={() => handleBedStatusChange(bed.id, 'OCCUPIED')}
                                  >
                                    Set Occupied
                                  </button>
                                )}
                                {bed.status !== 'MAINTENANCE' && (
                                  <button
                                    className="btn btn-outline btn-sm"
                                    style={{ fontSize: '0.65rem', padding: '0.15rem 0.35rem' }}
                                    onClick={() => handleBedStatusChange(bed.id, 'MAINTENANCE')}
                                  >
                                    Maint.
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Room Form */}
              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  Add Room & Generate Beds
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Instantiates Bed A, Bed B, etc., automatically in real database records for student booking.
                </p>

                <form onSubmit={handleAddRoom} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      TARGET PROPERTY
                    </label>
                    <select
                      className="filter-select"
                      style={{ width: '100%' }}
                      value={selectedPropertyId}
                      onChange={(e) => setSelectedPropertyId(e.target.value)}
                    >
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        ROOM NUMBER
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 302"
                        className="filter-select"
                        style={{ width: '100%' }}
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        FLOOR
                      </label>
                      <input
                        type="number"
                        className="filter-select"
                        style={{ width: '100%' }}
                        value={floor}
                        onChange={(e) => setFloor(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        SHARING TYPE
                      </label>
                      <select
                        className="filter-select"
                        style={{ width: '100%' }}
                        value={roomType}
                        onChange={(e) => {
                          setRoomType(e.target.value)
                          if (e.target.value === 'Single Sharing') setSharingCapacity(1)
                          if (e.target.value === 'Double Sharing') setSharingCapacity(2)
                          if (e.target.value === 'Triple Sharing') setSharingCapacity(3)
                          if (e.target.value === 'Four Sharing') setSharingCapacity(4)
                        }}
                      >
                        <option>Single Sharing</option>
                        <option>Double Sharing</option>
                        <option>Triple Sharing</option>
                        <option>Four Sharing</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        MONTHLY RENT PER BED (₹)
                      </label>
                      <input
                        type="number"
                        required
                        className="filter-select"
                        style={{ width: '100%' }}
                        value={rent}
                        onChange={(e) => setRent(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-accent" style={{ marginTop: '0.5rem' }}>
                    Generate Room & {sharingCapacity} Bed Units →
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem' }}>
              Student Booking Requests
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Student Name</th>
                    <th style={{ padding: '0.75rem' }}>Property</th>
                    <th style={{ padding: '0.75rem' }}>Room & Bed</th>
                    <th style={{ padding: '0.75rem' }}>Duration</th>
                    <th style={{ padding: '0.75rem' }}>Move-in</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{b.studentName}</td>
                      <td style={{ padding: '0.75rem' }}>{b.propertyName}</td>
                      <td style={{ padding: '0.75rem' }}>Room {b.roomNumber} ({b.bedNumber})</td>
                      <td style={{ padding: '0.75rem' }}>{b.duration} Mo</td>
                      <td style={{ padding: '0.75rem' }}>{b.startDate}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${b.bookingStatus === 'CONFIRMED' ? 'badge-verified' : 'badge-featured'}`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {b.bookingStatus === 'PENDING' ? (
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button className="btn btn-accent btn-sm" onClick={() => handleBookingDecision(b.id, 'approve')}>
                              Approve
                            </button>
                            <button className="btn btn-outline btn-sm" onClick={() => handleBookingDecision(b.id, 'reject')}>
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: '#059669', fontSize: '0.8rem', fontWeight: 600 }}>Confirmed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RESIDENT STUDENTS TAB */}
        {activeTab === 'students' && (
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Connected Resident Directory ({students.length})
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Restricted to students with verified bookings at your accommodations.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Resident Name</th>
                    <th style={{ padding: '0.75rem' }}>Contact Information</th>
                    <th style={{ padding: '0.75rem' }}>Allocated Property</th>
                    <th style={{ padding: '0.75rem' }}>Room & Bed</th>
                    <th style={{ padding: '0.75rem' }}>Booking Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{s.name}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <div>{s.email}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.phone || 'Phone on file'}</div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>{s.currentProperty || 'Hostel Dazee'}</td>
                      <td style={{ padding: '0.75rem' }}>
                        Room {s.roomNumber || '101'} ({s.bedNumber || 'Bed A'})
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${s.bookingStatus === 'CONFIRMED' ? 'badge-verified' : 'badge-featured'}`}>
                          {s.bookingStatus || 'Active Stay'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem' }}>
                Bed Occupancy Performance
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#059669' }}>
                  {stats.occupancyRate}%
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{stats.occupiedBeds} Beds Occupied</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{stats.availableBeds} Available for Booking</div>
                </div>
              </div>
              <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${stats.occupancyRate}%`, background: 'var(--accent)', borderRadius: '999px' }} />
              </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem' }}>
                Revenue Projections
              </h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                ₹{stats.monthlyRevenue?.toLocaleString('en-IN')}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Projected annual gross rental income based on active leases and recurring monthly rent collections.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* EDIT PROPERTY MODAL */}
      {editingProp && (
        <div className="modal-overlay" onClick={() => setEditingProp(null)}>
          <div className="modal-card" style={{ maxWidth: '600px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                Edit Property & Location
              </h3>
              <button
                onClick={() => setEditingProp(null)}
                style={{ border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateProperty} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  PROPERTY NAME
                </label>
                <input
                  type="text"
                  required
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={editingProp.name}
                  onChange={(e) => setEditingProp({ ...editingProp, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    CITY
                  </label>
                  <select
                    className="filter-select"
                    style={{ width: '100%' }}
                    value={editingProp.city}
                    onChange={(e) => {
                      const coords = CITY_COORDS[e.target.value] || { lat: 12.9716, lng: 77.5946 }
                      setEditingProp({
                        ...editingProp,
                        city: e.target.value,
                        latitude: coords.lat,
                        longitude: coords.lng,
                      })
                    }}
                  >
                    {Object.keys(CITY_COORDS).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    BASE RENT (₹)
                  </label>
                  <input
                    type="number"
                    required
                    className="filter-select"
                    style={{ width: '100%' }}
                    value={editingProp.startingRent}
                    onChange={(e) => setEditingProp({ ...editingProp, startingRent: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  ADDRESS
                </label>
                <input
                  type="text"
                  required
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={editingProp.address}
                  onChange={(e) => setEditingProp({ ...editingProp, address: e.target.value })}
                />
              </div>

              <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  📍 MAP COORDINATES
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LATITUDE</span>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      className="filter-select"
                      style={{ width: '100%', fontSize: '0.8rem' }}
                      value={editingProp.latitude || 12.9352}
                      onChange={(e) => setEditingProp({ ...editingProp, latitude: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LONGITUDE</span>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      className="filter-select"
                      style={{ width: '100%', fontSize: '0.8rem' }}
                      value={editingProp.longitude || 77.6245}
                      onChange={(e) => setEditingProp({ ...editingProp, longitude: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setEditingProp(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-accent btn-sm"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save & Re-submit for Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteModal.isOpen && (
        <div className="modal-overlay" onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}>
          <div className="modal-card" style={{ maxWidth: '480px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#dc2626' }}>
                Confirm Permanent Removal
              </h3>
              <button
                onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                style={{ border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#334155', marginBottom: '1.5rem' }}>
              Are you sure you want to delete {deleteModal.name}?
              This will remove all associated database units. Active bookings cannot be deleted.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-accent btn-sm"
                style={{ background: '#dc2626', borderColor: '#dc2626' }}
                onClick={() => {
                  if (deleteModal.type === 'property') handleDeletePropertyConfirmed(deleteModal.id)
                  else if (deleteModal.type === 'room') handleDeleteRoomConfirmed(deleteModal.id)
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default OwnerDashboard
