import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { supabase } from '../lib/supabaseClient'
import AuthButton from './AuthButton'

export default function Navbar({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const dropdownButtonRef = useRef(null)
  const closeTimeoutRef = useRef(null)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsOpen(false)
  }

  const updateDropdownPosition = () => {
    if (dropdownButtonRef.current) {
      const rect = dropdownButtonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY, // No gap
        left: rect.left + window.scrollX
      })
    }
  }

  const handleDropdownMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    updateDropdownPosition()
    setIsDropdownOpen(true)
  }

  const handleDropdownMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false)
    }, 150) // 150ms delay
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])
  useEffect(() => {
    const handleScroll = () => {
      if (isDropdownOpen) {
        updateDropdownPosition()
      }
    }

    const handleResize = () => {
      if (isDropdownOpen) {
        updateDropdownPosition()
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [isDropdownOpen])

  return (
    <>
      <nav className="text-white p-4 font-extrabold bg-[#0a0a23]" style={{ fontFamily: 'Poppins, Montserrat, Arial, sans-serif' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center relative">
          <div className="logo-gradient-glow text-2xl font-extrabold select-none cursor-default tracking-tight">Spotavibe</div>

          {/* Hamburger button */}
          <button
            className="md:hidden block p-2 rounded bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-0 shadow-md border border-white/20 transition-colors"
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
            className={`flex-col md:flex-row md:flex md:items-center absolute md:static top-16 left-0 right-0 navbar-animated md:bg-transparent transition-transform duration-300 ease-in-out z-10 ${
              isOpen ? 'flex' : 'hidden'
            }`}
          >
            <Link
              to="/"
              className="nav-link-underline block px-4 py-2 hover:text-blue-400 md:ml-6 transition-colors rounded-lg focus:outline-none focus:ring-0"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/explore-artists"
              className="nav-link-underline block px-4 py-2 hover:text-teal-300 md:ml-6 transition-colors rounded-lg focus:outline-none focus:ring-0"
              onClick={() => setIsOpen(false)}
            >
              Artists
            </Link>
            <Link
              to="/artist-submission"
              className="nav-link-underline block px-4 py-2 hover:text-purple-300 md:ml-6 transition-colors rounded-lg focus:outline-none focus:ring-0"
              onClick={() => setIsOpen(false)}
            >
              Profile Submission
            </Link>
            {/* Dashboards Dropdown */}
            <div className="relative md:ml-6 px-4 py-2">
              <button 
                ref={dropdownButtonRef}
                className="flex items-center space-x-2 nav-link-underline block px-4 py-2 hover:text-yellow-300 transition-colors rounded-lg focus:outline-none focus:ring-0"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
                onFocus={handleDropdownMouseEnter}
                onBlur={(e) => {
                  // Only close if focus is moving outside the dropdown area
                  if (!e.relatedTarget?.closest('[data-dropdown]')) {
                    setIsDropdownOpen(false)
                  }
                }}
              >
                <span>Dashboards</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </button>
            </div>
            {user ? (
              <div className="flex items-center space-x-4 md:ml-6 px-4 py-2">
                <span className="select-none font-semibold">👋 {user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="nav-btn-gradient px-3 py-1 rounded transition-colors font-bold focus:outline-none focus:ring-0"
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

      {/* Portal Dropdown */}
      {isDropdownOpen && createPortal(
        <div 
          data-dropdown
          className="fixed w-40 bg-gradient-to-br from-[#0a0a23] to-[#1a0033] text-white border border-white/20 rounded-lg shadow-lg transition-all duration-200 z-[999999]"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`
          }}
          onMouseEnter={() => {
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current)
              closeTimeoutRef.current = null
            }
            setIsDropdownOpen(true)
          }}
          onMouseLeave={() => {
            closeTimeoutRef.current = setTimeout(() => {
              setIsDropdownOpen(false)
            }, 150)
          }}
        >
          <Link 
            to="/investor-dashboard" 
            className="block px-4 py-3 hover:bg-white/10 rounded-t-lg transition-colors focus:outline-none focus:ring-0" 
            onClick={() => {
              setIsOpen(false)
              setIsDropdownOpen(false)
            }}
          >
            Investor
          </Link>
          <Link 
            to="/artist-dashboard" 
            className="block px-4 py-3 hover:bg-white/10 rounded-b-lg transition-colors focus:outline-none focus:ring-0" 
            onClick={() => {
              setIsOpen(false)
              setIsDropdownOpen(false)
            }}
          >
            Artist
          </Link>
        </div>,
        document.body
      )}
    </>
  )
}