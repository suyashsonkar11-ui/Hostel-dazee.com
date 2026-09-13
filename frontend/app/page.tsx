import React from 'react'
import type { Property, User } from '../types'
import { Hero } from '../components/property/Hero'
import { PopularLocations } from '../components/property/PopularLocations'
import { PropertyCard } from '../components/property/PropertyCard'
import { ContentSections } from '../components/property/ContentSections'
import { FAQAccordion } from '../components/ui/FAQAccordion'

interface HomePageProps {
  properties: Property[]
  user: User | null
  onSelectProperty: (property: Property) => void
  onBookProperty: (property: Property) => void
  onSelectCity: (city: string) => void
  onOpenOwnerSignup: () => void
  wishlist: string[]
  onToggleWishlist: (id: string, e: React.MouseEvent) => void
}

export const HomePage: React.FC<HomePageProps> = ({
  properties,
  onSelectProperty,
  onBookProperty,
  onSelectCity,
  onOpenOwnerSignup,
  wishlist,
  onToggleWishlist,
}) => {
  const featuredProperties = properties.filter((p) => p.featured)

  return (
    <>
      {/* 2. Hero + Search */}
      <Hero
        onSearch={({ city }) => {
          onSelectCity(city)
        }}
      />

      {/* 3. Popular Locations */}
      <PopularLocations onSelectCity={onSelectCity} />

      {/* 4. Featured Properties */}
      <section style={{ padding: '5rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="eyebrow">HANDPICKED EXPERIENCES</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                Featured Student Stays
              </h2>
              <p style={{ color: 'var(--text-muted)' }}>Top rated co-living homes with maximum amenities and verified ratings.</p>
            </div>
          </div>

          <div className="properties-grid">
            {featuredProperties.slice(0, 3).map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                isWishlisted={wishlist.includes(prop.id)}
                onToggleWishlist={onToggleWishlist}
                onSelect={onSelectProperty}
                onBook={onBookProperty}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Dazee, 6. How It Works, 8. Testimonials, 9. Owner CTA, 10. About */}
      <ContentSections onOpenOwnerSignup={onOpenOwnerSignup} />

      {/* 7. All Verified Stays Grid */}
      <section style={{ padding: '5rem 0', background: '#ffffff', borderTop: '1px solid var(--border)' }} id="stays">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="eyebrow">EXPLORE OUR COLLECTION</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>
              Verified Accommodations Ready for Move-In
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Choose your university city, inspect floor plans, and reserve your bed.
            </p>
          </div>

          <div className="properties-grid">
            {properties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                isWishlisted={wishlist.includes(prop.id)}
                onToggleWishlist={onToggleWishlist}
                onSelect={onSelectProperty}
                onBook={onBookProperty}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ Accordion */}
      <FAQAccordion />
    </>
  )
}
