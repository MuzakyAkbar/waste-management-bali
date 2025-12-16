import { defineStore } from 'pinia'

export const useMaterialStore = defineStore('material', {
  state: () => ({
    materials: [],
    selectedMaterial: null,
    loading: false,
    error: null,
  }),

  getters: {
    // Get material by ID
    getMaterialById: (state) => (id) => {
      return state.materials.find(mat => mat.id === id)
    },

    // Get materials by category
    getMaterialsByCategory: (state) => (category) => {
      return state.materials.filter(mat => mat.category === category)
    },

    // Count total materials
    totalMaterials: (state) => state.materials.length,
  },

  actions: {
    async fetchMaterials(locationId = null) {
      this.loading = true
      this.error = null

      try {
        const supabase = useSupabaseClient()
        
        let query = supabase
          .from('materials')
          .select('*')
          .order('name', { ascending: true })

        const { data, error } = await query

        if (error) throw error

        this.materials = data || []
        console.log('✅ Materials fetched:', this.materials.length)
        return { success: true, data }
      } catch (err) {
        console.error('❌ Fetch materials error:', err)
        this.error = err.message || 'Failed to fetch materials'
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async fetchMaterialById(id) {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await supabase
          .from('materials')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error

        this.selectedMaterial = data
        return { success: true, data }
      } catch (err) {
        console.error('❌ Fetch material error:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async createMaterial(materialData) {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await supabase
          .from('materials')
          .insert([materialData])
          .select()
          .single()

        if (error) throw error

        this.materials.push(data)
        console.log('✅ Material created:', data)
        return { success: true, data }
      } catch (err) {
        console.error('❌ Create material error:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async updateMaterial(id, updates) {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await supabase
          .from('materials')
          .update(updates)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error

        // Update in local state
        const index = this.materials.findIndex(mat => mat.id === id)
        if (index !== -1) {
          this.materials[index] = data
        }

        console.log('✅ Material updated:', data)
        return { success: true, data }
      } catch (err) {
        console.error('❌ Update material error:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async deleteMaterial(id) {
      this.loading = true
      this.error = null

      try {
        const { error } = await supabase
          .from('materials')
          .delete()
          .eq('id', id)

        if (error) throw error

        // Remove from local state
        this.materials = this.materials.filter(mat => mat.id !== id)

        console.log('✅ Material deleted:', id)
        return { success: true }
      } catch (err) {
        console.error('❌ Delete material error:', err)
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

    // Clear selected material
    clearSelectedMaterial() {
      this.selectedMaterial = null
    },
  },
})