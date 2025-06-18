// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Grab our URL and key from Vite’s environment
const supabaseUrl   = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon  = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnon)
