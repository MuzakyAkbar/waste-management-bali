import { defineStore } from 'pinia'

export const useLocationStore = defineStore('location', {
  state: () => ({
    locations: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchLocations() {
      this.loading = true
      this.error = null
      
      try {
        const supabase = useSupabaseClient()
        
        console.log('🔍 Fetching locations...')

        // ✅ PERBAIKAN: Gunakan nama kolom yang sesuai dengan database
        const { data, error } = await supabase
          .from('SB_Location')
          .select('location_id, location_name, location_detail, created_at')
          .order('location_name', { ascending: true })

        if (error) {
          console.error('❌ Supabase error:', error)
          throw error
        }

        console.log('✅ Locations fetched:', data?.length || 0)

        // ✅ Map data dengan nama yang konsisten untuk frontend
        this.locations = (data || []).map(loc => ({
          location_id: loc.location_id,
          name: loc.location_name, // Convert ke 'name' untuk konsistensi
          location_name: loc.location_name, // Keep original juga
          address: loc.location_detail,
          created_at: loc.created_at
        }))

        return { success: true, data: this.locations }
      } catch (err) {
        console.error('❌ Fetch locations error:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async createLocation(locationData) {
      this.loading = true
      
      try {
        const supabase = useSupabaseClient()
        
        console.log('➕ Creating location:', locationData)

        // ✅ PERBAIKAN: Gunakan nama kolom yang benar
        const { data, error } = await supabase
          .from('SB_Location')
          .insert([{
            location_name: locationData.name || locationData.location_name,
            location_detail: locationData.address || locationData.location_detail || null
          }])
          .select()
          .single()

        if (error) throw error

        console.log('✅ Location created:', data)

        await this.fetchLocations()
        return { success: true, data }
      } catch (err) {
        console.error('❌ Create location error:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async addLocation(locationData) {
      return await this.createLocation(locationData)
    },

    async updateLocation(locationId, updates) {
      this.loading = true
      
      try {
        const supabase = useSupabaseClient()
        
        console.log('✏️ Updating location:', locationId, updates)

        // ✅ Convert field names jika perlu
        const payload = {}
        if (updates.name) payload.location_name = updates.name
        if (updates.location_name) payload.location_name = updates.location_name
        if (updates.address !== undefined) payload.location_detail = updates.address
        if (updates.location_detail !== undefined) payload.location_detail = updates.location_detail

        const { data, error } = await supabase
          .from('SB_Location')
          .update(payload)
          .eq('location_id', locationId)
          .select()
          .single()

        if (error) throw error

        console.log('✅ Location updated:', data)

        await this.fetchLocations()
        return { success: true, data }
      } catch (err) {
        console.error('❌ Update location error:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async deleteLocation(locationId) {
      this.loading = true
      
      try {
        const supabase = useSupabaseClient()
        
        console.log('🗑️ Deleting location:', locationId)

        const { error } = await supabase
          .from('SB_Location')
          .delete()
          .eq('location_id', locationId)

        if (error) throw error

        console.log('✅ Location deleted')

        await this.fetchLocations()
        return { success: true }
      } catch (err) {
        console.error('❌ Delete location error:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    getLocationById(locationId) {
      return this.locations.find(l => l.location_id === locationId)
    },

    getLocationName(locationId) {
      const location = this.getLocationById(locationId)
      return location ? location.name : 'Unknown'
    }
  }
})