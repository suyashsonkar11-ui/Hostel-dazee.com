import React, { useState } from 'react'

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: 'Accommodation Inquiry', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({ name: '', email: '', phone: '', subject: 'Accommodation Inquiry', message: '' })
  }

  return (
    <div style={{ padding: '3.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="eyebrow">GET IN TOUCH</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.75rem' }}>
            Contact Hostel Dazee
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto' }}>
            Need help selecting a bed, verifying an accommodation, or listing your property? Our support team is available 24/7.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2.5rem' }}>
          {/* Support Info Cards */}
          <div>
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📞</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                Student Helpline
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                For quick queries regarding move-in and bookings:
              </p>
              <strong style={{ color: 'var(--accent)', fontSize: '1.1rem' }}>+91 98112 33445</strong>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Toll Free: 1800-DAZEE-HELP</div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✉️</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                Email Support
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                Send us your query and we'll reply within 2 hours:
              </p>
              <strong style={{ color: 'var(--accent)', fontSize: '1.05rem' }}>support@hosteldazee.com</strong>
            </div>

            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📍</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                Headquarters
              </h3>
              <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.5 }}>
                Hostel Dazee Technologies Pvt. Ltd.<br />
                80 Feet Road, 4th Block, Koramangala,<br />
                Bengaluru, Karnataka 560034
              </p>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2.5rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem' }}>
              Send Us a Message
            </h3>

            {submitted ? (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✓</div>
                <h4 style={{ color: '#065f46', fontSize: '1.15rem', fontWeight: 700 }}>Inquiry Received!</h4>
                <p style={{ color: '#047857', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  A campus housing representative will contact you on WhatsApp or call shortly.
                </p>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: '1rem' }}
                  onClick={() => setSubmitted(false)}
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.35rem' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    className="filter-select"
                    style={{ width: '100%' }}
                    placeholder="e.g. Suyash Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ marginBottom: '1.1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.35rem' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="filter-select"
                    style={{ width: '100%' }}
                    placeholder="suyash@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div style={{ marginBottom: '1.1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.35rem' }}>
                    Mobile / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    required
                    className="filter-select"
                    style={{ width: '100%' }}
                    placeholder="+91 98112 33445"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.35rem' }}>
                    Inquiry Type
                  </label>
                  <select
                    className="filter-select"
                    style={{ width: '100%' }}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option>Accommodation Inquiry</option>
                    <option>Move-In & Bed Question</option>
                    <option>List Property (Owner Partnership)</option>
                    <option>Billing / Refund Question</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.35rem' }}>
                    Message Details
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="filter-select"
                    style={{ width: '100%' }}
                    placeholder="Tell us about your university, required move-in date, or property details..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-accent" style={{ width: '100%', padding: '0.85rem' }}>
                  Submit Inquiry →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
