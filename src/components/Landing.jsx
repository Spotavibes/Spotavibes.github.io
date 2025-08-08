import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const SPOTAVIBE_LETTERS = [
  { letter: 'S', color: 'spotavibe-letter' },
  { letter: 'P', color: 'spotavibe-letter' },
  { letter: 'O', color: 'spotavibe-letter' },
  { letter: 'T', color: 'spotavibe-letter' },
  { letter: 'A', color: 'spotavibe-letter' },
  { letter: 'V', color: 'spotavibe-letter' },
  { letter: 'I', color: 'spotavibe-letter' },
  { letter: 'B', color: 'spotavibe-letter' },
  { letter: 'E', color: 'spotavibe-letter' },
]

export default function Landing() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-[#0a0a23] via-[#1a0033] to-[#2d0036] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Grid of Music Placeholders */}
        <div className="absolute inset-0 p-8">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 h-full">
            {Array.from({ length: 24 }, (_, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden opacity-40 hover:opacity-80 transition-all duration-300 blur-sm hover:blur-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.4, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
              >
                <div className="w-full h-[352px] bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎵</div>
                    <div className="text-white/60 text-sm">Music</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SPOTAVIBES Logo Overlay - no shadow overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center"
          >
            <motion.h1 
              className="text-7xl md:text-9xl font-black tracking-tight flex justify-center mb-8 drop-shadow-2xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {SPOTAVIBE_LETTERS.map((letter, index) => (
                <motion.span
                  key={index}
                  className={`spotavibe-letter ${letter.color} text-transparent bg-clip-text drop-shadow-lg`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.8 + index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.2,
                    transition: { duration: 0.2 }
                  }}
                >
                  {letter.letter}
                </motion.span>
              ))}
            </motion.h1>
            
            <motion.p 
              className="text-2xl md:text-3xl text-white/90 mb-8 max-w-5xl mx-auto px-4 font-light leading-relaxed drop-shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              Revolutionizing music investment through blockchain technology, connecting visionary investors with emerging artists
            </motion.p>
            
            <motion.p 
              className="text-lg text-white/70 mb-12 font-medium drop-shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              Where talent meets opportunity
            </motion.p>

            {/* Enhanced CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                to="/explore-artists"
                className="group relative px-10 py-5 bg-gradient-to-r from-[#A855F7] to-[#C084FC] rounded-2xl font-bold text-white text-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>🎵</span>
                  <span>Explore Artists</span>
                  <span>→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#C084FC] to-[#A855F7] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                to="/investor-dashboard"
                className="group px-10 py-5 border-2 border-white/30 rounded-2xl font-bold text-white text-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm"
              >
                <span className="flex items-center space-x-2">
                  <span>📊</span>
                  <span>Investor Dashboard</span>
                </span>
              </Link>
            </motion.div>

            {/* Stats section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="mt-16 grid grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              {[
                { number: "500+", label: "Artists", icon: "🎤" },
                { number: "10K+", label: "Investors", icon: "💰" },
                { number: "$2M+", label: "Invested", icon: "📈" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 2.0 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-white mb-1 drop-shadow-lg">{stat.number}</div>
                  <div className="text-white/60 text-sm drop-shadow-lg">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a23] via-[#1a0033] to-[#2d0036] relative">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Redesigned CTA */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <motion.div
                className="group relative bg-gradient-to-br from-[#1a0033] via-[#2d0036] to-[#0a0a23] p-12 rounded-3xl border border-white/10 shadow-2xl cursor-pointer transform hover:scale-105 transition-all duration-500 overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#A855F7] via-[#8B5CF6] to-[#7C3AED] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                
                {/* Floating orbs */}
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-r from-[#A855F7] to-[#C084FC] rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] rounded-full blur-lg opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 -right-4 w-12 h-12 bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] rounded-full blur-md opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
                
                <Link to="/explore-artists" className="block relative z-10">
                  {/* Header with modern design */}
                  <div className="flex items-center justify-center lg:justify-start mb-8">
                    <div className="relative mr-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#A855F7] to-[#C084FC] rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-3xl">🎵</span>
                      </div>
                      <motion.div
                        className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white shadow-lg"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <div>
                      <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                        EXPLORE ARTISTS
                      </h2>
                      <div className="h-1 w-20 bg-gradient-to-r from-[#A855F7] to-[#C084FC] rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Enhanced subtitle */}
                  <motion.p 
                    className="text-white/90 text-xl mb-10 leading-relaxed font-medium"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    Discover the next big thing in music and invest in emerging talent
                  </motion.p>
                  
                  {/* Enhanced stats with modern cards */}
                  <div className="grid grid-cols-2 gap-6 mb-10">
                    <motion.div 
                      className="text-center lg:text-left bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      <div className="text-4xl font-black text-white mb-2">10,000+</div>
                      <div className="text-white/70 text-sm font-medium mb-1">Active Investors</div>
                      <div className="text-xs text-white/50">💰 Growing Daily</div>
                    </motion.div>
                    <motion.div 
                      className="text-center lg:text-left bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      viewport={{ once: true }}
                    >
                      <div className="text-4xl font-black text-white mb-2">500+</div>
                      <div className="text-white/70 text-sm font-medium mb-1">Artists Discovered</div>
                      <div className="text-xs text-white/50">🎤 New Talent</div>
                    </motion.div>
                  </div>
                  
                  {/* Enhanced features with modern badges */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
                    <motion.span 
                      className="flex items-center bg-gradient-to-r from-green-500/20 to-green-400/20 px-4 py-2 rounded-full backdrop-blur-sm border border-green-400/30"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                      <span className="text-green-300 font-medium">Live Platform</span>
                    </motion.span>
                    <motion.span 
                      className="flex items-center bg-gradient-to-r from-blue-500/20 to-blue-400/20 px-4 py-2 rounded-full backdrop-blur-sm border border-blue-400/30"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                      viewport={{ once: true }}
                    >
                      <span className="text-blue-300 font-medium">⚡ Real-time Updates</span>
                    </motion.span>
                  </div>
                  
                  {/* Enhanced CTA button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center lg:text-left"
                  >
                    <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-[#A855F7] to-[#C084FC] px-8 py-4 rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-105 border border-white/20">
                      <span className="text-white font-bold text-lg">Start Exploring</span>
                      <motion.span 
                        className="text-white text-xl"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right - Enhanced Trending Artists */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="text-center lg:text-left">
                <h3 className="text-3xl font-bold text-white mb-2">Trending Artists</h3>
                <p className="text-white/60 text-lg">Discover what's hot right now</p>
              </div>
              
              {[
                {
                  id: 1,
                  name: "Luna Nova",
                  genre: "Alternative Pop",
                  spotifyUrl: "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh",
                  snippetUrl: "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh",
                  plays: "2.4k",
                  invested: "$15.2k",
                  investors: "234",
                  trend: "🔥 Hot"
                },
                {
                  id: 2,
                  name: "Echo Valley",
                  genre: "Indie Rock",
                  spotifyUrl: "https://open.spotify.com/track/6rqhFgbbKwnb9MLmU2h6N2",
                  snippetUrl: "https://open.spotify.com/track/6rqhFgbbKwnb9MLmU2h6N2",
                  plays: "1.8k",
                  invested: "$12.7k",
                  investors: "189",
                  trend: "📈 Rising"
                },
                {
                  id: 3,
                  name: "Neon Dreams",
                  genre: "Electronic",
                  spotifyUrl: "https://open.spotify.com/track/5QO79kh1waicV47BqGRL3g",
                  snippetUrl: "https://open.spotify.com/track/5QO79kh1waicV47BqGRL3g",
                  plays: "3.1k",
                  invested: "$18.9k",
                  investors: "312",
                  trend: "⭐ Featured"
                }
              ].map((artist, index) => {
                const spotifyEmbedUrl = artist.snippetUrl ? 
                  artist.snippetUrl.replace('open.spotify.com/track/', 'open.spotify.com/embed/track/') + '?utm_source=generator' : null;
                
                return (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="group bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden"
                  >
                    {/* Trend badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-[#A855F7] to-[#C084FC] px-3 py-1 rounded-full text-xs font-bold text-white">
                      {artist.trend}
                    </div>
                    
                    <div className="flex flex-col space-y-4">
                      {/* Spotify Embed */}
                      {spotifyEmbedUrl && (
                        <div className="w-full overflow-hidden rounded-lg mb-4">
                          <iframe
                            data-testid="embed-iframe"
                            style={{ borderRadius: "12px", maxWidth: '100%', boxSizing: 'border-box' }}
                            src={spotifyEmbedUrl}
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowfullscreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            title={`${artist.name} - Spotify Player`}
                            className="block w-full"
                          ></iframe>
                        </div>
                      )}
                      
                      {/* Artist Info */}
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">{artist.id}</span>
                          </div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-xl mb-1">{artist.name}</h4>
                          <p className="text-pink-300 italic font-semibold tracking-wide text-sm mb-3">
                            {artist.genre}
                          </p>
                          <div className="grid grid-cols-3 gap-2 text-xs text-gray-300">
                            <div className="text-center">
                              <div className="font-bold">🎵 {artist.plays}</div>
                              <div className="text-xs">plays</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold">💰 {artist.invested}</div>
                              <div className="text-xs">invested</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold">👥 {artist.investors}</div>
                              <div className="text-xs">investors</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Invest Button */}
                      <Link
                        to="/explore-artists"
                        className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-green-500 to-green-600 text-white hover:brightness-110 transition-all duration-300 w-full text-center text-sm transform hover:scale-105"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <span>Invest Now</span>
                          <span>→</span>
                        </span>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="min-h-screen bg-gradient-to-br from-[#0a0a23] via-[#1a0033] to-[#2d0036] py-24">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold purple-gradient-text mb-6">
              Platform Features
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Everything you need to discover, invest, and grow with emerging artists
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Artist Discovery",
                description: "Browse curated artists with detailed profiles, music samples, and investment opportunities",
                gradient: "from-[#8B5CF6] to-[#A855F7]",
                icon: "🎵",
                features: ["Curated Selection", "Music Previews", "Investment History"],
                stats: "500+ Artists"
              },
              {
                title: "Investor Dashboard",
                description: "Track your investments, monitor portfolio performance, and manage your artist relationships",
                gradient: "from-[#7C3AED] to-[#8B5CF6]",
                icon: "📊",
                features: ["Portfolio Tracking", "Performance Analytics", "Real-time Updates"],
                stats: "10K+ Investors"
              },
              {
                title: "Community",
                description: "Connect with other investors, artists, and industry professionals in our active community",
                gradient: "from-[#6D28D9] to-[#7C3AED]",
                icon: "👥",
                features: ["Network Events", "Expert Insights", "Collaboration Tools"],
                stats: "Active Community"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Background glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-3xl`}></div>
                
                <div className="relative z-10">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <span className="text-white text-3xl">{feature.icon}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">{feature.description}</p>
                  
                  {/* Feature list */}
                  <div className="space-y-2 mb-6">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm text-white/70">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{feature.stats}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Additional features row */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 grid md:grid-cols-4 gap-6"
          >
            {[
              { icon: "🔒", title: "Secure", desc: "Blockchain Security" },
              { icon: "⚡", title: "Fast", desc: "Real-time Processing" },
              { icon: "🌐", title: "Global", desc: "Worldwide Access" },
              { icon: "📱", title: "Mobile", desc: "App Available" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors duration-300">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="min-h-screen bg-gradient-to-br from-[#0a0a23] via-[#1a0033] to-[#2d0036] py-24">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold purple-gradient-text mb-6">
              What Our Community Says
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Join thousands of satisfied investors and artists
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center group hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-[#A855F7] to-[#C084FC] rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">★</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  "Amazing platform! I've discovered incredible artists and made great returns on my investments."
                </p>
                <div className="text-xs text-gray-400">
                  <p className="font-semibold">Sarah M.</p>
                  <p>Investor</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="min-h-screen bg-gradient-to-br from-[#0a0a23] via-[#1a0033] to-[#2d0036] py-24">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold purple-gradient-text mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Everything you need to know about music investing
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {[
              "How does music investing work?",
              "What are the legal requirements?",
              "What fees are involved?",
              "How do I track my investments?",
              "Can I sell my investments?"
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white/5 p-6 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white font-medium text-lg">{faq}</p>
                  <span className="text-white text-2xl group-hover:rotate-45 transition-transform duration-300">+</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="min-h-screen bg-gradient-to-br from-[#0a0a23] via-[#1a0033] to-[#2d0036] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/10"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center relative z-10"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Ready to Start Investing?
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Join thousands of investors discovering the next generation of music talent
          </p>
          <Link
            to="/explore-artists"
            className="inline-flex items-center space-x-3 px-12 py-6 bg-gradient-to-r from-[#A855F7] to-[#C084FC] rounded-2xl font-bold text-white text-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <span>Get Started Today</span>
            <span className="text-2xl">→</span>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 py-16 border-t border-white/10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center text-gray-400"
          >
            <div className="flex justify-center space-x-8 mb-8">
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
            </div>
            <p className="text-sm">© 2024 SPOTAVIBES. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
