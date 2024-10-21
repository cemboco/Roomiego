import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vadplafyxclgptxamdpn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhZHBsYWZ5eGNsZ3B0eGFtZHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkzODE5NTYsImV4cCI6MjA0NDk1Nzk1Nn0.n5r9UU7pvrOOvWuEnKHXecvxn8DYSmP1UnSJoSgAotY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
