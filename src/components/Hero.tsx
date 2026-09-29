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
    document.getElementById('stays')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero-wrapper luxury-hero" id="top">
      <div className="luxury-hero-image" aria-hidden="true" />
      <div className="luxury-hero-overlay" aria-hidden="true" />

      <div className="container hero-container">
        <div className="luxury-hero-content">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow">HOSTEL DAZEE · VERIFIED STUDENT LIVING</span>

            <h1 className="hero-title">
              Find your next
              <br />
              <em>place to call home.</em>
            </h1>

            <p className="hero-lead">
              Curated hostels, PGs and co-living spaces near India's leading campuses — verified for comfort, safety and value.
            </p>

            <form className="hero-search-card luxury-search" onSubmit={handleSearchSubmit}>
              <div className="hero-search-heading">Find your perfect stay</div>

              <div className="search-fields-grid">
                <div className="search-field">
                  <label>LOCATION</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)} aria-label="Location">
                    <option value="All">Anywhere in India</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Pune">Pune</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Chennai">Chennai</option>
                  </select>
                </div>

                <div className="search-field">
                  <label>CHECK-IN</label>
                  <input type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} aria-label="Check-in date" />
                </div>

                <div className="search-field">
                  <label>ROOM TYPE</label>
                  <select value={sharing} onChange={(e) => setSharing(e.target.value)} aria-label="Room type">
                    <option value="All">Any sharing</option>
                    <option value="Single">Single private</option>
                    <option value="Double">Double sharing</option>
                    <option value="Triple">Triple sharing</option>
                  </select>
                </div>

                <div className="search-field">
                  <label>STAY DURATION</label>
                  <select value={duration} onChange={(e) => setDuration(e.target.value)} aria-label="Stay duration">
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="11">11 Months</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-accent hero-search-button">
                <span>⌕</span> Search stays <span>→</span>
              </button>
            </form>

            <div className="hero-stats luxury-stats">
              <div className="hero-stat-item"><strong>500+</strong><span>Verified stays</span></div>
              <div className="hero-stat-item"><strong>25+</strong><span>Campus cities</span></div>
              <div className="hero-stat-item"><strong>10K+</strong><span>Residents</span></div>
              <div className="hero-stat-item"><strong>4.8</strong><span>Resident rating</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
