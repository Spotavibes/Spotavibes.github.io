import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { supabase } from '../lib/supabaseClient'

const artists = [
  {
    id: 1,
    name: 'Luna Waves',
    genre: ['Pop', 'Indie'],
    price: '$25.00',
    spotify: 'https://open.spotify.com/artist/12345',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/luna-waves-banner.jpg',
    bio: 'Luna Waves is a vibrant pop and indie artist...',
    socials: {
      twitter: 'https://twitter.com/lunawaves',
      instagram: 'https://instagram.com/lunawaves'
    }
  },
  {
    id: 2,
    name: 'Echo Pulse',
    genre: ['Hip-Hop'],
    price: '$30.00',
    spotify: 'https://open.spotify.com/artist/23456',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/echo-pulse-banner.jpg',
    bio: 'Echo Pulse delivers hard-hitting hip-hop beats...',
    socials: {
      twitter: 'https://twitter.com/echopulse',
      instagram: 'https://instagram.com/echopulse'
    }
  },
  {
    id: 3,
    name: 'Nova Sky',
    genre: ['Indie', 'Rock'],
    price: '$20.00',
    spotify: 'https://open.spotify.com/artist/34567',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/nova-sky-banner.jpg',
    bio: 'Nova Sky blends indie vibes with rock energy...',
    socials: {
      twitter: 'https://twitter.com/novasky',
      instagram: 'https://instagram.com/novasky'
    }
  },
  {
    id: 4,
    name: 'Violet Drift',
    genre: ['Pop'],
    price: '$28.00',
    spotify: 'https://open.spotify.com/artist/45678',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/violet-drift-banner.jpg',
    bio: 'Violet Drift creates catchy pop tunes...',
    socials: {
      twitter: 'https://twitter.com/violetdrift',
      instagram: 'https://instagram.com/violetdrift'
    }
  },
  {
    id: 5,
    name: 'Crimson Beat',
    genre: ['Hip-Hop', 'Rap'],
    price: '$35.00',
    spotify: 'https://open.spotify.com/artist/56789',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/crimson-beat-banner.jpg',
    bio: 'Crimson Beat brings fresh rap flows and beats...',
    socials: {
      twitter: 'https://twitter.com/crimsonbeat',
      instagram: 'https://instagram.com/crimsonbeat'
    }
  },
  {
    id: 6,
    name: 'Silver Lining',
    genre: ['Indie', 'Alternative'],
    price: '$22.00',
    spotify: 'https://open.spotify.com/artist/67890',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/silver-lining-banner.jpg',
    bio: 'Silver Lining mixes indie and alternative sounds...',
    socials: {
      twitter: 'https://twitter.com/silverlining',
      instagram: 'https://instagram.com/silverlining'
    }
  },
  {
    id: 7,
    name: 'Golden Hour',
    genre: ['Pop', 'Dance'],
    price: '$27.00',
    spotify: 'https://open.spotify.com/artist/78901',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/golden-hour-banner.jpg',
    bio: 'Golden Hour brings pop and dance anthems...',
    socials: {
      twitter: 'https://twitter.com/goldenhour',
      instagram: 'https://instagram.com/goldenhour'
    }
  },
  {
    id: 8,
    name: 'Midnight Echo',
    genre: ['Rock'],
    price: '$25.00',
    spotify: 'https://open.spotify.com/artist/89012',
    snippet: '/audio/mysnippet.mp3',
    banner: '/images/midnight-echo-banner.jpg',
    bio: 'Midnight Echo rocks the stage with classic vibes...',
    socials: {
      twitter: 'https://twitter.com/midnightecho',
      instagram: 'https://instagram.com/midnightecho'
    }
  }
]

export default function InvestorDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('transactions')
  const [artistFilter, setArtistFilter] = useState('All')
  const [chartArtist, setChartArtist] = useState('All')
  const [animateRows, setAnimateRows] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [realTransactions, setRealTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [roiData, setRoiData] = useState([])
  const [artistPrices, setArtistPrices] = useState({})

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch real transactions from Supabase
  useEffect(() => {
    async function fetchTransactions() {
      if (!user) return
      
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false })

        if (error) {
          console.error('Error fetching transactions:', error)
          setRealTransactions([])
        } else {
          setRealTransactions(data || [])
        }
      } catch (err) {
        console.error('Error fetching transactions:', err)
        setRealTransactions([])
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [user])

  // Calculate ROI data based on real transactions
  useEffect(() => {
    if (realTransactions.length === 0) {
      setRoiData([])
      return
    }

    // Group transactions by artist
    const transactionsByArtist = realTransactions.reduce((acc, tx) => {
      if (!acc[tx.artist_name]) {
        acc[tx.artist_name] = []
      }
      acc[tx.artist_name].push(tx)
      return acc
    }, {})

    // Calculate ROI for each artist
    const roiCalculations = Object.entries(transactionsByArtist).map(([artistName, transactions]) => {
      const totalInvested = transactions.reduce((sum, tx) => sum + tx.cost, 0)
      const totalShares = transactions.reduce((sum, tx) => sum + tx.amount_bought, 0)
      
      // Get current price (this would come from your backend)
      const currentPrice = getCurrentPrice(artistName)
      const currentValue = totalShares * currentPrice
      const roi = ((currentValue - totalInvested) / totalInvested) * 100

      return {
        artist: artistName,
        totalInvested,
        totalShares,
        currentPrice,
        currentValue,
        roi: Number(roi.toFixed(2)),
        transactions: transactions.length
      }
    })

    setRoiData(roiCalculations)
  }, [realTransactions])

  // Mock function to get current prices - replace with real API call
  function getCurrentPrice(artistName) {
    // This would be replaced with a real API call to get current prices
    const basePrices = {
      'Luna Waves': 25,
      'Echo Pulse': 30,
      'Nova Sky': 20,
      'Violet Drift': 28,
      'Crimson Beat': 35,
      'Silver Lining': 22,
      'Golden Hour': 27,
      'Midnight Echo': 25
    }

    // Simulate price fluctuations (replace with real data)
    const basePrice = basePrices[artistName] || 25
    const fluctuation = (Math.random() - 0.5) * 0.4 // ±20% fluctuation
    return basePrice * (1 + fluctuation)
  }

  // Get unique artist names from real transactions
  const realArtistNames = [...new Set(realTransactions.map(tx => tx.artist_name))].filter(Boolean)
  const artistNames = ['All', ...realArtistNames]

  const searchedArtists = searchTerm
    ? artistNames.filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()))
    : artistNames

  const combinedArtistFilter =
    artistFilter === 'All' ? searchedArtists : searchedArtists.filter(name => name === artistFilter)

  // Filter real transactions based on search and filter
  const filteredRealTransactions = combinedArtistFilter.includes('All')
    ? realTransactions
    : realTransactions.filter(tx => combinedArtistFilter.includes(tx.artist_name))

  // Group transactions by artist for the purchases display
  const transactionsByArtist = realTransactions.reduce((acc, tx) => {
    if (!acc[tx.artist_name]) {
      acc[tx.artist_name] = []
    }
    acc[tx.artist_name].push(tx)
    return acc
  }, {})

  // Filter ROI data based on selected artist
  const filteredRoiData = chartArtist === 'All' 
    ? roiData 
    : roiData.filter(item => item.artist === chartArtist)

  // Calculate total portfolio ROI
  const totalPortfolioRoi = roiData.length > 0 
    ? roiData.reduce((sum, item) => sum + item.roi, 0) / roiData.length 
    : 0

  useEffect(() => {
    setAnimateRows(false)
    const timeout = setTimeout(() => setAnimateRows(true), 150)
    return () => clearTimeout(timeout)
  }, [artistFilter, activeTab, searchTerm])

  function openModal(artistName) {
    const artistInfo = artists.find(a => a.name === artistName)
    const roiInfo = roiData.find(r => r.artist === artistName)
    setSelectedArtist({ ...artistInfo, ...roiInfo })
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setSelectedArtist(null)
  }

  return (
    <section className="min-h-screen bg-[#0a0a23] font-sans">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
        <div className="relative z-10 px-8 py-16 text-center">
          <h1
            className={`text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Investor Dashboard
          </h1>
          <p
            className={`text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Track your investments, monitor performance, and manage your portfolio.
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="px-8 pb-16">
        <div
          className={`max-w-7xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 transition-all duration-1000 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <p className="mt-2 text-gray-300">Loading your investments...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search artists..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all flex-1"
                />

                <select
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={artistFilter}
                  onChange={e => {
                    setArtistFilter(e.target.value)
                    if (chartArtist !== e.target.value) setChartArtist(e.target.value)
                  }}
                >
                  {artistNames.map(name => (
                    <option key={name} value={name} className="bg-[#0a0a23] text-white">
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Investment Summary */}
              {realTransactions.length > 0 && (
                <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">Total Invested</h3>
                    <p className="text-3xl font-bold text-green-400">
                      ${realTransactions.reduce((sum, tx) => sum + tx.cost, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">Artists Supported</h3>
                    <p className="text-3xl font-bold text-blue-400">{realArtistNames.length}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">Total Transactions</h3>
                    <p className="text-3xl font-bold text-purple-400">{realTransactions.length}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">Portfolio ROI</h3>
                    <p className={`text-3xl font-bold ${totalPortfolioRoi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {totalPortfolioRoi.toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}

              <h2 className="text-3xl font-bold mb-6 text-white">Purchases by Artist</h2>
              <div className="mb-10">
                {realTransactions.length === 0 ? (
                  <div className="text-center py-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
                    <p className="text-gray-300 text-lg">No investments found.</p>
                    <p className="text-gray-400 mt-2">Start investing in artists to see your purchases here!</p>
                  </div>
                ) : (
                  Object.entries(transactionsByArtist).map(([artistName, artistTxs]) => {
                    const roiInfo = roiData.find(r => r.artist === artistName)
                    return (
                      <div key={artistName} className="mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold text-white">{artistName}</h3>
                          {roiInfo && (
                            <div className="text-right">
                              <p className={`text-lg font-bold ${roiInfo.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {roiInfo.roi.toFixed(1)}% ROI
                              </p>
                              <p className="text-sm text-gray-300">
                                Current Value: ${roiInfo.currentValue.toFixed(2)}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b border-white/20">
                                <th className="p-3 text-left text-white font-semibold">Date</th>
                                <th className="p-3 text-right text-white font-semibold">Amount</th>
                                <th className="p-3 text-center text-white font-semibold">Units</th>
                              </tr>
                            </thead>
                            <tbody>
                              {artistTxs.map((tx, idx) => (
                                <tr key={tx.id || `${tx.timestamp}-${idx}`} className="border-b border-white/10">
                                  <td className="p-3 text-gray-300">{new Date(tx.timestamp).toLocaleDateString()}</td>
                                  <td className="p-3 text-right font-mono text-green-400">${tx.cost.toLocaleString()}</td>
                                  <td className="p-3 text-center text-gray-300">{tx.amount_bought}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              <div className="mb-6 flex border-b-4 border-purple-600">
                <button
                  className={`px-6 py-3 font-bold text-lg rounded-t-lg transition-colors ${
                    activeTab === 'transactions'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('transactions')}
                >
                  Transactions
                </button>
                <button
                  className={`ml-6 px-6 py-3 font-bold text-lg rounded-t-lg transition-colors ${
                    activeTab === 'chart'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('chart')}
                >
                  ROI Chart
                </button>
              </div>

              {activeTab === 'transactions' && (
                <ul className="mt-6 max-h-96 overflow-auto space-y-3">
                  {filteredRealTransactions.length === 0 && (
                    <li className="text-gray-300 text-center font-semibold">No transactions found.</li>
                  )}
                  {filteredRealTransactions.map((tx, idx) => (
                    <li
                      key={tx.id || `${tx.timestamp}-${idx}`}
                      className={`p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl cursor-default
                        transition duration-700 ease-out
                        ${animateRows ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
                        hover:bg-white/20 hover:border-purple-500/50`}
                      style={{ transitionDelay: `${idx * 100}ms` }}
                    >
                      <span className="font-semibold text-white">{tx.artist_name}</span> —{' '}
                      <span className="text-purple-300">Investment</span>{' '}
                      on <time dateTime={tx.timestamp} className="text-gray-300">{new Date(tx.timestamp).toLocaleDateString()}</time> for{' '}
                      <span className="font-mono text-green-400">${tx.cost.toLocaleString()}</span>
                      {tx.amount_bought > 1 && (
                        <span className="text-purple-300 ml-2">({tx.amount_bought} units)</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'chart' && (
                <div className="mt-8">
                  <div className="mb-6 flex items-center space-x-4">
                    <label htmlFor="chartArtist" className="text-white font-semibold text-lg">
                      Select Artist:
                    </label>
                    <select
                      id="chartArtist"
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={chartArtist}
                      onChange={e => setChartArtist(e.target.value)}
                    >
                      {artistNames.map(name => (
                        <option key={name} value={name} className="bg-[#0a0a23] text-white">
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {filteredRoiData.length === 0 ? (
                    <div className="text-center py-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
                      <p className="text-gray-300">No ROI data available.</p>
                      <p className="text-gray-400 mt-2">Make some investments to see your returns!</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* ROI Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredRoiData.map((item, index) => (
                          <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-2">{item.artist}</h3>
                            <div className="space-y-2">
                              <p className="text-gray-300">
                                <span className="text-white font-semibold">Total Invested:</span> ${item.totalInvested.toFixed(2)}
                              </p>
                              <p className="text-gray-300">
                                <span className="text-white font-semibold">Current Value:</span> ${item.currentValue.toFixed(2)}
                              </p>
                              <p className="text-gray-300">
                                <span className="text-white font-semibold">Shares:</span> {item.totalShares}
                              </p>
                              <p className={`text-lg font-bold ${item.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                ROI: {item.roi.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* ROI Chart */}
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4">ROI Performance</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={filteredRoiData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis 
                              dataKey="artist" 
                              stroke="white"
                              tick={{ fill: 'white' }}
                            />
                            <YAxis 
                              stroke="white"
                              tick={{ fill: 'white' }}
                              tickFormatter={(value) => `${value}%`}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'rgba(26, 0, 51, 0.95)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '8px',
                                color: 'white'
                              }}
                              formatter={(value) => [`${value}%`, 'ROI']}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="roi" 
                              stroke="#a855f7" 
                              strokeWidth={3}
                              dot={{ fill: '#a855f7', strokeWidth: 2, r: 6 }}
                              activeDot={{ r: 8, stroke: '#a855f7', strokeWidth: 2 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {isModalOpen && selectedArtist && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md w-full relative animate-fadeInUp"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-bold transition-colors"
              aria-label="Close modal"
            >
              ×
            </button>
            <h3 className="text-3xl font-extrabold mb-4 text-white">{selectedArtist.name}</h3>
            <img
              src={selectedArtist.image}
              alt={selectedArtist.name}
              className="mb-6 w-full h-56 object-cover rounded-lg shadow-lg"
            />
            <p className="mb-2 text-gray-300">
              <strong className="text-white">Genre:</strong> {selectedArtist.genre}
            </p>
            <p className="mb-2 text-gray-300">
              <strong className="text-white">Location:</strong> {selectedArtist.location}
            </p>
            <p className="mb-2 text-gray-300">
              <strong className="text-white">Price per Unit:</strong> {selectedArtist.price}
            </p>
            <p className="mb-2 text-gray-300">
              <strong className="text-white">Amount Invested:</strong>{' '}
              {selectedArtist.totalInvested ? `$${selectedArtist.totalInvested.toFixed(2)}` : 'N/A'}
            </p>
            <p className="mb-2 text-gray-300">
              <strong className="text-white">Current Value:</strong>{' '}
              {selectedArtist.currentValue ? `$${selectedArtist.currentValue.toFixed(2)}` : 'N/A'}
            </p>
            <p className="mb-2 text-gray-300">
              <strong className="text-white">ROI:</strong>{' '}
              <span
                className={
                  selectedArtist.roi > 0
                    ? 'text-green-400 font-semibold'
                    : selectedArtist.roi < 0
                    ? 'text-red-400 font-semibold'
                    : 'text-gray-300'
                }
              >
                {selectedArtist.roi !== undefined
                  ? `${selectedArtist.roi.toFixed(1)}%`
                  : 'N/A'}
              </span>
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.4s ease forwards;
        }
      `}</style>
    </section>
  )
}
