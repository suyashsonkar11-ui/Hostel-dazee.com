import React, { useState } from 'react'

export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'owner' | 'admin'
  phone?: string
}

interface NavbarProps {
  user: User | null
  onOpenAuth: (mode: 'login' | 'signup', role?: 'student' | 'owner') => void
  onLogout: () => void
  onOpenDashboard: () => void
  onNavigate?: (path: string) => void
}

export const Navbar: React.FC<NavbarProps> = ({ user, onOpenAuth, onLogout, onOpenDashboard, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (e: React.MouseEvent, dest: string) => {
    if (onNavigate) {
      e.preventDefault()
      onNavigate(dest)
    }
  }

  return (
    <header className="navbar-sticky">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <a
          href="/"
          className="brand-logo"
          onClick={(e) => handleNavClick(e, '/')}
        >
          <span className="brand-icon">D</span>
          <span>Hostel Dazee<span className="brand-dot">.</span></span>
        </a>

        {/* Desktop Links */}
        <nav className="nav-links-desktop">
          <a
            href="/explore"
            className="nav-link"
            onClick={(e) => handleNavClick(e, '/explore')}
          >
            Explore Stays
          </a>
          <a href="/how-it-works" className="nav-link" onClick={(e) => handleNavClick(e, '/how-it-works')}>How It Works</a>
          <a href="/about" className="nav-link" onClick={(e) => handleNavClick(e, '/about')}>About</a>
          <a href="/#why" className="nav-link">Why Dazee</a>
          <a href="/register?role=owner" className="nav-link" onClick={(e) => handleNavClick(e, '/register?role=owner')}>For Owners</a>
          <a href="/contact" className="nav-link" onClick={(e) => handleNavClick(e, '/contact')}>Contact</a>
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={onOpenDashboard}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                title="Go to Dashboard"
              >
                <span
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: '50%',
                    background: 'var(--accent)',
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

          {/* Mobile hamburger button */}
          <button
            className="btn btn-outline btn-sm"
            style={{ display: 'none' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  )
}
