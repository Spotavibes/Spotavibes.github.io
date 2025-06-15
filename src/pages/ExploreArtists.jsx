import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const dummyArtists = [
  {
    id: 1,
    name: 'Luna Waves',
    genre: ['Pop', 'Indie'],
    price: '$25.00',
    spotify: 'https://open.spotify.com/artist/12345',
    snippet: '/audio/mysnippet.mp3',
  },
  {
    id: 2,
    name: 'Echo Pulse',
    genre: ['Hip-Hop'],
    price: '$30.00',
    spotify: 'https://open.spotify.com/artist/23456',
    snippet: '/audio/mysnippet.mp3',
  },
  {
    id: 3,
    name: 'Nova Sky',
    genre: ['Indie', 'Rock'],
    price: '$20.00',
    spotify: 'https://open.spotify.com/artist/34567',
    snippet: '/audio/mysnippet.mp3',
  },
  {
    id: 4,
    name: 'Violet Drift',
    genre: ['Pop'],
    price: '$28.00',
    spotify: 'https://open.spotify.com/artist/45678',
    snippet: '/audio/mysnippet.mp3',
  },
  {
    id: 5,
    name: 'Crimson Beat',
    genre: ['Hip-Hop', 'Rap'],
    price: '$35.00',
    spotify: 'https://open.spotify.com/artist/56789',
    snippet: '/audio/mysnippet.mp3',
  },
  {
    id: 6,
    name: 'Silver Lining',
    genre: ['Indie', 'Alternative'],
    price: '$22.00',
    spotify: 'https://open.spotify.com/artist/67890',
    snippet: '/audio/mysnippet.mp3',
  },
  {
    id: 7,
    name: 'Golden Hour',
    genre: ['Pop', 'Dance'],
    price: '$27.00',
    spotify: 'https://open.spotify.com/artist/78901',
    snippet: '/audio/mysnippet.mp3',
  },
  {
    id: 8,
    name: 'Midnight Echo',
    genre: ['Rock'],
    price: '$25.00',
    spotify: 'https://open.spotify.com/artist/89012',
    snippet: '/audio/mysnippet.mp3',
  },
]

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

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
    <section className="p-8 min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100">
      <h2
        className={`text-4xl font-extrabold text-center mb-8 text-indigo-900 drop-shadow-lg transform transition-opacity duration-700 ${
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
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => setAlphaFilter(letter === alphaFilter ? '' : letter)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 transform ${
              alphaFilter === letter
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white shadow-lg scale-105'
                : 'bg-gray-300 text-gray-800 hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-400 hover:to-indigo-400 hover:scale-105'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      <div
        className={`flex flex-col md:flex-row justify-between items-center mb-12 gap-6 max-w-4xl mx-auto transition-opacity duration-700 delay-300 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-indigo-300 px-5 py-3 rounded-lg w-full md:w-2/3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-indigo-300 px-5 py-3 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
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
            className="bg-white border border-indigo-200 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 duration-300 flex flex-col p-6 opacity-0 animate-slideUp"
            style={{ animationFillMode: 'forwards', animationDuration: '500ms', animationDelay: `${100 * artist.id}ms` }}
          >
            <div className="flex flex-col space-y-4 flex-grow">
              <button
                onClick={() => togglePlay(artist)}
                className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-300 transform hover:scale-105 ${
                  playingId === artist.id
                    ? 'bg-purple-700 text-white shadow-inner'
                    : 'bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 text-white hover:brightness-110'
                }`}
              >
                {playingId === artist.id ? 'Pause Snippet' : 'Play Spotify Snippet'}
              </button>

              <button
                onClick={() => navigate('/checkout', { state: { artist } })}
                className="px-5 py-2 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors duration-300 animate-pulse hover:animate-none"
              >
                Invest Now
              </button>

              <a
                href={artist.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-900 font-bold text-xl hover:underline"
              >
                {artist.name}
              </a>

              <p className="text-indigo-700 italic font-medium">Genres: {artist.genre.join(', ')}</p>

              <p className="text-green-700 font-semibold">Investing Price: {artist.price}</p>
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
