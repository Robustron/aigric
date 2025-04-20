import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error('Error: VITE_SUPABASE_URL environment variable is not set.')
  throw new Error("Supabase URL is missing in environment variables. Ensure it's set in your .env file and prefixed with VITE_");
}
if (!supabaseAnonKey) {
  console.error('Error: VITE_SUPABASE_ANON_KEY environment variable is not set.')
  throw new Error("Supabase Anon Key is missing in environment variables. Ensure it's set in your .env file and prefixed with VITE_");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 