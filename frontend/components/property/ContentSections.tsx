import React, { useState } from 'react'

interface ContentSectionsProps {
  onOpenOwnerSignup: () => void
}

export const ContentSections: React.FC<ContentSectionsProps> = ({ onOpenOwnerSignup }) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const testimonials = [
    {
      name: 'Rohan Deshmukh',
      role: 'Tech Intern & Christ University Graduate',
      city: 'Bengaluru',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      text: 'Finding a good PG was always stressful with brokers asking absurd commissions. Hostel Dazee made the whole process simple and transparent. The visual bed selector let me pick the corner window bed before even visiting!',
    },
    {
      name: 'Ananya Kulkarni',
      role: 'Symbiosis Law School, 2nd Year',
      city: 'Pune',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      text: 'As a girl moving away from home for the first time, safety was non-negotiable. Ivy Scholars Haven has biometric security, fantastic food, and the friendliest community of female students.',
    },
    {
      name: 'Vikram Singh',
      role: 'SRCC Student, Delhi University',
      city: 'Delhi NCR',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      text: 'Super clean rooms and zero electricity cutoffs during peak exam prep. The Wi-Fi is blazing fast and the study pods keep you in the zone. Highly recommended!',
    },
  ]

  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: 'Accommodation Inquiry', message: '' })
  const [contactSubmitted, setContactSubmitted] = useState(false)

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setContactSubmitted(true)
    setContactForm({ name: '', email: '', phone: '', subject: 'Accommodation Inquiry', message: '' })
  }

  return (
    <>
      {/* 10. ABOUT HOSTEL DAZEE */}
      <section className="about-section" id="about" style={{ padding: '5rem 0', background: '#ffffff', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ maxWidth: '780px', margin: '0 auto 3.5rem', textAlign: 'center' }}>
            <span className="eyebrow">OUR STORY & PURPOSE</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1.25rem' }}>
              About Hostel Dazee
            </h2>
            <p style={{ fontSize: '1.15rem', color: '#334155', lineHeight: 1.7 }}>
              Hostel Dazee is more than just a place to stay — it is a comfortable, secure and community-driven living space designed for students and young professionals. We bring together comfortable spaces, essential amenities, safety, and digital convenience under one roof.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>🛋️</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                Comfortable Living
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Thoughtfully designed spaces that feel like home with ergonomic furniture, spacious storage, and natural light.
              </p>
            </div>

            <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>🛡️</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                Safe & Secure
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                A secure environment with round-the-clock CCTV surveillance, biometric access, and trusted on-premise wardens.
              </p>
            </div>

            <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>⚡</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                Modern Amenities
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Everything residents need for convenient everyday living: optical Wi-Fi, fresh buffet meals, laundry, and daily housekeeping.
              </p>
            </div>

            <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>🌱</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                Vibrant Community
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                A welcoming environment where residents connect, collaborate, study, and build friendships that last a lifetime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="how-section" id="how" style={{ padding: '5rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="eyebrow">SIMPLE 4-STEP JOURNEY</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>
              How It Works
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              From campus search to digital check-in in under 5 minutes.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[
              { num: '01', title: 'Search', desc: 'Find hostels and PGs based on your university location, budget and room preferences.' },
              { num: '02', title: 'Explore', desc: 'Compare verified properties with 360 photos, amenities, campus proximity and reviews.' },
              { num: '03', title: 'Choose Your Bed', desc: 'View live floor plans and select your specific available bed unit in real time.' },
              { num: '04', title: 'Book & Move In', desc: 'Complete transparent Razorpay checkout, receive your confirmation slip and move in!' },
            ].map((step) => (
              <div
                key={step.num}
                style={{
                  background: '#ffffff',
                  padding: '2rem 1.5rem',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.5rem' }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY HOSTEL DAZEE */}
      <section className="why-section" id="why" style={{ padding: '5rem 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="eyebrow">BUILT ON TRUST & QUALITY</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1.5rem' }}>
                Why Choose Hostel Dazee?
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  '✓ 100% Verified Properties',
                  '✓ Transparent, Zero-Brokerage Pricing',
                  '✓ Real-Time Visual Bed Booking',
                  '✓ Safe & Secure Digital Payments',
                  '✓ 24/7 Dedicated Resident Support',
                  '✓ Authentic Peer Reviews',
                  '✓ Flexible Semester Leases',
                  '✓ Nutritious Chef-Prepared Food',
                ].map((item, idx) => (
                  <div key={idx} style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#0f172a', color: '#ffffff', padding: '2.5rem', borderRadius: 'var(--radius-xl)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <div style={{ fontSize: '2.75rem', fontWeight: 800, color: '#34d399' }}>500+</div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Verified Properties</div>
              </div>
              <div>
                <div style={{ fontSize: '2.75rem', fontWeight: 800, color: '#34d399' }}>10K+</div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Happy Student Residents</div>
              </div>
              <div>
                <div style={{ fontSize: '2.75rem', fontWeight: 800, color: '#34d399' }}>25+</div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>University Cities</div>
              </div>
              <div>
                <div style={{ fontSize: '2.75rem', fontWeight: 800, color: '#34d399' }}>4.8 ★</div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Average Resident Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. STUDENT TESTIMONIALS */}
      <section className="reviews-section" style={{ padding: '5rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="eyebrow">WHAT OUR RESIDENTS SAY</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>
              Real Stories from Hostel Dazee
            </h2>
          </div>

          <div style={{ maxWidth: '720px', margin: '0 auto', background: '#ffffff', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#f59e0b', fontSize: '1.25rem' }}>
              {'★'.repeat(testimonials[activeTestimonial].rating)}
            </div>
            <p style={{ fontSize: '1.15rem', color: '#334155', fontStyle: 'italic', lineHeight: 1.7, marginBottom: '2rem' }}>
              "{testimonials[activeTestimonial].text}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <img
                src={testimonials[activeTestimonial].avatar}
                alt={testimonials[activeTestimonial].name}
                style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{testimonials[activeTestimonial].name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {testimonials[activeTestimonial].role} · {testimonials[activeTestimonial].city}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  style={{
                    width: activeTestimonial === idx ? '2rem' : '0.65rem',
                    height: '0.65rem',
                    borderRadius: '999px',
                    background: activeTestimonial === idx ? 'var(--accent)' : '#cbd5e1',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  aria-label={`Testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. OWNER CTA BANNER */}
      <section className="owner-banner" id="owners" style={{ padding: '5rem 0', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ maxWidth: '600px' }}>
              <span className="eyebrow" style={{ color: '#34d399' }}>FOR PROPERTY OWNERS</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
                Have a Property? List It on Hostel Dazee.
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                Reach thousands of verified students and young professionals. Fill vacancies faster, automate rent collections, and manage beds effortlessly with our smart owner studio.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-accent"
                style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}
                onClick={onOpenOwnerSignup}
              >
                List Your Property →
              </button>
              <a
                href="#contact"
                className="btn btn-outline"
                style={{ color: '#ffffff', borderColor: '#475569' }}
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 12. CONTACT SECTION */}
      <section className="contact-section" id="contact" style={{ padding: '5rem 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="eyebrow">WE’RE HERE TO HELP</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>
              Get in Touch with Our Stay Advisors
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Need help choosing the right hostel or have questions about booking? Reach out to us.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem' }}>
            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
              {contactSubmitted ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                    Message Received!
                  </h3>
                  <p style={{ color: 'var(--text-muted)' }}>
                    Our student advisor will call or email you within 2 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        YOUR NAME
                      </label>
                      <input
                        type="text"
                        required
                        className="filter-select"
                        style={{ width: '100%' }}
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Aarav Mehta"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        required
                        className="filter-select"
                        style={{ width: '100%' }}
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="aarav@college.edu"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        PHONE NUMBER
                      </label>
                      <input
                        type="tel"
                        required
                        className="filter-select"
                        style={{ width: '100%' }}
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        SUBJECT
                      </label>
                      <select
                        className="filter-select"
                        style={{ width: '100%' }}
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      >
                        <option>Accommodation Inquiry</option>
                        <option>Property Owner Listing</option>
                        <option>Payment / Booking Support</option>
                        <option>Campus Partnership</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      MESSAGE
                    </label>
                    <textarea
                      required
                      className="filter-select"
                      style={{ width: '100%', minHeight: '90px' }}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Tell us what college you are attending or any specific requirements..."
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    Send Message →
                  </button>
                </form>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
                <h4 style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>📍 Central Operations Office</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Hostel Dazee Tech Hub, 4th Block Koramangala,<br />
                  Near Sony World Signal, Bengaluru, Karnataka 560034
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
                <h4 style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>📞 Phone & WhatsApp</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Student Helpline: <strong>+91 (80) 4567-8900</strong><br />
                  Owner Support: <strong>+91 98230 11223</strong>
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
                <h4 style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>✉️ Email Support</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Support: <strong>support@hosteldazee.com</strong><br />
                  Listings: <strong>partners@hosteldazee.com</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
