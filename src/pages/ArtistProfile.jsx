
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const dummyArtists = [
  {
    id: 1,
    name: 'Luna Waves',
    genre: ['Pop', 'Indie'],
    price: '$25.00',
    spotify: 'https://open.spotify.com/artist/12345',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/luna-banner.jpg',
    bio: 'Luna Waves is an indie-pop artist creating ethereal music.',
    socials: {
      twitter: 'https://twitter.com/lunawaves',
      instagram: 'https://instagram.com/lunawaves',
    },
    amountRaised: 3000,
    fundingGoal: 10000,
  },
  {
    id: 2,
    name: 'Echo Pulse',
    genre: ['Hip-Hop'],
    price: '$30.00',
    spotify: 'https://open.spotify.com/artist/23456',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/echo-banner.jpg',
    bio: 'Echo Pulse delivers hard-hitting beats with a smooth flow.',
    socials: {
      twitter: 'https://twitter.com/echopulse',
      instagram: 'https://instagram.com/echopulse',
    },
    amountRaised: 5000,
    fundingGoal: 12000,
  },
  {
    id: 3,
    name: 'Nova Sky',
    genre: ['Indie', 'Rock'],
    price: '$20.00',
    spotify: 'https://open.spotify.com/artist/34567',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/nova-banner.jpg',
    bio: 'Nova Sky blends indie vibes with rock energy.',
    socials: {
      twitter: 'https://twitter.com/novasky',
      instagram: 'https://instagram.com/novasky',
    },
    amountRaised: 2000,
    fundingGoal: 8000,
  },
  {
    id: 4,
    name: 'Violet Drift',
    genre: ['Pop'],
    price: '$28.00',
    spotify: 'https://open.spotify.com/artist/45678',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/violet-banner.jpg',
    bio: 'Violet Drift sings soulful pop with dreamy melodies.',
    socials: {
      twitter: 'https://twitter.com/violetdrift',
      instagram: 'https://instagram.com/violetdrift',
    },
    amountRaised: 7500,
    fundingGoal: 15000,
  },
  {
    id: 5,
    name: 'Crimson Beat',
    genre: ['Hip-Hop', 'Rap'],
    price: '$35.00',
    spotify: 'https://open.spotify.com/artist/56789',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/crimson-banner.jpg',
    bio: 'Crimson Beat delivers raw and powerful rap lyrics.',
    socials: {
      twitter: 'https://twitter.com/crimsonbeat',
      instagram: 'https://instagram.com/crimsonbeat',
    },
    amountRaised: 10000,
    fundingGoal: 20000,
  },
  {
    id: 6,
    name: 'Silver Lining',
    genre: ['Indie', 'Alternative'],
    price: '$22.00',
    spotify: 'https://open.spotify.com/artist/67890',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/silver-banner.jpg',
    bio: 'Silver Lining crafts thoughtful alternative tracks.',
    socials: {
      twitter: 'https://twitter.com/silverlining',
      instagram: 'https://instagram.com/silverlining',
    },
    amountRaised: 4500,
    fundingGoal: 11000,
  },
  {
    id: 7,
    name: 'Golden Hour',
    genre: ['Pop', 'Dance'],
    price: '$27.00',
    spotify: 'https://open.spotify.com/artist/78901',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/golden-banner.jpg',
    bio: 'Golden Hour brings vibrant dance-pop beats.',
    socials: {
      twitter: 'https://twitter.com/goldenhour',
      instagram: 'https://instagram.com/goldenhour',
    },
    amountRaised: 6000,
    fundingGoal: 14000,
  },
  {
    id: 8,
    name: 'Midnight Echo',
    genre: ['Rock'],
    price: '$25.00',
    spotify: 'https://open.spotify.com/artist/89012',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/midnight-banner.jpg',
    bio: 'Midnight Echo delivers classic rock vibes with a modern touch.',
    socials: {
      twitter: 'https://twitter.com/midnightecho',
      instagram: 'https://instagram.com/midnightecho',
    },
    amountRaised: 3500,
    fundingGoal: 9000,
  },
];
export default function ArtistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const artist = dummyArtists.find((a) => a.id === Number(id));

  if (!artist) {
    return (
      <motion.div
        className="p-12 text-center text-red-700 font-extrabold text-2xl font-sans"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.3 }}
      >
        Artist not found
      </motion.div>
    );
  }

  const progress = (artist.amountRaised / artist.fundingGoal) * 100;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-red-500 text-gray-900 font-sans py-10"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-4xl mx-auto bg-white bg-opacity-95 rounded-3xl p-10 shadow-2xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 px-8 py-3 bg-pink-600 text-white rounded-full text-xl font-extrabold uppercase tracking-wide hover:bg-pink-700 transition-shadow shadow-md"
        >
          ← Back
        </button>

        <h1 className="text-5xl font-extrabold tracking-widest uppercase drop-shadow-md text-gray-900 mb-6">
          {artist.name}
        </h1>
        <div className="flex flex-wrap gap-3 mb-10">
          {artist.genre.map((g) => (
            <span
              key={g}
              className="bg-pink-600 px-6 py-2 rounded-full text-white font-bold text-lg uppercase tracking-wide shadow-sm"
            >
              {g}
            </span>
          ))}
        </div>

        <p className="text-xl text-gray-800 mb-10 leading-relaxed tracking-wide font-semibold">
          {artist.bio}
        </p>

        <div className="flex gap-10 text-xl font-extrabold uppercase tracking-wide mb-10">
          <a
            href={artist.socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1DA1F2] hover:text-[#0d8de1] underline transition"
          >
            Twitter
          </a>
          <a
            href={artist.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E4405F] hover:text-[#c12f4f] underline transition"
          >
            Instagram
          </a>
          <a
            href={artist.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1DB954] hover:text-[#17a744] underline transition"
          >
            Spotify
          </a>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-4 uppercase tracking-wider drop-shadow-sm">
          Snippet
        </h2>
        <audio
          controls
          src={artist.snippet}
          className="w-full rounded-xl mb-12 shadow-lg"
        >
          Your browser does not support the audio element.
        </audio>

        <div>
          <p className="mb-5 font-bold text-gray-900 text-lg tracking-wide">
            Raised ${artist.amountRaised} of ${artist.fundingGoal}
          </p>
          <div className="w-full h-8 rounded-full overflow-hidden shadow-xl bg-gray-200">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2 }}
              style={{
                background: 'linear-gradient(90deg, #ff6a00, #ee0979, #ff6a00)',
              }}
            />
          </div>
        </div>

        <button
          onClick={() => navigate('/checkout', { state: { artist } })}
          className="mt-12 w-full px-8 py-4 bg-gradient-to-r from-pink-700 via-red-600 to-red-700 text-white font-extrabold text-2xl rounded-3xl shadow-2xl hover:brightness-110 transition"
        >
          Donate
        </button>
      </div>
    </motion.div>
  );
}
