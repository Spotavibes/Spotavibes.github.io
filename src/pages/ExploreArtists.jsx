import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const dummyArtists = [
  {
    id: 1,
    name: 'Luna Waves',
    genre: ['Pop', 'Indie'],
    price: '25',
    spotify: 'https://open.spotify.com/artist/12345',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/luna-waves.jpg',
    bio: 'Luna Waves blends dreamy indie pop melodies with soulful vocals to create a celestial soundscape.',
    socials: {
      twitter: 'https://twitter.com/lunawaves',
      instagram: 'https://instagram.com/lunawaves',
    },
  },
  {
    id: 2,
    name: 'Echo Pulse',
    genre: ['Hip-Hop'],
    price: '$30.00',
    spotify: 'https://open.spotify.com/artist/23456',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/echo-pulse.jpg',
    bio: 'Echo Pulse brings hard-hitting beats and thought-provoking lyrics to the modern hip-hop scene.',
    socials: {
      twitter: 'https://twitter.com/echopulse',
      instagram: 'https://instagram.com/echopulse',
    },
  },
  {
    id: 3,
    name: 'Nova Sky',
    genre: ['Indie', 'Rock'],
    price: '$20.00',
    spotify: 'https://open.spotify.com/artist/34567',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/nova-sky.jpg',
    bio: 'Nova Sky fuses vintage rock vibes with indie flair, delivering high-energy performances and catchy hooks.',
    socials: {
      twitter: 'https://twitter.com/novasky',
      instagram: 'https://instagram.com/novasky',
    },
  },
  {
    id: 4,
    name: 'Violet Drift',
    genre: ['Pop'],
    price: '$28.00',
    spotify: 'https://open.spotify.com/artist/45678',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/violet-drift.jpg',
    bio: 'Violet Drift captivates audiences with smooth pop vocals and emotionally rich lyrics.',
    socials: {
      twitter: 'https://twitter.com/violetdrift',
      instagram: 'https://instagram.com/violetdrift',
    },
  },
  {
    id: 5,
    name: 'Crimson Beat',
    genre: ['Hip-Hop', 'Rap'],
    price: '$35.00',
    spotify: 'https://open.spotify.com/artist/56789',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/crimson-beat.jpg',
    bio: 'Crimson Beat is known for their raw lyrical energy and trap-influenced beats.',
    socials: {
      twitter: 'https://twitter.com/crimsonbeat',
      instagram: 'https://instagram.com/crimsonbeat',
    },
  },

]

export default function ExploreArtists() {
  const [search, setSearch] = useState('')
  const [genreFilter, setGenreFilter] = useState('')
  const [alphaFilter, setAlphaFilter] = useState('')
  const [playingId, setPlayingId] = useState(null)
  const audioRef = useRef(null)
  const navigate = useNavigate()

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const filtered = dummyArtists.filter((artist) => {
    const matchesSearch = artist.name.toLowerCase().includes(search.toLowerCase())
    const matchesGenre = genreFilter ? artist.genre.includes(genreFilter) : true
    const matchesAlpha = alphaFilter ? artist.name.startsWith(alphaFilter) : true
    return matchesSearch && matchesGenre && matchesAlpha
  })

  function togglePlay(artist) {
    if (playingId === artist.id) {
      audioRef.current.pause()
      setPlayingId(null)
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setPlayingId(artist.id)
      setTimeout(() => {
        audioRef.current.play()
      }, 0)
    }
  }

  return (
    <section className="p-8 min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-red-500 font-sans">
      <h2
        className={`text-5xl font-extrabold text-center mb-10 text-white drop-shadow-lg transform transition-opacity duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        Explore Artists
      </h2>

      <div
        className={`flex flex-wrap justify-center mb-8 gap-2 transition-opacity duration-700 delay-150 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        
      </div>

      <div
        className={`flex flex-col md:flex-row justify-between items-center mb-12 gap-6 max-w-4xl mx-auto transition-opacity duration-700 delay-300 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-pink-400 px-5 py-3 rounded-lg w-full md:w-2/3 focus:outline-none focus:ring-4 focus:ring-pink-500 transition text-purple-900 font-semibold"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-pink-400 px-5 py-3 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-4 focus:ring-pink-500 transition text-purple-900 font-semibold"
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          <option value="">All Genres</option>
          <option value="Pop">Pop</option>
          <option value="Indie">Indie</option>
          <option value="Hip-Hop">Hip-Hop</option>
          <option value="Rock">Rock</option>
          <option value="Rap">Rap</option>
          <option value="Alternative">Alternative</option>
          <option value="Dance">Dance</option>
        </select>
      </div>

      <audio
        ref={audioRef}
        src={playingId ? dummyArtists.find((a) => a.id === playingId)?.snippet : ''}
        onEnded={() => setPlayingId(null)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {filtered.map((artist) => (
          <div
            key={artist.id}
            className="bg-white border border-pink-300 rounded-3xl shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-3 duration-300 flex flex-col p-6 opacity-0 animate-slideUp"
            style={{ animationFillMode: 'forwards', animationDuration: '600ms', animationDelay: `${100 * artist.id}ms` }}
          >
            <div className="flex flex-col space-y-5 flex-grow">
              <button
                onClick={() => togglePlay(artist)}
                className={`px-6 py-3 rounded-xl font-semibold text-lg transition-colors duration-300 transform hover:scale-105 ${
                  playingId === artist.id
                    ? 'bg-gradient-to-r from-pink-700 via-red-600 to-red-700 text-white shadow-inner'
                    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:brightness-110'
                }`}
              >
                {playingId === artist.id ? 'Pause Snippet' : 'Play Spotify Snippet'}
              </button>

              <button
                onClick={() => navigate('/checkout', { state: { artist } })}
                className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white hover:brightness-110 transition-colors duration-300 animate-pulse hover:animate-none"
              >
                Invest Now
              </button>

              <Link
                to={`/artist/${artist.id}`}
                className="text-purple-900 font-extrabold text-2xl hover:underline drop-shadow-md"
              >
                {artist.name}
              </Link>

              <p className="text-pink-700 italic font-semibold tracking-wide">Genres: {artist.genre.join(', ')}</p>

              <p className="text-green-700 font-bold text-lg">Investing Price: {artist.price}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation-name: slideUp;
          animation-fill-mode: forwards;
        }
      `}</style>
    </section>
  )
}
