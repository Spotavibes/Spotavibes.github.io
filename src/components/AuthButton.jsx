// src/components/AuthButton.jsx
import React from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AuthButton() {
  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // After auth it will redirect back here
        redirectTo: window.location.origin,
      },
    })
    if (error) {
      console.error('Google sign‑in error:', error.message)
    } else {
      // data.url is the URL Supabase generated for the OAuth flow
      window.location.href = data.url
    }
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Sign in with Google
    </button>
  )
}
