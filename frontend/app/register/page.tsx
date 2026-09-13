import React, { useState } from 'react'
import type { User, Role } from '../../types'
import { setAuthSession } from '../../lib/auth'

interface RegisterPageProps {
  onSuccess?: (user: User) => void
  onNavigateLogin?: () => void
  onNavigateHome?: () => void
  initialRole?: Role
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onSuccess,
  onNavigateLogin,
  onNavigateHome,
  initialRole = 'student',
}) => {
  const [role, setRole] = useState<Role>(initialRole)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, role }),
      })

      const data = await res.json()
      if (!data.success) {
        throw new Error(data.message || 'Registration failed')
      }

      setAuthSession(data.data.token, data.data.user)

      if (onSuccess) {
        onSuccess(data.data.user)
      } else {
        if (data.data.user.role === 'owner') window.location.href = '/dashboard/owner'
        else window.location.href = '/dashboard/student'
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '4rem 1rem', background: '#f8fafc', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2.5rem', width: '100%', maxWidth: '480px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
        {/* Logo & Headline */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--accent)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, margin: '0 auto 0.75rem', fontSize: '1.25rem' }}>
            HD
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>
            Join Hostel Dazee
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Start discovering verified student accommodations or list your property
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Role Segmented Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: '#f1f5f9', padding: '0.35rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setRole('student')}
            style={{
              padding: '0.6rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: role === 'student' ? '#ffffff' : 'transparent',
              color: role === 'student' ? 'var(--primary)' : '#64748b',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: role === 'student' ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition-fast)',
            }}
          >
            🎓 I am a Student
          </button>
          <button
            type="button"
            onClick={() => setRole('owner')}
            style={{
              padding: '0.6rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: role === 'owner' ? '#ffffff' : 'transparent',
              color: role === 'owner' ? 'var(--primary)' : '#64748b',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: role === 'owner' ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition-fast)',
            }}
          >
            🏢 I am an Owner
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.35rem' }}>
              Full Legal Name
            </label>
            <input
              type="text"
              required
              className="filter-select"
              style={{ width: '100%' }}
              placeholder={role === 'student' ? 'e.g. Suyash Sharma' : 'e.g. Ramesh Kumar'}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.35rem' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              className="filter-select"
              style={{ width: '100%' }}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.35rem' }}>
              Mobile Phone Number
            </label>
            <input
              type="tel"
              required
              className="filter-select"
              style={{ width: '100%' }}
              placeholder="+91 98112 33445"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.35rem' }}>
              Choose a Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              className="filter-select"
              style={{ width: '100%' }}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-accent"
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
          >
            {loading ? 'Creating Account...' : `Register as ${role === 'student' ? 'Student' : 'Property Owner'} →`}
          </button>
        </form>

        {/* Switch to Login */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          {onNavigateLogin ? (
            <button
              onClick={onNavigateLogin}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
            >
              Sign In
            </button>
          ) : (
            <a href="/login" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
              Sign In
            </a>
          )}
        </div>

        {onNavigateHome && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              onClick={onNavigateHome}
              style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              ← Back to Homepage
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
