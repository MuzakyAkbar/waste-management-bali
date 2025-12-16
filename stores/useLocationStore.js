import { defineStore } from 'pinia'

export const useLocationStore = defineStore('location', {
  state: () => ({
    locations: [],
    selectedLocation: null,
    loading: false,
    error: null,
  }),

  getters: {
    // Get location by ID
    getLocationById: (state) => (id) => {
      return state.locations.find(loc => loc.id === id)
    },

    // Get locations by type
    getLocationsByType: (state) => (type) => {
      return state.locations.filter(loc => loc.type === type)
    },

    // Count total locations
    totalLocations: (state) => state.locations.length,
  },

  actions: {
    async fetchLocations() {
      this.loading = true
      this.error = null

      try {
        const supabase = useSupabaseClient()
        
        const { data, error } = await supabase
          .from('locations')
          .select('*')
          .order('name', { ascending: true })

        if (error) throw error

        this.locations = data || []
        console.log('✅ Locations fetched:', this.locations.length)
        return { success: true, data }
      } catch (err) {
        console.error('❌ Fetch locations error:', err)
        this.error = err.message || 'Failed to fetch locations'
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async fetchLocationById(id) {
      this.loading = true
      this.error = null

      try {
        const supabase = useSupabaseClient()
        
        const { data, error } = await supabase
          .from('locations')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error

        this.selectedLocation = data
        return { success: true, data }
      } catch (err) {
        console.error('❌ Fetch location error:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async createLocation(locationData) {
      this.loading = true
      this.error = null

      try {
        const supabase = useSupabaseClient()
        
        const { data, error } = await supabase
          .from('locations')
          .insert([locationData])
          .select()
          .single()

        if (error) throw error

        this.locations.push(data)
        console.log('✅ Location created:', data)
        return { success: true, data }
      } catch (err) {
        console.error('❌ Create location error:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async updateLocation(id, updates) {
      this.loading = true
      this.error = null

      try {
        const supabase = useSupabaseClient()
        
        const { data, error } = await supabase
          .from('locations')
          .update(updates)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error

        const index = this.locations.findIndex(loc => loc.id === id)
        if (index !== -1) {
          this.locations[index] = data
        }

        console.log('✅ Location updated:', data)
        return { success: true, data }
      } catch (err) {
        console.error('❌ Update location error:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async deleteLocation(id) {
      this.loading = true
      this.error = null

      try {
        const supabase = useSupabaseClient()
        
        const { error } = await supabase
          .from('locations')
          .delete()
          .eq('id', id)

        if (error) throw error

        this.locations = this.locations.filter(loc => loc.id !== id)

        console.log('✅ Location deleted:', id)
        return { success: true }
      } catch (err) {
        console.error('❌ Delete location error:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    // Clear error
    clearError() {
      this.error = null
    },

    // Clear selected location
    clearSelectedLocation() {
      this.selectedLocation = null
    },
  },
})