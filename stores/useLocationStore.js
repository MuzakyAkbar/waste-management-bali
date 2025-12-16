import { defineStore } from 'pinia'

export const useLocationStore = defineStore('location', {
  state: () => ({
    locations: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchLocations() {
      this.loading = true
      try {
        const supabase = useSupabaseClient()
        const { data, error } = await supabase
          .from('SB_Location')
          .select('*')
          .order('name')

        if (error) throw error
        this.locations = data
      } catch (err) {
        console.error('Fetch locations error:', err)
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async addLocation(locationData) {
      this.loading = true
      try {
        const supabase = useSupabaseClient()
        const { data, error } = await supabase
          .from('SB_Location')
          .insert([locationData])
          .select()
          .single()

        if (error) throw error
        await this.fetchLocations() // Refresh list
        return { success: true, data }
      } catch (err) {
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async deleteLocation(id) {
      try {
        const supabase = useSupabaseClient()
        const { error } = await supabase
          .from('SB_Location')
          .delete()
          .eq('location_id', id)

        if (error) throw error
        await this.fetchLocations()
        return { success: true }
      } catch (err) {
        return { success: false, error: err.message }
      }
    }
  }
})