import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import genresListRaw from '../assets/genres.txt?raw';
import Select from 'react-select';

const genresList = genresListRaw.split('\n').map(g => g.trim()).filter(Boolean);
const genreOptions = genresList.map(g => ({ value: g, label: g }));

function ArtistProfileForm() {
  const [artistName, setArtistName] = useState("");
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState([]); // now an array of objects
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Helper to count words
  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (wordCount > 50) {
      setMessage("Description must be 50 words or less.");
      return;
    }
    setLoading(true);

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setMessage("You must be logged in.");
      setLoading(false);
      return;
    }

    // Upsert artist profile
    const { error } = await supabase
      .from("artists")
      .upsert({
        user_id: user.id,
        artist_name: artistName,
        description,
        genres: genres.map(g => g.value), // store as array of strings
        snippet_url: spotifyUrl,
      }, { onConflict: ['user_id'] });

    if (error) {
      setMessage("Error saving profile: " + error.message);
    } else {
      setMessage("Profile saved!");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Artist Profile</h2>
      <label className="block mb-2">
        Artist Name:
        <input
          type="text"
          value={artistName}
          onChange={e => setArtistName(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
      </label>
      <label className="block mb-2">
        Description (max 50 words):
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <div className="text-sm text-gray-500">{wordCount}/50 words</div>
      </label>
      <label className="block mb-2">
        Genres:
        <Select
          isMulti
          options={genreOptions}
          value={genres}
          onChange={setGenres}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Select genres..."
        />
        <div className="text-xs text-gray-500">Type to search. Hold Ctrl (Windows) or Cmd (Mac) to select multiple genres.</div>
      </label>
      <label className="block mb-2">
        Spotify Song URL:
        <input
          type="url"
          value={spotifyUrl}
          onChange={e => setSpotifyUrl(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded mt-2"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
      {message && <div className="mt-2 text-red-600">{message}</div>}
    </form>
  );
}

export default ArtistProfileForm;