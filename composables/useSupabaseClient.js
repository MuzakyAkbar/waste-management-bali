import { createClient } from '@supabase/supabase-js'

// Function to get Supabase client
export const useSupabase = () => {
  // Get config (works in both client and server)
  const config = useRuntimeConfig()
  
  const supabaseUrl = config.public.supabaseUrl
  const supabaseAnonKey = config.public.supabaseKey

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase credentials')
    console.error('Add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file')
    throw new Error('Missing Supabase credentials')
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'waste-management-auth',
      storage: process.client ? window.localStorage : undefined,
    },
    global: {
      headers: {
        'x-application-name': 'waste-management-bali',
      },
    },
    db: {
      schema: 'public',
    },
  })
}

// Create singleton instance
let supabaseInstance = null

export const supabase = (() => {
  if (!supabaseInstance) {
    try {
      // Try to get runtime config
      const config = useRuntimeConfig?.() || {}
      const supabaseUrl = config?.public?.supabaseUrl || process.env.SUPABASE_URL
      const supabaseAnonKey = config?.public?.supabaseKey || process.env.SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('⚠️ Supabase not configured yet')
        return null
      }

      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: 'waste-management-auth',
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        },
        global: {
          headers: {
            'x-application-name': 'waste-management-bali',
          },
        },
        db: {
          schema: 'public',
        },
      })
    } catch (error) {
      console.error('❌ Failed to initialize Supabase:', error)
      return null
    }
  }
  return supabaseInstance
})()

export default supabase

// Helper function to get authenticated user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  return user
}

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error)
    return false
  }
  return true
}