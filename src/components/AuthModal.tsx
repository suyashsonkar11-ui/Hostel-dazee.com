import React, { useState } from 'react'
import type { User } from './Navbar'

interface AuthModalProps {
  initialMode: 'login' | 'signup'
  initialRole?: 'student' | 'owner'
  onClose: () => void
  onSuccess: (user: User) => void
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  initialRole = 'student',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode)
  const [role, setRole] = useState<'student' | 'owner'>(initialRole)

  // Form Fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')

  // Quick fill demo credentials
  const fillDemo = (demoRole: 'student' | 'owner' | 'admin') => {
    setMode('login')
    setError('')
    if (demoRole === 'student') {
      setEmail('student@hosteldazee.com')
      setPassword('Student@1234')
    } else if (demoRole === 'owner') {
      setEmail('owner@hosteldazee.com')
      setPassword('Owner@1234')
    } else {
      setEmail('admin@hosteldazee.com')
      setPassword('Admin@1234')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Safari can surface a native "The string did not match the expected pattern."
    // validation message for controlled email inputs. Validate explicitly so the
    // demo login and normal login behave consistently across browsers.
    if (mode !== 'forgot' && !email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (mode !== 'forgot' && !password) {
      setError('Please enter your password.')
      return
    }
    setInfoMessage('')
    setLoading(true)

    try {
      if (mode === 'forgot') {
        if (!otpSent) {
          await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          })
          setOtpSent(true)
          setInfoMessage('Demo OTP is 123456. Enter below with new password.')
        } else {
          const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, newPassword }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.message || 'Failed to reset password')
          setInfoMessage('Password reset successfully! Please log in.')
          setMode('login')
        }
        return
      }

      const apiBase = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '')
      const endpoint = `${apiBase}${mode === 'login' ? '/api/auth/login' : '/api/auth/register'}`
      const payload =
        mode === 'login'
          ? { email, password }
          : { name, email, phone, password, role }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed')
      }

      const loggedUser: User = data.data.user
      localStorage.setItem('dazee-token', data.data.token)
      localStorage.setItem('dazee-user', JSON.stringify(loggedUser))
      onSuccess(loggedUser)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error during authentication')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'google.student@hosteldazee.com',
          name: 'Google Student',
          role: 'student',
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Google login failed')

      const loggedUser: User = data.data.user
      localStorage.setItem('dazee-token', data.data.token)
      localStorage.setItem('dazee-user', JSON.stringify(loggedUser))
      onSuccess(loggedUser)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ×
        </button>

        <div style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <span className="eyebrow">
              {mode === 'login' ? 'WELCOME BACK' : mode === 'signup' ? 'JOIN HOSTEL DAZEE' : 'ACCOUNT RECOVERY'}
            </span>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
              {mode === 'login' ? 'Log in to your stay' : mode === 'signup' ? 'Create your account' : 'Reset password'}
            </h2>
          </div>

          {/* Quick Demo Account Selector (zero friction testing) */}
          {mode === 'login' && (
            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                ⚡ Quick 1-Click Demo Accounts:
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, fontSize: '0.75rem', padding: '0.35rem 0.25rem' }}
                  onClick={() => fillDemo('student')}
                >
                  🎓 Student
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, fontSize: '0.75rem', padding: '0.35rem 0.25rem' }}
                  onClick={() => fillDemo('owner')}
                >
                  🏢 Owner
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, fontSize: '0.75rem', padding: '0.35rem 0.25rem' }}
                  onClick={() => fillDemo('admin')}
                >
                  ⚙️ Admin
                </button>
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          {infoMessage && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>
              {infoMessage}
            </div>
          )}

          <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'signup' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    I WANT TO JOIN AS
                  </label>
                  <select
                    className="filter-select"
                    style={{ width: '100%' }}
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'student' | 'owner')}
                  >
                    <option value="student">🎓 Student / Working Professional</option>
                    <option value="owner">🏢 Property Owner / Hostel Manager</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    className="filter-select"
                    style={{ width: '100%' }}
                    placeholder="Aarav Mehta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    PHONE NUMBER
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
              </>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                EMAIL ADDRESS
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

            {mode !== 'forgot' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    PASSWORD
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      style={{ border: 'none', background: 'transparent', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="filter-select"
                  style={{ width: '100%' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            {mode === 'forgot' && otpSent && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    6-DIGIT OTP
                  </label>
                  <input
                    type="text"
                    required
                    className="filter-select"
                    style={{ width: '100%' }}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    NEW PASSWORD
                  </label>
                  <input
                    type="password"
                    required
                    className="filter-select"
                    style={{ width: '100%' }}
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-accent"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            >
              {loading
                ? 'Processing...'
                : mode === 'login'
                ? 'Sign In →'
                : mode === 'signup'
                ? 'Create Account →'
                : otpSent
                ? 'Update Password'
                : 'Send OTP'}
            </button>
          </form>

          {/* Social Google Button */}
          {mode !== 'forgot' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0', color: '#94a3b8' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                <span style={{ padding: '0 0.75rem', fontSize: '0.75rem', fontWeight: 600 }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>

              <button
                type="button"
                className="btn btn-outline"
                style={{ width: '100%', padding: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onClick={handleGoogleLogin}
              >
                <span>🌐</span> Continue with Google
              </button>
            </>
          )}

          {/* Switch Mode Footer */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError('')
                    setMode('signup')
                  }}
                  style={{ border: 'none', background: 'transparent', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer' }}
                >
                  Create one now
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError('')
                    setMode('login')
                  }}
                  style={{ border: 'none', background: 'transparent', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer' }}
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
