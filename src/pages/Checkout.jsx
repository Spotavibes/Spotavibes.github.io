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
    setFadeIn(true)
  }, [])

  if (!artist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">No artist data found.</h2>
        <button onClick={() => navigate('/explore-artists')} className="px-6 py-3 bg-indigo-500 text-white rounded-lg">Back to Explore</button>
      </div>
    )
  }

  // Fallbacks for missing fields
  const name = artist.artist_name || 'Unknown Artist';
  const genres = Array.isArray(artist.genres) ? artist.genres : (artist.genres ? artist.genres.split(',') : []);
  const bio = artist.bio || 'No bio available.';
  const banner = artist.snippet_url || '';
  const price = artist.price || '$10.00'; // fallback price if not present
  const id = artist.user_id || artist.id || '';

  // Socials fallback
  let socials = {};
  try {
    socials = typeof artist.socials === 'string' ? JSON.parse(artist.socials) : (artist.socials || {});
  } catch {
    socials = {};
  }

  async function handlePayment() {
    const { data: { session }, error: sessErr } = await supabase.auth.getSession();
    if (sessErr || !session) {
      alert('Unable to get session. Please sign in again.');
      return;
    }
    const token = session.access_token;
    const priceNum = Number(price.replace('$', ''));
    try {
      const res = await fetch('http://localhost:3000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          artistId: id,
          amount: priceNum,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to get Stripe Checkout URL.');
      }
    } catch (error) {
      alert('Error creating Stripe Checkout session.');
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
      {banner && (
        <img src={banner} alt={`${name} banner`} className="w-full h-48 object-cover rounded-xl mb-6 shadow-md" />
      )}
      <div className="mb-8 space-y-4 text-indigo-800">
        <p className="text-xl"><strong>Artist:</strong> {name}</p>
        <p className="text-lg"><strong>Price:</strong> <span className="text-green-600 font-semibold">{price}</span></p>
        <p className="italic"><strong>Genres:</strong> {genres.join(', ')}</p>
        <p className="text-sm text-indigo-700"><strong>About:</strong> {bio}</p>
        <div className="flex gap-4 mt-2">
          {socials.twitter && (
            <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">Twitter</a>
          )}
          {socials.instagram && (
            <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline text-sm">Instagram</a>
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
