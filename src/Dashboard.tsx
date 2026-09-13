import { useEffect, useState } from 'react'

type Role = 'student' | 'owner' | 'admin'
type User = { id: string; name: string; email: string; role: Role }
type DashboardProps = { user: User; onLogout: () => void }
type Stats = Record<string, number>
type Property = { id: string; name: string; city?: string; status?: string; email?: string; role?: string; isActive?: boolean; bookingReference?: string; bookingStatus?: string; description?: string; propertyType?: string; startingRent?: number }

const labels: Record<Role, { title: string; links: { path: string; label: string }[] }> = {
  student: { title: 'Student space', links: [{ path: '/student/dashboard', label: 'Overview' }, { path: '/', label: 'Browse properties' }, { path: '/student/bookings', label: 'My bookings' }, { path: '/student/saved', label: 'Saved properties' }, { path: '/student/payments', label: 'Payment history' }, { path: '/student/profile', label: 'Profile settings' }] },
  owner: { title: 'Owner studio', links: [{ path: '/owner/dashboard', label: 'Overview' }, { path: '/owner/properties', label: 'My properties' }, { path: '/owner/bookings', label: 'Booking requests' }, { path: '/owner/profile', label: 'Profile settings' }] },
  admin: { title: 'Admin console', links: [{ path: '/admin/dashboard', label: 'Overview' }, { path: '/admin/users', label: 'Manage users' }, { path: '/admin/properties', label: 'Properties' }, { path: '/admin/bookings', label: 'Bookings' }, { path: '/admin/reports', label: 'Reports' }] },
}

function Dashboard({ user, onLogout }: DashboardProps) {
  const [stats, setStats] = useState<Stats>({})
  const [items, setItems] = useState<Property[]>([])
  const [message, setMessage] = useState('')
  const currentPath = window.location.pathname
  const config = labels[user.role]
  const activeLabel = config.links.find((link) => link.path === currentPath)?.label || config.title
  const token = localStorage.getItem('dazee-token') || ''
  const api = async (path: string, options: RequestInit = {}) => {
    const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers } })
    const result = await response.json()
    if (!response.ok) throw new Error(result.message || 'Request failed')
    return result.data
  }

  useEffect(() => {
    const load = async () => {
      try {
        const endpoint = currentPath.endsWith('/reports') ? '/api/admin/reports' : currentPath.endsWith('/users') ? '/api/admin/users' : currentPath.endsWith('/payments') ? '/api/payments/my' : user.role === 'student' ? '/api/bookings/my' : user.role === 'owner' ? '/api/owner/dashboard' : '/api/admin/dashboard'
        const data = await api(endpoint)
        setStats(data && !Array.isArray(data) ? data : { bookings: Array.isArray(data) ? data.length : 0 })
        if (currentPath.endsWith('/properties') || currentPath.endsWith('/bookings') || currentPath.endsWith('/users')) {
          const listPath = user.role === 'owner' && currentPath.endsWith('/properties') ? '/api/owner/properties' : user.role === 'owner' ? '/api/owner/bookings' : user.role === 'admin' && currentPath.endsWith('/properties') ? '/api/admin/properties' : user.role === 'admin' && currentPath.endsWith('/users') ? '/api/admin/users' : user.role === 'admin' ? '/api/admin/bookings' : '/api/bookings/my'
          const list = await api(listPath)
          setItems(Array.isArray(list) ? list : [])
        }
      } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to load dashboard') }
    }
    void load()
  }, [currentPath, user.role])

  const createProperty = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    try {
      await api('/api/properties', { method: 'POST', body: JSON.stringify({ name: data.get('name'), description: data.get('description'), propertyType: data.get('propertyType'), genderType: 'Unisex', address: data.get('address'), city: data.get('city'), state: data.get('state'), pincode: data.get('pincode') }) })
      setMessage('Property submitted for admin review.')
      event.currentTarget.reset()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to create property') }
  }

  const decideProperty = async (id: string, decision: 'approve' | 'reject') => {
    try { await api(`/api/admin/properties/${id}/${decision}`, { method: 'POST' }); setItems((current) => current.filter((item) => item.id !== id)); setMessage(`Property ${decision}d.`) } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to update property') }
  }
  const decideBooking = async (id: string, decision: 'approve' | 'reject') => {
    try { await api(`/api/owner/bookings/${id}/${decision}`, { method: 'POST' }); setItems((current) => current.filter((item) => item.id !== id)); setMessage(`Booking ${decision}d.`) } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to update booking') }
  }

  return <div className="dashboard-shell"><aside className="dashboard-sidebar"><a className="brand" href="/"><span className="brand-mark">d</span> dazee<span className="dot">.</span></a><p className="dashboard-kicker">{config.title}</p><nav className="dashboard-nav">{config.links.map((link) => <a className={link.path === currentPath ? 'active' : ''} href={link.path} key={link.path}>{link.label}</a>)}</nav><button className="dashboard-logout" onClick={onLogout}>Log out ↗</button></aside><main className="dashboard-main"><header className="dashboard-header"><div><p className="eyebrow">{user.role.toUpperCase()} ACCOUNT</p><h1>{activeLabel}</h1></div><div className="dashboard-user"><span>{user.name.slice(0, 1)}</span><div><strong>{user.name}</strong><small>{user.email}</small></div></div></header>{message && <button className="dashboard-message" onClick={() => setMessage('')}>{message} ×</button>}{currentPath.endsWith('/properties') && user.role === 'owner' && <><form className="property-form" onSubmit={createProperty}><h2>Add a property</h2><input name="name" required placeholder="Property name" /><input name="address" required placeholder="Address" /><input name="city" required placeholder="City" /><input name="state" required placeholder="State" /><input name="pincode" required placeholder="Pincode" /><select name="propertyType" defaultValue="PG"><option>PG</option><option>Hostel</option><option>Co-living</option></select><textarea name="description" required placeholder="Tell students about the space" /><button className="dark-button" type="submit">Submit property ↗</button></form><section className="dashboard-list"><h2>My properties</h2>{items.map((item) => <article className="dashboard-row" key={item.id}><div><strong>{item.name}</strong><span>{item.city || 'Location pending'} · {item.status}</span></div></article>)}{!items.length && <p className="muted">No properties yet.</p>}</section></>}{currentPath.endsWith('/properties') && user.role === 'admin' && <section className="dashboard-list"><h2>Property review queue</h2>{items.map((item) => <article className="dashboard-row" key={item.id}><div><strong>{item.name}</strong><span>{item.city || 'Location pending'} · {item.status}</span></div><div><button className="small-button" onClick={() => decideProperty(item.id, 'approve')}>Approve</button><button className="small-button danger" onClick={() => decideProperty(item.id, 'reject')}>Reject</button></div></article>)}{!items.length && <p className="muted">No properties to review.</p>}</section>}{(!currentPath.endsWith('/properties') || user.role === 'student') && <section className="dashboard-content"><div className="stats-grid">{Object.entries(stats).slice(0, 6).map(([key, value]) => <article className="stat-card" key={key}><span>{key.replace(/[A-Z]/g, (letter) => ` ${letter}`).toUpperCase()}</span><strong>{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</strong></article>)}</div>{currentPath.endsWith('/bookings') && <div className="dashboard-list"><h2>Booking requests</h2>{items.map((item) => <article className="dashboard-row" key={item.id}><div><strong>{item.name || item.email || item.bookingReference || 'Dazee booking'}</strong><span>{item.status || item.bookingStatus || 'Pending'}</span></div>{user.role === 'owner' && <div><button className="small-button" onClick={() => decideBooking(item.id, 'approve')}>Approve</button><button className="small-button danger" onClick={() => decideBooking(item.id, 'reject')}>Reject</button></div>}</article>)}{!items.length && <p className="muted">Nothing here yet.</p>}</div>}{currentPath.endsWith('/users') && <div className="dashboard-list"><h2>Manage users</h2>{items.map((item) => <article className="dashboard-row" key={item.id}><div><strong>{item.name || item.email || 'Dazee user'}</strong><span>{item.role || 'User'} · {item.isActive === false ? 'Suspended' : 'Active'}</span></div></article>)}{!items.length && <p className="muted">No users yet.</p>}</div>}{currentPath.endsWith('/profile') && <section className="profile-panel"><h2>Profile settings</h2><p>Signed in as {user.email}</p><p>Your {user.role} account is protected by JWT authentication.</p></section>}</section>}</main></div>
}

export default Dashboard
