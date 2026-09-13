import React, { useState } from 'react'

export const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      q: 'How do I book a hostel or PG on Hostel Dazee?',
      a: 'Simply search by university or city, explore verified listings, pick your preferred room type, and use our interactive visual bed selector to pick an available bed unit. Complete the multi-step checkout and your booking confirmation voucher is generated instantly!',
    },
    {
      q: 'Are all properties and rooms physically verified?',
      a: 'Yes! Every Hostel Dazee listing goes through a comprehensive 24-point physical verification audit covering biometric security, hygiene standards, optical Wi-Fi speeds, and meal taste tests before receiving our Verified badge.',
    },
    {
      q: 'Can I choose a specific bed before moving in?',
      a: 'Absolutely! Hostel Dazee is India’s first platform offering real-time visual floor plans with selectable bed units (e.g. Bed A, Bed B). Available beds are highlighted in green, occupied beds are locked, and your selection is reserved for you during checkout.',
    },
    {
      q: 'How does digital payment work?',
      a: 'Payments are processed securely through Razorpay supporting UPI (Google Pay, PhonePe, Paytm), NetBanking, and credit/debit cards. We never hold sensitive card data and provide instant digital receipts.',
    },
    {
      q: 'Can I cancel my booking or request a refund?',
      a: 'Yes, cancellations made up to 7 days before your scheduled move-in date are eligible for a 100% refund of your security deposit and first month rent in accordance with property policy.',
    },
    {
      q: 'How do property owners list their properties?',
      a: 'Owners can register for free via the Owner Studio, enter property specifications, add rooms, and auto-generate bed units. Our audit team reviews and approves listings within 24 hours.',
    },
    {
      q: 'Is a security deposit required?',
      a: 'A refundable 1-month security deposit is standard across student accommodations to protect property fittings. It is refunded directly to your bank account upon formal check-out.',
    },
  ]

  return (
    <section className="faq-section" id="faq" style={{ padding: '5rem 0', background: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="eyebrow">COMMON QUESTIONS</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Everything you need to know about booking, moving in, and student living with Hostel Dazee.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: isOpen ? 'var(--accent)' : 'var(--primary)',
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '1.25rem', transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>
                    +
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.5rem 1.25rem', color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
