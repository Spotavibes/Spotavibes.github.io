import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import genresListRaw from '../assets/genres.txt?raw';
import Select from 'react-select';

const genresList = genresListRaw.split('\n').map(g => g.trim()).filter(Boolean);
const genreOptions = genresList.map(g => ({ value: g, label: g }));

function ArtistProfileForm() {
  const [artistName, setArtistName] = useState("");
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState([]);
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [mounted, setMounted] = useState(false);
  const [monthlyListeners, setMonthlyListeners] = useState("");
  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper to count words
  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
  const isFormValid = artistName.trim() && description.trim() && genres.length > 0 && spotifyUrl.trim() && monthlyListeners.trim();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    
    if (wordCount > 50) {
      setMessage("Description must be 50 words or less.");
      setMessageType("error");
      return;
    }
    
    setLoading(true);

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setMessage("You must be logged in to submit your profile.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    // Upsert artist profile
    const { error } = await supabase
  .from("artists")
  .upsert({
    user_id: user.id,
    artist_name: artistName.trim(),
    description: description.trim(),
    genres: genres.map(g => g.value),
    snippet_url: spotifyUrl.trim(),
    monthly_listeners: Number(monthlyListeners),
  }, { onConflict: ['user_id'] });
setMonthlyListeners("");
    if (error) {
      setMessage("Error saving profile: " + error.message);
      setMessageType("error");
    } else {
      setMessage("Profile saved successfully! Your artist profile is now live.");
      setMessageType("success");
      // Clear form on success
      setArtistName("");
      setDescription("");
      setGenres([]);
      setSpotifyUrl("");
    }
    setLoading(false);
  };

  return (
<section className="min-h-screen bg-gradient-to-b from-[#1a002a] to-[#0a0010] font-sans relative overflow-hidden">
    <div className="relative z-10 px-8 py-16 text-center">
      <h1
        className={`text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        Submit Your Profile
      </h1>
      <p
        className={`text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        Share your music with the world and connect with potential investors. 
        Create your artist profile to start your journey.
      </p>
    </div>


      {/* Form Section */}
      <div className="px-8 pb-16">
        <div
          className={`max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 transition-all duration-1000 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Artist Name */}
            <div>
              <label className="block text-white font-semibold mb-3 text-lg">
                Artist Name *
              </label>
              <input
                type="text"
                value={artistName}
                onChange={e => setArtistName(e.target.value)}
                required
                placeholder="Enter your artist name..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-semibold mb-3 text-lg">
                Artist Description *
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                placeholder="Tell us about your music, style, and what makes you unique..."
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              />
              <div className={`text-sm mt-2 ${wordCount > 50 ? 'text-red-400' : 'text-gray-400'}`}>
                {wordCount}/50 words {wordCount > 50 && '(limit exceeded)'}
              </div>
            </div>

            {/* Genres */}
            <div>
              <label className="block text-white font-semibold mb-3 text-lg">
                Genres *
              </label>
              <Select
                isMulti
                options={genreOptions}
                value={genres}
                onChange={setGenres}
                placeholder="Select your genres..."
                classNamePrefix="select"
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                  control: (base) => ({
                    ...base,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    minHeight: '48px',
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
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: 'rgba(168, 85, 247, 0.3)',
                    borderRadius: '8px'
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: 'white'
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(239, 68, 68, 0.3)',
                      color: 'white'
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
              <div className="text-sm text-gray-400 mt-2">
                Type to search. Hold Ctrl (Windows) or Cmd (Mac) to select multiple genres.
              </div>
            </div>
    {/* Monthly Listeners */}
            <div>
              <label className="block text-white font-semibold mb-3 text-lg">
                Monthly Listeners *
              </label>
              <input
                type="number"
                min="0"
                value={monthlyListeners}
                onChange={e => setMonthlyListeners(e.target.value)}
                required
                placeholder="Enter your monthly listeners..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <div className="text-sm text-gray-400 mt-2">
                Please enter the number of monthly listeners you have on Spotify.
              </div>
            </div>
            {/* Spotify URL */}
            <div>
              <label className="block text-white font-semibold mb-3 text-lg">
                Spotify Song URL *
              </label>
              <input
                type="url"
                value={spotifyUrl}
                onChange={e => setSpotifyUrl(e.target.value)}
                required
                placeholder="https://open.spotify.com/track/..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <div className="text-sm text-gray-400 mt-2">
                Share a link to your best track on Spotify
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading || !isFormValid || wordCount > 50}
                className={`w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                  loading || !isFormValid || wordCount > 50
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Saving Profile...
                  </div>
                ) : (
                  'Submit Profile'
                )}
              </button>
            </div>

            {/* Message Display */}
            {message && (
              <div
                className={`mt-6 p-4 rounded-xl border ${
                  messageType === 'success'
                    ? 'bg-green-500/20 border-green-500/30 text-green-300'
                    : 'bg-red-500/20 border-red-500/30 text-red-300'
                }`}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default ArtistProfileForm;