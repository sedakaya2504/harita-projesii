import { createClient } from '@supabase/supabase-js'

// Supabase panelinden aldığın "Project URL" ve "anon public Key" buraya gelecek
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log(import.meta.env.VITE_SUPABASE_URL)

export const supabase = createClient(supabaseUrl, supabaseKey)