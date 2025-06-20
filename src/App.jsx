import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { supabase } from './lib/supabaseClient'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './components/Landing'
import ExploreArtists from './pages/ExploreArtists'
import Checkout from './pages/Checkout'
import About from './pages/About'
import ArtistProfile from './pages/ArtistProfile'
import InvestorDashboard from './pages/InvestorDashboard'

// ✅ ADD: Simple success and cancel components
const Success = () => (
  <div className="p-10 text-center">
    <h1 className="text-3xl font-bold text-green-600">✅ Payment Successful</h1>
    <p className="mt-2">Thank you for supporting the artist!</p>
    <a href="/explore-artists" className="text-blue-600 underline mt-4 inline-block">Back to Explore</a>
  </div>
)

const Cancel = () => (
  <div className="p-10 text-center">
    <h1 className="text-3xl font-bold text-red-600">❌ Payment Cancelled</h1>
    <p className="mt-2">You can try again anytime.</p>
    <a href="/explore-artists" className="text-blue-600 underline mt-4 inline-block">Back to Explore</a>
  </div>
)

export default function App() {
  const location = useLocation()
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession)
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  const user = session?.user ?? null

  function ProtectedRoute({ children }) {
    return user ? children : <Navigate to="/" replace state={{ from: location }} />
  }

  return (
    <>
      <Navbar user={user} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/explore-artists" element={<ExploreArtists />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/artist/:id" element={<ArtistProfile />} />

          {/* ✅ ADD THESE TWO ROUTES */}
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />

          {/* Private */}
          <Route
            path="/investor-dashboard"
            element={
              <ProtectedRoute>
                <InvestorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </>
  )
}
