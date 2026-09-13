import React from 'react'
import type { User } from '../../types'
import AdminDashboard from '../../../src/AdminDashboard'

interface AdminPageProps {
  user: User | null
  onLogout: () => void
  onNavigateHome: () => void
  onOpenAuth?: (mode: 'login' | 'signup', role?: 'student' | 'owner') => void
}

export const AdminPage: React.FC<AdminPageProps> = ({
  user,
  onLogout,
  onNavigateHome,
  onOpenAuth,
}) => {
  if (!user || user.role !== 'admin') {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center', minHeight: '60vh' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
          SuperAdmin Privileges Required
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Please sign in with administrator credentials to access platform moderation, GMV ledgers, and property approvals.
        </p>
        <button
          className="btn btn-accent"
          onClick={() => onOpenAuth ? onOpenAuth('login') : (window.location.href = '/login')}
        >
          Admin Sign In
        </button>
      </div>
    )
  }

  return (
    <AdminDashboard
      user={user}
      onLogout={onLogout}
      onNavigateHome={onNavigateHome}
    />
  )
}
