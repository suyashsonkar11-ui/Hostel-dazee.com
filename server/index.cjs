const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const STORE_KEY = process.env.STORE_KEY || 'hostel-dazee:app-state'
const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN
let memoryStore = null
let loadPromise = null

async function redisCommand(command, args = []) {
  if (!redisUrl || !redisToken) return null
  const base = redisUrl.replace(/\/$/, '')
  const url = base + '/' + command.toLowerCase() + (args.length ? '/' + args.map((v) => encodeURIComponent(String(v))).join('/') : '')
  const response = await fetch(url, { headers: { Authorization: 'Bearer ' + redisToken } })
  if (!response.ok) throw new Error('Persistent store request failed: ' + response.status)
  const payload = await response.json()
  if (payload.error) throw new Error(payload.error)
  return payload.result
}

async function ensureStore() {
  if (memoryStore) return memoryStore
  if (loadPromise) return loadPromise
  loadPromise = (async () => {
    if (!redisUrl || !redisToken) {
      if (process.env.NODE_ENV === 'production') throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required in production')
      return null
    }
    const stored = await redisCommand('get', [STORE_KEY])
    if (stored) memoryStore = JSON.parse(stored)
    else {
      const initial = { users: [], properties: [], rooms: [], beds: [], bookings: [], payments: [], reviews: [] }
      try { Object.assign(initial, JSON.parse(fs.readFileSync(dataPath, 'utf8'))) } catch (_) {}
      memoryStore = initial
      await redisCommand('set', [STORE_KEY, JSON.stringify(memoryStore)])
    }
    return memoryStore
  })()
  try { return await loadPromise } finally { loadPromise = null }
}

const app = express()
const port = process.env.PORT || 5050
const dataPath = path.resolve(process.env.DATA_FILE || 'server/data.json')
const secret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev-only-hostel-dazee-secret')
if (!secret) throw new Error('JWT_SECRET is required in production')

const allowedOrigins = (process.env.FRONTEND_URL || '').split(',').map((v) => v.trim()).filter(Boolean)
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true, credentials: true }))
app.use(express.json({ limit: '5mb' }))

const read = async () => { const store = await ensureStore(); return store || { users: [], properties: [], rooms: [], beds: [], bookings: [], payments: [], reviews: [] } }
const write = async (data) => { memoryStore = data; if (redisUrl && redisToken) await redisCommand('set', [STORE_KEY, JSON.stringify(data)]) }

const response = (res, data, message = 'OK', code = 200) =>
  res.status(code).json({ success: code < 400, message, data })

const tokenFor = (user) =>
  jwt.sign({ id: user.id, role: user.role, email: user.email, name: user.name }, secret, { expiresIn: '7d' })

async function auth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return response(res, null, 'Authentication required', 401)
  try {
    const decoded = jwt.verify(header.slice(7), secret)
    const db = await read()
    const foundUser = db.users.find((u) => u.id === decoded.id)
    if (!foundUser) return response(res, null, 'User account not found', 401)
    if (foundUser.isActive === false || foundUser.status === 'suspended') {
      return response(res, null, 'Your account has been suspended. Please contact Hostel Dazee support.', 403)
    }
    req.user = { id: foundUser.id, role: foundUser.role, email: foundUser.email, name: foundUser.name }
    req.currentUser = foundUser
    next()
  } catch (_e) {
    return response(res, null, 'Invalid or expired session', 401)
  }
}

const authorizeRoles = (...allowed) => (req, res, next) =>
  allowed.includes(req.user.role) ? next() : response(res, null, 'Permission denied', 403)

// --- SYSTEM & HEALTH ---
app.get('/api/health', async (req, res) =>
  response(res, { status: 'ok', time: new Date().toISOString() }, 'Hostel Dazee API is operational')
)

// --- AUTHENTICATION ---
app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, password, role = 'student' } = req.body
  if (!name || !email || !password || !['student', 'owner'].includes(role)) {
    return response(res, null, 'Name, email, password and a valid role are required', 400)
  }
  if (password.length < 6) {
    return response(res, null, 'Password must be at least 6 characters long', 400)
  }
  const db = await read()
  if (db.users.some((user) => user.email === email.toLowerCase())) {
    return response(res, null, 'An account with this email already exists', 409)
  }

  const user = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    phone: phone || '',
    passwordHash: await bcrypt.hash(password, 10),
    role,
    isActive: true,
    createdAt: new Date().toISOString(),
  }

  db.users.push(user)
  await write(db)

  return response(
    res,
    {
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
      token: tokenFor(user),
    },
    'Account successfully created',
    201
  )
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return response(res, null, 'Please provide email and password', 400)
  }
  const db = await read()
  const user = db.users.find(
    (item) => item.email === String(email).toLowerCase().trim() || item.phone === String(email).trim()
  )

  if (!user) {
    return response(res, null, 'Invalid email or password', 401)
  }
  if (!user.isActive) {
    return response(res, null, 'Account has been suspended. Please contact support.', 403)
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash)
  if (!isMatch) {
    return response(res, null, 'Invalid email or password', 401)
  }

  return response(
    res,
    {
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
      token: tokenFor(user),
    },
    'Logged in successfully'
  )
})

app.post('/api/auth/google', async (req, res) => {
  const { email, name, role = 'student', idToken } = req.body
  if (!email || !idToken || !process.env.GOOGLE_CLIENT_ID) return response(res, null, 'Verified Google ID token is required and OAuth must be configured.', 501)

  const db = await read()
  let user = db.users.find((item) => item.email === email.toLowerCase().trim())
  if (!user) {
    user = {
      id: crypto.randomUUID(),
      name: name || email.split('@')[0],
      email: email.toLowerCase().trim(),
      phone: '',
      passwordHash: await bcrypt.hash(crypto.randomUUID(), 10),
      role: ['student', 'owner'].includes(role) ? role : 'student',
      isActive: true,
      createdAt: new Date().toISOString(),
    }
    db.users.push(user)
    await write(db)
  }

  return response(
    res,
    {
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
      token: tokenFor(user),
    },
    'Google login successful'
  )
})

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body
  const db = await read()
  const user = db.users.find((u) => u.email === String(email).toLowerCase().trim())
  if (!user) return response(res, null, 'If this email is registered, an OTP has been sent.', 200)
  // Simulated OTP
  return response(res, { otpSent: false }, 'Password reset is not configured. Configure a verified OTP provider first.', 503)
})

app.post('/api/auth/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body
  return response(res, null, 'Password reset is not configured. Configure a verified OTP provider first.', 503)
  if (!newPassword || newPassword.length < 6) return response(res, null, 'Password must be at least 6 characters', 400)

  const db = await read()
  const user = db.users.find((u) => u.email === String(email).toLowerCase().trim())
  if (!user) return response(res, null, 'User not found', 404)

  user.passwordHash = await bcrypt.hash(newPassword, 10)
  await write(db)
  return response(res, null, 'Password successfully reset. Please log in.')
})

app.post('/api/auth/logout', async (req, res) => {
  return response(res, null, 'Logged out successfully')
})

app.get('/api/auth/me', auth, async (req, res) => {
  const user = read().users.find((item) => item.id === req.user.id)
  if (!user) return response(res, null, 'User session not found', 404)
  return response(res, { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone })
})

// --- PROPERTIES (PUBLIC & OWNER) ---
app.get('/api/properties', async (req, res) => {
  const db = await read()
  let items = db.properties.filter((property) => property.status === 'approved')
  const { city, type, gender, maxPrice, search, amenities } = req.query

  if (city && city !== 'All') {
    items = items.filter((p) => p.city?.toLowerCase().includes(String(city).toLowerCase()))
  }
  if (type && type !== 'All stays') {
    items = items.filter((p) => p.propertyType?.toLowerCase() === String(type).toLowerCase())
  }
  if (gender && gender !== 'All') {
    items = items.filter((p) => p.genderType?.toLowerCase().includes(String(gender).toLowerCase()))
  }
  if (maxPrice) {
    items = items.filter((p) => p.startingRent <= Number(maxPrice))
  }
  if (search) {
    const term = String(search).toLowerCase()
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.city.toLowerCase().includes(term) ||
        p.address.toLowerCase().includes(term) ||
        (p.landmark && p.landmark.toLowerCase().includes(term))
    )
  }
  if (amenities) {
    const required = String(amenities).split(',')
    items = items.filter((p) => required.every((a) => p.amenities?.includes(a)))
  }

  // Attach room & bed count summary
  const enriched = items.map((p) => {
    const rooms = db.rooms.filter((r) => r.propertyId === p.id)
    const beds = db.beds.filter((b) => rooms.some((r) => r.id === b.roomId))
    const availableBeds = beds.filter((b) => b.status === 'AVAILABLE').length
    return {
      ...p,
      totalRooms: rooms.length,
      totalBeds: beds.length,
      availableBeds,
    }
  })

  return response(res, enriched, 'Approved properties retrieved')
})

app.get('/api/properties/:id', async (req, res) => {
  const db = await read()
  const property = db.properties.find((item) => item.id === req.params.id)
  if (!property) return response(res, null, 'Property not found', 404)

  const rooms = db.rooms
    .filter((room) => room.propertyId === property.id)
    .map((room) => ({
      ...room,
      beds: db.beds.filter((bed) => bed.roomId === room.id),
    }))

  const reviews = db.reviews.filter((r) => r.propertyId === property.id)

  return response(res, { ...property, rooms, reviews }, 'Property details loaded')
})

const defaultCityCoords = {
  'Bengaluru': { lat: 12.9352, lng: 77.6245, state: 'Karnataka', pincode: '560034' },
  'Pune': { lat: 18.5679, lng: 73.9143, state: 'Maharashtra', pincode: '411014' },
  'Delhi NCR': { lat: 28.4682, lng: 77.4981, state: 'Uttar Pradesh', pincode: '201306' },
  'Hyderabad': { lat: 17.4401, lng: 78.3489, state: 'Telangana', pincode: '500032' },
  'Mumbai': { lat: 19.1176, lng: 72.9060, state: 'Maharashtra', pincode: '400076' },
  'Chennai': { lat: 13.0067, lng: 80.2026, state: 'Tamil Nadu', pincode: '600025' },
  'Kanpur': { lat: 26.5123, lng: 80.2329, state: 'Uttar Pradesh', pincode: '208016' },
  'Lucknow': { lat: 26.8500, lng: 80.9984, state: 'Uttar Pradesh', pincode: '226010' },
  'Bhopal': { lat: 23.2324, lng: 77.4326, state: 'Madhya Pradesh', pincode: '462011' },
  'Bilaspur': { lat: 22.1287, lng: 82.1384, state: 'Chhattisgarh', pincode: '495009' },
}

app.post('/api/properties', auth, authorizeRoles('owner', 'admin'), async (req, res) => {
  const { name, description, propertyType, genderType, address, city, state, pincode, startingRent, amenities, images } = req.body
  if (!name || !city || !address) {
    return response(res, null, 'Property name, city and address are required', 400)
  }

  const db = await read()
  const matchedCity = defaultCityCoords[city] || { lat: 12.9716, lng: 77.5946, state: state || 'Karnataka', pincode: pincode || '560001' }
  const lat = req.body.latitude ? Number(req.body.latitude) : matchedCity.lat
  const lng = req.body.longitude ? Number(req.body.longitude) : matchedCity.lng
  const finalState = state || matchedCity.state
  const finalPincode = pincode || matchedCity.pincode
  const formattedAddress = req.body.formattedAddress || `${address}, ${city}, ${finalState} ${finalPincode}`

  const newProperty = {
    id: `prop-${Date.now()}`,
    ownerId: req.user.id,
    name,
    tagline: req.body.tagline || 'Comfortable student stay',
    description: description || 'Thoughtfully designed student accommodation.',
    propertyType: propertyType || 'PG',
    genderType: genderType || 'Unisex',
    address,
    city,
    state: finalState,
    pincode: finalPincode,
    landmark: req.body.landmark || '',
    latitude: lat,
    longitude: lng,
    formattedAddress,
    location: {
      address,
      city,
      state: finalState,
      pincode: finalPincode,
      formattedAddress,
      latitude: lat,
      longitude: lng,
    },
    startingRent: Number(startingRent) || 7999,
    rating: 4.8,
    reviewCount: 0,
    status: req.user.role === 'admin' ? 'approved' : 'pending',
    featured: false,
    images: images && images.length ? images : [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85'
    ],
    amenities: amenities || ['High-Speed Wi-Fi', 'Daily Fresh Meals', '24/7 CCTV & Security', 'Power Backup', 'Housekeeping'],
    houseRules: [
      'Visitors permitted in common lobby until 9:00 PM',
      'Strictly non-smoking campus',
      'Quiet hours observed from 11:00 PM to 6:00 AM'
    ],
    createdAt: new Date().toISOString()
  }

  db.properties.push(newProperty)

  // Auto create 2 sample rooms and beds for the new property so it is immediately bookable
  const sampleRoom1 = {
    id: `room-${Date.now()}-1`,
    propertyId: newProperty.id,
    roomNumber: '101',
    floor: 1,
    roomType: 'Single Sharing',
    rent: Number(startingRent) || 8999,
    ac: true,
    sharingCapacity: 1,
    status: 'available',
    features: ['Attached Bath', 'Balcony', 'Study Table']
  }
  const sampleRoom2 = {
    id: `room-${Date.now()}-2`,
    propertyId: newProperty.id,
    roomNumber: '201',
    floor: 2,
    roomType: 'Double Sharing',
    rent: Math.round((Number(startingRent) || 8999) * 0.75),
    ac: true,
    sharingCapacity: 2,
    status: 'available',
    features: ['Attached Bath', 'Twin Wardrobes', 'Twin Study Desks']
  }

  db.rooms.push(sampleRoom1, sampleRoom2)
  db.beds.push(
    { id: `bed-${Date.now()}-1`, roomId: sampleRoom1.id, bedNumber: 'Bed A', status: 'AVAILABLE' },
    { id: `bed-${Date.now()}-2`, roomId: sampleRoom2.id, bedNumber: 'Bed A', status: 'AVAILABLE' },
    { id: `bed-${Date.now()}-3`, roomId: sampleRoom2.id, bedNumber: 'Bed B', status: 'AVAILABLE' }
  )

  await write(db)
  return response(res, newProperty, 'Property listed successfully with initial rooms', 201)
})

app.put('/api/properties/:id', auth, authorizeRoles('owner', 'admin'), async (req, res) => {
  const db = await read()
  const property = db.properties.find((p) => p.id === req.params.id)
  if (!property) return response(res, null, 'Property not found', 404)
  if (req.user.role !== 'admin' && property.ownerId !== req.user.id) {
    return response(res, null, 'Unauthorized to edit this property', 403)
  }

  // If approved property is edited by owner, require admin review
  if (req.user.role !== 'admin' && property.status === 'approved') {
    property.status = 'pending_review'
  }

  const updatedCity = req.body.city || property.city
  const updatedAddress = req.body.address || property.address
  const updatedState = req.body.state || property.state
  const updatedPincode = req.body.pincode || property.pincode
  const matchedCity = defaultCityCoords[updatedCity] || { lat: 12.9716, lng: 77.5946, state: updatedState, pincode: updatedPincode }
  const updatedLat = req.body.latitude !== undefined ? Number(req.body.latitude) : (property.latitude || matchedCity.lat)
  const updatedLng = req.body.longitude !== undefined ? Number(req.body.longitude) : (property.longitude || matchedCity.lng)
  const formattedAddress = req.body.formattedAddress || `${updatedAddress}, ${updatedCity}, ${updatedState} ${updatedPincode}`

  Object.assign(property, req.body, {
    latitude: updatedLat,
    longitude: updatedLng,
    formattedAddress,
    location: {
      address: updatedAddress,
      city: updatedCity,
      state: updatedState,
      pincode: updatedPincode,
      formattedAddress,
      latitude: updatedLat,
      longitude: updatedLng,
    },
    updatedAt: new Date().toISOString(),
  })
  await write(db)
  return response(res, property, 'Property updated successfully')
})

app.delete('/api/properties/:id', auth, authorizeRoles('owner', 'admin'), async (req, res) => {
  const db = await read()
  const idx = db.properties.findIndex((p) => p.id === req.params.id)
  if (idx === -1) return response(res, null, 'Property not found', 404)
  if (req.user.role !== 'admin' && db.properties[idx].ownerId !== req.user.id) {
    return response(res, null, 'Unauthorized to delete this property', 403)
  }

  const propId = db.properties[idx].id
  const hasActiveBookings = db.bookings.some((b) => b.propertyId === propId && b.bookingStatus === 'CONFIRMED')
  if (hasActiveBookings) {
    return response(res, null, 'Cannot delete property with active confirmed resident bookings. Suspend property instead.', 400)
  }

  db.properties.splice(idx, 1)
  const roomIds = db.rooms.filter((r) => r.propertyId === propId).map((r) => r.id)
  db.rooms = db.rooms.filter((r) => r.propertyId !== propId)
  db.beds = db.beds.filter((b) => !roomIds.includes(b.roomId))
  await write(db)
  return response(res, null, 'Property and associated rooms removed safely')
})

// --- ROOMS & BEDS (VISUAL SELECTION API) ---
app.get('/api/properties/:id/rooms', async (req, res) => {
  const db = await read()
  const rooms = db.rooms
    .filter((r) => r.propertyId === req.params.id)
    .map((room) => ({
      ...room,
      beds: db.beds.filter((b) => b.roomId === room.id),
    }))
  return response(res, rooms, 'Rooms loaded')
})

app.post('/api/properties/:id/rooms', auth, authorizeRoles('owner', 'admin'), async (req, res) => {
  const { roomNumber, floor = 1, roomType = 'Double Sharing', rent, ac = true, sharingCapacity = 2, features } = req.body
  if (!roomNumber || !rent) {
    return response(res, null, 'Room number and monthly rent are required', 400)
  }

  const db = await read()
  const room = {
    id: `room-${Date.now()}`,
    propertyId: req.params.id,
    roomNumber: String(roomNumber),
    floor: Number(floor),
    roomType,
    rent: Number(rent),
    ac: Boolean(ac),
    sharingCapacity: Number(sharingCapacity),
    status: 'available',
    features: features || ['Attached Bath', 'Study Desk', 'Wardrobe']
  }

  db.rooms.push(room)

  // Generate beds Bed A, Bed B, Bed C...
  const letters = ['A', 'B', 'C', 'D', 'E', 'F']
  for (let i = 0; i < room.sharingCapacity; i++) {
    db.beds.push({
      id: `bed-${Date.now()}-${i + 1}`,
      roomId: room.id,
      bedNumber: `Bed ${letters[i] || i + 1}`,
      status: 'AVAILABLE',
    })
  }

  await write(db)
  return response(res, room, 'Room and bed units generated successfully', 201)
})

app.post('/api/rooms', auth, authorizeRoles('owner', 'admin'), async (req, res) => {
  const { propertyId, roomNumber, floor = 1, roomType = 'Double Sharing', rent, ac = true, sharingCapacity = 2, features } = req.body
  if (!propertyId || !roomNumber || !rent) {
    return response(res, null, 'Property ID, room number and monthly rent are required', 400)
  }

  const db = await read()
  const property = db.properties.find((p) => p.id === propertyId)
  if (!property) return response(res, null, 'Property not found', 404)
  if (req.user.role !== 'admin' && property.ownerId !== req.user.id) {
    return response(res, null, 'Unauthorized to add room to this property', 403)
  }

  const room = {
    id: `room-${Date.now()}`,
    propertyId,
    roomNumber: String(roomNumber),
    floor: Number(floor),
    roomType,
    rent: Number(rent),
    ac: Boolean(ac),
    sharingCapacity: Number(sharingCapacity),
    status: 'available',
    features: features || ['Attached Bath', 'Study Desk', 'Wardrobe']
  }

  db.rooms.push(room)

  const letters = ['A', 'B', 'C', 'D', 'E', 'F']
  for (let i = 0; i < room.sharingCapacity; i++) {
    db.beds.push({
      id: `bed-${Date.now()}-${i + 1}`,
      roomId: room.id,
      bedNumber: `Bed ${letters[i] || i + 1}`,
      status: 'AVAILABLE',
    })
  }

  await write(db)
  return response(res, room, 'Room and beds generated successfully', 201)
})

app.put('/api/rooms/:id', auth, authorizeRoles('owner', 'admin'), async (req, res) => {
  const db = await read()
  const room = db.rooms.find((r) => r.id === req.params.id)
  if (!room) return response(res, null, 'Room not found', 404)

  const property = db.properties.find((p) => p.id === room.propertyId)
  if (req.user.role !== 'admin' && property && property.ownerId !== req.user.id) {
    return response(res, null, 'Unauthorized to modify this room', 403)
  }

  Object.assign(room, req.body)
  await write(db)
  return response(res, room, 'Room updated successfully')
})

app.delete('/api/rooms/:id', auth, authorizeRoles('owner', 'admin'), async (req, res) => {
  const db = await read()
  const idx = db.rooms.findIndex((r) => r.id === req.params.id)
  if (idx === -1) return response(res, null, 'Room not found', 404)

  const room = db.rooms[idx]
  const property = db.properties.find((p) => p.id === room.propertyId)
  if (req.user.role !== 'admin' && property && property.ownerId !== req.user.id) {
    return response(res, null, 'Unauthorized to delete this room', 403)
  }

  db.rooms.splice(idx, 1)
  db.beds = db.beds.filter((b) => b.roomId !== req.params.id)
  await write(db)
  return response(res, null, 'Room and associated beds removed')
})

app.get('/api/rooms/:id/beds', async (req, res) => {
  const db = await read()
  const beds = db.beds.filter((b) => b.roomId === req.params.id)
  return response(res, beds, 'Beds loaded')
})

app.put('/api/beds/:id', auth, authorizeRoles('owner', 'admin'), async (req, res) => {
  const db = await read()
  const bed = db.beds.find((b) => b.id === req.params.id)
  if (!bed) return response(res, null, 'Bed not found', 404)

  Object.assign(bed, Object.fromEntries(Object.entries(req.body).filter(([key]) => ['status', 'bedNumber'].includes(key))))
  await write(db)
  return response(res, bed, 'Bed updated')
})

app.post('/api/rooms/:id/reserve', auth, async (req, res) => {
  const db = await read()
  const bed = db.beds.find((b) => b.id === req.params.id)
  if (!bed || bed.status !== 'AVAILABLE') {
    return response(res, null, 'Selected bed is no longer available', 409)
  }

  bed.status = 'RESERVED'
  bed.reservedBy = req.user.id
  bed.reservedUntil = Date.now() + 15 * 60 * 1000 // 15 minutes hold
  await write(db)
  return response(res, bed, 'Bed reserved for 15 minutes during checkout')
})

// --- BOOKINGS & CHECKOUT FLOW ---
app.post('/api/bookings', auth, async (req, res) => {
  const {
    propertyId,
    roomId,
    bedId,
    duration = 6,
    startDate,
    studentName,
    studentPhone,
    studentEmail,
    dob,
    emergencyContact,
    idProofType,
    idProofNumber,
  } = req.body

  if (!propertyId || !roomId || !bedId) {
    return response(res, null, 'Property, Room, and Bed selection are required', 400)
  }

  const db = await read()
  const property = db.properties.find((p) => p.id === propertyId)
  const room = db.rooms.find((r) => r.id === roomId)
  const bed = db.beds.find((b) => b.id === bedId)

  if (!property || !room || !bed) {
    return response(res, null, 'Selected accommodation not found', 404)
  }
  if (bed.status === 'OCCUPIED') {
    return response(res, null, 'Bed is already occupied by another resident', 409)
  }
  if (bed.status === 'RESERVED' && bed.reservedUntil && bed.reservedUntil > Date.now() && bed.reservedBy !== req.user.id) {
    return response(res, null, 'Bed is temporarily reserved by another student during checkout', 409)
  }

  const monthlyRent = Number(room.rent)
  const securityDeposit = monthlyRent // 1 month security deposit standard
  const serviceFee = 999 // platform maintenance & hygiene fee
  const totalAmount = monthlyRent + securityDeposit + serviceFee

  const booking = {
    id: `booking-${Date.now()}`,
    bookingReference: `DZ-${Date.now().toString(36).toUpperCase()}`,
    studentId: req.user.id,
    studentName: studentName || req.user.name,
    studentEmail: studentEmail || req.user.email,
    studentPhone: studentPhone || '',
    dob: dob || '',
    emergencyContact: emergencyContact || '',
    idProofType: idProofType || 'Aadhaar',
    idProofNumber: idProofNumber || '',
    propertyId: property.id,
    propertyName: property.name,
    propertyAddress: `${property.address}, ${property.city}`,
    roomId: room.id,
    roomNumber: room.roomNumber,
    roomType: room.roomType,
    bedId: bed.id,
    bedNumber: bed.bedNumber,
    startDate: startDate || new Date().toISOString().slice(0, 10),
    duration: Number(duration),
    monthlyRent,
    securityDeposit,
    serviceFee,
    amount: totalAmount,
    paymentStatus: 'PENDING',
    bookingStatus: 'PENDING',
    createdAt: new Date().toISOString(),
  }

  db.bookings.push(booking)
  bed.status = 'RESERVED'
  bed.reservedBy = req.user.id
  bed.reservedUntil = Date.now() + 15 * 60 * 1000 // 15 min lock
  bed.bookingId = booking.id
  await write(db)

  return response(res, booking, 'Booking created. Proceed to payment.', 201)
})

app.get('/api/bookings', auth, async (req, res) => {
  const db = await read()
  if (req.user.role === 'admin') {
    return response(res, db.bookings, 'All platform bookings retrieved')
  }
  if (req.user.role === 'owner') {
    const ownerPropIds = db.properties.filter((p) => p.ownerId === req.user.id).map((p) => p.id)
    const bookings = db.bookings.filter((b) => ownerPropIds.includes(b.propertyId))
    return response(res, bookings, 'Owner bookings retrieved')
  }
  const myBookings = db.bookings.filter((b) => b.studentId === req.user.id)
  return response(res, myBookings, 'Student bookings retrieved')
})

app.get('/api/bookings/:id', auth, async (req, res) => {
  const db = await read()
  const booking = db.bookings.find((b) => b.id === req.params.id)
  if (!booking) return response(res, null, 'Booking not found', 404)
  if (req.user.role === 'student' && booking.studentId !== req.user.id) return response(res, null, 'Unauthorized', 403)
  if (req.user.role === 'owner') { const property = db.properties.find((p) => p.id === booking.propertyId); if (!property || property.ownerId !== req.user.id) return response(res, null, 'Unauthorized', 403) }
  return response(res, booking, 'Booking retrieved')
})

app.put('/api/bookings/:id/cancel', auth, async (req, res) => {
  const db = await read()
  const booking = db.bookings.find((b) => b.id === req.params.id)
  if (!booking) return response(res, null, 'Booking not found', 404)
  if (req.user.role !== 'admin' && booking.studentId !== req.user.id) {
    return response(res, null, 'Unauthorized to cancel this booking', 403)
  }

  booking.bookingStatus = 'CANCELLED'
  const bed = db.beds.find((b) => b.id === booking.bedId)
  if (bed) {
    bed.status = 'AVAILABLE'
    delete bed.occupantName
    delete bed.bookingId
    delete bed.reservedUntil
    delete bed.reservedBy
  }

  await write(db)
  return response(res, booking, 'Booking cancelled and bed released to available pool')
})

// --- PAYMENTS (RAZORPAY INTEGRATION) ---
app.post('/api/payments/create-order', auth, async (req, res) => {
  const { bookingId } = req.body
  const db = await read()
  const booking = db.bookings.find((b) => b.id === bookingId)
  if (!booking) return response(res, null, 'Booking not found', 404)

  const razorpayOrder = {
    orderId: `order_dz_${Date.now()}`,
    amount: booking.amount * 100, // in paise
    currency: 'INR',
    receipt: booking.bookingReference,
    key: process.env.RAZORPAY_KEY_ID || 'rzp_test_hostel_dazee_demo',
    booking,
  }
  booking.razorpayOrderId = razorpayOrder.orderId
  await write(db)

  return response(res, razorpayOrder, 'Razorpay order generated')
})

app.post('/api/payments/create', auth, async (req, res) => {
  const { bookingId } = req.body
  const db = await read()
  const booking = db.bookings.find((b) => b.id === bookingId)
  if (!booking) return response(res, null, 'Booking not found', 404)

  const razorpayOrder = {
    orderId: `order_dz_${Date.now()}`,
    amount: booking.amount * 100,
    currency: 'INR',
    receipt: booking.bookingReference,
    key: process.env.RAZORPAY_KEY_ID || 'rzp_test_hostel_dazee_demo',
    booking,
  }

  return response(res, razorpayOrder, 'Razorpay order generated')
})

app.post('/api/payments/verify', auth, async (req, res) => {
  const { bookingId, paymentId, paymentSignature, paymentMethod = 'Razorpay UPI' } = req.body
  const db = await read()
  const booking = db.bookings.find((b) => b.id === bookingId)
  if (!booking) return response(res, null, 'Booking not found', 404)
  if (req.user.role !== 'admin' && booking.studentId !== req.user.id) return response(res, null, 'Unauthorized payment access', 403)
  if (!paymentId || !paymentSignature || !process.env.RAZORPAY_KEY_SECRET) return response(res, null, 'Razorpay signature verification is required.', 503)
  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update((booking.razorpayOrderId || '') + '|' + paymentId).digest('hex')
  if (expectedSignature.length !== String(paymentSignature).length || !crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(String(paymentSignature)))) return response(res, null, 'Invalid Razorpay payment signature', 400)

  const bed = db.beds.find((b) => b.id === booking.bedId)

  booking.paymentStatus = 'SUCCESS'
  booking.bookingStatus = 'CONFIRMED'
  booking.transactionId = paymentId || `PAY-${crypto.randomUUID().slice(0, 8).toUpperCase()}`

  if (bed) {
    bed.status = 'OCCUPIED'
    bed.occupantName = `${booking.studentName} (Confirmed)`
    bed.bookingId = booking.id
    delete bed.reservedUntil
    delete bed.reservedBy
  }

  const payment = {
    id: `pay-${Date.now()}`,
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
    studentId: booking.studentId,
    studentName: booking.studentName,
    amount: booking.amount,
    transactionId: booking.transactionId,
    paymentMethod,
    paymentStatus: 'SUCCESS',
    createdAt: new Date().toISOString(),
  }

  db.payments.push(payment)
  await write(db)

  return response(res, { booking, payment }, 'Payment verified! Booking confirmed.')
})

app.get('/api/payments/history', auth, async (req, res) => {
  const db = await read()
  if (req.user.role === 'admin') {
    return response(res, db.payments, 'All payment history retrieved')
  }
  const payments = db.payments.filter((p) => p.studentId === req.user.id)
  return response(res, payments, 'Student payment history retrieved')
})

app.get('/api/bookings/my', auth, async (req, res) => {
  const db = await read()
  const bookings = db.bookings.filter((b) => b.studentId === req.user.id)
  return response(res, bookings, 'Student bookings retrieved')
})

app.get('/api/payments/my', auth, async (req, res) => {
  const db = await read()
  const payments = db.payments.filter((p) => p.studentId === req.user.id)
  return response(res, payments, 'Student payment history retrieved')
})

// --- REVIEWS ---
app.get('/api/properties/:id/reviews', async (req, res) => {
  const db = await read()
  const reviews = db.reviews.filter((r) => r.propertyId === req.params.id)
  return response(res, reviews, 'Property reviews retrieved')
})

app.post('/api/reviews', auth, async (req, res) => {
  const { propertyId, rating, comment } = req.body
  if (!propertyId || !rating || !comment) {
    return response(res, null, 'Property, rating and comment are required', 400)
  }

  const db = await read()
  const property = db.properties.find((p) => p.id === propertyId)
  if (!property) return response(res, null, 'Property not found', 404)

  const review = {
    id: `rev-${Date.now()}`,
    propertyId,
    userName: req.user.name,
    userRole: req.user.role === 'student' ? 'Student Resident' : 'Resident',
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString(),
  }

  db.reviews.push(review)

  // Re-calculate property average rating
  const allReviews = db.reviews.filter((r) => r.propertyId === propertyId)
  const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
  property.rating = Number(avg.toFixed(1))
  property.reviewCount = allReviews.length

  await write(db)
  return response(res, review, 'Review submitted successfully', 201)
})

// --- OWNER PORTAL APIS ---
app.get('/api/owner/dashboard', auth, authorizeRoles('owner', 'admin'), async (req, res) => {
  const db = await read()
  const properties = db.properties.filter((p) => req.user.role === 'admin' || p.ownerId === req.user.id)
  const propIds = properties.map((p) => p.id)
  const rooms = db.rooms.filter((r) => propIds.includes(r.propertyId))
  const roomIds = rooms.map((r) => r.id)
  const beds = db.beds.filter((b) => roomIds.includes(b.roomId))
  const bookings = db.bookings.filter((b) => propIds.includes(b.propertyId))
  const confirmedBookings = bookings.filter((b) => b.bookingStatus === 'CONFIRMED')
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.amount || 0), 0)

  const occupiedBeds = beds.filter((b) => b.status === 'OCCUPIED').length
  const occupancyRate = beds.length ? Math.round((occupiedBeds / beds.length) * 100) : 0

  return response(res, {
    totalProperties: properties.length,
    totalRooms: rooms.length,
    totalBeds: beds.length,
    occupiedBeds,
    availableBeds: beds.filter((b) => b.status === 'AVAILABLE').length,
    occupancyRate,
    totalBookings: bookings.length,
    confirmedBookings: confirmedBookings.length,
    monthlyRevenue: totalRevenue,
  })
})

app.get('/api/owner/properties', auth, authorizeRoles('owner', 'admin'), async (req, res) => {
  const db = await read()
  const properties = db.properties.filter((p) => req.user.role === 'admin' || p.ownerId === req.user.id)
  return response(res, properties, 'Owner properties retrieved')
})

app.get('/api/owner/bookings', auth, authorizeRoles('owner', 'admin'), async (req, res) => {
  const db = await read()
  const properties = db.properties.filter((p) => req.user.role === 'admin' || p.ownerId === req.user.id)
  const propIds = properties.map((p) => p.id)
  const bookings = db.bookings.filter((b) => propIds.includes(b.propertyId))
  return response(res, bookings, 'Owner bookings retrieved')
})

app.post('/api/owner/bookings/:id/:decision', auth, authorizeRoles('owner', 'admin'), async (req, res) => {
  const db = await read()
  const booking = db.bookings.find((b) => b.id === req.params.id)
  if (!booking) return response(res, null, 'Booking not found', 404)

  const decision = req.params.decision
  if (!['approve', 'reject'].includes(decision)) {
    return response(res, null, 'Invalid decision', 400)
  }

  booking.bookingStatus = decision === 'approve' ? 'CONFIRMED' : 'REJECTED'
  const bed = db.beds.find((b) => b.id === booking.bedId)
  if (bed) {
    bed.status = decision === 'approve' ? 'OCCUPIED' : 'AVAILABLE'
    if (decision === 'reject') delete bed.occupantName
  }

  await write(db)
  return response(res, booking, `Booking marked as ${booking.bookingStatus}`)
})

app.get('/api/owner/students', auth, authorizeRoles('owner', 'admin'), async (req, res) => {
  const db = await read()
  const ownerProps = db.properties.filter((p) => req.user.role === 'admin' || p.ownerId === req.user.id)
  const propIds = ownerProps.map((p) => p.id)
  const ownerBookings = db.bookings.filter((b) => propIds.includes(b.propertyId))
  const studentIds = [...new Set(ownerBookings.map((b) => b.studentId))]
  const students = db.users
    .filter((u) => studentIds.includes(u.id))
    .map(({ passwordHash, ...u }) => {
      const stays = ownerBookings.filter((b) => b.studentId === u.id)
      return {
        ...u,
        stays,
        totalStays: stays.length,
        currentProperty: stays[0]?.propertyName,
        roomNumber: stays[0]?.roomNumber,
        bedNumber: stays[0]?.bedNumber,
        bookingStatus: stays[0]?.bookingStatus,
      }
    })
  return response(res, students, 'Connected students retrieved')
})

// --- ADMIN PORTAL APIS ---
app.get('/api/admin/dashboard', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  const totalRevenue = db.payments
    .filter((p) => p.paymentStatus === 'SUCCESS')
    .reduce((sum, p) => sum + (p.amount || 0), 0)

  return response(res, {
    totalUsers: db.users.length,
    students: db.users.filter((u) => u.role === 'student').length,
    totalStudents: db.users.filter((u) => u.role === 'student').length,
    owners: db.users.filter((u) => u.role === 'owner').length,
    totalOwners: db.users.filter((u) => u.role === 'owner').length,
    totalProperties: db.properties.length,
    pendingProperties: db.properties.filter((p) => p.status === 'pending' || p.status === 'pending_review').length,
    approvedProperties: db.properties.filter((p) => p.status === 'approved').length,
    rejectedProperties: db.properties.filter((p) => p.status === 'rejected').length,
    suspendedProperties: db.properties.filter((p) => p.status === 'suspended').length,
    totalBookings: db.bookings.length,
    activeBookings: db.bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length,
    cancelledBookings: db.bookings.filter((b) => b.bookingStatus === 'CANCELLED' || b.bookingStatus === 'REJECTED').length,
    totalRevenue,
    totalBeds: db.beds.length,
    occupiedBeds: db.beds.filter((b) => b.status === 'OCCUPIED').length,
  })
})

app.get('/api/admin/users', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  const sanitized = db.users.map(({ passwordHash: _passwordHash, ...user }) => ({
    ...user,
    status: user.status || (user.isActive !== false ? 'active' : 'suspended'),
  }))
  return response(res, sanitized, 'Users retrieved')
})

app.put('/api/admin/users/:id/suspend', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  const user = db.users.find((u) => u.id === req.params.id)
  if (!user) return response(res, null, 'User not found', 404)
  if (user.role === 'admin') return response(res, null, 'Cannot modify admin account status', 403)

  user.isActive = false
  user.status = 'suspended'
  await write(db)
  return response(res, { id: user.id, status: user.status, isActive: user.isActive }, 'User suspended successfully')
})

app.put('/api/admin/users/:id/activate', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  const user = db.users.find((u) => u.id === req.params.id)
  if (!user) return response(res, null, 'User not found', 404)

  user.isActive = true
  user.status = 'active'
  await write(db)
  return response(res, { id: user.id, status: user.status, isActive: user.isActive }, 'User reactivated successfully')
})

app.delete('/api/admin/users/:id', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  const idx = db.users.findIndex((u) => u.id === req.params.id)
  if (idx === -1) return response(res, null, 'User not found', 404)
  const user = db.users[idx]
  if (user.role === 'admin') return response(res, null, 'Cannot delete admin account', 403)

  const activeBookings = db.bookings.filter((b) => b.studentId === user.id && b.bookingStatus === 'CONFIRMED')
  if (activeBookings.length > 0) {
    return response(res, null, `Cannot delete resident with ${activeBookings.length} active stay(s). Suspend account instead.`, 400)
  }

  db.users.splice(idx, 1)
  await write(db)
  return response(res, null, 'User account removed')
})

app.patch('/api/admin/users/:id/status', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  const user = db.users.find((u) => u.id === req.params.id)
  if (!user) return response(res, null, 'User not found', 404)
  if (user.role === 'admin') return response(res, null, 'Cannot modify admin account status', 403)

  user.isActive = Boolean(req.body.isActive)
  user.status = user.isActive ? 'active' : 'suspended'
  await write(db)
  return response(res, { id: user.id, isActive: user.isActive, status: user.status }, 'User status updated')
})

// Admin Owners Management
app.get('/api/admin/owners', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  const owners = db.users
    .filter((u) => u.role === 'owner')
    .map(({ passwordHash, ...owner }) => {
      const ownerProps = db.properties.filter((p) => p.ownerId === owner.id)
      const ownerPropIds = ownerProps.map((p) => p.id)
      const ownerBookings = db.bookings.filter((b) => ownerPropIds.includes(b.propertyId))
      return {
        ...owner,
        propertiesCount: ownerProps.length,
        bookingsCount: ownerBookings.length,
        verificationStatus: owner.verificationStatus || 'approved',
        status: owner.status || (owner.isActive !== false ? 'active' : 'suspended'),
      }
    })
  return response(res, owners, 'Owners list retrieved')
})

app.put('/api/admin/owners/:id/approve', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  const owner = db.users.find((u) => u.id === req.params.id && u.role === 'owner')
  if (!owner) return response(res, null, 'Owner not found', 404)
  owner.verificationStatus = 'approved'
  owner.status = 'active'
  owner.isActive = true
  delete owner.rejectionReason
  await write(db)
  return response(res, owner, 'Owner verification approved')
})

app.put('/api/admin/owners/:id/reject', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  const owner = db.users.find((u) => u.id === req.params.id && u.role === 'owner')
  if (!owner) return response(res, null, 'Owner not found', 404)
  owner.verificationStatus = 'rejected'
  owner.rejectionReason = req.body.reason || 'Missing or invalid verification documents.'
  await write(db)
  return response(res, owner, 'Owner verification rejected with reason')
})

app.put('/api/admin/owners/:id/suspend', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  const owner = db.users.find((u) => u.id === req.params.id && u.role === 'owner')
  if (!owner) return response(res, null, 'Owner not found', 404)
  owner.status = 'suspended'
  owner.isActive = false
  // Suspend owner's public listings
  db.properties.forEach((p) => {
    if (p.ownerId === owner.id && p.status === 'approved') {
      p.status = 'suspended'
    }
  })
  await write(db)
  return response(res, owner, 'Owner account and listings suspended')
})

app.put('/api/admin/owners/:id/activate', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  const owner = db.users.find((u) => u.id === req.params.id && u.role === 'owner')
  if (!owner) return response(res, null, 'Owner not found', 404)
  owner.status = 'active'
  owner.isActive = true
  // Reactivate owner's listings
  db.properties.forEach((p) => {
    if (p.ownerId === owner.id && p.status === 'suspended') {
      p.status = 'approved'
    }
  })
  await write(db)
  return response(res, owner, 'Owner account reactivated')
})

app.delete('/api/admin/owners/:id', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  const idx = db.users.findIndex((u) => u.id === req.params.id && u.role === 'owner')
  if (idx === -1) return response(res, null, 'Owner not found', 404)

  const ownerProps = db.properties.filter((p) => p.ownerId === req.params.id)
  const propIds = ownerProps.map((p) => p.id)
  const activeBookings = db.bookings.filter((b) => propIds.includes(b.propertyId) && b.bookingStatus === 'CONFIRMED')
  if (activeBookings.length > 0) {
    return response(res, null, `Cannot delete owner with ${activeBookings.length} active confirmed student bookings. Suspend the account instead.`, 400)
  }

  db.users.splice(idx, 1)
  db.properties = db.properties.filter((p) => p.ownerId !== req.params.id)
  const removedRoomIds = db.rooms.filter((r) => propIds.includes(r.propertyId)).map((r) => r.id)
  db.rooms = db.rooms.filter((r) => !propIds.includes(r.propertyId))
  db.beds = db.beds.filter((b) => !removedRoomIds.includes(b.roomId))
  await write(db)
  return response(res, null, 'Owner and associated listings removed safely')
})

// Admin Property Management
app.get('/api/admin/properties', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  return response(res, db.properties, 'All properties retrieved')
})

app.put('/api/admin/properties/:id/approve', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  const property = db.properties.find((p) => p.id === req.params.id)
  if (!property) return response(res, null, 'Property not found', 404)
  property.status = 'approved'
  delete property.rejectionReason
  await write(db)
  return response(res, property, 'Property approved successfully.')
})

app.put('/api/admin/properties/:id/reject', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  const property = db.properties.find((p) => p.id === req.params.id)
  if (!property) return response(res, null, 'Property not found', 404)
  const reason = req.body?.reason || req.body?.rejectionReason
  if (!reason) return response(res, null, 'Rejection reason is required.', 400)
  property.status = 'rejected'
  property.rejectionReason = reason
  await write(db)
  return response(res, property, 'Property rejected with reason.')
})

app.put('/api/admin/properties/:id/suspend', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  const property = db.properties.find((p) => p.id === req.params.id)
  if (!property) return response(res, null, 'Property not found', 404)
  property.status = 'suspended'
  await write(db)
  return response(res, property, 'Property has been suspended by admin.')
})

app.put('/api/admin/properties/:id/activate', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  const property = db.properties.find((p) => p.id === req.params.id)
  if (!property) return response(res, null, 'Property not found', 404)
  property.status = 'approved'
  await write(db)
  return response(res, property, 'Property restored to approved state.')
})

app.delete('/api/admin/properties/:id', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  const idx = db.properties.findIndex((p) => p.id === req.params.id)
  if (idx === -1) return response(res, null, 'Property not found', 404)

  const propId = db.properties[idx].id
  const hasActiveBookings = db.bookings.some((b) => b.propertyId === propId && b.bookingStatus === 'CONFIRMED')
  if (hasActiveBookings) {
    return response(res, null, 'Cannot delete property with active confirmed bookings. Suspend property instead.', 400)
  }

  db.properties.splice(idx, 1)
  const roomIds = db.rooms.filter((r) => r.propertyId === propId).map((r) => r.id)
  db.rooms = db.rooms.filter((r) => r.propertyId !== propId)
  db.beds = db.beds.filter((b) => !roomIds.includes(b.roomId))
  await write(db)
  return response(res, null, 'Property deleted successfully')
})

app.post('/api/admin/properties/:id/:decision', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  const property = db.properties.find((p) => p.id === req.params.id)
  if (!property) return response(res, null, 'Property not found', 404)

  const decision = req.params.decision
  if (!['approve', 'reject', 'suspend', 'activate'].includes(decision)) return response(res, null, 'Invalid decision', 400)

  if (decision === 'approve') property.status = 'approved'
  else if (decision === 'reject') {
    property.status = 'rejected'
    if (req.body?.reason) property.rejectionReason = req.body.reason
  } else if (decision === 'suspend') property.status = 'suspended'
  else if (decision === 'activate') property.status = 'approved'

  await write(db)
  return response(res, property, `Property has been ${property.status}`)
})

app.get('/api/admin/bookings', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  return response(res, db.bookings, 'All platform bookings retrieved')
})

app.get('/api/admin/payments', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  return response(res, db.payments, 'All payment transactions retrieved')
})

app.get('/api/admin/reviews', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  return response(res, db.reviews, 'All property reviews retrieved')
})

app.get('/api/admin/reports', auth, authorizeRoles('admin'), async (req, res) => {
  const db = await read()
  const revenue = db.payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  return response(res, {
    totalRevenue: revenue,
    activeResidents: db.beds.filter((b) => b.status === 'OCCUPIED').length,
    availableUnits: db.beds.filter((b) => b.status === 'AVAILABLE').length,
    approvedProperties: db.properties.filter((p) => p.status === 'approved').length,
    totalBookings: db.bookings.length,
    totalReviews: db.reviews.length,
  })
})

const distPath = path.resolve(__dirname, '../dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'))
    }
    next()
  })
}

app.use('/api', async (req, res) => response(res, null, 'Endpoint not found', 404))

if (require.main === module) { app.listen(port, () => console.log(`Hostel Dazee live server listening on http://localhost:${port}`)) }

module.exports = app