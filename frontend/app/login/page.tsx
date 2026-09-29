import React, { useState } from 'react'
import type { User } from '../../types'
import { setAuthSession } from '../../lib/auth'

interface LoginPageProps {
  onSuccess?: (user: User) => void
  onNavigateRegister?: () => void
  onNavigateHome?: () => void
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateRegister,
  onNavigateHome,
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const apiBase = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '')
      const endpoint = `${apiBase}/api/auth/login`
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!data.success) {
        throw new Error(data.message || 'Login failed')
      }

      setAuthSession(data.data.token, data.data.user)

      if (onSuccess) {
        onSuccess(data.data.user)
      } else {
        // Fallback browser redirect
        if (data.data.user.role === 'admin') window.location.href = '/admin'
        else if (data.data.user.role === 'owner') window.location.href = '/dashboard/owner'
        else window.location.href = '/dashboard/student'
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    setErrorMsg('')
  }

  return (
    <div style={{ padding: '4rem 1rem', background: '#f8fafc', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-page-card" style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2.5rem', width: '100%', maxWidth: '460px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
        {/* Logo & Headline */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--accent)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, margin: '0 auto 0.75rem', fontSize: '1.25rem' }}>
            HD
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Log in to manage your student booking or hostel property
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Form */}
        <form noValidate onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.4rem' }}>
              Email Address
            </label>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              className="filter-select"
              style={{ width: '100%' }}
              placeholder="e.g. rahul.verma@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                Password
              </label>
              <a href="#forgot" style={{ fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                Forgot?
              </a>
            </div>
            <input
              type="password"
              autoComplete="current-password"
              className="filter-select"
              style={{ width: '100%' }}
              placeholder="••••••••"
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
            {loading ? 'Authenticating...' : 'Sign In to Account →'}
          </button>
        </form>

        {/* 1-Click Demo Credentials */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.75rem' }}>
            ⚡ 1-Click Demo Accounts (Instant Test)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => fillDemo('student@hosteldazee.com', 'Student@1234')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.4rem' }}
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => fillDemo('owner@hosteldazee.com', 'Owner@1234')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.4rem' }}
            >
              🏢 Owner
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@hosteldazee.com', 'Admin@1234')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.4rem' }}
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {/* Switch to Register */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          {onNavigateRegister ? (
            <button
              onClick={onNavigateRegister}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
            >
              Create Account
            </button>
          ) : (
            <a href="/register" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
              Create Account
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
