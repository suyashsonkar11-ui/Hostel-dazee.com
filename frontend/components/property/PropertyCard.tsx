import React from 'react'
import type { Property } from '../../types'

interface PropertyCardProps {
  property: Property
  isWishlisted: boolean
  onToggleWishlist: (id: string, e: React.MouseEvent) => void
  onSelect: (property: Property) => void
  onBook: (property: Property) => void
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isWishlisted,
  onToggleWishlist,
  onSelect,
  onBook,
}) => {
  return (
    <article
      className="property-card"
      onClick={() => onSelect(property)}
      style={{ cursor: 'pointer' }}
    >
      {/* Media Image with Badges */}
      <div className="card-media">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=85'}
          alt={property.name}
          loading="lazy"
        />
        <div className="card-badges-top">
          <span className="badge badge-verified">✓ Verified</span>
          {property.featured && <span className="badge badge-featured">★ Dazee Pick</span>}
          <span className="badge badge-gender">{property.genderType}</span>
        </div>
        <button
          className="card-wishlist-btn"
          onClick={(e) => onToggleWishlist(property.id, e)}
          title={isWishlisted ? 'Remove from saved' : 'Save to wishlist'}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Card Body */}
      <div className="card-body">
        <div className="card-title-row">
          <h3 className="card-title">{property.name}</h3>
          <span className="card-rating">★ {property.rating}</span>
        </div>

        <div className="card-location">
          <span>📍</span>
          <span>{property.address}, {property.city}</span>
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

        {/* Footer with Starting Price & Actions */}
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
                onSelect(property)
              }}
            >
              View Details
            </button>
            <button
              className="btn btn-accent btn-sm"
              onClick={(e) => {
                e.stopPropagation()
                onBook(property)
              }}
            >
              Book Bed
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
