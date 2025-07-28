import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function ExploreArtists() {
  const [artists, setArtists] = useState([]);
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchArtists() {
      setLoading(true);
      const { data, error } = await supabase.from('artists').select('*');
      if (!error && data) setArtists(data);
      setLoading(false);
    }
    fetchArtists();
  }, []);

  const filtered = artists.filter((artist) => {
    const name = artist.artist_name || '';
    const genres = Array.isArray(artist.genres) ? artist.genres : (artist.genres ? artist.genres.split(',') : []);
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genreFilter ? genres.map(g => g.trim()).includes(genreFilter) : true;
    return matchesSearch && matchesGenre;
  });

  // Helper to get Spotify embed URL from a Spotify track/playlist URL
  function getSpotifyEmbedUrl(url) {
    if (!url) return null;
    // Accepts both open.spotify.com/track/... and open.spotify.com/playlist/...
    const match = url.match(/open\.spotify\.com\/(track|playlist)\/([a-zA-Z0-9]+)/);
    if (match) {
      return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
    }
    return null;
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
        className={`flex flex-col md:flex-row justify-between items-center mb-12 gap-6 max-w-4xl mx-auto transition-opacity duration-700 delay-300 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-pink-400 px-5 py-3 rounded-lg w-full md:w-2/3 focus:outline-none focus:ring-4 focus:ring-pink-500 transition text-white placeholder-white font-semibold bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-pink-400 px-5 py-3 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-4 focus:ring-pink-500 transition text-white font-semibold bg-transparent"
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          <option value="" className="text-white bg-purple-700">All Genres</option>
          <option value="Pop">Pop</option>
          <option value="Indie">Indie</option>
          <option value="Hip-Hop">Hip-Hop</option>
          <option value="Rock">Rock</option>
          <option value="Rap">Rap</option>
          <option value="Alternative">Alternative</option>
          <option value="Dance">Dance</option>
        </select>
      </div>

      {loading ? (
        <div className="text-white text-center text-xl">Loading artists...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {filtered.map((artist) => {
            const genres = Array.isArray(artist.genres) ? artist.genres : (artist.genres ? artist.genres.split(',') : []);
            const genreString = genres.map(g => g.trim()).join(', ');
            const spotifyEmbedUrl = getSpotifyEmbedUrl(artist.snippet_url);
            return (
              <div
                key={artist.user_id}
                className="bg-white/40 backdrop-blur-md border border-pink-300 rounded-3xl shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-3 duration-300 flex flex-col p-6 opacity-0 animate-slideUp w-full"
                style={{ animationFillMode: 'forwards', animationDuration: '600ms' }}
              >
                <div className="flex flex-col space-y-4 flex-grow items-center w-full">
                  {spotifyEmbedUrl && (
                    <div className="w-full overflow-hidden rounded-lg mb-4">
                      <iframe
                        src={spotifyEmbedUrl}
                        width="100%"
                        height="180"
                        frameBorder="0"
                        allow="encrypted-media"
                        title="Spotify Player"
                        className="block w-full"
                        style={{ maxWidth: '100%', boxSizing: 'border-box' }}
                      ></iframe>
                    </div>
                  )}
                  <button
                    onClick={() => navigate('/checkout', { state: { artist } })}
                    className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white hover:brightness-110 transition-colors duration-300 animate-pulse hover:animate-none w-full text-lg"
                  >
                    Invest Now
                  </button>
                  <p className="text-pink-700 italic font-semibold tracking-wide text-lg mt-2 mb-0">
                    {genreString}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
  );
}
