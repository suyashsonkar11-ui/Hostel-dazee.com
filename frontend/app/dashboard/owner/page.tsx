import React from 'react'
import type { User } from '../../../types'
import OwnerDashboard from '../../../../src/OwnerDashboard'

interface OwnerDashboardPageProps {
  user: User | null
  onLogout: () => void
  onNavigateHome: () => void
  onOpenAuth?: (mode: 'login' | 'signup', role?: 'student' | 'owner') => void
}

export const OwnerDashboardPage: React.FC<OwnerDashboardPageProps> = ({
  user,
  onLogout,
  onNavigateHome,
  onOpenAuth,
}) => {
  if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center', minHeight: '60vh' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
          Owner Studio Access Required
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Please log in with a property owner account to manage your listings, view occupancy, and approve bed requests.
        </p>
        <button
          className="btn btn-accent"
          onClick={() => onOpenAuth ? onOpenAuth('login', 'owner') : (window.location.href = '/login')}
        >
          Sign In as Property Owner
        </button>
      </div>
    )
  }

  return (
    <OwnerDashboard
      user={user}
      onLogout={onLogout}
      onNavigateHome={onNavigateHome}
    />
  )
}
