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

export default function ArtistDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('transactions')
  const [investorFilter, setInvestorFilter] = useState('All')
  const [chartInvestor, setChartInvestor] = useState('All')
  const [animateRows, setAnimateRows] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedInvestor, setSelectedInvestor] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [realTransactions, setRealTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [artistInfo, setArtistInfo] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch artist info and transactions where this artist was invested in
  useEffect(() => {
    async function fetchArtistData() {
      if (!user) return
      
      setLoading(true)
      try {
        // First, get the artist info
        const { data: artistData, error: artistError } = await supabase
          .from('artists')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (artistError) {
          console.error('Error fetching artist info:', artistError)
          setArtistInfo(null)
        } else {
          setArtistInfo(artistData)
        }

        // Then, get all transactions where this artist was invested in
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('artist_name', artistData?.artist_name || '')
          .order('timestamp', { ascending: false })

        if (error) {
          console.error('Error fetching transactions:', error)
          setRealTransactions([])
        } else {
          setRealTransactions(data || [])
        }
      } catch (err) {
        console.error('Error fetching artist data:', err)
        setRealTransactions([])
      } finally {
        setLoading(false)
      }
    }

    fetchArtistData()
  }, [user])

  // Get unique investor emails from real transactions
  const realInvestorEmails = [...new Set(realTransactions.map(tx => tx.email))].filter(Boolean)
  const investorNames = ['All', ...realInvestorEmails]

  const searchedInvestors = searchTerm
    ? investorNames.filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()))
    : investorNames

  const combinedInvestorFilter =
    investorFilter === 'All' ? searchedInvestors : searchedInvestors.filter(name => name === investorFilter)

  // Filter real transactions based on search and filter
  const filteredRealTransactions = combinedInvestorFilter.includes('All')
    ? realTransactions
    : realTransactions.filter(tx => combinedInvestorFilter.includes(tx.email))

  // Group transactions by investor for the investments display
  const transactionsByInvestor = realTransactions.reduce((acc, tx) => {
    if (!acc[tx.email]) {
      acc[tx.email] = []
    }
    acc[tx.email].push(tx)
    return acc
  }, {})

  useEffect(() => {
    setAnimateRows(false)
    const timeout = setTimeout(() => setAnimateRows(true), 150)
    return () => clearTimeout(timeout)
  }, [investorFilter, activeTab, searchTerm])

  function openModal(investorEmail) {
    const investorTxs = realTransactions.filter(tx => tx.email === investorEmail)
    const totalInvested = investorTxs.reduce((sum, tx) => sum + tx.cost, 0)
    const totalShares = investorTxs.reduce((sum, tx) => sum + tx.amount_bought, 0)
    
    setSelectedInvestor({ 
      email: investorEmail, 
      transactions: investorTxs,
      totalInvested,
      totalShares
    })
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setSelectedInvestor(null)
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
            Artist Dashboard
          </h1>
          <p
            className={`text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Track your investments, monitor your growth, and connect with your supporters.
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
              <p className="mt-2 text-gray-300">Loading your investment data...</p>
            </div>
          ) : !artistInfo ? (
            <div className="text-center py-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
              <p className="text-gray-300 text-lg">No artist profile found.</p>
              <p className="text-gray-400 mt-2">Please create an artist profile first!</p>
            </div>
          ) : (
            <>
              <div className="mb-6 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-2">{artistInfo.artist_name}</h2>
                <p className="text-gray-300">{artistInfo.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search investors..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all flex-1"
                />

                <select
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={investorFilter}
                  onChange={e => {
                    setInvestorFilter(e.target.value)
                    if (chartInvestor !== e.target.value) setChartInvestor(e.target.value)
                  }}
                >
                  {investorNames.map(name => (
                    <option key={name} value={name} className="bg-[#0a0a23] text-white">
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Investment Summary */}
              {realTransactions.length > 0 && (
                <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">Total Raised</h3>
                    <p className="text-3xl font-bold text-green-400">
                      ${realTransactions.reduce((sum, tx) => sum + tx.cost, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">Total Investors</h3>
                    <p className="text-3xl font-bold text-blue-400">{realInvestorEmails.length}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">Total Transactions</h3>
                    <p className="text-3xl font-bold text-purple-400">{realTransactions.length}</p>
                  </div>
                </div>
              )}

              <h2 className="text-3xl font-bold mb-6 text-white">Investments by Investor</h2>
              <div className="mb-10">
                {realTransactions.length === 0 ? (
                  <div className="text-center py-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
                    <p className="text-gray-300 text-lg">No investments found.</p>
                    <p className="text-gray-400 mt-2">Start promoting your music to get investments!</p>
                  </div>
                ) : (
                  Object.entries(transactionsByInvestor).map(([investorEmail, investorTxs]) => (
                    <div key={investorEmail} className="mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">{investorEmail}</h3>
                        <button
                          onClick={() => openModal(investorEmail)}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                          View Details
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-white/20">
                              <th className="p-3 text-left text-white font-semibold">Date</th>
                              <th className="p-3 text-right text-white font-semibold">Amount</th>
                              <th className="p-3 text-center text-white font-semibold">Shares</th>
                            </tr>
                          </thead>
                          <tbody>
                            {investorTxs.map((tx, idx) => (
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
                  ))
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
                  Growth Chart
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
                      <span className="font-semibold text-white">{tx.email}</span> —{' '}
                      <span className="text-purple-300">Investment</span>{' '}
                      on <time dateTime={tx.timestamp} className="text-gray-300">{new Date(tx.timestamp).toLocaleDateString()}</time> for{' '}
                      <span className="font-mono text-green-400">${tx.cost.toLocaleString()}</span>
                      {tx.amount_bought > 1 && (
                        <span className="text-purple-300 ml-2">({tx.amount_bought} shares)</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'chart' && (
                <div className="mt-8">
                  <div className="text-center py-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
                    <p className="text-gray-300">Investment growth tracking coming soon!</p>
                    <p className="text-gray-400 mt-2">We're working on tracking your investment growth over time.</p>
                  </div>
                </div>
              )}

              {isModalOpen && selectedInvestor && (
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
                    <h3 className="text-3xl font-extrabold mb-4 text-white">{selectedInvestor.email}</h3>
                    <div className="mb-4 space-y-2">
                      <p className="text-gray-300">
                        <strong className="text-white">Total Invested:</strong> ${selectedInvestor.totalInvested.toLocaleString()}
                      </p>
                      <p className="text-gray-300">
                        <strong className="text-white">Total Shares:</strong> {selectedInvestor.totalShares}
                      </p>
                      <p className="text-gray-300">
                        <strong className="text-white">Number of Transactions:</strong> {selectedInvestor.transactions.length}
                      </p>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Transaction History:</h4>
                    <div className="max-h-48 overflow-auto">
                      {selectedInvestor.transactions.map((tx, idx) => (
                        <div key={idx} className="p-2 bg-white/10 rounded mb-1">
                          <p className="text-sm text-gray-300">
                            {new Date(tx.timestamp).toLocaleDateString()} - ${tx.cost} ({tx.amount_bought} shares)
                          </p>
                        </div>
                      ))}
                    </div>
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
            </>
          )}
        </div>
      </div>
    </section>
  )
} 