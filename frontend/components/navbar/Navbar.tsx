import React from 'react'
import type { User } from '../../types'

interface NavbarProps {
  user: User | null
  onOpenAuth: (mode: 'login' | 'signup', role?: 'student' | 'owner') => void
  onLogout: () => void
  onNavigate: (path: string) => void
}

export const Navbar: React.FC<NavbarProps> = ({ user, onOpenAuth, onLogout, onNavigate }) => {
  return (
    <header className="navbar-sticky">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            onNavigate('/')
          }}
          className="brand-logo"
        >
          <span className="brand-icon">D</span>
          <span>Hostel Dazee<span className="brand-dot">.</span></span>
        </a>

        {/* Desktop Links */}
        <nav className="nav-links-desktop">
          <a
            href="/explore"
            onClick={(e) => {
              e.preventDefault()
              onNavigate('/explore')
            }}
            className="nav-link"
          >
            Explore Stays
          </a>
          <a href="/#how" className="nav-link">How It Works</a>
          <a href="/#locations" className="nav-link">Top Cities</a>
          <a href="/#about" className="nav-link">About</a>
          <a href="/#faq" className="nav-link">FAQs</a>
          <a href="/#contact" className="nav-link">Contact</a>
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  if (user.role === 'admin') onNavigate('/admin')
                  else if (user.role === 'owner') onNavigate('/dashboard/owner')
                  else onNavigate('/dashboard/student')
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                title="Go to Dashboard"
              >
                <span
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: '50%',
                    background: user.role === 'admin' ? '#dc2626' : user.role === 'owner' ? '#0284c7' : 'var(--accent)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span>{user.name.split(' ')[0]} ({user.role})</span>
              </button>
              <button className="btn btn-outline btn-sm" onClick={onLogout}>
                Log out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button className="btn btn-outline btn-sm" onClick={() => onOpenAuth('login')}>
                Log in
              </button>
              <button className="btn btn-accent btn-sm" onClick={() => onOpenAuth('signup')}>
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
