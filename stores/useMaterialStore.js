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
      try {
        const supabase = useSupabaseClient()
        
        console.log('🔍 Fetching materials...')
        
        // Join ke SB_Location untuk menampilkan nama lokasi
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
          console.error('❌ Fetch materials error:', error)
          throw error
        }
        
        console.log('✅ Materials fetched:', data)
        
        // Format data dengan location name
        this.materials = (data || []).map(m => ({
          material_id: m.material_id,
          material_name: m.material_name,
          location_id: m.location_id,
          location_name: m.SB_Location?.name || 'Unknown',
          created_at: m.created_at
        }))
        
      } catch (err) {
        console.error('❌ Fetch materials error:', err)
        this.error = err.message
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