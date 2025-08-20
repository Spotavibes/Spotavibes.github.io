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

  // Store custom percentages per artist (0% to max_revenue_share%)
  const [customPercentages, setCustomPercentages] = useState({});

  useEffect(() => {
    setMounted(true);
    async function fetchArtists() {
      setLoading(true);
      const { data, error } = await supabase.from('artists').select('*');
      if (!error && data) {
        setArtists(data);

        // Initialize customPercentages with 1% as default
        const initialPercentages = {};
        data.forEach(artist => {
          initialPercentages[artist.user_id] = 1; // Default to 1%
        });
        setCustomPercentages(initialPercentages);
      }
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
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
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
    <section className="min-h-screen bg-gradient-to-b from-[#1a002a] to-[#0a0010] font-sans relative overflow-hidden">

      {/* Background decorations */}
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
        <div className="absolute top-0 left-0 right-0 h-[26vh] max-h-[320px] bg-gradient-to-r from-purple-900/60 via-blue-900/30 to-pink-900/60 rounded-b-3xl pointer-events-none"></div>
        <div className="relative z-10 px-8 py-20 text-center">
          <h1
            className={`text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Explore Artists
          </h1>
          {/* Animated Stats - currently empty */}
          <div className={`flex justify-center gap-8 mt-8 transition-all duration-1000 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
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

      {/* Artist Grid */}
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
              const ml = Number(artist.monthly_listeners) || 0;
              const inv = Number(artist.investors) || 0;
              const maxRevenueShare = Number(artist.max_revenue_share) || 100; // Default to 100% if not set
              const pricePerPercent = 0.01 * ml * 3 * 0.04 / 24 * (1 + 0.01 * inv); // Price for 1% of shares

              const currentPercentage = customPercentages[artist.user_id] ?? 1;
              const currentPrice = (pricePerPercent * currentPercentage);

              return (
                <div
                  key={artist.user_id}
                  className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer relative overflow-hidden"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'forwards'
                  }}
                  // Clicking artist card could open details or do something else
                >
                  <div className="mb-4 relative z-10">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {artist.artist_name || 'Unknown Artist'}
                    </h3>
                  </div>

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

                  {/* Revenue Share Slider */}
                  <div className="mb-4 relative z-10">
                    <label className="block text-white text-sm font-semibold mb-1">
                      Select Revenue Share: {currentPercentage.toFixed(1)}%
                    </label>
                    <input
                      type="range"
                      min={0.1}
                      max={maxRevenueShare}
                      step={0.1}
                      value={currentPercentage}
                      onChange={(e) =>
                        setCustomPercentages(prev => ({
                          ...prev,
                          [artist.user_id]: Number(e.target.value)
                        }))
                      }
                      className="w-full"
                    />
                    <p className="text-gray-300 text-xs mt-1">
                      Price: ${currentPrice.toFixed(2)} for {currentPercentage.toFixed(1)}% ownership
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/checkout', { state: { artist, price: currentPrice, percentage: currentPercentage } })}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent relative z-10"
                  >
                    Invest ${currentPrice.toFixed(2)} for {currentPercentage.toFixed(1)}%
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
