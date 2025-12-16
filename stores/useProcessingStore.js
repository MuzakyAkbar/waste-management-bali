import { defineStore } from 'pinia'

export const useProcessingStore = defineStore('processing', {
  state: () => ({
    processes: [],
    statistics: {
      totalProcesses: 0,
      activeProcesses: 0,
      completedToday: 0,
      totalOutput: 0,
    },
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProcesses(locationId = null) {
      this.loading = true
      this.error = null

      try {
        const supabase = useSupabaseClient()
        
        let query = supabase
          .from('processing_activities')
          .select(`
            *,
            location:locations(*),
            materials:processing_materials(
              *,
              material:materials(*)
            )
          `)
          .order('activity_date', { ascending: false })

        if (locationId) {
          query = query.eq('location_id', locationId)
        }

        const { data, error } = await query

        if (error) throw error

        this.processes = data || []
        this.calculateStatistics()
        return { success: true, data }
      } catch (err) {
        console.error('Fetch processes error:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async createProcess(processData) {
      this.loading = true
      this.error = null

      try {
        const supabase = useSupabaseClient()
        
        const { data, error } = await supabase
          .from('processing_activities')
          .insert([processData])
          .select()
          .single()

        if (error) throw error

        await this.fetchProcesses()
        return { success: true, data }
      } catch (err) {
        console.error('Create process error:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async completeProcess(processingId, completionData) {
      this.loading = true
      this.error = null

      try {
        const supabase = useSupabaseClient()
        
        const { data, error } = await supabase
          .from('processing_activities')
          .update({
            ...completionData,
            status: 'completed'
          })
          .eq('id', processingId)
          .select()
          .single()

        if (error) throw error

        await this.fetchProcesses()
        return { success: true, data }
      } catch (err) {
        console.error('Complete process error:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async addMaterialUsed(processingId, materials) {
      try {
        const supabase = useSupabaseClient()
        
        const materialsData = materials.map(m => ({
          activity_id: processingId,
          material_id: m.material_id,
          weight_received: m.qty,
          weight_processed: m.qty,
        }))

        const { error } = await supabase
          .from('processing_materials')
          .insert(materialsData)

        if (error) throw error

        return { success: true }
      } catch (err) {
        console.error('Add material error:', err)
        return { success: false, error: err.message }
      }
    },

    async uploadImage(file, folder = 'processing_images') {
      try {
        const supabase = useSupabaseClient()
        
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`
        const filePath = `${folder}/${fileName}`

        const { data, error } = await supabase.storage
          .from('processing-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
          .from('processing-images')
          .getPublicUrl(filePath)

        return {
          success: true,
          path: filePath,
          url: publicUrl,
          bucket: 'processing-images'
        }
      } catch (err) {
        console.error('Upload image error:', err)
        return { success: false, error: err.message }
      }
    },

    calculateStatistics() {
      const today = new Date().toISOString().split('T')[0]
      
      this.statistics = {
        totalProcesses: this.processes.length,
        activeProcesses: this.processes.filter(p => p.status === 'in_progress').length,
        completedToday: this.processes.filter(p => 
          p.status === 'completed' && 
          p.completed_at?.split('T')[0] === today
        ).length,
        totalOutput: this.processes
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + (parseFloat(p.output_amount_kg) || 0), 0)
      }
    },
  },
})