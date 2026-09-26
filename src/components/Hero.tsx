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
    <section className="hero-wrapper" id="top">
      <div className="hero-backdrop" aria-hidden="true" />
      <div className="container hero-container">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow">HOSTEL DAZEE · VERIFIED STUDENT LIVING</span>
            <h1 className="hero-title">
              Find your next<br />
              <em>place to call home.</em>
            </h1>
            <p className="hero-lead">
              Premium hostels, PGs and co-living spaces near the campuses that matter to you.
            </p>

            <form className="hero-search-card" onSubmit={handleSearchSubmit}>
              <div className="hero-search-heading">Find your perfect stay</div>
              <div className="search-fields-grid">
                <div className="search-field">
                  <label>Location</label>
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
                  <label>Check-in</label>
                  <input type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} aria-label="Check-in date" />
                </div>
                <div className="search-field">
                  <label>Room type</label>
                  <select value={sharing} onChange={(e) => setSharing(e.target.value)} aria-label="Room type">
                    <option value="All">Any sharing</option>
                    <option value="Single">Single room</option>
                    <option value="Double">Double sharing</option>
                    <option value="Triple">Triple sharing</option>
                  </select>
                </div>
                <div className="search-field">
                  <label>Stay duration</label>
                  <select value={duration} onChange={(e) => setDuration(e.target.value)} aria-label="Stay duration">
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="11">11 Months</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-accent hero-search-button">
                Search stays <span aria-hidden="true">→</span>
              </button>
            </form>

            <div className="hero-stats">
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
