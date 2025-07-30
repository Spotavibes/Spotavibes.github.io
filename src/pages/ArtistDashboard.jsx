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
    <div className="p-6 max-w-7xl mx-auto bg-gradient-to-tr from-purple-50 via-teal-50 to-indigo-50 rounded-lg shadow-lg">
      <h1 className="text-5xl font-extrabold mb-8 text-indigo-700 drop-shadow-md select-none">
        Artist Dashboard
      </h1>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-indigo-600">Loading your investment data...</p>
        </div>
      ) : !artistInfo ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-indigo-600 text-lg">No artist profile found.</p>
          <p className="text-indigo-500 mt-2">Please create an artist profile first!</p>
        </div>
      ) : (
        <>
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold text-indigo-700 mb-2">{artistInfo.artist_name}</h2>
            <p className="text-indigo-600">{artistInfo.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search investors..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border-2 border-indigo-300 focus:border-indigo-500 rounded-lg p-3 flex-1 shadow-sm focus:shadow-indigo-300 transition duration-300 placeholder-indigo-400"
            />

            <select
              className="border-2 border-teal-300 focus:border-teal-500 rounded-lg p-3 shadow-sm focus:shadow-teal-300 transition duration-300 text-indigo-800 font-semibold"
              value={investorFilter}
              onChange={e => {
                setInvestorFilter(e.target.value)
                if (chartInvestor !== e.target.value) setChartInvestor(e.target.value)
              }}
            >
              {investorNames.map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Investment Summary */}
          {realTransactions.length > 0 && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <h3 className="text-lg font-semibold text-indigo-700">Total Raised</h3>
                <p className="text-2xl font-bold text-green-600">
                  ${realTransactions.reduce((sum, tx) => sum + tx.cost, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <h3 className="text-lg font-semibold text-indigo-700">Total Investors</h3>
                <p className="text-2xl font-bold text-blue-600">{realInvestorEmails.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <h3 className="text-lg font-semibold text-indigo-700">Total Transactions</h3>
                <p className="text-2xl font-bold text-purple-600">{realTransactions.length}</p>
              </div>
            </div>
          )}

          <h2 className="text-3xl font-bold mb-4 text-teal-700 drop-shadow-sm">Investments by Investor</h2>
          <div className="mb-10">
            {realTransactions.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow">
                <p className="text-indigo-600 text-lg">No investments found.</p>
                <p className="text-indigo-500 mt-2">Start promoting your music to get investments!</p>
              </div>
            ) : (
              Object.entries(transactionsByInvestor).map(([investorEmail, investorTxs]) => (
                <div key={investorEmail} className="mb-6 bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-indigo-700">{investorEmail}</h3>
                    <button
                      onClick={() => openModal(investorEmail)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded shadow-md transition"
                    >
                      View Details
                    </button>
                  </div>
                  <table className="w-full border-collapse mb-2">
                    <thead>
                      <tr className="bg-indigo-100 text-indigo-800">
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-right">Amount</th>
                        <th className="p-2 text-center">Shares</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investorTxs.map((tx, idx) => (
                        <tr key={tx.id || `${tx.timestamp}-${idx}`} className="border-b border-indigo-50">
                          <td className="p-2">{new Date(tx.timestamp).toLocaleDateString()}</td>
                          <td className="p-2 text-right font-mono">${tx.cost.toLocaleString()}</td>
                          <td className="p-2 text-center">{tx.amount_bought}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            )}
          </div>

          <div className="mb-6 flex border-b-4 border-indigo-600">
            <button
              className={`px-6 py-3 font-bold text-lg rounded-t-lg transition-colors ${
                activeTab === 'transactions'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-400'
                  : 'text-indigo-600 hover:text-indigo-800'
              }`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
            </button>
            <button
              className={`ml-6 px-6 py-3 font-bold text-lg rounded-t-lg transition-colors ${
                activeTab === 'chart'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-400'
                  : 'text-indigo-600 hover:text-indigo-800'
              }`}
              onClick={() => setActiveTab('chart')}
            >
              Growth Chart
            </button>
          </div>

          {activeTab === 'transactions' && (
            <ul className="mt-6 max-h-96 overflow-auto space-y-3">
              {filteredRealTransactions.length === 0 && (
                <li className="text-indigo-600 text-center font-semibold">No transactions found.</li>
              )}
              {filteredRealTransactions.map((tx, idx) => (
                <li
                  key={tx.id || `${tx.timestamp}-${idx}`}
                  className={`p-4 bg-white rounded-lg shadow-md cursor-default
                    transition duration-700 ease-out
                    ${animateRows ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
                    hover:shadow-xl hover:bg-indigo-50`}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <span className="font-semibold text-indigo-700">{tx.email}</span> —{' '}
                  <span className="text-indigo-500">Investment</span>{' '}
                  on <time dateTime={tx.timestamp}>{new Date(tx.timestamp).toLocaleDateString()}</time> for{' '}
                  <span className="font-mono text-indigo-900">${tx.cost.toLocaleString()}</span>
                  {tx.amount_bought > 1 && (
                    <span className="text-indigo-600 ml-2">({tx.amount_bought} shares)</span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'chart' && (
            <div className="mt-8">
              <div className="text-center py-8 bg-white rounded-lg shadow">
                <p className="text-indigo-600">Investment growth tracking coming soon!</p>
                <p className="text-indigo-500 mt-2">We're working on tracking your investment growth over time.</p>
              </div>
            </div>
          )}

          {isModalOpen && selectedInvestor && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-indigo-900 bg-opacity-80 z-50 p-4"
              onClick={closeModal}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full relative animate-fadeInUp"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-indigo-600 hover:text-indigo-900 text-3xl font-bold transition-colors"
                  aria-label="Close modal"
                >
                  ×
                </button>
                <h3 className="text-3xl font-extrabold mb-4 text-indigo-700">{selectedInvestor.email}</h3>
                <div className="mb-4 space-y-2">
                  <p className="text-indigo-800">
                    <strong>Total Invested:</strong> ${selectedInvestor.totalInvested.toLocaleString()}
                  </p>
                  <p className="text-indigo-800">
                    <strong>Total Shares:</strong> {selectedInvestor.totalShares}
                  </p>
                  <p className="text-indigo-800">
                    <strong>Number of Transactions:</strong> {selectedInvestor.transactions.length}
                  </p>
                </div>
                <h4 className="text-lg font-bold text-indigo-700 mb-2">Transaction History:</h4>
                <div className="max-h-48 overflow-auto">
                  {selectedInvestor.transactions.map((tx, idx) => (
                    <div key={idx} className="p-2 bg-indigo-50 rounded mb-1">
                      <p className="text-sm">
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
  )
} 