import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Checkout({ user }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progressStep, setProgressStep] = useState(1)

  const artist = location.state?.artist

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setProgressStep(2), 500)
    const timer2 = setTimeout(() => setProgressStep(3), 1000)
    return () => {
      clearTimeout(timer)
      clearTimeout(timer2)
    }
  }, [])

  if (!artist) {
    return (
      <section className="min-h-screen bg-[#0a0a23] font-sans relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-40 right-20 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-screen px-8 relative z-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4 animate-bounce">⚠️</div>
            <h2 className="text-3xl font-bold text-white mb-4">No artist data found.</h2>
            <button 
              onClick={() => navigate('/explore-artists')} 
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Back to Explore
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Fallbacks for missing fields
  const name = artist.artist_name || 'Unknown Artist';
  const genres = Array.isArray(artist.genres) ? artist.genres : (artist.genres ? artist.genres.split(',') : []);
  const bio = artist.bio || 'No bio available.';
  const banner = artist.snippet_url || '';
  const ml = Number(artist.monthly_listeners) || 0;
  const inv = Number(artist.investors) || 0;

  // Keep price as number internally
  const price = 0.01 * ml * 3 * 0.04 / 24 * (1 + 0.01 * inv); 
  const id = artist.user_id || artist.id || '';

  // Socials fallback
  let socials = {};
  try {
    socials = typeof artist.socials === 'string' ? JSON.parse(artist.socials) : (artist.socials || {});
  } catch {
    socials = {};
  }

  async function handlePayment() {
    setLoading(true)
    const { data: { session }, error: sessErr } = await supabase.auth.getSession();
    if (sessErr || !session) {
      alert('Unable to get session. Please sign in again.');
      setLoading(false)
      return;
    }
    const token = session.access_token;

    // Send amount in cents to backend
    const amountInDollars = price.toFixed(2);

    try {
      const res = await fetch('http://localhost:3000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          artistId: id,
          amount: amountInDollars,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout session creation failed:", data);
        alert('Failed to get Stripe Checkout URL.');
        setLoading(false)
      }
    } catch (error) {
      console.error(error);
      alert('Error creating Stripe Checkout session.');
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-[#0a0a23] font-sans relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-pink-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-transparent to-blue-900/20"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-purple-900/10 via-transparent to-green-900/10"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/30 via-blue-900/20 to-purple-900/30"></div>
        <div className="relative z-10 px-8 py-16 text-center">
          <div className="mb-6">
            <div className="text-8xl mb-4 animate-bounce" style={{ animationDuration: '3s' }}>💳</div>
            <div className="text-6xl mb-4 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>🎵</div>
            <div className="text-8xl mb-4 animate-bounce" style={{ animationDuration: '3s', animationDelay: '1s' }}>💰</div>
          </div>
          <h1 className={`text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-green-200 via-blue-200 to-purple-200 bg-clip-text text-transparent transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Complete Investment
          </h1>
          <p className={`text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Review your investment details and confirm your purchase.
          </p>
          
          {/* Progress Steps */}
          <div className={`flex justify-center gap-4 mt-8 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className={`flex items-center ${progressStep >= 1 ? 'text-green-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${progressStep >= 1 ? 'border-green-400 bg-green-400' : 'border-gray-500'}`}>
                {progressStep >= 1 ? '✓' : '1'}
              </div>
              <span className="ml-2 text-sm">Review</span>
            </div>
            <div className={`w-16 h-0.5 ${progressStep >= 2 ? 'bg-green-400' : 'bg-gray-500'}`}></div>
            <div className={`flex items-center ${progressStep >= 2 ? 'text-green-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${progressStep >= 2 ? 'border-green-400 bg-green-400' : 'border-gray-500'}`}>
                {progressStep >= 2 ? '✓' : '2'}
              </div>
              <span className="ml-2 text-sm">Confirm</span>
            </div>
            <div className={`w-16 h-0.5 ${progressStep >= 3 ? 'bg-green-400' : 'bg-gray-500'}`}></div>
            <div className={`flex items-center ${progressStep >= 3 ? 'text-green-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${progressStep >= 3 ? 'border-green-400 bg-green-400' : 'border-gray-500'}`}>
                {progressStep >= 3 ? '✓' : '3'}
              </div>
              <span className="ml-2 text-sm">Pay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="px-8 pb-16">
        <div className={`max-w-2xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Artist Banner */}
          {banner && (
            <div className="mb-6 overflow-hidden rounded-xl relative group">
              <img 
                src={banner} 
                alt={`${name} banner`} 
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}

          {/* Artist Info */}
          <div className="mb-8 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{name}</h2>
              <p className="text-gray-300 text-lg">{bio}</p>
            </div>

            {/* Price Display */}
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md border border-green-500/30 rounded-xl p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 animate-pulse"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white mb-2">Investment Amount</h3>
                <p className="text-4xl font-bold text-green-400 animate-pulse">
                  {`$${price.toFixed(2)}`}
                </p>
                <p className="text-sm text-gray-400 mt-2">Secure payment via Stripe</p>
              </div>
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-purple-500/20 text-purple-300 text-sm font-semibold rounded-full border border-purple-500/30 hover:bg-purple-500/30 transition-all duration-300 transform hover:scale-105"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {(socials.twitter || socials.instagram) && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Follow Artist</h3>
                <div className="flex gap-4">
                  {socials.twitter && (
                    <a 
                      href={socials.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-300 transform hover:scale-105"
                    >
                      Twitter
                    </a>
                  )}
                  {socials.instagram && (
                    <a 
                      href={socials.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-lg border border-pink-500/30 hover:bg-pink-500/30 transition-all duration-300 transform hover:scale-105"
                    >
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:transform-none relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💳</span>
                    Confirm Investment
                  </>
                )}
              </div>
            </button>
            
            <button
              onClick={() => navigate('/explore-artists')}
              className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
