import React, { useState, useMemo } from 'react'
import type { Property } from '../../types'
import { PropertyCard } from '../../components/property/PropertyCard'

interface ExplorePageProps {
  properties: Property[]
  initialCity?: string
  onSelectProperty: (p: Property) => void
  onBookProperty: (p: Property) => void
  onNavigateHome: () => void
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  properties,
  initialCity = 'All',
  onSelectProperty,
  onBookProperty,
}) => {
  // Filters State
  const [search, setSearch] = useState('')
  const [selectedCity, setSelectedCity] = useState(initialCity)
  const [selectedType, setSelectedType] = useState('All')
  const [selectedGender, setSelectedGender] = useState('All')
  const [maxRent, setMaxRent] = useState(25000)
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  // Wishlist state
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

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    )
  }

  // Filter & Sort Logic
  const filteredAndSorted = useMemo(() => {
    let result = properties.filter((p) => {
      const textMatch = `${p.name} ${p.city} ${p.address} ${p.landmark || ''}`
        .toLowerCase()
        .includes(search.toLowerCase())

      const cityMatch = selectedCity === 'All' || p.city.toLowerCase() === selectedCity.toLowerCase()
      const typeMatch = selectedType === 'All' || p.propertyType.toLowerCase() === selectedType.toLowerCase()
      const genderMatch = selectedGender === 'All' || p.genderType.toLowerCase().includes(selectedGender.toLowerCase())
      const rentMatch = p.startingRent <= maxRent

      const amenitiesMatch =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((a) => p.amenities.some((pa) => pa.toLowerCase().includes(a.toLowerCase())))

      return textMatch && cityMatch && typeMatch && genderMatch && rentMatch && amenitiesMatch
    })

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.startingRent - b.startingRent)
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.startingRent - a.startingRent)
    } else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating)
    }

    return result
  }, [properties, search, selectedCity, selectedType, selectedGender, maxRent, sortBy, selectedAmenities])

  const clearAllFilters = () => {
    setSearch('')
    setSelectedCity('All')
    setSelectedType('All')
    setSelectedGender('All')
    setMaxRent(25000)
    setSelectedAmenities([])
    setSortBy('recommended')
  }

  return (
    <div style={{ padding: '2rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Breadcrumb & Title Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Home / <strong style={{ color: 'var(--primary)' }}>Explore Accommodations</strong>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)' }}>
              Student Stays & PGs Across India
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Showing {filteredAndSorted.length} verified accommodations
            </p>
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="filter-select"
              style={{ minWidth: '180px' }}
            >
              <option value="recommended">⭐ Recommended</option>
              <option value="price-asc">💵 Price: Low to High</option>
              <option value="price-desc">💎 Price: High to Low</option>
              <option value="rating">★ Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
          {/* Desktop Filter Sidebar */}
          <aside
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border)',
              padding: '1.5rem',
              height: 'fit-content',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>Filters</h3>
              <button
                onClick={clearAllFilters}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Clear All
              </button>
            </div>

            {/* City Filter */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                City / Location
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="All">All Cities</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Chennai">Chennai</option>
                <option value="Kanpur">Kanpur</option>
                <option value="Lucknow">Lucknow</option>
                <option value="Bhopal">Bhopal</option>
                <option value="Bilaspur">Bilaspur</option>
              </select>
            </div>

            {/* Property Type */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Stay Type
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Co-living">Co-living</option>
                <option value="PG">Student PG</option>
                <option value="Hostel">University Hostel</option>
              </select>
            </div>

            {/* Gender Type */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Gender Preference
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <option value="All">Any Gender</option>
                <option value="Unisex">Unisex / Co-ed</option>
                <option value="Girls">Girls Only</option>
                <option value="Boys">Boys Only</option>
              </select>
            </div>

            {/* Budget Range */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                <span>MAX BUDGET</span>
                <strong style={{ color: 'var(--primary)' }}>₹{maxRent.toLocaleString('en-IN')}/mo</strong>
              </div>
              <input
                type="range"
                min={4000}
                max={25000}
                step={500}
                value={maxRent}
                onChange={(e) => setMaxRent(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
            </div>

            {/* Amenities Checkboxes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Essential Amenities
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                {[
                  { id: 'Wi-Fi', label: '📶 High-Speed Wi-Fi' },
                  { id: 'Meal', label: '🍽️ Daily Fresh Meals' },
                  { id: 'Conditioning', label: '❄️ Air Conditioning (AC)' },
                  { id: 'Laundry', label: '🧺 Laundry Service' },
                  { id: 'Security', label: '📹 24/7 CCTV & Security' },
                  { id: 'Power', label: '⚡ Power Backup' },
                ].map((item) => (
                  <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(item.id)}
                      onChange={() => toggleAmenity(item.id)}
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Listings Grid */}
          <main>
            {/* Search Box */}
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <input
                type="text"
                className="filter-select"
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', fontSize: '0.95rem' }}
                placeholder="Search college name, metro station, landmark or locality..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span style={{ position: 'absolute', left: '0.85rem', top: '0.75rem', color: '#94a3b8' }}>
                🔍
              </span>
            </div>

            {filteredAndSorted.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  No properties found
                </h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                  Try relaxing your price slider or search in a nearby university campus.
                </p>
                <button className="btn btn-accent btn-sm" onClick={clearAllFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="properties-grid">
                {filteredAndSorted.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isWishlisted={wishlist.includes(property.id)}
                    onToggleWishlist={toggleWishlist}
                    onSelect={onSelectProperty}
                    onBook={onBookProperty}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
