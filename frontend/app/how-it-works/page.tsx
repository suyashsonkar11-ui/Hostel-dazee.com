import React from 'react'

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Search by Campus or City',
      desc: 'Type your university name, target city, or landmark. Filter by budget, room sharing preference (Single, Double, Triple), and gender.',
      icon: '🔍',
    },
    {
      num: '02',
      title: 'Inspect Verified Property Details',
      desc: 'Browse authentic room photos, check included meals and Wi-Fi amenities, and read verified reviews from active residents.',
      icon: '🏠',
    },
    {
      num: '03',
      title: 'Choose Your Exact Room & Bed',
      desc: 'Use our interactive room layout to pick your specific bed unit (Bed A, Bed B). Live availability prevents double booking.',
      icon: '🛏️',
    },
    {
      num: '04',
      title: 'Reserve & Move-In Seamlessly',
      desc: 'Complete quick student identification, pay securely via Razorpay, and download your instant digital voucher DZ-XXXXX.',
      icon: '🎉',
    },
  ]

  return (
    <div style={{ padding: '3.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="eyebrow">STEP-BY-STEP GUIDE</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.75rem' }}>
            How Hostel Dazee Works
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto' }}>
            From finding your campus accommodation to moving in, here is how easy it is to secure your bed.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3.5rem' }}>
          {steps.map((step) => (
            <div
              key={step.num}
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                border: '1px solid var(--border)',
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                alignItems: 'center',
                gap: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  width: '75px',
                  height: '75px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  fontWeight: 900,
                }}
              >
                {step.num}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>{step.icon}</span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary)' }}>{step.title}</h3>
                </div>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2.5rem', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
            Ready to Find Your Home Away From Home?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Join thousands of students who booked verified stays with zero brokerage.
          </p>
          <a href="/explore" className="btn btn-accent" style={{ padding: '0.85rem 2.5rem' }}>
            Browse Accommodations Now →
          </a>
        </div>
      </div>
    </div>
  )
}
