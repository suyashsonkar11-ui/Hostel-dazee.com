import React, { useState } from 'react'

export interface Property {
  id: string
  name: string
  tagline?: string
  description?: string
  propertyType: string
  genderType: string
  address: string
  city: string
  state?: string
  pincode?: string
  landmark?: string
  formattedAddress?: string
  latitude?: number
  longitude?: number
  location?: {
    address: string
    city: string
    state: string
    pincode: string
    formattedAddress: string
    latitude: number
    longitude: number
  }
  startingRent: number
  rating: number
  reviewCount: number
  images: string[]
  amenities: string[]
  houseRules?: string[]
  featured?: boolean
  totalRooms?: number
  totalBeds?: number
  availableBeds?: number
}

interface ExploreListingsProps {
  properties: Property[]
  onSelectProperty: (property: Property) => void
  onBookDirect: (property: Property) => void
  selectedCity: string
  onCityChange: (city: string) => void
}

export const ExploreListings: React.FC<ExploreListingsProps> = ({
  properties,
  onSelectProperty,
  onBookDirect,
  selectedCity,
  onCityChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [propertyType, setPropertyType] = useState('All stays')
  const [genderFilter, setGenderFilter] = useState('All')
  const [maxPrice, setMaxPrice] = useState(20000)
  const [selectedAmenity, setSelectedAmenity] = useState('All')
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('dazee-wishlist') || '[]')
    } catch {
      return []
    }
  })

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = wishlist.includes(id) ? wishlist.filter((item) => item !== id) : [...wishlist, id]
    setWishlist(next)
    localStorage.setItem('dazee-wishlist', JSON.stringify(next))
  }

  // Client-side filtering for fast responsive typing
  const filtered = properties.filter((p) => {
    const matchesSearch =
      `${p.name} ${p.city} ${p.address} ${p.landmark || ''}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

    const matchesCity = selectedCity === 'All' || p.city.toLowerCase() === selectedCity.toLowerCase()

    const matchesType =
      propertyType === 'All stays' ||
      p.propertyType.toLowerCase() === propertyType.toLowerCase()

    const matchesGender =
      genderFilter === 'All' ||
      p.genderType.toLowerCase().includes(genderFilter.toLowerCase())

    const matchesPrice = p.startingRent <= maxPrice

    const matchesAmenity =
      selectedAmenity === 'All' ||
      p.amenities?.some((a) => a.toLowerCase().includes(selectedAmenity.toLowerCase()))

    return matchesSearch && matchesCity && matchesType && matchesGender && matchesPrice && matchesAmenity
  })

  return (
    <section className="explore-section" id="stays">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div>
            <span className="eyebrow">CURATED SPACES FOR EVERY NEED</span>
            <h2 className="section-title">Explore Verified Accommodations</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Showing {filtered.length} verified stays ready for immediate move-in
            </p>
          </div>

          {/* City quick pills */}
          <div className="filter-pills-group">
            {['All', 'Bengaluru', 'Pune', 'Delhi NCR', 'Hyderabad', 'Mumbai', 'Chennai'].map((city) => (
              <button
                key={city}
                className={`filter-pill ${selectedCity === city ? 'active' : ''}`}
                onClick={() => onCityChange(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Filter Bar */}
        <div className="filters-bar">
          <div className="filters-primary-row">
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <input
                type="text"
                placeholder="Search by college, campus, landmark or locality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  outline: 'none',
                }}
              />
              <span style={{ position: 'absolute', left: '0.75rem', top: '0.65rem', color: '#94a3b8' }}>
                🔍
              </span>
            </div>

            {/* Type selector */}
            <div className="filter-pills-group">
              {['All stays', 'Co-living', 'PG', 'Hostel'].map((t) => (
                <button
                  key={t}
                  className={`filter-pill ${propertyType === t ? 'active' : ''}`}
                  onClick={() => setPropertyType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filter Controls */}
          <div className="filters-secondary-grid">
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                GENDER TYPE
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <option value="All">All Genders</option>
                <option value="Unisex">Unisex / Co-ed</option>
                <option value="Girls">Girls Only</option>
                <option value="Boys">Boys Only</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                KEY AMENITY
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={selectedAmenity}
                onChange={(e) => setSelectedAmenity(e.target.value)}
              >
                <option value="All">All Amenities</option>
                <option value="Wi-Fi">Wi-Fi (High Speed)</option>
                <option value="Meal">Daily Fresh Meals</option>
                <option value="Conditioning">Air Conditioning (AC)</option>
                <option value="Laundry">Laundry Service</option>
                <option value="Security">24/7 Security / CCTV</option>
                <option value="Power">Power Backup</option>
              </select>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                <span>MAX MONTHLY BUDGET</span>
                <strong style={{ color: 'var(--primary)' }}>₹{maxPrice.toLocaleString('en-IN')}/mo</strong>
              </div>
              <input
                type="range"
                min={5000}
                max={25000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏠</div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>No stays match your criteria</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Try clearing some filters or searching a nearby university or landmark.</p>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                setSearchQuery('')
                setPropertyType('All stays')
                setGenderFilter('All')
                setMaxPrice(25000)
                setSelectedAmenity('All')
                onCityChange('All')
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="properties-grid">
            {filtered.map((property) => (
              <article
                className="property-card"
                key={property.id}
                onClick={() => onSelectProperty(property)}
                style={{ cursor: 'pointer' }}
              >
                {/* Media Image */}
                <div className="card-media">
                  <img src={property.images[0]} alt={property.name} loading="lazy" />
                  <div className="card-badges-top">
                    <span className="badge badge-verified">✓ Verified</span>
                    {property.featured && <span className="badge badge-featured">★ Dazee Pick</span>}
                    <span className="badge badge-gender">{property.genderType}</span>
                  </div>
                  <button
                    className="card-wishlist-btn"
                    onClick={(e) => toggleWishlist(property.id, e)}
                    title={wishlist.includes(property.id) ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    {wishlist.includes(property.id) ? '❤️' : '🤍'}
                  </button>
                </div>

                {/* Card Body */}
                <div className="card-body">
                  <div className="card-title-row">
                    <h3 className="card-title">{property.name}</h3>
                    <span className="card-rating">★ {property.rating}</span>
                  </div>

                  <div className="card-location" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      📍 {property.address}, {property.city}
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${property.latitude || property.location?.latitude || 12.9352},${property.longitude || property.location?.longitude || 77.6245}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, flexShrink: 0, marginLeft: '0.5rem', textDecoration: 'underline' }}
                      title="Open property location in Google Maps"
                    >
                      📍 View Location
                    </a>
                  </div>

                  {/* Amenities Chips */}
                  <div className="card-amenities-row">
                    {property.amenities.slice(0, 4).map((amenity) => (
                      <span key={amenity} className="card-amenity-chip">
                        {amenity}
                      </span>
                    ))}
                    {property.amenities.length > 4 && (
                      <span className="card-amenity-chip">
                        +{property.amenities.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Card Footer with Price & Actions */}
                  <div className="card-footer-row">
                    <div className="card-price-block">
                      <span>Starting from</span>
                      <strong>
                        ₹{property.startingRent.toLocaleString('en-IN')}
                        <small> / month</small>
                      </strong>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectProperty(property)
                        }}
                      >
                        View Details
                      </button>
                      <button
                        className="btn btn-accent btn-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onBookDirect(property)
                        }}
                      >
                        Book Bed
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
