import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6 bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 animate-gradient-x">
      <div className="max-w-3xl text-center space-y-8 px-6 py-12 bg-black bg-opacity-50 rounded-xl backdrop-blur-md shadow-lg">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg animate-fadeIn">
          Support the Next Generation of Music Artists
        </h1>
        <p className="text-xl md:text-2xl text-purple-200 drop-shadow-md animate-fadeIn delay-200">
          Discover rising stars and help fund their music journey. Join a community that believes in the future of sound.
        </p>
        <div className="flex justify-center gap-6 animate-fadeIn delay-400">
          <Link
            to="/explore-artists"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-transform transform hover:scale-105"
          >
            Explore Artists
          </Link>
          <button
            className="border-2 border-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-600 transition-colors transition-transform transform hover:scale-105"
          >
            Your Portfolio
          </button>
        </div>
      </div>

      <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 8s ease infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
          opacity: 0;
        }
        .animate-fadeIn.delay-200 {
          animation-delay: 0.2s;
        }
        .animate-fadeIn.delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </section>
  )
}
