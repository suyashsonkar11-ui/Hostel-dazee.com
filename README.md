# Hostel Dazee — Premium Student & PG Accommodation Platform

**Hostel Dazee** is a modern, student-centric hostel, PG, and co-living discovery and booking platform designed for university students and young professionals across India.

---

## 🚀 Key Features

1. **Accommodation Discovery & Advanced Filters**:
   - Filter by City (Bengaluru, Pune, Delhi NCR, Hyderabad, Mumbai, Chennai)
   - Filter by Sharing (Single, Double, Triple, Four-sharing)
   - Filter by Gender (Unisex / Co-ed, Girls only, Boys only)
   - Filter by Price Range & Essential Amenities (High-Speed Wi-Fi, Fresh Meals, AC, Laundry, 24/7 Security)
2. **Interactive Visual Room & Bed Selection**:
   - Real-time room floor plans (Single, Double, Triple sharing)
   - Select individual available beds (`[ Bed A ]`, `[ Bed B ]`) with live status indicators
   - Occupied beds disabled with resident privacy badges
3. **Multi-Step Checkout & Razorpay Integration**:
   - Step 1: Confirm room, bed, move-in date & duration (1, 3, 6, 11 months)
   - Step 2: Personal details & Emergency contact
   - Step 3: Fare summary (Rent, Security deposit, Platform service fee)
   - Step 4: Razorpay checkout & test payment verification
   - Step 5: Confirmed Booking Slip with Booking Reference (`DZ-XXXXX`) & printable voucher
4. **Three Dedicated Role Portals**:
   - **Student Portal**: Active stay card with security code, booking history, payment transactions, and profile settings.
   - **Owner Studio**: Property listings, auto-generate rooms and bed units, accept/reject student booking requests, and track revenue & occupancy rates.
   - **SuperAdmin Console**: Platform analytics, property verification & review queue, user directory with status toggling, and gross volume reports.

---

## ⚡ Quick Demo Test Accounts

For testing, use any of these pre-seeded accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@hosteldazee.com` | `Student@1234` |
| **Owner** | `owner@hosteldazee.com` | `Owner@1234` |
| **SuperAdmin** | `admin@hosteldazee.com` | `Admin@1234` |

*(You can also use the 1-click quick credentials buttons in the Login modal).*

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Modern Vanilla CSS Design System with Plus Jakarta Sans typography, glassmorphism, responsive cards, and micro-interactions
- **Backend**: Node.js + Express (`server/index.cjs`)
- **Authentication**: JWT (`jsonwebtoken`) + `bcryptjs`
- **Database**: Persistent JSON database (`server/data.json`) with MongoDB schema fidelity
- **Payment Gateway**: Razorpay integration (`/api/payments/create` and `/api/payments/verify`)

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Backend API Server
```bash
npm run server
# Runs Express on http://localhost:5000
```

### 3. Start Frontend Development Server
```bash
npm run dev
# Runs Vite on http://localhost:5173
```

### 4. Production Build
```bash
npm run build
```

---

## 🌐 Production Deployment

- **Frontend → Vercel**:
  Connect your GitHub repository to Vercel. Set build command `npm run build` and output directory `dist`.
- **Backend → Render**:
  Create a Web Service on Render with Build Command `npm install` and Start Command `node server/index.cjs`.
- **Database → MongoDB Atlas**:
  Set environment variable `MONGODB_URI` in your Render service settings to connect your MongoDB Atlas cluster.
