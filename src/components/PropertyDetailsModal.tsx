import React, { useState } from 'react'
import type { Property } from './ExploreListings'
import type { Room, Bed } from './RoomBedSelector'
import { RoomBedSelector } from './RoomBedSelector'

interface PropertyDetailsModalProps {
  property: Property
  rooms: Room[]
  onClose: () => void
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
  'Laundry': '🧺',
  'Housekeeping': '🧹',
  '24/7 CCTV & Security': '📹',
  'CCTV Security': '📹',
  'Power Backup': '⚡',
  'Study Lounge': '📚',
  'Biometric Access': '🔒',
  'Biometric Entry': '🔒',
  'Refrigerator': '🧊',
  'Common Area': '🛋️',
  'Gym Access': '🏋️',
  'Parking': '🚗',
  'Gaming Zone': '🎮',
  'Rooftop Cafe': '☕',
  'Sports Ground': '🏸',
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  property,
  rooms,
  onClose,
  onStartBooking,
  onAddReview,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'rooms' | 'location' | 'amenities' | 'rules' | 'reviews'>('rooms')
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)

  const lat = property.latitude || property.location?.latitude || 12.9352
  const lng = property.longitude || property.location?.longitude || 77.6245
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  const searchUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setReviewSubmitting(true)
    try {
      await onAddReview(property.id, newRating, newComment)
      setReviewSuccess(true)
      setNewComment('')
    } finally {
      setReviewSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: '880px', width: '95%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ×
        </button>

        {/* Gallery Section */}
        <div style={{ padding: '1.5rem 1.5rem 0' }}>
          <div style={{ height: '360px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '0.75rem' }}>
            <img
              src={property.images[activeImageIndex] || property.images[0]}
              alt={property.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {property.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {property.images.map((img, idx) => (
                <button
                  key={img + idx}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    width: '80px',
                    height: '60px',
                    borderRadius: 'var(--radius-sm)',
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
          )}
        </div>

        {/* Property Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-verified">✓ Verified Property</span>
                <span className="badge badge-gender">{property.genderType}</span>
                <span className="badge badge-gender">{property.propertyType}</span>
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                {property.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                  📍 {property.address}, {property.city} {property.landmark && `· ${property.landmark}`}
                </p>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ color: 'var(--accent)', borderColor: 'var(--accent)', fontWeight: 700, padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                >
                  📍 Get Directions
                </a>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#ecfdf5', color: '#047857', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-md)', fontWeight: 700 }}>
                ★ {property.rating} ({property.reviewCount} Reviews)
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                ₹{property.startingRent.toLocaleString('en-IN')}
                <small style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-muted)' }}> / mo</small>
              </div>
            </div>
          </div>

          <p style={{ marginTop: '1rem', color: '#334155', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {property.description}
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 1.5rem', background: '#f8fafc', overflowX: 'auto' }}>
          {[
            { id: 'rooms', label: '🛏️ Rooms & Bed Selector' },
            { id: 'location', label: '📍 Location & Directions' },
            { id: 'amenities', label: '✨ Amenities' },
            { id: 'rules', label: '📋 House Rules' },
            { id: 'reviews', label: '💬 Resident Reviews' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.85rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                border: 'none',
                background: 'transparent',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div style={{ padding: '1.5rem' }}>
          {activeTab === 'rooms' && (
            <RoomBedSelector
              rooms={rooms}
              onBedSelected={({ room, bed }) => onStartBooking({ property, room, bed })}
            />
          )}

          {activeTab === 'location' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                    Location & Neighborhood
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    📍 {property.formattedAddress || `${property.address}, ${property.city}${property.state ? `, ${property.state}` : ''}${property.pincode ? ` ${property.pincode}` : ''}`}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-accent btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                  >
                    📍 Get Directions
                  </a>
                  <a
                    href={searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    🗺️ Open in Google Maps
                  </a>
                </div>
              </div>

              {/* Map Container */}
              <div style={{ height: '320px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative', background: '#e2e8f0', marginBottom: '1.25rem' }}>
                <iframe
                  title={`Map location for ${property.name}`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=15&output=embed`}
                  loading="lazy"
                />
              </div>

              {/* Geographic Coordinates & Landmark highlights */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>GEOGRAPHIC COORDINATES</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                    Lat: {lat.toFixed(5)}, Lng: {lng.toFixed(5)}
                  </div>
                </div>
                <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>CAMPUS PROXIMITY</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                    {property.landmark ? `Walking distance to ${property.landmark}` : 'Central student connectivity hub'}
                  </div>
                </div>
                <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>COMMUTE & SAFETY</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#059669' }}>
                    ✓ Verified walkable transit & street-lit area
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'amenities' && (
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>
                Included Amenities & Services
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.85rem' }}>
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.75rem 1rem',
                      background: '#f8fafc',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{amenityIcons[amenity] || '✅'}</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>
                Community & Stay Guidelines
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(property.houseRules || [
                  'Visitors allowed according to property policy until 9:00 PM',
                  'Strictly no smoking or alcohol on premises',
                  'Maintain quiet hours for studies from 11:00 PM to 6:00 AM',
                  'Valid government ID and college/work ID required at check-in'
                ]).map((rule, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.65rem',
                      background: '#f8fafc',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      fontSize: '0.9rem',
                    }}
                  >
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)' }}>
                  Resident Feedback & Reviews
                </h3>
              </div>

              {/* Submit Review Form */}
              <form
                onSubmit={handleReviewSubmit}
                style={{
                  background: '#f8fafc',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                  Leave a Review
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Rating:</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="filter-select"
                    style={{ width: '120px' }}
                  >
                    <option value={5}>★★★★★ (5/5)</option>
                    <option value={4}>★★★★☆ (4/5)</option>
                    <option value={3}>★★★☆☆ (3/5)</option>
                    <option value={2}>★★☆☆☆ (2/5)</option>
                    <option value={1}>★☆☆☆☆ (1/5)</option>
                  </select>
                </div>
                <textarea
                  required
                  placeholder="Share your experience with facilities, meal quality, or staff support..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    fontSize: '0.9rem',
                    minHeight: '70px',
                    outline: 'none',
                    marginBottom: '0.75rem',
                  }}
                />
                <button type="submit" className="btn btn-accent btn-sm" disabled={reviewSubmitting}>
                  {reviewSubmitting ? 'Posting...' : 'Post Review'}
                </button>
                {reviewSuccess && (
                  <span style={{ marginLeft: '1rem', color: '#059669', fontSize: '0.85rem', fontWeight: 600 }}>
                    ✓ Review posted successfully!
                  </span>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
