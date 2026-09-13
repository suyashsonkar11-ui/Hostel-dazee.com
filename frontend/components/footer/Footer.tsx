import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer style={{ background: 'var(--primary)', color: '#ffffff', padding: '4.5rem 0 2.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', marginBottom: '3.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900 }}>
                HD
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>Hostel Dazee</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              India's trusted student & young professional living network. Verified rooms, high-speed optical Wi-Fi, chef-curated meals, and anti-double booking security.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '1.25rem' }}>
              <span>📸</span>
              <span>💼</span>
              <span>🐦</span>
              <span>📘</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#f8fafc' }}>Top University Hubs</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              <li><a href="/explore?city=Delhi%20NCR" style={{ color: 'inherit', textDecoration: 'none' }}>Delhi NCR (DU, IITD)</a></li>
              <li><a href="/explore?city=Bengaluru" style={{ color: 'inherit', textDecoration: 'none' }}>Bengaluru (Christ, IISc)</a></li>
              <li><a href="/explore?city=Pune" style={{ color: 'inherit', textDecoration: 'none' }}>Pune (Symbiosis, MIT-WPU)</a></li>
              <li><a href="/explore?city=Kanpur" style={{ color: 'inherit', textDecoration: 'none' }}>Kanpur (IITK, HBTI)</a></li>
              <li><a href="/explore?city=Lucknow" style={{ color: 'inherit', textDecoration: 'none' }}>Lucknow (IIML, BBAU)</a></li>
              <li><a href="/explore?city=Hyderabad" style={{ color: 'inherit', textDecoration: 'none' }}>Hyderabad (IIIT-H, UoH)</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#f8fafc' }}>For Students & Residents</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              <li><a href="/explore" style={{ color: 'inherit', textDecoration: 'none' }}>Explore All Accommodations</a></li>
              <li><a href="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Resident Login Portal</a></li>
              <li><a href="/dashboard/student" style={{ color: 'inherit', textDecoration: 'none' }}>Student Dashboard</a></li>
              <li><a href="#rules" style={{ color: 'inherit', textDecoration: 'none' }}>Hostel Rules & Safety</a></li>
              <li><a href="#faq" style={{ color: 'inherit', textDecoration: 'none' }}>FAQ & Policies</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#f8fafc' }}>Property Owners & Admin</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              <li><a href="/register?role=owner" style={{ color: 'inherit', textDecoration: 'none' }}>List Your Property</a></li>
              <li><a href="/dashboard/owner" style={{ color: 'inherit', textDecoration: 'none' }}>Owner Studio Console</a></li>
              <li><a href="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>SuperAdmin Portal</a></li>
              <li><a href="mailto:support@hosteldazee.com" style={{ color: 'inherit', textDecoration: 'none' }}>24/7 Helpline: 1800-DAZEE-HELP</a></li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
          <div>© {new Date().getFullYear()} Hostel Dazee Technologies Pvt. Ltd. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Refund Policy</span>
            <span>Security Measures</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
