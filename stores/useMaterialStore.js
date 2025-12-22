// stores/useMaterialStore.js
import { defineStore } from 'pinia'

export const useMaterialStore = defineStore('material', {
  state: () => ({
    materials: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchMaterials() {
      this.loading = true
      this.error = null
      
      try {
        const supabase = useSupabaseClient()
        
        console.log('📦 Fetching materials...')

        const { data, error } = await supabase
          .from('SB_Material')
          .select('material_id, material_name, location_id, created_at')
          .order('material_name', { ascending: true })

        if (error) {
          console.error('❌ Supabase error:', error)
          throw error
        }

        console.log('✅ Materials fetched:', data?.length || 0)

        this.materials = (data || []).map(m => ({
          material_id: m.material_id,
          material_name: m.material_name,
          location_id: m.location_id,
          created_at: m.created_at
        }))

        return { success: true, data: this.materials }
      } catch (err) {
        console.error('❌ Fetch materials error:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async fetchMaterialsWithLocations() {
      this.loading = true
      this.error = null
      
      try {
        const supabase = useSupabaseClient()
        
        console.log('📦 Fetching materials with locations...')

        const { data: materialsData, error: materialsError } = await supabase
          .from('SB_Material')
          .select('material_id, material_name, location_id, created_at')
          .order('material_name', { ascending: true })

        if (materialsError) throw materialsError

        const { data: locationsData, error: locationsError } = await supabase
          .from('SB_Location')
          .select('location_id, location_name')

        if (locationsError) throw locationsError

        // Create location map
        const locationMap = {}
        if (locationsData) {
          locationsData.forEach(loc => {
            locationMap[loc.location_id] = loc.location_name
          })
        }

        // Merge data
        this.materials = (materialsData || []).map(m => ({
          material_id: m.material_id,
          material_name: m.material_name,
          location_id: m.location_id,
          location_name: locationMap[m.location_id] || 'Unknown',
          created_at: m.created_at
        }))

        console.log('✅ Materials with locations fetched:', this.materials.length)

        return { success: true, data: this.materials }
      } catch (err) {
        console.error('❌ Fetch materials error:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async createMaterial(materialData) {
      this.loading = true
      
      try {
        const supabase = useSupabaseClient()
        
        console.log('➕ Creating material:', materialData)

        const { data, error } = await supabase
          .from('SB_Material')
          .insert([{
            material_name: materialData.material_name,
            location_id: materialData.location_id
          }])
          .select()
          .single()

        if (error) throw error

        console.log('✅ Material created:', data)

        await this.fetchMaterials()
        return { success: true, data }
      } catch (err) {
        console.error('❌ Create material error:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async addMaterial(materialData) {
      return await this.createMaterial(materialData)
    },

    async updateMaterial(materialId, updates) {
      this.loading = true
      
      try {
        const supabase = useSupabaseClient()
        
        console.log('✏️ Updating material:', materialId, updates)

        const { data, error } = await supabase
          .from('SB_Material')
          .update(updates)
          .eq('material_id', materialId)
          .select()
          .single()

        if (error) throw error

        console.log('✅ Material updated:', data)

        await this.fetchMaterials()
        return { success: true, data }
      } catch (err) {
        console.error('❌ Update material error:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async deleteMaterial(materialId) {
      this.loading = true
      
      try {
        const supabase = useSupabaseClient()
        
        console.log('🗑️ Deleting material:', materialId)

        const { error } = await supabase
          .from('SB_Material')
          .delete()
          .eq('material_id', materialId)

        if (error) throw error

        console.log('✅ Material deleted')

        await this.fetchMaterials()
        return { success: true }
      } catch (err) {
        console.error('❌ Delete material error:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    // ✅ NEW: uploadImage untuk upload files
    async uploadImage(file, bucketName, folderName) {
      try {
        const supabase = useSupabaseClient()
        const config = useRuntimeConfig()
        const baseUrl = config.public.supabaseUrl
        
        console.log('📤 Upload starting...')
        console.log('  - File:', file.name, '(' + (file.size / 1024).toFixed(2) + ' KB)')
        console.log('  - Bucket:', bucketName)
        console.log('  - Folder:', folderName)
        
        const fileExt = file.name.split('.').pop()
        const randomName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`
        const filePath = folderName ? `${folderName}/${randomName}` : randomName

        console.log('  - Path:', filePath)

        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, { 
            upsert: false,
            contentType: file.type
          })
          
        if (error) {
          console.error('❌ Upload error:', error)
          console.error('  - Message:', error.message)
          console.error('  - Status:', error.status)
          throw error
        }

        console.log('  - Upload data:', data)

        const publicUrl = `${baseUrl}/storage/v1/object/public/${bucketName}/${filePath}`

        console.log('✅ Upload success!')
        console.log('  - URL:', publicUrl)

        return { 
          success: true, 
          path: filePath, 
          bucket: bucketName,
          url: publicUrl
        }
      } catch (err) { 
        console.error('❌ Upload error:', err)
        return { success: false, error: err.message } 
      }
    },

    getMaterialById(materialId) {
      return this.materials.find(m => m.material_id === materialId)
    },

    getMaterialName(materialId) {
      const material = this.getMaterialById(materialId)
      return material ? material.material_name : 'Unknown'
    }
  }
})