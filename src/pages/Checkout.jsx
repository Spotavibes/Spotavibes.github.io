import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'


export default function Checkout({ user }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [fadeIn, setFadeIn] = useState(false)

  const artist = location.state?.artist

  useEffect(() => {
    console.log('Checkout component mounted');
    setFadeIn(true)
  }, [])

  async function handlePayment() {
    console.log('handlePayment called');
  
    // 1) get the current session & token
    const { data: { session }, error: sessErr } = await supabase.auth.getSession();
    if (sessErr || !session) {
      console.error('Unable to get session:', sessErr);
      return;
    }
  
    const token = session.access_token;
    const price = Number(artist.price.replace('$', ''));
  
    console.log('About to fetch /create-checkout-session', {
      artistId: artist.id,
      amount: price,
      token: token.slice(0, 10) + '…'
    });
  
    try {
      const res = await fetch('http://localhost:3000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 2) send the JWT so your backend can verify it
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          artistId: artist.id,
          amount: price,
          // no more userId or userEmail here!
        }),
      });
  
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Failed to get Stripe Checkout URL:', data);
      }
    } catch (error) {
      console.error('Error creating Stripe Checkout session:', error);
    }
  }
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: fadeIn ? 1 : 0, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="p-8 min-h-screen max-w-md mx-auto bg-white rounded-3xl shadow-2xl ring-1 ring-purple-300 hover:-translate-y-1 transition-transform duration-300"
    >
      <h2 className="text-4xl font-extrabold mb-6 text-center text-indigo-900 drop-shadow-lg">Checkout</h2>

      <img src={artist.banner} alt={`${artist.name} banner`} className="w-full h-48 object-cover rounded-xl mb-6 shadow-md" />

      <div className="mb-8 space-y-4 text-indigo-800">
        <p className="text-xl"><strong>Artist:</strong> {artist.name}</p>
        <p className="text-lg"><strong>Price:</strong> <span className="text-green-600 font-semibold">{artist.price}</span></p>
        <p className="italic"><strong>Genres:</strong> {artist.genre.join(', ')}</p>
        <p className="text-sm text-indigo-700"><strong>About:</strong> {artist.bio}</p>

        <div className="flex gap-4 mt-2">
          {artist.socials?.twitter && (
            <a href={artist.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">Twitter</a>
          )}
          {artist.socials?.instagram && (
            <a href={artist.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline text-sm">Instagram</a>
          )}
        </div>
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold shadow-lg transition transform hover:scale-105 active:scale-95"
      >
        Confirm Investment
      </button>
      <button
        onClick={() => navigate('/explore-artists')}
        className="w-full mt-4 bg-indigo-200 hover:bg-indigo-300 text-indigo-900 py-3 rounded-lg font-medium shadow-inner transition transform hover:scale-105 active:scale-95"
      >
        Cancel
      </button>
    </motion.div>
  )
}
