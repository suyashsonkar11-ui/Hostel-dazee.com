import React, { useState } from 'react'

interface ContentSectionsProps {
  onOpenOwnerSignup: () => void
}

const destinations = [
  { name: 'Bengaluru', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=900&q=85' },
  { name: 'Pune', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=85' },
  { name: 'Delhi NCR', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&q=85' },
  { name: 'Hyderabad', image: 'https://images.unsplash.com/photo-1572449043415-55f4685a9f4b?auto=format&fit=crop&w=900&q=85' },
  { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=900&q=85' },
  { name: 'Chennai', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=85' },
]

const services = [
  ['🏠', 'Move-in ready rooms', 'Comfortable spaces with the essentials already sorted.'],
  ['🛡️', 'Verified & secure', 'Property details, amenities and availability presented clearly.'],
  ['⚡', 'Fast booking', 'Compare, select your room and start your booking journey online.'],
  ['🎓', 'Student-first support', 'Help with shortlisting, booking and settling into a new city.'],
  ['📶', 'Everyday essentials', 'Wi-Fi, meals, laundry and other amenities where available.'],
  ['💬', 'Resident support', 'A simple way to reach the Hostel Dazee support team.'],
]

const testimonials = [
  {
    name: 'Rohan Deshmukh',
    role: 'Student · Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'Hostel Dazee made comparing student stays much easier. I could check the room options and amenities before deciding where to stay.',
  },
  {
    name: 'Ananya Kulkarni',
    role: 'Student · Pune',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'The biggest difference for me was having student-focused information in one place instead of searching through dozens of listings.',
  },
  {
    name: 'Vikram Singh',
    role: 'Student · Delhi NCR',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'The property details and bed selection made the booking process feel much more transparent.',
  },
]

const faqs = [
  ['What is Hostel Dazee?', 'Hostel Dazee is a student accommodation platform for discovering hostels, PGs and co-living spaces near universities and major student hubs.'],
  ['How do I find a property?', 'Use the homepage search or Explore Stays page to filter by city and browse available properties. Open a property to view its rooms, beds, amenities and booking options.'],
  ['Can I choose a specific bed?', 'Where bed-level availability is provided by a property, you can select an available bed during the property and booking flow.'],
  ['Can property owners list their property?', 'Yes. Owners can use the List Your Property flow to create an owner account and manage their listings through the owner dashboard.'],
  ['How does payment work right now?', 'The current booking flow uses the temporary demo payment mode. The live payment gateway can be enabled later without changing the accommodation discovery experience.'],
]

export const ContentSections: React.FC<ContentSectionsProps> = ({ onOpenOwnerSignup }) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <>
      <section className="dazee-destinations" id="destinations">
        <div className="container">
          <div className="dazee-section-heading">
            <div>
              <span className="eyebrow">DISCOVER YOUR CITY</span>
              <h2>Popular student destinations</h2>
              <p>Explore accommodation in the places where students study, work and build their next chapter.</p>
            </div>
            <a href="/explore">View all stays →</a>
          </div>

          <div className="dazee-destination-grid">
            {destinations.map((destination) => (
              <a href="/explore" className="dazee-destination-card" key={destination.name}>
                <img src={destination.image} alt={destination.name} loading="lazy" />
                <div className="dazee-destination-overlay" />
                <strong>{destination.name}</strong>
                <span>Explore stays →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="dazee-stats-band">
        <div className="container dazee-stats-grid">
          {[
            ['500+', 'Verified stays'],
            ['25+', 'Student cities'],
            ['10K+', 'Residents served'],
            ['4.8/5', 'Resident rating'],
          ].map(([value, label]) => (
            <div className="dazee-stat" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="dazee-services" id="services">
        <div className="container">
          <div className="dazee-section-heading centered">
            <div>
              <span className="eyebrow">MORE THAN A ROOM</span>
              <h2>Everything you need to settle in</h2>
              <p>From discovery to move-in, Hostel Dazee is designed around the student journey.</p>
            </div>
          </div>

          <div className="dazee-service-grid">
            {services.map(([icon, title, description]) => (
              <article className="dazee-service-card" key={title}>
                <div className="dazee-service-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dazee-about" id="about">
        <div className="container dazee-about-grid">
          <div className="dazee-about-copy">
            <span className="eyebrow">THE DAZEE DIFFERENCE</span>
            <h2>Housing made around your student life.</h2>
            <p>
              Finding a room in a new city should feel exciting, not overwhelming. Hostel Dazee brings
              properties, room choices, amenities and booking into one focused experience.
            </p>
            <div className="dazee-check-list">
              {[
                'Clear property information',
                'Student-focused discovery',
                'Room and bed availability',
                'Simple digital booking journey',
              ].map((item) => (
                <div key={item}><span>✓</span>{item}</div>
              ))}
            </div>
            <a className="btn btn-accent" href="/explore">Explore properties →</a>
          </div>
          <div className="dazee-about-visual">
            <img
              src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1400&q=85"
              alt="Modern student accommodation"
              loading="lazy"
            />
            <div className="dazee-about-badge">
              <strong>Student-first</strong>
              <span>Built for finding your next home</span>
            </div>
          </div>
        </div>
      </section>

      <section className="dazee-steps" id="how">
        <div className="container">
          <div className="dazee-section-heading centered">
            <div>
              <span className="eyebrow">HOW IT WORKS</span>
              <h2>Book your place in 4 easy steps</h2>
              <p>Search, compare and move into a place that feels right for you.</p>
            </div>
          </div>
          <div className="dazee-step-grid">
            {[
              ['01', 'Discover', 'Search by city and explore student-friendly properties.'],
              ['02', 'Compare', 'Review rooms, amenities, location and available beds.'],
              ['03', 'Choose', 'Select your preferred room and available bed.'],
              ['04', 'Book', 'Complete the booking flow and get ready to move in.'],
            ].map(([number, title, description]) => (
              <div className="dazee-step" key={number}>
                <span>{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dazee-owner-cta" id="owners">
        <div className="container">
          <div>
            <span className="eyebrow">FOR PROPERTY OWNERS</span>
            <h2>Have a property? Put it in front of students.</h2>
            <p>List your rooms, manage availability and connect your property with students searching for their next home.</p>
          </div>
          <button className="btn dazee-owner-button" onClick={onOpenOwnerSignup}>List Your Property →</button>
        </div>
      </section>

      <section className="dazee-testimonials">
        <div className="container">
          <div className="dazee-section-heading centered">
            <div>
              <span className="eyebrow">STUDENT STORIES</span>
              <h2>People who found their place</h2>
            </div>
          </div>
          <div className="dazee-testimonial-card">
            <div className="dazee-stars">{'★'.repeat(testimonials[activeTestimonial].rating || 5)}</div>
            <p>“{testimonials[activeTestimonial].text}”</p>
            <div className="dazee-testimonial-person">
              <img src={testimonials[activeTestimonial].avatar} alt={testimonials[activeTestimonial].name} />
              <div><strong>{testimonials[activeTestimonial].name}</strong><span>{testimonials[activeTestimonial].role}</span></div>
            </div>
          </div>
          <div className="dazee-dots">
            {testimonials.map((item, index) => (
              <button key={item.name} className={index === activeTestimonial ? 'active' : ''} onClick={() => setActiveTestimonial(index)} aria-label={`Show testimonial ${index + 1}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="dazee-faq" id="faq">
        <div className="container">
          <div className="dazee-section-heading centered">
            <div>
              <span className="eyebrow">NEED TO KNOW</span>
              <h2>Frequently asked questions</h2>
            </div>
          </div>
          <div className="dazee-faq-list">
            {faqs.map(([question, answer], index) => (
              <div className={`dazee-faq-item ${openFaq === index ? 'open' : ''}`} key={question}>
                <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                  <span>{question}</span><b>{openFaq === index ? '−' : '+'}</b>
                </button>
                {openFaq === index && <p>{answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dazee-contact" id="contact">
        <div className="container">
          <span className="eyebrow">WE'RE HERE TO HELP</span>
          <h2>Need help finding your stay?</h2>
          <p>Reach the Hostel Dazee team for accommodation, booking and property-listing support.</p>
          <div className="dazee-contact-grid">
            <a href="mailto:support@hosteldazee.com"><span>✉</span><strong>Email us</strong><small>support@hosteldazee.com</small></a>
            <a href="tel:+918045678900"><span>☎</span><strong>Call support</strong><small>+91 80 4567 8900</small></a>
            <a href="/explore"><span>⌕</span><strong>Explore stays</strong><small>Find your next home</small></a>
          </div>
        </div>
      </section>

      <footer className="dazee-footer">
        <div className="container">
          <div className="dazee-footer-grid">
            <div className="dazee-footer-brand">
              <div className="brand-logo"><span className="brand-icon">D</span><span>Hostel Dazee<span className="brand-dot">.</span></span></div>
              <p>Find your place. Live your journey.</p>
            </div>
            <div><h4>Discover</h4><a href="/explore">Explore Stays</a><a href="#destinations">Popular Cities</a><a href="#how">How It Works</a></div>
            <div><h4>Hostel Dazee</h4><a href="#about">About Us</a><a href="#owners">For Owners</a><a href="#contact">Contact</a></div>
            <div><h4>Support</h4><a href="#faq">FAQs</a><a href="#contact">Help Centre</a><a href="/login">Login</a></div>
          </div>
          <div className="dazee-footer-bottom">
            <span>© {new Date().getFullYear()} Hostel Dazee. All rights reserved.</span>
            <span>Student accommodation, simplified.</span>
          </div>
        </div>
      </footer>

      <nav className="dazee-mobile-bottom-nav" aria-label="Mobile navigation">
        <a href="/explore"><span>⌕</span><b>Explore</b></a>
        <a href="/explore"><span>♡</span><b>Wishlist</b></a>
        <a href="#contact"><span>◉</span><b>Support</b></a>
        <a href="/login"><span>◯</span><b>Profile</b></a>
      </nav>
    </>
  )
}
