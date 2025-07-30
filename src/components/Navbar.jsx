import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import AuthButton from './AuthButton'

export default function Navbar({ user }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsOpen(false)
  }

  return (
    <nav className="navbar-animated text-white p-4 shadow-md font-extrabold" style={{ fontFamily: 'Poppins, Montserrat, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        <div className="logo-gradient-glow text-2xl font-extrabold select-none cursor-default tracking-tight">Spotavibe</div>

        {/* Hamburger button */}
        <button
          className="md:hidden block p-2 rounded bg-indigo-800 hover:bg-indigo-700 focus:outline-none shadow-md border border-indigo-700 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <svg
            className="w-8 h-8 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.3 5.71a1 1 0 00-1.42-1.42L12 9.17 7.12 4.3a1 1 0 10-1.42 1.42L10.83 12l-5.13 5.13a1 1 0 101.42 1.42L12 14.83l4.88 4.88a1 1 0 001.42-1.42L13.17 12l5.13-5.13z"
              />
            ) : (
              <path fillRule="evenodd" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Navigation links */}
        <div
          className={`flex-col md:flex-row md:flex md:items-center absolute md:static top-16 left-0 right-0 bg-indigo-900 md:bg-transparent transition-transform duration-300 ease-in-out z-10 ${
            isOpen ? 'flex' : 'hidden'
          }`}
        >
          <Link
            to="/"
            className="nav-link-underline block px-4 py-2 hover:text-blue-400 md:ml-6 transition-colors rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/explore-artists"
            className="nav-link-underline block px-4 py-2 hover:text-teal-300 md:ml-6 transition-colors rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            Artists
          </Link>
          <Link
            to="/artist-submission"
            className="nav-link-underline block px-4 py-2 hover:text-purple-300 md:ml-6 transition-colors rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            Profile Submission
          </Link>
          {/* Dashboards Dropdown */}
          <div className="relative group md:ml-6 px-4 py-2">
            <button className="flex items-center space-x-2 nav-link-underline block px-4 py-2 hover:text-yellow-300 transition-colors rounded-lg focus:outline-none">
              <span>Dashboards</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute left-0 mt-2 w-40 bg-white text-indigo-900 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50">
              <Link to="/investor-dashboard" className="block px-4 py-3 hover:bg-indigo-100 rounded-t-lg transition-colors" onClick={() => setIsOpen(false)}>
                Investor
              </Link>
              <Link to="/artist-dashboard" className="block px-4 py-3 hover:bg-indigo-100 rounded-b-lg transition-colors" onClick={() => setIsOpen(false)}>
                Artist
              </Link>
            </div>
          </div>
          {user ? (
            <div className="flex items-center space-x-4 md:ml-6 px-4 py-2">
              <span className="select-none font-semibold">👋 {user.email}</span>
              <button
                onClick={handleSignOut}
                className="nav-btn-gradient px-3 py-1 rounded transition-colors font-bold"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="px-4 py-2 md:ml-6">
              <AuthButton className="nav-btn-gradient" />
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
