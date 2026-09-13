import React from 'react'
import type { User } from '../../../types'
import StudentDashboard from '../../../../src/StudentDashboard'

interface StudentDashboardPageProps {
  user: User | null
  onLogout: () => void
  onNavigateHome: () => void
  onOpenAuth?: (mode: 'login' | 'signup', role?: 'student' | 'owner') => void
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({
  user,
  onLogout,
  onNavigateHome,
  onOpenAuth,
}) => {
  if (!user || user.role !== 'student') {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center', minHeight: '60vh' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
          Student Account Required
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Please sign in with your student credentials to view your active stays, vouchers, and rent dues.
        </p>
        <button
          className="btn btn-accent"
          onClick={() => onOpenAuth ? onOpenAuth('login', 'student') : (window.location.href = '/login')}
        >
          Sign In as Student
        </button>
      </div>
    )
  }

  return (
    <StudentDashboard
      user={user}
      onLogout={onLogout}
      onNavigateHome={onNavigateHome}
    />
  )
}
