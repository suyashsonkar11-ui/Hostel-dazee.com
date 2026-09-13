import React, { useState } from 'react'

export interface Bed {
  id: string
  roomId: string
  bedNumber: string
  status: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'MAINTENANCE'
  occupantName?: string
}

export interface Room {
  id: string
  propertyId: string
  roomNumber: string
  floor: number
  roomType: string
  rent: number
  ac: boolean
  sharingCapacity: number
  status?: string
  features?: string[]
  beds?: Bed[]
}

interface RoomBedSelectorProps {
  rooms: Room[]
  onBedSelected: (selection: { room: Room; bed: Bed }) => void
}

export const RoomBedSelector: React.FC<RoomBedSelectorProps> = ({ rooms, onBedSelected }) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || '')
  const [selectedBedId, setSelectedBedId] = useState<string>('')

  const activeRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0]
  const activeBeds = activeRoom?.beds || []
  const selectedBed = activeBeds.find((b) => b.id === selectedBedId)

  const handleBedClick = (bed: Bed) => {
    if (bed.status === 'OCCUPIED') return
    setSelectedBedId(bed.id)
  }

  const handleProceed = () => {
    if (activeRoom && selectedBed) {
      onBedSelected({ room: activeRoom, bed: selectedBed })
    }
  }

  if (!rooms.length) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
        No rooms configured for this property yet.
      </div>
    )
  }

  return (
    <div className="room-bed-selector">
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
          Select Your Room & Preferred Bed
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Choose your sharing configuration, floor preference, and pick an available bed unit in real time.
        </p>
      </div>

      {/* Room Category Tabs */}
      <div className="room-tabs">
        {rooms.map((room) => {
          const availableCount = (room.beds || []).filter((b) => b.status === 'AVAILABLE').length
          return (
            <button
              key={room.id}
              className={`room-tab-btn ${selectedRoomId === room.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedRoomId(room.id)
                setSelectedBedId('') // reset bed selection on room switch
              }}
            >
              <span>Room {room.roomNumber} ({room.roomType})</span>
              <span
                style={{
                  marginLeft: '0.5rem',
                  fontSize: '0.75rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '999px',
                  background: selectedRoomId === room.id ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                  color: selectedRoomId === room.id ? '#fff' : 'var(--text-muted)',
                }}
              >
                {availableCount} available
              </span>
            </button>
          )
        })}
      </div>

      {/* Selected Room Specifications Banner */}
      {activeRoom && (
        <div className="room-details-banner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>
                Room {activeRoom.roomNumber} · Floor {activeRoom.floor}
              </strong>
              <span className="badge" style={{ background: activeRoom.ac ? '#e0f2fe' : '#f1f5f9', color: activeRoom.ac ? '#0369a1' : '#475569' }}>
                {activeRoom.ac ? '❄️ Air Conditioned' : '🌀 Natural Ventilation'}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {activeRoom.features?.join(' · ') || 'Wardrobe · Workstation · High-Speed Wi-Fi'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monthly Rent</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent)' }}>
              ₹{activeRoom.rent.toLocaleString('en-IN')}
              <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}> / mo</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Visual Bed Grid */}
      <div style={{ marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
        FLOOR PLAN BEDS:
      </div>

      <div className="bed-grid">
        {activeBeds.map((bed) => {
          const isSelected = selectedBedId === bed.id
          const isOccupied = bed.status === 'OCCUPIED'
          return (
            <div
              key={bed.id}
              className={`bed-unit ${isSelected ? 'selected' : isOccupied ? 'occupied' : 'available'}`}
              onClick={() => handleBedClick(bed)}
            >
              <span className="bed-icon-visual">🛏️</span>
              <span className="bed-name">{bed.bedNumber}</span>
              <span className="bed-status-tag">
                {isSelected ? 'Selected' : isOccupied ? 'Occupied' : 'Available'}
              </span>
              {isOccupied && bed.occupantName && (
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', textAlign: 'center' }}>
                  {bed.occupantName}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Selection Summary & Booking Action */}
      {activeRoom && selectedBed ? (
        <div className="bed-selection-summary">
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>
              CURRENT SELECTION
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              Room {activeRoom.roomNumber} — {selectedBed.bedNumber} ({activeRoom.roomType})
            </div>
            <div style={{ fontSize: '0.85rem', color: '#34d399' }}>
              ₹{activeRoom.rent.toLocaleString('en-IN')}/month · Ready for move-in
            </div>
          </div>

          <button className="btn btn-accent" onClick={handleProceed} style={{ padding: '0.75rem 1.75rem' }}>
            Continue to Booking →
          </button>
        </div>
      ) : (
        <div
          style={{
            background: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
          }}
        >
          👆 Click on any <strong style={{ color: '#059669' }}>Available</strong> bed unit above to select your stay.
        </div>
      )}
    </div>
  )
}
