import React, { useState } from 'react'

interface HeroProps {
  onSearch: (criteria: { city: string; duration: string; checkin: string; sharing: string }) => void
}

export const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [city, setCity] = useState('All')
  const [duration, setDuration] = useState('6')
  const [checkin, setCheckin] = useState('')
  const [sharing, setSharing] = useState('All')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({ city, duration, checkin, sharing })
    const staysSection = document.getElementById('stays')
    if (staysSection) {
      staysSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="hero-wrapper" id="top">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">PREMIUM STUDENT & CO-LIVING PLATFORM</span>
            <h1 className="hero-title">
              Find Your Perfect Stay.<br />
              <em>Feel Right at Home.</em>
            </h1>
            <p className="hero-lead">
              Discover comfortable, secure and affordable hostels and PGs designed for students and young professionals across top university hubs in India.
            </p>

            <form className="hero-search-card" onSubmit={handleSearchSubmit}>
              <div className="search-fields-grid">
                <div className="search-field">
                  <label>City / Location</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)}>
                    <option value="All">All Cities</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Kanpur">Kanpur</option>
                    <option value="Lucknow">Lucknow</option>
                    <option value="Bhopal">Bhopal</option>
                    <option value="Bilaspur">Bilaspur</option>
                  </select>
                </div>

                <div className="search-field">
                  <label>Move-in Date</label>
                  <input
                    type="date"
                    value={checkin}
                    onChange={(e) => setCheckin(e.target.value)}
                  />
                </div>

                <div className="search-field">
                  <label>Duration</label>
                  <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                    <option value="1">1 Month (Trial)</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months (Semester)</option>
                    <option value="11">11 Months (Academic)</option>
                  </select>
                </div>

                <div className="search-field">
                  <label>Room Sharing</label>
                  <select value={sharing} onChange={(e) => setSharing(e.target.value)}>
                    <option value="All">Any Sharing</option>
                    <option value="Single">Single Room</option>
                    <option value="Double">Double Sharing</option>
                    <option value="Triple">Triple Sharing</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-accent" style={{ padding: '0.75rem 2rem' }}>
                  <span>🔍 Search Stays</span>
                </button>
              </div>
            </form>

            <div className="hero-stats">
              <div className="hero-stat-item">
                <strong>500+</strong>
                <span>Verified Stays</span>
              </div>
              <div style={{ width: '1px', height: '2rem', background: '#cbd5e1' }} />
              <div className="hero-stat-item">
                <strong>10K+</strong>
                <span>Happy Residents</span>
              </div>
              <div style={{ width: '1px', height: '2rem', background: '#cbd5e1' }} />
              <div className="hero-stat-item">
                <strong>25+</strong>
                <span>Campus Cities</span>
              </div>
              <div style={{ width: '1px', height: '2rem', background: '#cbd5e1' }} />
              <div className="hero-stat-item">
                <strong>4.8 ★</strong>
                <span>Resident Rating</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=85"
              alt="Hostel Dazee Co-living Space"
              className="hero-img-main"
            />
            <div className="hero-floating-card">
              <span className="dot-pulse" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                  Verified Dazee Homes
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Biometric Access · Optical Wi-Fi · Chef Buffet
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
