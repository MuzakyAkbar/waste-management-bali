import { createClient } from '@supabase/supabase-js'

let supabaseInstance = null

export const useSupabaseClient = () => {
  // 1. Singleton check
  if (supabaseInstance) return supabaseInstance

  const config = useRuntimeConfig()
  
  // 2. Ambil kredensial dengan 2 metode (Runtime Config & Direct Vite Env)
  // Ini memastikan variabel terbaca meskipun nuxt.config belum me-load-nya
  let url = config.public.supabaseUrl || import.meta.env.VITE_SUPABASE_URL
  let key = config.public.supabaseKey || import.meta.env.VITE_SUPABASE_KEY

  // 3. Validasi ketat
  if (!url || !key) {
    console.error('❌ Gagal memuat kredensial Supabase!')
    console.error('Pastikan file .env memiliki VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY')
    throw new Error('Supabase credentials missing')
  }

  // 4. Inisialisasi Client
  supabaseInstance = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'waste-management-auth',
      storage: import.meta.client ? window.localStorage : undefined,
    },
    global: {
      headers: {
        'x-application-name': 'waste-management-bali',
      },
    }
  })

  return supabaseInstance
}