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

export default function App() {
  const location = useLocation()
  const [session, setSession] = useState(null)

  useEffect(() => {
    // 1) Fetch the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // 2) Listen for future changes
    const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession)
    })

    // 3) Cleanup subscription on unmount
    return () => {
      data.subscription.unsubscribe()  // correct way to unsubscribe :contentReference[oaicite:0]{index=0}
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
