import { Link } from 'react-router-dom'

const SPOTAVIBE_LETTERS = [
  { letter: 'S', color: 'bg-gradient-to-r from-[#FF5F6D] to-[#FFC371]' },
  { letter: 'P', color: 'bg-gradient-to-r from-[#36D1C4] to-[#1E3C72]' },
  { letter: 'O', color: 'bg-gradient-to-r from-[#FF512F] to-[#F09819]' },
  { letter: 'T', color: 'bg-gradient-to-r from-[#7F00FF] to-[#E100FF]' },
  { letter: 'A', color: 'bg-gradient-to-r from-[#43CEA2] to-[#185A9D]' },
  { letter: 'V', color: 'bg-gradient-to-r from-[#F7971E] to-[#FFD200]' },
  { letter: 'I', color: 'bg-gradient-to-r from-[#00C3FF] to-[#FFFF1C]' },
  { letter: 'B', color: 'bg-gradient-to-r from-[#F953C6] to-[#B91D73]' },
  { letter: 'E', color: 'bg-gradient-to-r from-[#1D4350] to-[#A43931]' },
]

export default function Landing() {
  return (
    <section className="min-h-screen flex flex-col md:flex-row relative overflow-hidden">
      {/* Subtle music SVG background */}
      <div className="music-bg" />
      {/* Left Side */}
      <div className="md:w-1/2 w-full flex flex-col justify-start bg-[#0a0a23] p-6 md:p-10 lg:p-12 relative">
        <div className="flex-1 flex flex-col justify-start mt-2 md:mt-4" style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight" style={{ fontFamily: 'Montserrat, Poppins, Arial, sans-serif', fontWeight: 900 }}>
            The <span className="headline-gradient-glow">#1</span> source for music investing.
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-[#FFFDE4] mb-6 font-medium drop-shadow-lg">
            Discover rising stars and help fund their music journey. Join a community that believes in the future of sound.
          </p>
          <div className="flex gap-4 mb-6">
            <Link
              to="/explore-artists"
              className="pulse-cta bg-gradient-to-r from-[#FFD200] to-[#F7971E] hover:from-[#F7971E] hover:to-[#FFD200] text-[#2C5364] px-6 py-2 md:px-8 md:py-3 rounded-full font-bold shadow-xl transition-transform transform hover:scale-105 text-base md:text-lg border-2 border-[#FFD200] drop-shadow-lg"
            >
              Explore Artists
            </Link>
            <Link
              to="/investor-dashboard"
              className="pulse-cta bg-gradient-to-r from-[#00C3FF] to-[#FFFF1C] hover:from-[#FFFF1C] hover:to-[#00C3FF] text-[#2C5364] px-6 py-2 md:px-8 md:py-3 rounded-full font-bold shadow-xl transition-transform transform hover:scale-105 text-base md:text-lg border-2 border-[#00C3FF] drop-shadow-lg"
            >
              Investor Dashboard
            </Link>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className="md:w-1/2 w-full flex flex-col justify-center bg-animate-conic p-0 md:p-0 min-h-[60vh] relative overflow-y-auto">
        <div className="flex flex-col gap-2 md:gap-3 lg:gap-4 w-full max-w-xl mx-auto mt-4 md:mt-6 lg:mt-8 px-1 md:px-2 lg:px-0 bg-transparent">
          {SPOTAVIBE_LETTERS.map(({ letter, color }, idx) => (
            <div
              key={letter}
              className={`neon-border spotavibe-letter relative flex items-center h-10 md:h-14 lg:h-16 rounded-2xl overflow-hidden ${color} shadow-2xl transition-transform hover:scale-105`}
              style={{ boxShadow: `0 8px 32px 0 rgba(0,0,0,0.25)` }}
            >
              <span
                className="ml-4 md:ml-8 text-white text-xl md:text-3xl lg:text-5xl font-extrabold tracking-wide select-none drop-shadow-2xl"
                style={{ fontFamily: 'Poppins, Montserrat, Arial, sans-serif', letterSpacing: '0.1em' }}
              >
                {letter}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* SVG Wave Overlay at Bottom */}
      <svg className="wave-overlay" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0,80 C360,160 1080,0 1440,80 L1440,120 L0,120 Z" fill="#fff" fillOpacity="0.12" />
      </svg>
    </section>
  )
}
