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
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        <div className="text-2xl font-bold select-none cursor-default">Spotavibe</div>

        {/* Hamburger button */}
        <button
          className="md:hidden block p-2 rounded bg-gray-800 hover:bg-gray-700 focus:outline-none shadow-md border border-gray-700 transition-colors"
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
          className={`flex-col md:flex-row md:flex md:items-center absolute md:static top-16 left-0 right-0 bg-gray-900 md:bg-transparent transition-transform duration-300 ease-in-out z-10 ${
            isOpen ? 'flex' : 'hidden'
          }`}
        >
          <Link
            to="/"
            className="block px-4 py-2 hover:text-purple-400 md:ml-6 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/explore-artists"
            className="block px-4 py-2 hover:text-purple-400 md:ml-6 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Artists
          </Link>
          <Link
            to="/about"
            className="block px-4 py-2 hover:text-purple-400 md:ml-6 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          {user ? (
            <div className="flex items-center space-x-4 md:ml-6 px-4 py-2">
              <span className="select-none">👋 {user.email}</span>
              <button
                onClick={handleSignOut}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="px-4 py-2 md:ml-6">
              <AuthButton />
            </div>
          )}
        </div>
      </div>
    </nav>)}
