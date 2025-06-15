import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Landing from './components/Landing.jsx'

import ExploreArtists from './pages/ExploreArtists.jsx'
import Checkout from './pages/Checkout.jsx'
import About from './pages/About.jsx'
import ArtistProfile from './pages/ArtistProfile.jsx'
import InvestorDashboard from './pages/InvestorDashboard.jsx'

export default function App() {
  const location = useLocation()

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        {/* AnimatePresence needs a key to detect route changes */}
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/explore-artists" element={<ExploreArtists />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
          <Route path="/investor-dashboard" element={<InvestorDashboard />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  )
}
