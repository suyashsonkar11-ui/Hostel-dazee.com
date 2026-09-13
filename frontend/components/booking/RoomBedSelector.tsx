import React, { useState } from 'react'
import type { Room, Bed } from '../../types'

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
    <div className="room-bed-selector" style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--border)' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
          Interactive Bed Layout & Selection
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Select your desired room and choose an available bed. Double-booking is prevented with real-time locking.
        </p>
      </div>

      {/* Room Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        {rooms.map((room) => {
          const isSelected = (activeRoom && activeRoom.id === room.id)
          const availableCount = room.beds?.filter((b) => b.status === 'AVAILABLE').length || 0
          return (
            <button
              key={room.id}
              onClick={() => {
                setSelectedRoomId(room.id)
                setSelectedBedId('')
              }}
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                background: isSelected ? 'rgba(16, 185, 129, 0.08)' : '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
                minWidth: '150px',
                transition: 'var(--transition-fast)',
              }}
            >
              <div style={{ fontWeight: 700, color: isSelected ? 'var(--accent)' : 'var(--primary)', fontSize: '0.95rem' }}>
                Room {room.roomNumber}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {room.roomType} · Fl {room.floor}
              </div>
              <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: availableCount > 0 ? 'var(--accent)' : '#ef4444', fontWeight: 600 }}>
                {availableCount > 0 ? `${availableCount} bed(s) free` : 'Sold out'}
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected Room Details Bar */}
      {activeRoom && (
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Room {activeRoom.roomNumber}</span>
            <span style={{ margin: '0 0.5rem', color: 'var(--border)' }}>|</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{activeRoom.roomType}</span>
            {activeRoom.ac && <span className="badge badge-verified" style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }}>❄️ AC</span>}
          </div>
          <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.15rem' }}>
            ₹{activeRoom.rent.toLocaleString('en-IN')}<span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-muted)' }}> / mo</span>
          </div>
        </div>
      )}

      {/* Visual Beds Matrix */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          SELECT AN OPEN BED:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
          {activeBeds.map((bed) => {
            const isOccupied = bed.status === 'OCCUPIED'
            const isChosen = selectedBedId === bed.id

            let bg = '#ffffff'
            let border = '1px solid var(--border)'
            let cursor = 'pointer'
            let statusText = 'Available'
            let statusColor = 'var(--accent)'

            if (isOccupied) {
              bg = '#f1f5f9'
              border = '1px solid #cbd5e1'
              cursor = 'not-allowed'
              statusText = 'Occupied'
              statusColor = '#94a3b8'
            } else if (isChosen) {
              bg = 'rgba(16, 185, 129, 0.12)'
              border = '2px solid var(--accent)'
              statusText = 'Selected'
              statusColor = 'var(--accent)'
            }

            return (
              <div
                key={bed.id}
                onClick={() => handleBedClick(bed)}
                style={{
                  background: bg,
                  border,
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem 0.75rem',
                  textAlign: 'center',
                  cursor,
                  transition: 'var(--transition-fast)',
                }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem', opacity: isOccupied ? 0.4 : 1 }}>
                  🛏️
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isOccupied ? '#94a3b8' : 'var(--primary)' }}>
                  {bed.bedNumber}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: statusColor, marginTop: '0.25rem' }}>
                  {statusText}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bed Legend */}
      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.75rem 0', borderTop: '1px solid var(--border)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent)', display: 'inline-block' }}></span>
          <span>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#94a3b8', display: 'inline-block' }}></span>
          <span>Occupied</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', border: '2px solid var(--accent)', display: 'inline-block' }}></span>
          <span>Your Selection</span>
        </div>
      </div>

      {/* Action button */}
      <button
        className="btn btn-accent"
        style={{ width: '100%', padding: '0.85rem' }}
        disabled={!selectedBed}
        onClick={handleProceed}
      >
        {selectedBed
          ? `Proceed with ${selectedBed.bedNumber} in Room ${activeRoom.roomNumber} →`
          : 'Select an Available Bed to Book'}
      </button>
    </div>
  )
}
