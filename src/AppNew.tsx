import { useCallback, useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import type { User } from './components/Navbar'
import { Hero } from './components/Hero'
import { ExploreListings } from './components/ExploreListings'
import type { Property } from './components/ExploreListings'
import { PropertyDetailsModal } from './components/PropertyDetailsModal'
import { BookingFlowModal } from './components/BookingFlowModal'
import { ContentSections } from './components/ContentSections'
import { AuthModal } from './components/AuthModal'
import StudentDashboard from './StudentDashboard'
import OwnerDashboard from './OwnerDashboard'
import AdminDashboard from './AdminDashboard'
import type { Room, Bed } from './components/RoomBedSelector'
import { clearStoredSession, getStoredToken, getStoredUser, setStoredSession } from './lib/auth'

// Next.js App Router Page components
import { ExplorePage } from '../frontend/app/explore/page'
import { PropertyDetailPage } from '../frontend/app/properties/[id]/page'
import { BookingPage } from '../frontend/app/booking/page'
import { LoginPage } from '../frontend/app/login/page'
import { RegisterPage } from '../frontend/app/register/page'
import { AboutPage } from '../frontend/app/about/page'
import { HowItWorksPage } from '../frontend/app/how-it-works/page'
import { ContactPage } from '../frontend/app/contact/page'
import { Footer } from '../frontend/components/footer/Footer'

// Rich initial fallback properties ensuring instant zero-delay render
const fallbackProperties: Property[] = [
  {
    id: 'prop-1',
    name: 'Hostel Dazee Premium Living',
    tagline: 'Curated student co-living with premium vibes',
    description: 'A premier co-living space designed specifically for students and early-career tech professionals in Bengaluru. Offers chef-prepared healthy meals, gigabit optical Wi-Fi, biometric keyless entry, fully air-conditioned rooms, and dedicated acoustic study pods.',
    propertyType: 'Co-living',
    genderType: 'Unisex',
    address: '4th Block, 80 Feet Road, Near Sony World Signal',
    city: 'Bengaluru',
    landmark: 'Near Christ University & St. John\'s Hospital',
    startingRent: 8999,
    rating: 4.8,
    reviewCount: 46,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85',
    ],
    amenities: ['High-Speed Wi-Fi', 'Daily Fresh Meals', 'Air Conditioning', 'Laundry Service', '24/7 CCTV & Security', 'Power Backup', 'Housekeeping', 'Study Lounge'],
  },
  {
    id: 'prop-2',
    name: 'Dazee Ivy Scholars Residency',
    tagline: 'Safe, serene & welcoming haven for female scholars',
    description: 'Nestled right across Symbiosis University in Viman Nagar. This girls-only accommodation offers complete peace of mind with 3-tier round-the-clock security, fingerprint access, home-cooked organic meals, attached clean bathrooms, and a garden terrace.',
    propertyType: 'PG',
    genderType: 'Girls only',
    address: 'Lane 3, Behind Phoenix Marketcity, Viman Nagar',
    city: 'Pune',
    landmark: '500m from Symbiosis Campus',
    startingRent: 7999,
    rating: 4.7,
    reviewCount: 38,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85',
    ],
    amenities: ['High-Speed Wi-Fi', 'Daily Fresh Meals', '24/7 CCTV & Security', 'Power Backup', 'Laundry Service', 'Housekeeping', 'Common Area'],
  },
  {
    id: 'prop-3',
    name: 'Northstar Dazee Campus Hub',
    tagline: 'Heart of Delhi University student life',
    description: 'Prime student living located right in Hudson Lane. Walking distance to GTB Nagar Metro Station, Miranda House, SRCC, and Kirori Mal College. Equipped with ergonomic study chairs, gaming lounge, and customized North & South Indian cafeteria menu.',
    propertyType: 'Hostel',
    genderType: 'Boys only',
    address: 'Hudson Lane, Near GTB Nagar Metro Gate 3',
    city: 'Delhi NCR',
    landmark: 'Near DU North Campus Arts Faculty',
    startingRent: 6999,
    rating: 4.6,
    reviewCount: 54,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=85',
    ],
    amenities: ['High-Speed Wi-Fi', 'Daily Fresh Meals', 'Air Conditioning', '24/7 CCTV & Security', 'Gym Access', 'Power Backup', 'Gaming Zone'],
  },
  {
    id: 'prop-4',
    name: 'Dazee Silicon Heights',
    tagline: 'Modern tech-ready coliving near IT corridor',
    description: 'Strategically positioned in Gachibowli, moments from IIIT Hyderabad, Microsoft, and Amazon campuses. Ultra high-speed fiber internet, rooftop coffee deck, coworking pods, and automated laundry.',
    propertyType: 'Co-living',
    genderType: 'Unisex',
    address: 'Telecom Nagar, Gachibowli',
    city: 'Hyderabad',
    landmark: 'Near IIIT Junction & Financial District',
    startingRent: 9499,
    rating: 4.9,
    reviewCount: 32,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85',
    ],
    amenities: ['High-Speed Wi-Fi', 'Daily Fresh Meals', 'Air Conditioning', 'Laundry Service', 'Housekeeping', 'CCTV Security', 'Rooftop Cafe', 'Parking'],
  },
]

export default function AppNew() {
  const [properties, setProperties] = useState<Property[]>(fallbackProperties)
  const [selectedCity, setSelectedCity] = useState('All')
  const [user, setUser] = useState<User | null>(() => getStoredUser())

  // Modals & Navigation
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [authInitialRole, setAuthInitialRole] = useState<'student' | 'owner'>('student')

  const [detailsProperty, setDetailsProperty] = useState<Property | null>(null)
  const [detailsRooms, setDetailsRooms] = useState<Room[]>([])

  const [bookingSelection, setBookingSelection] = useState<{ property: Property; room: Room; bed: Bed } | null>(null)

  const [path, setPath] = useState(window.location.pathname)

  // Listen to browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = useCallback((dest: string, replace = false) => {
    const normalized = dest || '/'
    if (replace) window.history.replaceState({}, '', normalized)
    else window.history.pushState({}, '', normalized)
    setPath(window.location.pathname)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const token = getStoredToken()
    const storedUser = getStoredUser()
    if (!token || !storedUser) return

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Session expired')
        const data = await res.json()
        if (!data.success || !data.data) throw new Error('Invalid session')
        setUser(data.data as User)
        setStoredSession(token, data.data as User)
      })
      .catch(() => {
        clearStoredSession()
        setUser(null)
      })
  }, [])

  // Fetch approved properties from API
  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/properties')
      const data = await res.json()
      if (data.success && data.data?.length) {
        setProperties(data.data)
      }
    } catch (_err) {
      console.warn('Backend API offline or loading; using cached seed properties.')
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  // Open property details modal and fetch rooms
  const handleOpenPropertyDetails = async (property: Property) => {
    setDetailsProperty(property)
    try {
      const res = await fetch(`/api/properties/${property.id}`)
      const data = await res.json()
      if (data.success && data.data?.rooms) {
        setDetailsRooms(data.data.rooms)
      } else {
        // Fallback demo rooms
        setDetailsRooms([
          {
            id: `room-${property.id}-101`,
            propertyId: property.id,
            roomNumber: '101',
            floor: 1,
            roomType: 'Single Sharing',
            rent: property.startingRent + 3000,
            ac: true,
            sharingCapacity: 1,
            beds: [{ id: `bed-${property.id}-1`, roomId: `room-${property.id}-101`, bedNumber: 'Bed A', status: 'AVAILABLE' }],
          },
          {
            id: `room-${property.id}-201`,
            propertyId: property.id,
            roomNumber: '201',
            floor: 2,
            roomType: 'Double Sharing',
            rent: property.startingRent,
            ac: true,
            sharingCapacity: 2,
            beds: [
              { id: `bed-${property.id}-2`, roomId: `room-${property.id}-201`, bedNumber: 'Bed A', status: 'AVAILABLE' },
              { id: `bed-${property.id}-3`, roomId: `room-${property.id}-201`, bedNumber: 'Bed B', status: 'OCCUPIED', occupantName: 'Resident' },
            ],
          },
        ])
      }
    } catch {
      setDetailsRooms([])
    }
  }

  const handleStartBooking = (selection: { property: Property; room: Room; bed: Bed }) => {
    setDetailsProperty(null) // close details modal
    setBookingSelection(selection) // open booking flow
  }

  const handleOpenAuth = (mode: 'login' | 'signup', role: 'student' | 'owner' = 'student') => {
    setAuthMode(mode)
    setAuthInitialRole(role)
    setAuthModalOpen(true)
  }

  const handleLogout = async () => {
    const token = getStoredToken()
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      }
    } catch {
      // Always complete local sign-out.
    } finally {
      clearStoredSession()
      setUser(null)
      navigate('/', true)
    }
  }

  const navigateToDashboard = (targetUser?: User | null) => {
    const activeUser = targetUser ?? getStoredUser() ?? user
    if (!activeUser) {
      navigate('/login')
      return
    }
    const dest = activeUser.role === 'admin' ? '/admin' : `/dashboard/${activeUser.role}`
    navigate(dest)
  }

  const handleAddReview = async (propertyId: string, rating: number, comment: string) => {
    const token = localStorage.getItem('dazee-token')
    if (!token) {
      handleOpenAuth('login')
      return
    }
    await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ propertyId, rating, comment }),
    })
    fetchProperties()
  }

  // --- ROUTE: /login ---
  if (path === '/login') {
    return (
      <main>
        <Navbar
          user={user}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          onOpenDashboard={() => navigateToDashboard()}
          onNavigate={navigate}
        />
        <LoginPage
          onSuccess={(loggedUser) => {
            setUser(loggedUser)
            navigateToDashboard(loggedUser)
          }}
          onNavigateRegister={() => navigate('/register')}
          onNavigateHome={() => navigate('/')}
        />
        <Footer />
      </main>
    )
  }

  // --- ROUTE: /register ---
  if (path.startsWith('/register')) {
    const isOwner = window.location.search.includes('role=owner')
    return (
      <main>
        <Navbar
          user={user}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          onOpenDashboard={() => navigateToDashboard()}
          onNavigate={navigate}
        />
        <RegisterPage
          initialRole={isOwner ? 'owner' : 'student'}
          onSuccess={(loggedUser) => {
            setUser(loggedUser)
            navigateToDashboard(loggedUser)
          }}
          onNavigateLogin={() => navigate('/login')}
          onNavigateHome={() => navigate('/')}
        />
        <Footer />
      </main>
    )
  }

  // --- ROUTE: /explore ---
  if (path === '/explore') {
    return (
      <main>
        <Navbar
          user={user}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          onOpenDashboard={() => navigateToDashboard()}
          onNavigate={navigate}
        />
        <ExplorePage
          properties={properties}
          initialCity={selectedCity}
          onSelectProperty={(p) => navigate(`/properties/${p.id}`)}
          onBookProperty={(p) => {
            handleOpenPropertyDetails(p)
          }}
          onNavigateHome={() => navigate('/')}
        />
        <Footer />

        {/* Modal for Details if triggered directly */}
        {detailsProperty && (
          <PropertyDetailsModal
            property={detailsProperty}
            rooms={detailsRooms}
            onClose={() => setDetailsProperty(null)}
            onStartBooking={handleStartBooking}
            onAddReview={handleAddReview}
          />
        )}

        {bookingSelection && (
          <BookingFlowModal
            selection={bookingSelection}
            user={user}
            onClose={() => setBookingSelection(null)}
            onSuccess={() => {
              fetchProperties()
              navigate('/dashboard/student')
            }}
            onOpenAuth={() => handleOpenAuth('login')}
          />
        )}
      </main>
    )
  }

  // --- ROUTE: /about ---
  if (path === '/about') {
    return (
      <main>
        <Navbar
          user={user}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          onOpenDashboard={() => navigateToDashboard()}
          onNavigate={navigate}
        />
        <AboutPage />
        <Footer />
      </main>
    )
  }

  // --- ROUTE: /how-it-works ---
  if (path === '/how-it-works') {
    return (
      <main>
        <Navbar
          user={user}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          onOpenDashboard={() => navigateToDashboard()}
          onNavigate={navigate}
        />
        <HowItWorksPage />
        <Footer />
      </main>
    )
  }

  // --- ROUTE: /contact ---
  if (path === '/contact') {
    return (
      <main>
        <Navbar
          user={user}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          onOpenDashboard={() => navigateToDashboard()}
          onNavigate={navigate}
        />
        <ContactPage />
        <Footer />
      </main>
    )
  }

  // --- ROUTE: /properties/[id] ---
  if (path.startsWith('/properties/')) {
    const propId = path.replace('/properties/', '').split('?')[0]
    const activeProp = properties.find((p) => p.id === propId) || properties[0]

    return (
      <main>
        <Navbar
          user={user}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          onOpenDashboard={() => navigateToDashboard()}
          onNavigate={navigate}
        />
        <PropertyDetailPage
          property={activeProp}
          rooms={detailsRooms.length ? detailsRooms : [
            {
              id: `room-${activeProp.id}-101`,
              propertyId: activeProp.id,
              roomNumber: '101',
              floor: 1,
              roomType: 'Single Sharing',
              rent: activeProp.startingRent + 2500,
              ac: true,
              sharingCapacity: 1,
              beds: [{ id: `bed-${activeProp.id}-1`, roomId: `room-${activeProp.id}-101`, bedNumber: 'Bed A', status: 'AVAILABLE' }],
            },
            {
              id: `room-${activeProp.id}-201`,
              propertyId: activeProp.id,
              roomNumber: '201',
              floor: 2,
              roomType: 'Double Sharing',
              rent: activeProp.startingRent,
              ac: true,
              sharingCapacity: 2,
              beds: [
                { id: `bed-${activeProp.id}-2`, roomId: `room-${activeProp.id}-201`, bedNumber: 'Bed A', status: 'AVAILABLE' },
                { id: `bed-${activeProp.id}-3`, roomId: `room-${activeProp.id}-201`, bedNumber: 'Bed B', status: 'OCCUPIED', occupantName: 'Resident' },
              ],
            },
          ]}
          onBack={() => navigate('/explore')}
          onStartBooking={(sel) => {
            setBookingSelection(sel)
            navigate('/booking')
          }}
          onAddReview={handleAddReview}
        />
        <Footer />
      </main>
    )
  }

  // --- ROUTE: /booking ---
  if (path === '/booking') {
    return (
      <main>
        <Navbar
          user={user}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          onOpenDashboard={() => navigateToDashboard()}
          onNavigate={navigate}
        />
        <BookingPage
          property={bookingSelection?.property}
          room={bookingSelection?.room}
          bed={bookingSelection?.bed}
          user={user}
          onNavigateHome={() => navigate('/')}
          onOpenAuth={handleOpenAuth}
          onViewBookings={() => navigate('/dashboard/student')}
        />
        <Footer />
      </main>
    )
  }

  // --- ROUTE: /dashboard/student or /student/dashboard ---
  if (path.startsWith('/student/dashboard') || path.startsWith('/dashboard/student')) {
    if (!user || user.role !== 'student') {
      return (
        <main>
          <Navbar
            user={user}
            onOpenAuth={handleOpenAuth}
            onLogout={handleLogout}
            onOpenDashboard={() => navigateToDashboard()}
            onNavigate={navigate}
          />
          <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
            <h2>Student Access Required</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Please log in with a student account to view this dashboard.</p>
            <button className="btn btn-accent" onClick={() => handleOpenAuth('login', 'student')}>
              Log In as Student
            </button>
          </div>
          <Footer />
        </main>
      )
    }
    return <StudentDashboard
      user={user}
      onLogout={handleLogout}
      onNavigateHome={() => navigate('/')}
      onNavigateExplore={() => navigate('/explore')}
    />
  }

  // --- ROUTE: /dashboard/owner or /owner/dashboard ---
  if (path.startsWith('/owner/dashboard') || path.startsWith('/dashboard/owner')) {
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
      return (
        <main>
          <Navbar
            user={user}
            onOpenAuth={handleOpenAuth}
            onLogout={handleLogout}
            onOpenDashboard={() => navigateToDashboard()}
            onNavigate={navigate}
          />
          <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
            <h2>Owner Studio Access Required</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Please log in with a property owner account to access management tools.</p>
            <button className="btn btn-accent" onClick={() => handleOpenAuth('login', 'owner')}>
              Log In as Property Owner
            </button>
          </div>
          <Footer />
        </main>
      )
    }
    return <OwnerDashboard user={user} onLogout={handleLogout} onNavigateHome={() => navigate('/')} />
  }

  // --- ROUTE: /admin or /admin/dashboard ---
  if (path.startsWith('/admin')) {
    if (!user || user.role !== 'admin') {
      return (
        <main>
          <Navbar
            user={user}
            onOpenAuth={handleOpenAuth}
            onLogout={handleLogout}
            onOpenDashboard={() => navigateToDashboard()}
            onNavigate={navigate}
          />
          <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
            <h2>Admin Privileges Required</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Please log in with SuperAdmin credentials.</p>
            <button className="btn btn-accent" onClick={() => handleOpenAuth('login')}>
              Admin Sign In
            </button>
          </div>
          <Footer />
        </main>
      )
    }
    return <AdminDashboard user={user} onLogout={handleLogout} onNavigateHome={() => navigate('/')} />
  }

  // --- PUBLIC LANDING & DISCOVERY VIEW (/) ---
  return (
    <main>
      {/* Sticky Glass Navbar */}
      <Navbar
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenDashboard={() => navigateToDashboard()}
        onNavigate={navigate}
      />

      {/* Hero Section */}
      <Hero
        onSearch={({ city }) => {
          setSelectedCity(city)
          navigate('/explore')
        }}
      />

      {/* Explore Listings & Filter Bar */}
      <ExploreListings
        properties={properties}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        onSelectProperty={handleOpenPropertyDetails}
        onBookDirect={handleOpenPropertyDetails}
      />

      {/* Sections 9 to 15: About, How It Works, Why Dazee, Testimonials, Owner Banner, Contact, Footer */}
      <ContentSections onOpenOwnerSignup={() => handleOpenAuth('signup', 'owner')} />

      {/* Property Details Modal (Gallery, Amenities, Rules, Reviews & Bed Selector) */}
      {detailsProperty && (
        <PropertyDetailsModal
          property={detailsProperty}
          rooms={detailsRooms}
          onClose={() => setDetailsProperty(null)}
          onStartBooking={handleStartBooking}
          onAddReview={handleAddReview}
        />
      )}

      {/* Multi-step Booking & Razorpay Flow Modal */}
      {bookingSelection && (
        <BookingFlowModal
          selection={bookingSelection}
          user={user}
          onClose={() => setBookingSelection(null)}
          onSuccess={(booking) => {
            console.log('Booking successful:', booking)
            fetchProperties()
            navigate('/dashboard/student')
          }}
          onOpenAuth={() => handleOpenAuth('login')}
        />
      )}

      {/* Authentication Modal */}
      {authModalOpen && (
        <AuthModal
          initialMode={authMode}
          initialRole={authInitialRole}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={(loggedUser) => {
            setUser(loggedUser)
            navigateToDashboard(loggedUser)
          }}
        />
      )}
    </main>
  )
}
