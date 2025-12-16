import { defineStore } from 'pinia'

export const useMaterialStore = defineStore('material', {
  state: () => ({
    materials: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchMaterials() {
      this.loading = true
      this.error = null
      
      try {
        const supabase = useSupabaseClient()
        
        console.log('🔍 Fetching materials from SB_Material...')
        
        // Query dengan LEFT JOIN ke SB_Location
        const { data, error } = await supabase
          .from('SB_Material')
          .select(`
            material_id,
            material_name,
            location_id,
            created_at,
            SB_Location (
              name
            )
          `)
          .order('material_name')

        if (error) {
          console.error('❌ Supabase error:', error)
          throw error
        }
        
        console.log('📦 Raw data from Supabase:', data)
        
        if (!data || data.length === 0) {
          console.warn('⚠️ No materials found in database')
          this.materials = []
          return
        }
        
        // Format data dengan location name
        this.materials = data.map(m => ({
          material_id: m.material_id,
          material_name: m.material_name,
          location_id: m.location_id,
          location_name: m.SB_Location?.name || 'Unknown',
          created_at: m.created_at
        }))
        
        console.log('✅ Materials loaded:', this.materials.length)
        console.log('📋 Materials:', this.materials)
        
      } catch (err) {
        console.error('❌ Fetch materials error:', err)
        this.error = err.message
        this.materials = []
      } finally {
        this.loading = false
      }
    },

    async addMaterial(materialData) {
      this.loading = true
      try {
        const supabase = useSupabaseClient()
        
        console.log('➕ Adding material:', materialData)
        
        const { data, error } = await supabase
          .from('SB_Material')
          .insert([materialData])
          .select()
          .single()

        if (error) {
          console.error('❌ Add material error:', error)
          throw error
        }
        
        console.log('✅ Material added:', data)
        await this.fetchMaterials()
        return { success: true, data }
      } catch (err) {
        console.error('❌ Add material error:', err)
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async deleteMaterial(id) {
      try {
        const supabase = useSupabaseClient()
        
        console.log('🗑️ Deleting material:', id)
        
        const { error } = await supabase
          .from('SB_Material')
          .delete()
          .eq('material_id', id)

        if (error) {
          console.error('❌ Delete material error:', error)
          throw error
        }
        
        console.log('✅ Material deleted')
        await this.fetchMaterials()
        return { success: true }
      } catch (err) {
        console.error('❌ Delete material error:', err)
        return { success: false, error: err.message }
      }
    }
  }
})