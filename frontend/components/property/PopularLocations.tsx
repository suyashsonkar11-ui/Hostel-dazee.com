import React from 'react'

interface PopularLocationsProps {
  onSelectCity: (city: string) => void
}

export const PopularLocations: React.FC<PopularLocationsProps> = ({ onSelectCity }) => {
  const locations = [
    { name: 'Delhi NCR', count: '120+ Stays', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80', colleges: 'DU, IIT Delhi, Jamia' },
    { name: 'Bengaluru', count: '95+ Stays', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80', colleges: 'Christ Univ, IISc, Electronic City' },
    { name: 'Pune', count: '80+ Stays', image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=600&q=80', colleges: 'Symbiosis, Pune Univ, MIT' },
    { name: 'Kanpur', count: '45+ Stays', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80', colleges: 'IIT Kanpur, HBTI, CSJMU' },
    { name: 'Lucknow', count: '50+ Stays', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80', colleges: 'IIM Lucknow, BBD, Amity' },
    { name: 'Bhopal', count: '35+ Stays', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80', colleges: 'MANIT, AIIMS, BU Bhopal' },
    { name: 'Bilaspur', count: '25+ Stays', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80', colleges: 'Central Univ (GGU), CIMS' },
    { name: 'Hyderabad', count: '65+ Stays', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&q=80', colleges: 'IIIT, HCU, Tech Parks' },
  ]

  return (
    <section className="popular-locations-section" id="locations" style={{ padding: '5rem 0', background: '#ffffff', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="eyebrow">POPULAR STUDENT DESTINATIONS</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
            Explore by University Hub
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Verified accommodations situated within 15 minutes of India’s top academic campuses.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {locations.map((loc) => (
            <div
              key={loc.name}
              onClick={() => onSelectCity(loc.name)}
              style={{
                position: 'relative',
                height: '200px',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              className="location-card"
            >
              <img
                src={loc.image}
                alt={loc.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.1) 0%, rgba(15, 23, 42, 0.85) 100%)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  color: '#ffffff',
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
                  {loc.count}
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.2rem' }}>
                  {loc.name}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                  📍 {loc.colleges}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
