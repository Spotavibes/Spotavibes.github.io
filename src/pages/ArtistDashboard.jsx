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

  //code for revenue percentage limit
const [maxRevenueShare, setMaxRevenueShare] = useState(0);
const [savingRevenueShare, setSavingRevenueShare] = useState(false);

async function saveRevenueShareLimit() {
  setSavingRevenueShare(true);
  const { error } = await supabase
    .from('artists')
    .update({ max_revenue_share: maxRevenueShare })
    .eq('user_id', user.id);

  if (error) {
    console.error('Error updating revenue share limit:', error);
    alert('Failed to update limit.');
  } else {
    alert(`Revenue share limit updated to ${maxRevenueShare}%`);
  }
  setSavingRevenueShare(false);
}

// State
const [investmentPrice, setInvestmentPrice] = useState(0.01);
const [savingPrice, setSavingPrice] = useState(false);

// Assume you already have a function or variable that calculates this:
const maxPrice = artistInfo?.formula_valuation || 1.00; // Replace with your formula

async function saveInvestmentPrice() {
  setSavingPrice(true);
  const { error } = await supabase
    .from('artists')
    .update({ custom_investment_price: investmentPrice })
    .eq('user_id', user.id);

  if (error) {
    console.error('Error updating investment price:', error);
    alert('Failed to update price.');
  } else {
    alert(`Investment price updated to $${investmentPrice}`);
  }
  setSavingPrice(false);
}

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
          // Update state values when artist info is loaded
          setMaxRevenueShare(artistData.max_revenue_share || 0)
          setInvestmentPrice(artistData.custom_investment_price || 0.01)
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
<section className="min-h-screen bg-gradient-to-b from-[#1a002a] to-[#0a0010] font-sans relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
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
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">{artistInfo.artist_name}</h2>
                    <p className="text-gray-300">{artistInfo.description}</p>
                  </div>
                  {artistInfo.snippet_url && (
                    <div className="lg:w-[600px] flex-shrink-0">
                      <iframe
                        src={artistInfo.snippet_url.replace('open.spotify.com/track/', 'open.spotify.com/embed/track/') + '?utm_source=generator'}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allow="encrypted-media"
                        title="Spotify Player"
                        className="rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Revenue & Investment Settings Section */}
              <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                                 {/* Current Revenue Sharing */}
                 <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-md border border-purple-500/30 rounded-xl p-6">
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="text-xl font-bold text-white">Revenue Sharing</h3>
                     <div className="bg-purple-600/50 px-3 py-1 rounded-full">
                       <span className="text-white font-semibold">{artistInfo?.max_revenue_share || 0}%</span>
                     </div>
                   </div>
                   <p className="text-gray-300 mb-4">Maximum percentage of revenue you're willing to share with investors</p>
                   <div className="space-y-3">
                     <div className="flex items-center justify-between">
                       <span className="text-gray-300 text-sm">Current Limit:</span>
                       <span className="text-purple-400 font-semibold">{artistInfo?.max_revenue_share || 0}%</span>
                     </div>
                     <div className="flex items-center justify-between">
                       <span className="text-gray-300 text-sm">Max Limit:</span>
                       <span className="text-gray-400 text-sm">100%</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <input
                         type="number"
                         min="0"
                         max="100"
                         step="0.1"
                         value={maxRevenueShare}
                         onChange={(e) => setMaxRevenueShare(Number(e.target.value))}
                         className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                         placeholder="Enter percentage"
                       />
                       <span className="text-gray-300">%</span>
                     </div>
                     <input
                       type="range"
                       min="0"
                       max="100"
                       step="0.1"
                       value={maxRevenueShare}
                       onChange={(e) => setMaxRevenueShare(Number(e.target.value))}
                       className="w-full accent-purple-500"
                     />
                     <button
                       onClick={saveRevenueShareLimit}
                       disabled={savingRevenueShare}
                       className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                     >
                       {savingRevenueShare ? 'Saving...' : 'Update Revenue Limit'}
                     </button>
                   </div>
                 </div>

                                 {/* Current Investment Price */}
                 <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-md border border-green-500/30 rounded-xl p-6">
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="text-xl font-bold text-white">Investment Price</h3>
                     <div className="bg-green-600/50 px-3 py-1 rounded-full">
                       <span className="text-white font-semibold">${(artistInfo?.custom_investment_price || 0.01).toFixed(2)}</span>
                     </div>
                   </div>
                   <p className="text-gray-300 mb-4">Price per share that investors pay to invest in your music</p>
                   <div className="space-y-3">
                     <div className="flex items-center justify-between">
                       <span className="text-gray-300 text-sm">Current Price:</span>
                       <span className="text-green-400 font-semibold">${(artistInfo?.custom_investment_price || 0.01).toFixed(2)}</span>
                     </div>
                     <div className="flex items-center justify-between">
                       <span className="text-gray-300 text-sm">Max Price:</span>
                       <span className="text-gray-400 text-sm">${maxPrice.toFixed(2)}</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <span className="text-gray-300">$</span>
                       <input
                         type="number"
                         min="0.01"
                         max={maxPrice}
                         step="0.01"
                         value={investmentPrice}
                         onChange={(e) => setInvestmentPrice(Number(e.target.value))}
                         className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                         placeholder="Enter price"
                       />
                     </div>
                     <input
                       type="range"
                       min="0.01"
                       max={maxPrice}
                       step="0.01"
                       value={investmentPrice}
                       onChange={(e) => setInvestmentPrice(Number(e.target.value))}
                       className="w-full accent-green-500"
                     />
                     <button
                       onClick={saveInvestmentPrice}
                       disabled={savingPrice}
                       className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                     >
                       {savingPrice ? 'Saving...' : 'Update Investment Price'}
                     </button>
                   </div>
                 </div>
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