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
    setMobileMenuOpen(false)
  }

  return (
    <header className="navbar-sticky">
      <div className="navbar-inner">
        <a href="/" className="brand-logo" onClick={(e) => handleNavClick(e, '/')}>
          <span className="brand-icon">D</span>
          <span>Hostel Dazee<span className="brand-dot">.</span></span>
        </a>

        <nav className="nav-links-desktop">
          <a href="/explore" className="nav-link" onClick={(e) => handleNavClick(e, '/explore')}>Explore</a>
          <a href="#destinations" className="nav-link">Cities</a>
          <a href="#how" className="nav-link">How it works</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#owners" className="nav-link">For Owners</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <button className="nav-user-button" onClick={onOpenDashboard}>Hi, {user.name.split(' ')[0]}</button>
              <button className="btn btn-accent nav-cta" onClick={onOpenDashboard}>Dashboard</button>
              <button className="nav-logout" onClick={onLogout}>Log out</button>
            </>
          ) : (
            <>
              <button className="nav-login" onClick={() => onOpenAuth('login')}>Log in</button>
              <button className="btn btn-accent nav-cta" onClick={() => onOpenAuth('signup', 'student')}>Find your stay</button>
            </>
          )}
          <button className="mobile-menu-button" onClick={() => setMobileMenuOpen((v) => !v)} aria-label="Open menu">
            {mobileMenuOpen ? '×' : '☰'}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu-panel">
          <a href="/explore" onClick={(e) => handleNavClick(e, '/explore')}>Explore Stays</a>
          <a href="#destinations" onClick={() => setMobileMenuOpen(false)}>Popular Cities</a>
          <a href="#how" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>About Hostel Dazee</a>
          <a href="#owners" onClick={() => setMobileMenuOpen(false)}>List Your Property</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Support</a>
          {!user && <button onClick={() => { setMobileMenuOpen(false); onOpenAuth('login') }}>Login</button>}
          {user && <button onClick={() => { setMobileMenuOpen(false); onOpenDashboard() }}>My Dashboard</button>}
        </div>
      )}
    </header>
  )
}
