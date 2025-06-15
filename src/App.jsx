import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Landing from './components/Landing.jsx'

import ExploreArtists from './pages/ExploreArtists.jsx'
import Checkout from './pages/Checkout.jsx'
import About from './pages/About.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/explore-artists" element={<ExploreArtists />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </>
  )
}
