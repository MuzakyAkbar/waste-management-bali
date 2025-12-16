import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    userId: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userRole: (state) => state.user?.role || 'guest',
    userName: (state) => state.user?.full_name || state.user?.username || 'User',
  },

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null

      try {
        // Get Supabase client
        const supabase = useSupabaseClient()

        // Query user from database
        const { data: users, error: queryError } = await supabase
          .from('user')
          .select('*')
          .eq('email', email)
          .eq('password', password)
          .limit(1)

        if (queryError) throw queryError

        if (!users || users.length === 0) {
          throw new Error('Email atau password salah')
        }

        const user = users[0]
        
        // Save to state and localStorage
        this.user = user
        this.userId = user.id
        
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(user))
          localStorage.setItem('userId', user.id)
        }

        console.log('✅ Login successful:', user.email)
        return true
      } catch (err) {
        console.error('❌ Login error:', err)
        this.error = err.message || 'Login gagal'
        return false
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        this.user = null
        this.userId = null
        
        if (process.client) {
          localStorage.removeItem('user')
          localStorage.removeItem('userId')
        }

        console.log('✅ Logout successful')
        return true
      } catch (err) {
        console.error('❌ Logout error:', err)
        return false
      }
    },

    async checkAuth() {
      if (process.client) {
        const savedUser = localStorage.getItem('user')
        const savedUserId = localStorage.getItem('userId')
        
        if (savedUser && savedUserId) {
          this.user = JSON.parse(savedUser)
          this.userId = savedUserId
          console.log('✅ Auth restored from localStorage')
          return true
        }
      }
      return false
    },

    clearError() {
      this.error = null
    },
  },
})