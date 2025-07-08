import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function ArtistProfileForm() {
  const [artistName, setArtistName] = useState("");
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState("");
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

    // Prepare genres as array or string
    const genresArray = genres.split(",").map(g => g.trim()).filter(Boolean);

    // Upsert artist profile
    const { error } = await supabase
      .from("artists")
      .upsert({
        user_id: user.id,
        artist_name: artistName,
        description,
        genres: genresArray, // or genres: genresArray.join(",") if using text
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
        Genres (comma separated):
        <input
          type="text"
          value={genres}
          onChange={e => setGenres(e.target.value)}
          placeholder="e.g. pop, rock, jazz"
          required
          className="w-full border p-2 rounded"
        />
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