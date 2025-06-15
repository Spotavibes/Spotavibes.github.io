import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Checkout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [fadeIn, setFadeIn] = useState(false)

  const artist = location.state?.artist

  useEffect(() => {
    setFadeIn(true)
  }, [])

  if (!artist) {
    return (
      <div className="p-8 min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 transition-opacity duration-700" style={{opacity: fadeIn ? 1 : 0}}>
        <h2 className="text-3xl font-bold mb-6 text-indigo-900 drop-shadow-lg">No artist selected.</h2>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105"
          onClick={() => navigate('/explore-artists')}
        >
          Go back to Explore Artists
        </button>
      </div>
    )
  }

  function handlePayment() {
    alert(`You invested in ${artist.name} for ${artist.price}!`)
    navigate('/explore-artists')
  }

  return (
    <div
      className={`p-8 min-h-screen max-w-md mx-auto bg-white rounded-3xl shadow-2xl ring-1 ring-purple-300 transition-transform duration-300 ${
        fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } hover:-translate-y-1`}
    >
      <h2 className="text-4xl font-extrabold mb-8 text-center text-indigo-900 drop-shadow-lg">
        Checkout
      </h2>
      <div className="mb-8 space-y-4 text-indigo-800">
        <p className="text-xl"><strong>Artist:</strong> {artist.name}</p>
        <p className="text-lg"><strong>Price:</strong> <span className="text-green-600 font-semibold">{artist.price}</span></p>
        <p className="italic"><strong>Genres:</strong> {artist.genre.join(', ')}</p>
      </div>
      <button
        onClick={handlePayment}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl font-semibold shadow-lg transition transform hover:scale-105 active:scale-95"
      >
        Confirm Investment
      </button>
      <button
        onClick={() => navigate('/explore-artists')}
        className="w-full mt-4 bg-indigo-200 hover:bg-indigo-300 text-indigo-900 py-3 rounded-lg font-medium shadow-inner transition transform hover:scale-105 active:scale-95"
      >
        Cancel
      </button>
    </div>
  )
}
