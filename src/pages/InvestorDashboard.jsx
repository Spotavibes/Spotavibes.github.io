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


const investmentData = [
  { name: 'Luna Waves', amount: 1200, profit: 400 },
  { name: 'Echo Pulse', amount: 1800, profit: -150 },
  { name: 'Nova Sky', amount: 1500, profit: 450 },
  { name: 'Violet Drift', amount: 1000, profit: -200 },
  { name: 'Crimson Beat', amount: 1600, profit: 300 },
  { name: 'Silver Lining', amount: 2000, profit: -100 },
  { name: 'Golden Hour', amount: 1400, profit: 250 },
  { name: 'Midnight Echo', amount: 1700, profit: 500 },
]



const transactions = [
  { artist: 'Luna Waves', date: '2025-05-10', type: 'Investment', amount: 200 },
  { artist: 'Echo Pulse', date: '2025-05-12', type: 'Profit', amount: 100 },
  { artist: 'Nova Sky', date: '2025-05-15', type: 'Investment', amount: 150 },
  { artist: 'Luna Waves', date: '2025-05-18', type: 'Profit', amount: 50 },
  { artist: 'Violet Drift', date: '2025-05-20', type: 'Investment', amount: 300 },
  { artist: 'Crimson Beat', date: '2025-05-22', type: 'Profit', amount: 120 },
  { artist: 'Silver Lining', date: '2025-05-25', type: 'Investment', amount: 180 },
  { artist: 'Golden Hour', date: '2025-05-27', type: 'Profit', amount: 90 },
  { artist: 'Midnight Echo', date: '2025-05-30', type: 'Investment', amount: 210 },
]


const roiMonthlyDataPerArtist = {
  'Luna Waves': [
    { month: 'Jan', roi: 4 },
    { month: 'Feb', roi: 6 },
    { month: 'Mar', roi: 7 },
    { month: 'Apr', roi: 5 },
    { month: 'May', roi: 6 },
  ],
  'Echo Pulse': [
    { month: 'Jan', roi: 5 },
    { month: 'Feb', roi: 7 },
    { month: 'Mar', roi: 8 },
    { month: 'Apr', roi: 6 },
    { month: 'May', roi: 7 },
  ],
  'Nova Sky': [
    { month: 'Jan', roi: 3 },
    { month: 'Feb', roi: 5 },
    { month: 'Mar', roi: 6 },
    { month: 'Apr', roi: 4 },
    { month: 'May', roi: 5 },
  ],
  'Violet Drift': [
    { month: 'Jan', roi: 2 },
    { month: 'Feb', roi: 4 },
    { month: 'Mar', roi: 3 },
    { month: 'Apr', roi: 2 },
    { month: 'May', roi: 1 },
  ],
  'Crimson Beat': [
    { month: 'Jan', roi: 5 },
    { month: 'Feb', roi: 6 },
    { month: 'Mar', roi: 7 },
    { month: 'Apr', roi: 6 },
    { month: 'May', roi: 5 },
  ],
  'Silver Lining': [
    { month: 'Jan', roi: 4 },
    { month: 'Feb', roi: 3 },
    { month: 'Mar', roi: 2 },
    { month: 'Apr', roi: 1 },
    { month: 'May', roi: 0 },
  ],
  'Golden Hour': [
    { month: 'Jan', roi: 6 },
    { month: 'Feb', roi: 7 },
    { month: 'Mar', roi: 8 },
    { month: 'Apr', roi: 7 },
    { month: 'May', roi: 8 },
  ],
  'Midnight Echo': [
    { month: 'Jan', roi: 5 },
    { month: 'Feb', roi: 6 },
    { month: 'Mar', roi: 7 },
    { month: 'Apr', roi: 6 },
    { month: 'May', roi: 7 },
  ],
}

const averageROIAllArtists = (() => {
  const months = roiMonthlyDataPerArtist[artists[0].name].map(d => d.month)
  return months.map(month => {
    const rois = artists.map(artist => {
      const data = roiMonthlyDataPerArtist[artist.name].find(d => d.month === month)
      return data ? data.roi : 0
    })
    const avg = rois.reduce((a, b) => a + b, 0) / rois.length
    return { month, roi: Number(avg.toFixed(1)) }
  })
})()

export default function InvestorDashboard() {
  const [activeTab, setActiveTab] = useState('transactions')
  const [artistFilter, setArtistFilter] = useState('All')
  const [chartArtist, setChartArtist] = useState('All')
  const [animateRows, setAnimateRows] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const artistNames = ['All', ...artists.map(a => a.name)]

  const searchedArtists = searchTerm
    ? artistNames.filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()))
    : artistNames

  const combinedArtistFilter =
    artistFilter === 'All' ? searchedArtists : searchedArtists.filter(name => name === artistFilter)

  const filteredInvestments = combinedArtistFilter.includes('All')
    ? investmentData
    : investmentData.filter(i => combinedArtistFilter.includes(i.name))

  const filteredTransactions = combinedArtistFilter.includes('All')
    ? transactions
    : transactions.filter(tx => combinedArtistFilter.includes(tx.artist))

  const roiDataToShow = chartArtist === 'All' ? averageROIAllArtists : roiMonthlyDataPerArtist[chartArtist] || []

  useEffect(() => {
    setAnimateRows(false)
    const timeout = setTimeout(() => setAnimateRows(true), 150)
    return () => clearTimeout(timeout)
  }, [artistFilter, activeTab, searchTerm])

  function openModal(artistName) {
    const artistInfo = artists.find(a => a.name === artistName)
    const investmentInfo = investmentData.find(i => i.name === artistName)
    setSelectedArtist({ ...artistInfo, ...investmentInfo })
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setSelectedArtist(null)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gradient-to-tr from-purple-50 via-teal-50 to-indigo-50 rounded-lg shadow-lg">
      <h1 className="text-5xl font-extrabold mb-8 text-indigo-700 drop-shadow-md select-none">
        Investor Dashboard
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search artists..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border-2 border-indigo-300 focus:border-indigo-500 rounded-lg p-3 flex-1 shadow-sm focus:shadow-indigo-300 transition duration-300 placeholder-indigo-400"
        />

        <select
          className="border-2 border-teal-300 focus:border-teal-500 rounded-lg p-3 shadow-sm focus:shadow-teal-300 transition duration-300 text-indigo-800 font-semibold"
          value={artistFilter}
          onChange={e => {
            setArtistFilter(e.target.value)
            if (chartArtist !== e.target.value) setChartArtist(e.target.value)
          }}
        >
          {artistNames.map(name => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <h2 className="text-3xl font-bold mb-4 text-teal-700 drop-shadow-sm">Investment Summary</h2>

      <table className="w-full border-collapse mb-10 rounded-lg overflow-hidden shadow-md">
        <thead>
          <tr className="bg-gradient-to-r from-indigo-400 via-purple-500 to-teal-400 text-white uppercase tracking-wide">
            <th className="p-4 text-left">Artist</th>
            <th className="p-4 text-right">Amount Invested</th>
            <th className="p-4 text-right">Profit</th>
            <th className="p-4 text-center">Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvestments.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-6 text-indigo-600 font-semibold">
                No investments found.
              </td>
            </tr>
          )}
          {filteredInvestments.map((item, idx) => (
            <tr
              key={item.name}
              className={`border-b border-indigo-200 bg-white text-indigo-900 
                transition-all duration-700 ease-out
                ${animateRows ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}
                hover:bg-indigo-100 cursor-pointer`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <td className="p-4">{item.name}</td>
              <td className="p-4 text-right font-mono">${item.amount.toLocaleString()}</td>
              <td
  className={`p-4 text-right font-mono ${
    item.profit >= 0 ? 'text-green-600' : 'text-red-500'
  }`}
>
  ${item.profit.toLocaleString()}
</td>

              <td className="p-4 text-center">
                <button
                  onClick={() => openModal(item.name)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded shadow-md transition"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
          ROI Chart
        </button>
      </div>

      {activeTab === 'transactions' && (
        <ul className="mt-6 max-h-96 overflow-auto space-y-3">
          {filteredTransactions.length === 0 && (
            <li className="text-indigo-600 text-center font-semibold">No transactions found.</li>
          )}
          {filteredTransactions.map((tx, idx) => (
            <li
              key={`${tx.date}-${tx.artist}-${idx}`}
              className={`p-4 bg-white rounded-lg shadow-md cursor-default
                transition duration-700 ease-out
                ${animateRows ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
                hover:shadow-xl hover:bg-indigo-50`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <span className="font-semibold text-indigo-700">{tx.artist}</span> —{' '}
              <span
                className={`${
                  tx.type === 'Profit' ? 'text-teal-600 font-bold' : 'text-indigo-500'
                }`}
              >
                {tx.type}
              </span>{' '}
              on <time dateTime={tx.date}>{tx.date}</time> for{' '}
              <span className="font-mono text-indigo-900">${tx.amount.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}

      {activeTab === 'chart' && (
        <div className="mt-8">
          <div className="mb-6 flex items-center space-x-4">
            <label htmlFor="chartArtist" className="text-indigo-700 font-semibold text-lg">
              Select Artist:
            </label>
            <select
              id="chartArtist"
              className="border-2 border-teal-300 focus:border-teal-500 rounded-lg p-3 shadow-sm focus:shadow-teal-300 transition duration-300 text-indigo-800 font-semibold"
              value={chartArtist}
              onChange={e => setChartArtist(e.target.value)}
            >
              {artistNames.map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={roiDataToShow}
              margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid stroke="#c4f0f9" strokeDasharray="4 4" />
              <XAxis dataKey="month" stroke="#4ade80" fontWeight="bold" />
              <YAxis
                unit="%"
                stroke="#7c3aed"
                domain={[0, dataMax => dataMax + 5]}
                fontWeight="bold"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#eef6ff',
                  borderRadius: '8px',
                  borderColor: '#7c3aed',
                  color: '#312e81',
                }}
              />
              <Line
                type="monotone"
                dataKey="roi"
                stroke="#7c3aed"
                strokeWidth={3}
                dot={{ r: 6, fill: '#c084fc' }}
                activeDot={{ r: 8, fill: '#a78bfa' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {isModalOpen && selectedArtist && (
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
            <h3 className="text-3xl font-extrabold mb-4 text-indigo-700">{selectedArtist.name}</h3>
            <img
              src={selectedArtist.image}
              alt={selectedArtist.name}
              className="mb-6 w-full h-56 object-cover rounded-lg shadow-lg"
            />
            <p className="mb-2 text-indigo-800">
              <strong>Genre:</strong> {selectedArtist.genre}
            </p>
            <p className="mb-2 text-indigo-800">
              <strong>Location:</strong> {selectedArtist.location}
            </p>
            <p className="mb-2 text-indigo-800">
              <strong>Price per Unit:</strong> {selectedArtist.price}
            </p>
            <p className="mb-2 text-indigo-800">
              <strong>Amount Invested:</strong>{' '}
              {selectedArtist.amount ? `$${selectedArtist.amount.toLocaleString()}` : 'N/A'}
            </p>
            <p className="mb-2 text-indigo-800">
  <strong>Profit:</strong>{' '}
  <span
    className={
      selectedArtist.profit > 0
        ? 'text-green-600 font-semibold'
        : selectedArtist.profit < 0
        ? 'text-red-500 font-semibold'
        : 'text-indigo-800'
    }
  >
    {selectedArtist.profit !== undefined
      ? `$${selectedArtist.profit.toLocaleString()}`
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
    </div>
  )
}
