import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import genresListRaw from '../assets/genres.txt?raw';
import Select from 'react-select';

const genresList = genresListRaw.split('\n').map(g => g.trim()).filter(Boolean);
const genreOptions = genresList.map(g => ({ value: g, label: g }));

export default function ExploreArtists() {
  const [artists, setArtists] = useState([]);
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);

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

  const filteredAndSorted = artists
    .filter((artist) => {
      const name = artist.artist_name || '';
      let genres = [];
      if (Array.isArray(artist.genres)) {
        genres = artist.genres;
      } else if (typeof artist.genres === 'string') {
        try {
          genres = JSON.parse(artist.genres);
        } catch {
          genres = artist.genres.split(',').map(g => g.trim());
        }
      }
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = genreFilter ? genres.map(g => g.trim()).includes(genreFilter.value) : true;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = (a.artist_name || '').toLowerCase();
          bValue = (b.artist_name || '').toLowerCase();
          break;
        case 'genre':
          let aGenres = [];
          let bGenres = [];
          if (Array.isArray(a.genres)) {
            aGenres = a.genres;
          } else if (typeof a.genres === 'string') {
            try {
              aGenres = JSON.parse(a.genres);
            } catch {
              aGenres = a.genres.split(',').map(g => g.trim());
            }
          }
          if (Array.isArray(b.genres)) {
            bGenres = b.genres;
          } else if (typeof b.genres === 'string') {
            try {
              bGenres = JSON.parse(b.genres);
            } catch {
              bGenres = b.genres.split(',').map(g => g.trim());
            }
          }
          aValue = aGenres.join(', ').toLowerCase();
          bValue = bGenres.join(', ').toLowerCase();
          break;
        default:
          aValue = (a.artist_name || '').toLowerCase();
          bValue = (b.artist_name || '').toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

  function getSpotifyEmbedUrl(url) {
    if (!url) return null;
    const match = url.match(/open\.spotify\.com\/(track|playlist)\/([a-zA-Z0-9]+)/);
    if (match) {
      return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
    }
    return null;
  }

  function getGenres(artist) {
    if (Array.isArray(artist.genres)) {
      return artist.genres;
    } else if (typeof artist.genres === 'string') {
      try {
        return JSON.parse(artist.genres);
      } catch {
        return artist.genres.split(',').map(g => g.trim());
      }
    }
    return [];
  }

  const sortOptions = [
    { value: 'name', label: 'Artist Name' },
    { value: 'genre', label: 'Genre' }
  ];

  const orderOptions = [
    { value: 'asc', label: 'A → Z' },
    { value: 'desc', label: 'Z → A' }
  ];

  return (

  <section className="min-h-screen bg-gradient-to-b from-[#1a002a] to-black font-sans relative overflow-hidden">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-pink-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-green-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-pink-900/10 via-transparent to-purple-900/10"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-blue-900/20 to-pink-900/30"></div>
        <div className="relative z-10 px-8 py-20 text-center">
          <div className="mb-6">
            <div className="text-8xl mb-4 animate-bounce" style={{ animationDuration: '3s' }}>🎵</div>
            <div className="text-6xl mb-4 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>🎤</div>
            <div className="text-8xl mb-4 animate-bounce" style={{ animationDuration: '3s', animationDelay: '1s' }}>🎸</div>
          </div>
          <h1
            className={`text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Explore Artists
          </h1>
          <p
            className={`text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Discover emerging talent and invest in the future of music
          </p>
          
          {/* Animated Stats */}
          <div className={`flex justify-center gap-8 mt-8 transition-all duration-1000 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 animate-pulse">{artists.length}</div>
              <div className="text-sm text-gray-400">Artists</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 animate-pulse" style={{ animationDelay: '0.5s' }}>{genreOptions.length}</div>
              <div className="text-sm text-gray-400">Genres</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400 animate-pulse" style={{ animationDelay: '1s' }}>∞</div>
              <div className="text-sm text-gray-400">Possibilities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="px-8 pb-8">
        <div
          className={`max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 transition-all duration-1000 delay-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search Input */}
            <div>
              <label className="block text-white font-semibold mb-2">Search Artists</label>
              <input
                type="text"
                placeholder="Type artist name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Genre Filter */}
            <div>
              <label className="block text-white font-semibold mb-2">Filter by Genre</label>
              <Select
                options={genreOptions}
                value={genreFilter}
                onChange={setGenreFilter}
                placeholder="Select genre..."
                isClearable
                classNamePrefix="select"
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                  control: (base) => ({
                    ...base,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    '&:hover': {
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: 'rgba(26, 0, 51, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px'
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? 'rgba(168, 85, 247, 0.3)' : 'transparent',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(168, 85, 247, 0.3)'
                    }
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: 'white'
                  }),
                  input: (base) => ({
                    ...base,
                    color: 'white'
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: 'rgba(156, 163, 175, 1)'
                  })
                }}
              />
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white font-semibold mb-2">Sort By</label>
                <Select
                  options={sortOptions}
                  value={sortOptions.find(option => option.value === sortBy)}
                  onChange={(option) => setSortBy(option.value)}
                  classNamePrefix="select"
                  menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                  styles={{
                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                    control: (base) => ({
                      ...base,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      '&:hover': {
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: 'rgba(26, 0, 51, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px'
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? 'rgba(168, 85, 247, 0.3)' : 'transparent',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(168, 85, 247, 0.3)'
                      }
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: 'white'
                    }),
                    input: (base) => ({
                      ...base,
                      color: 'white'
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: 'rgba(156, 163, 175, 1)'
                    })
                  }}
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Order</label>
                <Select
                  options={orderOptions}
                  value={orderOptions.find(option => option.value === sortOrder)}
                  onChange={(option) => setSortOrder(option.value)}
                  classNamePrefix="select"
                  menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                  styles={{
                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                    control: (base) => ({
                      ...base,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      '&:hover': {
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: 'rgba(26, 0, 51, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px'
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? 'rgba(168, 85, 247, 0.3)' : 'transparent',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(168, 85, 247, 0.3)'
                      }
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: 'white'
                    }),
                    input: (base) => ({
                      ...base,
                      color: 'white'
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: 'rgba(156, 163, 175, 1)'
                    })
                  }}
                />
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-300">
              Showing <span className="text-purple-400 font-semibold">{filteredAndSorted.length}</span> of{' '}
              <span className="text-purple-400 font-semibold">{artists.length}</span> artists
            </p>
          </div>
        </div>
      </div>

      {/* Artists Grid */}
      <div className="px-8 pb-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-white text-xl">Loading artists...</p>
            </div>
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-bounce">🎵</div>
            <h3 className="text-2xl font-bold text-white mb-2">No artists found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {filteredAndSorted.map((artist, index) => {
              const genres = getGenres(artist);
              const spotifyEmbedUrl = getSpotifyEmbedUrl(artist.snippet_url);
              
              return (
                <div
                  key={artist.user_id}
                  className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer relative overflow-hidden"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'forwards'
                  }}
                  onClick={() => setSelectedArtist(artist)}
                >
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Artist Header */}
                  <div className="mb-4 relative z-10">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {artist.artist_name || 'Unknown Artist'}
                    </h3>
                  </div>

                  {/* Spotify Embed */}
                  {spotifyEmbedUrl && (
                    <div className="mb-4 overflow-hidden rounded-xl relative z-10">
                      <iframe
                        src={spotifyEmbedUrl}
                        width="100%"
                        height="200"
                        frameBorder="0"
                        allow="encrypted-media"
                        title="Spotify Player"
                        className="block w-full"
                      />
                    </div>
                  )}

                  {/* Genre Tags - Moved below embed and made bigger */}
                  <div className="mb-4 relative z-10">
                    <div className="flex flex-wrap gap-2">
                      {genres.slice(0, 3).map((genre, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-purple-500/20 text-purple-300 text-sm font-semibold rounded-full border border-purple-500/30 hover:bg-purple-500/30 transition-all duration-300 transform hover:scale-105"
                        >
                          {genre}
                        </span>
                      ))}
                      {genres.length > 3 && (
                        <span className="px-4 py-2 bg-gray-500/20 text-gray-300 text-sm font-semibold rounded-full">
                          +{genres.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/checkout', { state: { artist } });
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent relative z-10"
                  >
                    Invest Now
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Artist Modal */}
      {selectedArtist && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold text-white">{selectedArtist.artist_name}</h2>
              <button
                onClick={() => setSelectedArtist(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Genres */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {getGenres(selectedArtist).map((genre, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full border border-purple-500/30"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* Spotify Embed */}
              {getSpotifyEmbedUrl(selectedArtist.snippet_url) && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Music Preview</h3>
                  <div className="overflow-hidden rounded-xl">
                    <iframe
                      src={getSpotifyEmbedUrl(selectedArtist.snippet_url)}
                      width="100%"
                      height="300"
                      frameBorder="0"
                      allow="encrypted-media"
                      title="Spotify Player"
                      className="block w-full"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-white/10">
                <button
                  onClick={() => {
                    navigate('/checkout', { state: { artist: selectedArtist } });
                    setSelectedArtist(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Invest Now
                </button>
                <button
                  onClick={() => setSelectedArtist(null)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation-name: slideUp;
          animation-fill-mode: forwards;
          animation-duration: 600ms;
        }
      `}</style>
    </section>
  );
}
