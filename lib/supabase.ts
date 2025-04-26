import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://bakbmyaefvcgyrofujlh.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJha2JteWFlZnZjZ3lyb2Z1amxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3MDE1NDUsImV4cCI6MjA2MTI3NzU0NX0.yfa65QH0b9veV-ri23U9yW50G9ebPU8iOcghszCnsVM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
