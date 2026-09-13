import React, { useEffect, useState } from 'react'
import type { User } from './components/Navbar'

interface AdminDashboardProps {
  user: User
  onLogout: () => void
  onNavigateHome: () => void
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'owners' | 'users' | 'bookings' | 'reports'>('overview')
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    students: 0,
    totalStudents: 0,
    owners: 0,
    totalOwners: 0,
    totalProperties: 0,
    pendingProperties: 0,
    approvedProperties: 0,
    rejectedProperties: 0,
    suspendedProperties: 0,
    totalBookings: 0,
    activeBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    totalBeds: 0,
    occupiedBeds: 0,
  })
  const [properties, setProperties] = useState<any[]>([])
  const [ownersList, setOwnersList] = useState<any[]>([])
  const [usersList, setUsersList] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Modals
  const [rejectModal, setRejectModal] = useState<{
    isOpen: boolean
    type: 'property' | 'owner'
    id: string
    name: string
    reason: string
  }>({
    isOpen: false,
    type: 'property',
    id: '',
    name: '',
    reason: '',
  })

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    type: 'property' | 'owner' | 'user'
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
      const [resDash, resProps, resOwners, resUsers, resBookings, resPayments] = await Promise.all([
        fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/properties', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/owners', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/bookings', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/payments', { headers: { Authorization: `Bearer ${token}` } }),
      ])

      const dataDash = await resDash.json()
      const dataProps = await resProps.json()
      const dataOwners = await resOwners.json()
      const dataUsers = await resUsers.json()
      const dataBookings = await resBookings.json()
      const dataPayments = await resPayments.json()

      if (dataDash.success) setStats(dataDash.data)
      if (dataProps.success) setProperties(dataProps.data || [])
      if (dataOwners.success) setOwnersList(dataOwners.data || [])
      if (dataUsers.success) setUsersList(dataUsers.data || [])
      if (dataBookings.success) setBookings(dataBookings.data || [])
      if (dataPayments.success) setPayments(dataPayments.data || [])
    } catch (err) {
      console.error('Admin data fetch error:', err)
    }
  }

  useEffect(() => {
    loadData()
  }, [token])

  // --- PROPERTY ACTIONS ---
  const handlePropertyApprove = async (id: string) => {
    setActionLoading(`prop-approve-${id}`)
    setMessage('')
    setErrorMessage('')
    try {
      const res = await fetch(`/api/admin/properties/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Approval failed')
      setMessage('Property approved successfully.')
      await loadData()
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to approve property')
    } finally {
      setActionLoading(null)
    }
  }

  const handlePropertySuspend = async (id: string) => {
    setActionLoading(`prop-suspend-${id}`)
    setMessage('')
    setErrorMessage('')
    try {
      const res = await fetch(`/api/admin/properties/${id}/suspend`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Suspension failed')
      setMessage('Property suspended by admin.')
      await loadData()
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to suspend property')
    } finally {
      setActionLoading(null)
    }
  }

  const handlePropertyActivate = async (id: string) => {
    setActionLoading(`prop-activate-${id}`)
    setMessage('')
    setErrorMessage('')
    try {
      const res = await fetch(`/api/admin/properties/${id}/activate`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Activation failed')
      setMessage('Property restored to approved state.')
      await loadData()
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to activate property')
    } finally {
      setActionLoading(null)
    }
  }

  const handlePropertyDeleteConfirmed = async (id: string) => {
    setActionLoading(`prop-delete-${id}`)
    setMessage('')
    setErrorMessage('')
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Deletion failed')
      setMessage('Property and associated rooms deleted successfully.')
      setDeleteModal({ isOpen: false, type: 'property', id: '', name: '' })
      await loadData()
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete property')
    } finally {
      setActionLoading(null)
    }
  }

  // --- OWNER ACTIONS ---
  const handleOwnerApprove = async (id: string) => {
    setActionLoading(`owner-approve-${id}`)
    setMessage('')
    setErrorMessage('')
    try {
      const res = await fetch(`/api/admin/owners/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Owner approval failed')
      setMessage('Owner verification approved successfully.')
      await loadData()
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to approve owner')
    } finally {
      setActionLoading(null)
    }
  }

  const handleOwnerSuspend = async (id: string) => {
    setActionLoading(`owner-suspend-${id}`)
    setMessage('')
    setErrorMessage('')
    try {
      const res = await fetch(`/api/admin/owners/${id}/suspend`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Owner suspension failed')
      setMessage('Owner and associated properties suspended.')
      await loadData()
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to suspend owner')
    } finally {
      setActionLoading(null)
    }
  }

  const handleOwnerActivate = async (id: string) => {
    setActionLoading(`owner-activate-${id}`)
    setMessage('')
    setErrorMessage('')
    try {
      const res = await fetch(`/api/admin/owners/${id}/activate`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Owner activation failed')
      setMessage('Owner account reactivated.')
      await loadData()
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reactivate owner')
    } finally {
      setActionLoading(null)
    }
  }

  const handleOwnerDeleteConfirmed = async (id: string) => {
    setActionLoading(`owner-delete-${id}`)
    setMessage('')
    setErrorMessage('')
    try {
      const res = await fetch(`/api/admin/owners/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Owner deletion failed')
      setMessage('Owner and associated listings removed safely.')
      setDeleteModal({ isOpen: false, type: 'owner', id: '', name: '' })
      await loadData()
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete owner')
    } finally {
      setActionLoading(null)
    }
  }

  // --- USER ACTIONS ---
  const handleUserSuspend = async (id: string) => {
    setActionLoading(`user-suspend-${id}`)
    setMessage('')
    setErrorMessage('')
    try {
      const res = await fetch(`/api/admin/users/${id}/suspend`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'User suspension failed')
      setMessage('User suspended successfully.')
      await loadData()
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to suspend user')
    } finally {
      setActionLoading(null)
    }
  }

  const handleUserActivate = async (id: string) => {
    setActionLoading(`user-activate-${id}`)
    setMessage('')
    setErrorMessage('')
    try {
      const res = await fetch(`/api/admin/users/${id}/activate`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'User activation failed')
      setMessage('User account reactivated successfully.')
      await loadData()
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to activate user')
    } finally {
      setActionLoading(null)
    }
  }

  const handleUserDeleteConfirmed = async (id: string) => {
    setActionLoading(`user-delete-${id}`)
    setMessage('')
    setErrorMessage('')
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'User deletion failed')
      setMessage('User account removed safely.')
      setDeleteModal({ isOpen: false, type: 'user', id: '', name: '' })
      await loadData()
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete user')
    } finally {
      setActionLoading(null)
    }
  }

  // Submit Rejection Modal
  const handleRejectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rejectModal.reason.trim()) {
      setErrorMessage('Please provide a mandatory rejection reason.')
      return
    }

    const endpoint = rejectModal.type === 'property'
      ? `/api/admin/properties/${rejectModal.id}/reject`
      : `/api/admin/owners/${rejectModal.id}/reject`

    setActionLoading('rejection-submitting')
    setMessage('')
    setErrorMessage('')

    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: rejectModal.reason }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Rejection failed')
      setMessage(`${rejectModal.type === 'property' ? 'Property' : 'Owner'} rejected with reason saved.`)
      setRejectModal({ isOpen: false, type: 'property', id: '', name: '', reason: '' })
      await loadData()
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reject')
    } finally {
      setActionLoading(null)
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
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#dc2626' }}>
            SUPERADMIN CONSOLE
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {[
            { id: 'overview', label: '📊 System KPIs' },
            { id: 'properties', label: '🏢 Listings & Moderation' },
            { id: 'owners', label: '🛡️ Owner Verification' },
            { id: 'users', label: '👥 User Directory' },
            { id: 'bookings', label: '📋 All Bookings' },
            { id: 'reports', label: '📈 Financial Reports' },
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
            🔍 View Public Platform
          </button>
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: '#dc2626', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              A
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>SuperAdmin</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <span className="eyebrow" style={{ color: '#dc2626' }}>PLATFORM GOVERNANCE & AUDIT</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              Dazee Master Console
            </h1>
          </div>
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
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div className="stat-card">
                <span>Total Students</span>
                <strong>{stats.totalStudents || stats.students}</strong>
              </div>
              <div className="stat-card">
                <span>Total Owners</span>
                <strong>{stats.totalOwners || stats.owners}</strong>
              </div>
              <div className="stat-card">
                <span>Total Properties</span>
                <strong>{stats.totalProperties}</strong>
              </div>
              <div className="stat-card">
                <span>Approved Properties</span>
                <strong style={{ color: '#059669' }}>{stats.approvedProperties}</strong>
              </div>
              <div className="stat-card">
                <span>Pending Moderation</span>
                <strong style={{ color: '#d97706' }}>{stats.pendingProperties}</strong>
              </div>
              <div className="stat-card">
                <span>Suspended Properties</span>
                <strong style={{ color: '#dc2626' }}>{stats.suspendedProperties || 0}</strong>
              </div>
              <div className="stat-card">
                <span>Active Bookings</span>
                <strong>{stats.activeBookings || stats.totalBookings}</strong>
              </div>
              <div className="stat-card">
                <span>Platform GMV Volume</span>
                <strong style={{ color: 'var(--primary)' }}>₹{stats.totalRevenue?.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* Verification Queue Preview */}
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '1.75rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem' }}>
                Property Moderation Queue
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem' }}>Property</th>
                      <th style={{ padding: '0.75rem' }}>Location</th>
                      <th style={{ padding: '0.75rem' }}>Type</th>
                      <th style={{ padding: '0.75rem' }}>Starting Rent</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                      <th style={{ padding: '0.75rem' }}>Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.slice(0, 6).map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 600 }}>{p.name}</td>
                        <td style={{ padding: '0.75rem' }}>{p.city}</td>
                        <td style={{ padding: '0.75rem' }}>{p.propertyType} ({p.genderType})</td>
                        <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                          ₹{p.startingRent?.toLocaleString('en-IN')}/mo
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span className={`badge ${p.status === 'approved' ? 'badge-verified' : p.status === 'suspended' ? 'badge-gender' : 'badge-featured'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            {p.status !== 'approved' && (
                              <button
                                className="btn btn-accent btn-sm"
                                disabled={actionLoading === `prop-approve-${p.id}`}
                                onClick={() => handlePropertyApprove(p.id)}
                              >
                                {actionLoading === `prop-approve-${p.id}` ? 'Approving...' : 'Approve'}
                              </button>
                            )}
                            {p.status !== 'rejected' && (
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => setRejectModal({ isOpen: true, type: 'property', id: p.id, name: p.name, reason: '' })}
                              >
                                Reject
                              </button>
                            )}
                            {p.status === 'approved' && (
                              <button
                                className="btn btn-outline btn-sm"
                                style={{ borderColor: '#ef4444', color: '#dc2626' }}
                                disabled={actionLoading === `prop-suspend-${p.id}`}
                                onClick={() => handlePropertySuspend(p.id)}
                              >
                                {actionLoading === `prop-suspend-${p.id}` ? 'Suspending...' : 'Suspend'}
                              </button>
                            )}
                            {p.status === 'suspended' && (
                              <button
                                className="btn btn-outline btn-sm"
                                style={{ borderColor: '#059669', color: '#059669' }}
                                disabled={actionLoading === `prop-activate-${p.id}`}
                                onClick={() => handlePropertyActivate(p.id)}
                              >
                                {actionLoading === `prop-activate-${p.id}` ? 'Activating...' : 'Activate'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PROPERTIES TAB */}
        {activeTab === 'properties' && (
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                All Platform Properties ({properties.length})
              </h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Property & Location</th>
                    <th style={{ padding: '0.75rem' }}>Coordinates (Lat, Lng)</th>
                    <th style={{ padding: '0.75rem' }}>Type & Gender</th>
                    <th style={{ padding: '0.75rem' }}>Rent</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => {
                    const lat = p.latitude || p.location?.latitude || 12.9352
                    const lng = p.longitude || p.location?.longitude || 77.6245
                    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 {p.address}, {p.city}</div>
                          {p.rejectionReason && (
                            <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.25rem' }}>
                              ⚠️ Rejection Reason: {p.rejectionReason}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#475569' }}>
                            {lat?.toFixed(4)}, {lng?.toFixed(4)}
                          </div>
                          <a
                            href={mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.75rem', color: 'var(--accent)', textDecoration: 'underline' }}
                          >
                            🗺️ View on Map
                          </a>
                        </td>
                        <td style={{ padding: '0.75rem' }}>{p.propertyType} · {p.genderType}</td>
                        <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                          ₹{p.startingRent?.toLocaleString('en-IN')}/mo
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span className={`badge ${p.status === 'approved' ? 'badge-verified' : p.status === 'suspended' ? 'badge-gender' : 'badge-featured'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            {p.status !== 'approved' && (
                              <button
                                className="btn btn-accent btn-sm"
                                disabled={actionLoading === `prop-approve-${p.id}`}
                                onClick={() => handlePropertyApprove(p.id)}
                              >
                                {actionLoading === `prop-approve-${p.id}` ? 'Approving...' : 'Approve'}
                              </button>
                            )}
                            {p.status !== 'rejected' && (
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => setRejectModal({ isOpen: true, type: 'property', id: p.id, name: p.name, reason: '' })}
                              >
                                Reject
                              </button>
                            )}
                            {p.status === 'approved' && (
                              <button
                                className="btn btn-outline btn-sm"
                                style={{ borderColor: '#ef4444', color: '#dc2626' }}
                                disabled={actionLoading === `prop-suspend-${p.id}`}
                                onClick={() => handlePropertySuspend(p.id)}
                              >
                                {actionLoading === `prop-suspend-${p.id}` ? 'Suspending...' : 'Suspend'}
                              </button>
                            )}
                            {p.status === 'suspended' && (
                              <button
                                className="btn btn-outline btn-sm"
                                style={{ borderColor: '#059669', color: '#059669' }}
                                disabled={actionLoading === `prop-activate-${p.id}`}
                                onClick={() => handlePropertyActivate(p.id)}
                              >
                                {actionLoading === `prop-activate-${p.id}` ? 'Activating...' : 'Activate'}
                              </button>
                            )}
                            <button
                              className="btn btn-outline btn-sm"
                              style={{ borderColor: '#ef4444', color: '#b91c1c' }}
                              onClick={() => setDeleteModal({ isOpen: true, type: 'property', id: p.id, name: p.name })}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* OWNERS TAB */}
        {activeTab === 'owners' && (
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem' }}>
              Registered Accommodation Owners ({ownersList.length})
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Owner Name & Business</th>
                    <th style={{ padding: '0.75rem' }}>Contact Info</th>
                    <th style={{ padding: '0.75rem' }}>Verification</th>
                    <th style={{ padding: '0.75rem' }}>Account Status</th>
                    <th style={{ padding: '0.75rem' }}>Properties & Bookings</th>
                    <th style={{ padding: '0.75rem' }}>Moderation Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ownersList.map((o) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{o.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.businessName || 'Independent Host'}</div>
                        {o.rejectionReason && (
                          <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.2rem' }}>
                            ⚠️ Reason: {o.rejectionReason}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div>{o.email}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.phone || 'Phone pending'}</div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${o.verificationStatus === 'approved' ? 'badge-verified' : o.verificationStatus === 'rejected' ? 'badge-gender' : 'badge-featured'}`}>
                          {o.verificationStatus || 'pending'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${o.status === 'active' || o.isActive !== false ? 'badge-verified' : 'badge-gender'}`}>
                          {o.status || (o.isActive !== false ? 'active' : 'suspended')}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ fontWeight: 600 }}>{o.propertiesCount || 0} Listed</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.bookingsCount || 0} Bookings</div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {o.verificationStatus !== 'approved' && (
                            <button
                              className="btn btn-accent btn-sm"
                              disabled={actionLoading === `owner-approve-${o.id}`}
                              onClick={() => handleOwnerApprove(o.id)}
                            >
                              {actionLoading === `owner-approve-${o.id}` ? 'Approving...' : 'Approve'}
                            </button>
                          )}
                          {o.verificationStatus !== 'rejected' && (
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => setRejectModal({ isOpen: true, type: 'owner', id: o.id, name: o.name, reason: '' })}
                            >
                              Reject
                            </button>
                          )}
                          {o.status !== 'suspended' && o.isActive !== false ? (
                            <button
                              className="btn btn-outline btn-sm"
                              style={{ borderColor: '#ef4444', color: '#dc2626' }}
                              disabled={actionLoading === `owner-suspend-${o.id}`}
                              onClick={() => handleOwnerSuspend(o.id)}
                            >
                              {actionLoading === `owner-suspend-${o.id}` ? 'Suspending...' : 'Suspend'}
                            </button>
                          ) : (
                            <button
                              className="btn btn-outline btn-sm"
                              style={{ borderColor: '#059669', color: '#059669' }}
                              disabled={actionLoading === `owner-activate-${o.id}`}
                              onClick={() => handleOwnerActivate(o.id)}
                            >
                              {actionLoading === `owner-activate-${o.id}` ? 'Activating...' : 'Activate'}
                            </button>
                          )}
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ borderColor: '#ef4444', color: '#b91c1c' }}
                            onClick={() => setDeleteModal({ isOpen: true, type: 'owner', id: o.id, name: o.name })}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem' }}>
              Registered Platform Users ({usersList.length})
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>User Name</th>
                    <th style={{ padding: '0.75rem' }}>Email & Phone</th>
                    <th style={{ padding: '0.75rem' }}>Role</th>
                    <th style={{ padding: '0.75rem' }}>Account Status</th>
                    <th style={{ padding: '0.75rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => {
                    const isSuspended = u.status === 'suspended' || u.isActive === false
                    return (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 600 }}>{u.name}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <div>{u.email}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.phone || 'No phone'}</div>
                        </td>
                        <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>
                          <span className={`badge ${u.role === 'admin' ? 'badge-featured' : 'badge-gender'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span className={`badge ${!isSuspended ? 'badge-verified' : 'badge-gender'}`}>
                            {!isSuspended ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          {u.role !== 'admin' && (
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              {!isSuspended ? (
                                <button
                                  className="btn btn-outline btn-sm"
                                  style={{ borderColor: '#ef4444', color: '#dc2626' }}
                                  disabled={actionLoading === `user-suspend-${u.id}`}
                                  onClick={() => handleUserSuspend(u.id)}
                                >
                                  {actionLoading === `user-suspend-${u.id}` ? 'Suspending...' : 'Suspend'}
                                </button>
                              ) : (
                                <button
                                  className="btn btn-outline btn-sm"
                                  style={{ borderColor: '#059669', color: '#059669' }}
                                  disabled={actionLoading === `user-activate-${u.id}`}
                                  onClick={() => handleUserActivate(u.id)}
                                >
                                  {actionLoading === `user-activate-${u.id}` ? 'Activating...' : 'Activate'}
                                </button>
                              )}
                              <button
                                className="btn btn-outline btn-sm"
                                style={{ borderColor: '#ef4444', color: '#b91c1c' }}
                                onClick={() => setDeleteModal({ isOpen: true, type: 'user', id: u.id, name: u.name })}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem' }}>
              All Platform Bookings ({bookings.length})
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Reference</th>
                    <th style={{ padding: '0.75rem' }}>Resident</th>
                    <th style={{ padding: '0.75rem' }}>Property</th>
                    <th style={{ padding: '0.75rem' }}>Room & Bed</th>
                    <th style={{ padding: '0.75rem' }}>Amount</th>
                    <th style={{ padding: '0.75rem' }}>Payment</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>{b.bookingReference}</td>
                      <td style={{ padding: '0.75rem' }}>{b.studentName}</td>
                      <td style={{ padding: '0.75rem' }}>{b.propertyName}</td>
                      <td style={{ padding: '0.75rem' }}>Room {b.roomNumber} ({b.bedNumber})</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                        ₹{b.amount?.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${b.paymentStatus === 'SUCCESS' ? 'badge-verified' : 'badge-featured'}`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${b.bookingStatus === 'CONFIRMED' ? 'badge-verified' : b.bookingStatus === 'CANCELLED' ? 'badge-gender' : 'badge-featured'}`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem' }}>
                Platform Revenue Breakdown
              </h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#059669', marginBottom: '0.5rem' }}>
                ₹{stats.totalRevenue?.toLocaleString('en-IN')}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Gross transaction value processed via Razorpay gateway across student bookings, security deposits, and maintenance retainers.
              </p>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>Recent Transactions ({payments.length})</div>
                {payments.slice(0, 3).map((pay: any) => (
                  <div key={pay.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.4rem 0', borderBottom: '1px dashed var(--border)' }}>
                    <span>{pay.studentName} ({pay.bookingReference})</span>
                    <strong style={{ color: '#059669' }}>+₹{pay.amount?.toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem' }}>
                Inventory & Occupancy Scalability
              </h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                {stats.approvedProperties} Live / {stats.totalProperties} Total
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Active student accommodations undergoing physical audit, fire safety protocols, and background checks.
              </p>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Total Managed Beds:</span>
                  <strong>{stats.totalBeds} Units</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Active Resident Beds:</span>
                  <strong style={{ color: '#059669' }}>{stats.occupiedBeds} Units</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Available Beds:</span>
                  <strong style={{ color: 'var(--accent)' }}>{(stats.totalBeds || 0) - (stats.occupiedBeds || 0)} Units</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* REJECTION REASON MODAL */}
      {rejectModal.isOpen && (
        <div className="modal-overlay" onClick={() => setRejectModal({ ...rejectModal, isOpen: false })}>
          <div className="modal-card" style={{ maxWidth: '500px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#dc2626' }}>
                Reject {rejectModal.type === 'property' ? 'Property' : 'Owner'}
              </h3>
              <button
                onClick={() => setRejectModal({ ...rejectModal, isOpen: false })}
                style={{ border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1rem' }}>
              Please specify the rejection reason for <strong>{rejectModal.name}</strong>. The owner will see this feedback in their portal.
            </p>
            <form onSubmit={handleRejectionSubmit}>
              <textarea
                required
                rows={4}
                className="filter-select"
                style={{ width: '100%', marginBottom: '1rem', minHeight: '90px' }}
                placeholder="e.g. Incomplete fire safety NOC, blurred government ID, or invalid building permit."
                value={rejectModal.reason}
                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setRejectModal({ ...rejectModal, isOpen: false })}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-accent btn-sm"
                  style={{ background: '#dc2626', borderColor: '#dc2626' }}
                  disabled={actionLoading === 'rejection-submitting'}
                >
                  {actionLoading === 'rejection-submitting' ? 'Submitting...' : 'Confirm Rejection'}
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
                Confirm Permanent Deletion
              </h3>
              <button
                onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                style={{ border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#334155', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this {deleteModal.type}: <strong>{deleteModal.name}</strong>?
              This action cannot be undone. Active bookings will be safeguarded.
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
                  if (deleteModal.type === 'property') handlePropertyDeleteConfirmed(deleteModal.id)
                  else if (deleteModal.type === 'owner') handleOwnerDeleteConfirmed(deleteModal.id)
                  else if (deleteModal.type === 'user') handleUserDeleteConfirmed(deleteModal.id)
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
export default AdminDashboard
