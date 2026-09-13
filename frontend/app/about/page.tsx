import React from 'react'

export const AboutPage: React.FC = () => {
  return (
    <div style={{ padding: '3.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="eyebrow">OUR MISSION & HERITAGE</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.75rem' }}>
            About Hostel Dazee
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto' }}>
            Empowering students and young professionals across India with verified, secure, and community-centric living spaces.
          </p>
        </div>

        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2.5rem', border: '1px solid var(--border)', marginBottom: '2.5rem', lineHeight: 1.8, fontSize: '1.05rem', color: '#334155' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem' }}>
            Redefining Student Accommodation in India
          </h2>
          <p style={{ marginBottom: '1.25rem' }}>
            Hostel Dazee was established to solve one of the most frustrating challenges faced by students leaving home for college: finding safe, verified, and high-quality hostel accommodation without predatory brokerage or hidden fees.
          </p>
          <p style={{ marginBottom: '1.25rem' }}>
            Every accommodation listed on our network is physically inspected, verified for 24/7 security and biometric entry, and equipped with chef-curated meals, high-speed optical Wi-Fi, and acoustic study spaces designed for modern university life.
          </p>
          <p>
            Whether you are preparing for competitive exams in Delhi University North Campus, pursuing engineering in Bengaluru, or studying law in Pune, Hostel Dazee is your home away from home.
          </p>
        </div>

        {/* 4 Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { icon: '🛡️', title: '100% Verified Stays', desc: 'No fake photos or hidden caveats. Every property undergoes physical safety vetting.' },
            { icon: '🔒', title: 'Anti-Double Booking', desc: 'Instant bed-level reservation and real-time locking prevents double booking.' },
            { icon: '🍽️', title: 'Home-Style Fresh Food', desc: 'Hygienic 3-time meals cooked fresh with student-friendly nutrition menus.' },
            { icon: '⚡', title: 'Zero Brokerage', desc: 'Direct owner booking with transparent rents and standard refundable security deposit.' },
          ].map((pillar) => (
            <div key={pillar.title} style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>{pillar.icon}</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>{pillar.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{pillar.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <a href="/explore" className="btn btn-accent" style={{ padding: '0.85rem 2rem' }}>
            Explore Verified Accommodations →
          </a>
        </div>
      </div>
    </div>
  )
}
