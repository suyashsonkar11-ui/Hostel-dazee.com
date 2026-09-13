import React, { useState } from 'react'
import type { Property, Room, Bed } from '../../../types'
import { RoomBedSelector } from '../../../components/booking/RoomBedSelector'

interface PropertyDetailPageProps {
  property: Property
  rooms: Room[]
  onBack: () => void
  onStartBooking: (selection: { property: Property; room: Room; bed: Bed }) => void
  onAddReview: (propertyId: string, rating: number, comment: string) => Promise<void>
}

const amenityIcons: Record<string, string> = {
  'High-Speed Wi-Fi': '📶',
  'Wi-Fi': '📶',
  'Daily Fresh Meals': '🍽️',
  'Food & Meals': '🍽️',
  'Air Conditioning': '❄️',
  'Laundry Service': '🧺',
  'Housekeeping': '🧹',
  '24/7 CCTV & Security': '📹',
  'Power Backup': '⚡',
  'Study Lounge': '📚',
  'Biometric Access': '🔒',
  'Common Area': '🛋️',
  'Gym Access': '🏋️',
  'Gaming Zone': '🎮',
  'Rooftop Cafe': '☕',
  'Sports Ground': '🏸',
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  property,
  rooms,
  onBack,
  onStartBooking,
  onAddReview,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    setSubmittingReview(true)
    try {
      await onAddReview(property.id, rating, comment)
      setReviewSuccess(true)
      setComment('')
    } finally {
      setSubmittingReview(false)
    }
  }

  return (
    <div style={{ padding: '2rem 0 5rem', background: '#f8fafc' }}>
      <div className="container">
        {/* Back Link */}
        <button
          onClick={onBack}
          className="btn btn-outline btn-sm"
          style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          ← Back to Stays
        </button>

        {/* Gallery */}
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '2rem' }}>
          <div style={{ height: '420px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '1rem' }}>
            <img
              src={property.images[activeImageIndex] || property.images[0]}
              alt={property.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {property.images.map((img, idx) => (
              <button
                key={img + idx}
                onClick={() => setActiveImageIndex(idx)}
                style={{
                  width: '90px',
                  height: '65px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: activeImageIndex === idx ? '2px solid var(--accent)' : '2px solid transparent',
                  cursor: 'pointer',
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Property Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '2.5rem' }}>
          {/* Left Column: Info & Visual Bed Selector */}
          <div>
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--border)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-verified">✓ Verified Stay</span>
                <span className="badge badge-gender">{property.genderType}</span>
                <span className="badge badge-gender">{property.propertyType}</span>
              </div>

              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                {property.name}
              </h1>

              <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                📍 {property.address}, {property.city} {property.landmark && `· ${property.landmark}`}
              </div>

              <p style={{ color: '#334155', fontSize: '1rem', lineHeight: 1.7, borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                {property.description}
              </p>
            </div>

            {/* Visual Bed Selection Section */}
            <div style={{ marginBottom: '2rem' }}>
              <RoomBedSelector
                rooms={rooms}
                onBedSelected={({ room, bed }) => onStartBooking({ property, room, bed })}
              />
            </div>

            {/* Amenities Grid */}
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--border)', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem' }}>
                Included Amenities & Living Perks
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.85rem 1rem',
                      background: '#f8fafc',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{amenityIcons[amenity] || '✅'}</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location & Neighborhood Section */}
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--border)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                    Location & Neighborhood
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    📍 {property.formattedAddress || `${property.address}, ${property.city}${property.state ? `, ${property.state}` : ''}${property.pincode ? ` ${property.pincode}` : ''}`}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${property.latitude || property.location?.latitude || 12.9352},${property.longitude || property.location?.longitude || 77.6245}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-accent btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                  >
                    📍 Get Directions
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${property.latitude || property.location?.latitude || 12.9352},${property.longitude || property.location?.longitude || 77.6245}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    🗺️ Open in Google Maps
                  </a>
                </div>
              </div>

              {/* Responsive Map Embed Container */}
              <div style={{ height: '320px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', background: '#e2e8f0', marginBottom: '1.25rem' }}>
                <iframe
                  title={`Map for ${property.name}`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${property.latitude || property.location?.latitude || 12.9352},${property.longitude || property.location?.longitude || 77.6245}&hl=en&z=15&output=embed`}
                  loading="lazy"
                />
              </div>

              {/* Location Metric Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>COORDINATES</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                    {(property.latitude || 12.9352).toFixed(5)}, {(property.longitude || 77.6245).toFixed(5)}
                  </div>
                </div>
                <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>CAMPUS PROXIMITY</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                    {property.landmark ? `Walking distance to ${property.landmark}` : 'Direct access to student campuses'}
                  </div>
                </div>
                <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>STUDENT TRANSIT</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#059669' }}>
                    ✓ Walkable to nearest metro/bus stop
                  </div>
                </div>
              </div>
            </div>

            {/* Resident Reviews */}
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary)' }}>
                  Resident Reviews (★ {property.rating})
                </h3>
              </div>

              {/* Review Form */}
              <form onSubmit={handleReview} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Share Your Stay Experience</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.85rem' }}>Rating:</label>
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="filter-select" style={{ width: '120px' }}>
                    <option value={5}>★★★★★ (5/5)</option>
                    <option value={4}>★★★★☆ (4/5)</option>
                    <option value={3}>★★★☆☆ (3/5)</option>
                  </select>
                </div>
                <textarea
                  required
                  className="filter-select"
                  style={{ width: '100%', minHeight: '80px', marginBottom: '0.75rem' }}
                  placeholder="Tell other students about meal quality, Wi-Fi speed, and warden support..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button type="submit" className="btn btn-accent btn-sm" disabled={submittingReview}>
                  {submittingReview ? 'Posting...' : 'Post Verified Review'}
                </button>
                {reviewSuccess && (
                  <span style={{ marginLeft: '1rem', color: '#059669', fontSize: '0.85rem', fontWeight: 600 }}>
                    ✓ Review posted!
                  </span>
                )}
              </form>
            </div>
          </div>

          {/* Right Column: Pricing card & House Rules */}
          <div>
            <div
              style={{
                position: 'sticky',
                top: '6rem',
                background: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                padding: '1.75rem',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Starting monthly rent</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem' }}>
                ₹{property.startingRent.toLocaleString('en-IN')}
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}> / month</span>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1rem 0', margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Security Deposit:</span>
                  <strong>1 Month (Refundable)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Lock-in Period:</span>
                  <strong>Flexible (1-11 Months)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Move-in:</span>
                  <strong style={{ color: '#059669' }}>Immediate Availability</strong>
                </div>
              </div>

              {/* House Rules */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>
                  Property Guidelines
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>
                  {(property.houseRules || [
                    'Visitors permitted in lobby until 9:00 PM',
                    'Quiet hours from 11 PM to 6 AM',
                    'Strictly non-smoking campus',
                    'Govt ID mandatory at move-in',
                  ]).map((rule, idx) => (
                    <li key={idx} style={{ display: 'flex', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--accent)' }}>•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#rooms"
                className="btn btn-accent"
                style={{ width: '100%', textAlign: 'center' }}
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({ top: 700, behavior: 'smooth' })
                }}
              >
                Select Room & Bed →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
