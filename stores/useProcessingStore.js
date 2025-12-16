import { defineStore } from 'pinia'

export const useProcessingStore = defineStore('processing', {
  state: () => ({
    processes: [],
    loading: false,
    error: null,
    statistics: {
      totalProcesses: 0,
      activeProcesses: 0,
      completedToday: 0,
      totalOutput: 0,
    },
  }),

  actions: {
    async fetchProcesses() {
      this.loading = true
      this.error = null
      try {
        const supabase = useSupabaseClient()
        const { data, error } = await supabase
          .from('SB_Processing')
          .select('*')
          .order('start_datetime', { ascending: false })

        if (error) throw error

        this.processes = (data || []).map(item => ({
            id: item.processing_id,
            activity_date: item.start_datetime,
            completed_at: item.end_datetime,
            input_amount: item.input_amount_kg,
            output_amount: item.output_amount_kg,
            kwh_start: item.kwh_start,
            kwh_start_img: item.kwh_start_img_path, 
            kwh_end: item.kwh_end,
            kwh_used: item.kwh_used,
            status: item.end_datetime ? 'completed' : 'in_progress',
            notes: '-' 
        }))
        this.calculateStatistics()
        return { success: true, data: this.processes }
      } catch (err) {
        console.error(err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async createProcess(processData) {
        this.loading = true
        try {
            const supabase = useSupabaseClient()
            const userId = processData.created_by
            if (!userId) throw new Error('User ID not found.')

            let imagePath = null
            let bucketId = null
            if (processData.imageFile) {
               const uploadRes = await this.uploadImage(processData.imageFile, 'kwh-start-images', 'temp') 
               if (uploadRes.success) {
                   imagePath = uploadRes.path
                   bucketId = uploadRes.bucket
               }
            }

            const payload = {
              created_by: userId, 
              start_datetime: processData.activity_date,
              kwh_start: processData.kwh_start || 0,
              kwh_start_img_path: imagePath,
              kwh_start_bucket_id: bucketId,
              input_amount_kg: 0, 
            }
            
            const { data, error } = await supabase.from('SB_Processing').insert([payload]).select().single()
            if (error) throw error
            
            await this.fetchProcesses()
            return { success: true, data }
        } catch(err) {
            this.error = err.message
            return { success: false, error: err.message }
        } finally {
            this.loading = false
        }
    },

    async uploadImage(file, bucketName, folderName) {
        try {
            const supabase = useSupabaseClient()
            const fileExt = file.name.split('.').pop()
            const randomName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`
            const filePath = folderName ? `${folderName}/${randomName}` : randomName

            const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, { upsert: false })
            if (error) throw error
            return { success: true, path: filePath, bucket: bucketName }
        } catch (err) { 
            console.error('Upload error:', err)
            return { success: false, error: err.message } 
        }
    },

    async completeProcess(id, data) {
         this.loading = true
         try {
            const supabase = useSupabaseClient()
            const updatePayload = {
              end_datetime: data.end_datetime,
              output_amount_kg: data.output_amount_kg,
              kwh_end: data.kwh_end,
              kwh_end_img_path: data.kwh_end_img_path,
              kwh_end_bucket_id: data.kwh_end_bucket_id,
              output_img_path: data.output_img_path,
              output_bucket_id: data.output_bucket_id
            }
            const { error } = await supabase.from('SB_Processing').update(updatePayload).eq('processing_id', id)
            if (error) throw error
            await this.fetchProcesses()
            return { success: true }
         } catch(err) { 
            return { success: false, error: err.message } 
         } finally { 
            this.loading = false 
         }
    },
    
    // PERBAIKAN: Fetch Materials Used dengan struktur yang benar
    async fetchMaterialsUsed(processingId) {
      try {
        const supabase = useSupabaseClient()
        
        console.log('🔍 Fetching materials for process:', processingId)
        
        const { data, error } = await supabase
          .from('SB_Material_Used')
          .select(`
            used_id,
            material_id,
            qty,
            SB_Material (
              material_name
            )
          `)
          .eq('processing_id', processingId)
        
        if (error) {
          console.error('❌ Fetch materials error:', error)
          throw error
        }
        
        console.log('✅ Materials fetched:', data)
        
        // Return dengan format yang sesuai untuk ManageMaterialsModal
        return (data || []).map(m => ({
            used_id: m.used_id,
            material_id: m.material_id,
            material_name: m.SB_Material?.material_name || 'Unknown',
            qty: parseFloat(m.qty) || 0
        }))
      } catch (err) {
        console.error('❌ Fetch materials error:', err)
        return []
      }
    },

    // PERBAIKAN: Save Materials dengan nama kolom yang benar
    async saveMaterialsUsed(processingId, materials) {
      this.loading = true
      try {
        const supabase = useSupabaseClient()

        console.log('💾 Saving materials for process:', processingId, materials)

        // 1. Hapus semua material lama untuk ID ini
        const { error: deleteError } = await supabase
          .from('SB_Material_Used')
          .delete()
          .eq('processing_id', processingId)
        
        if (deleteError) {
          console.error('❌ Delete error:', deleteError)
          throw deleteError
        }

        // 2. Insert data baru (jika ada)
        if (materials.length > 0) {
            const payload = materials.map(m => ({
                processing_id: processingId,
                material_id: m.material_id,
                qty: parseFloat(m.qty) // PERBAIKAN: Gunakan 'qty' bukan 'amount_kg'
            }))

            console.log('📝 Insert payload:', payload)

            const { error: insertError } = await supabase
              .from('SB_Material_Used')
              .insert(payload)
            
            if (insertError) {
              console.error('❌ Insert error:', insertError)
              throw insertError
            }
        }

        // 3. Hitung Total Berat
        const totalInput = materials.reduce((sum, m) => sum + (parseFloat(m.qty) || 0), 0)

        console.log('📊 Total input calculated:', totalInput)

        // 4. Update 'input_amount_kg' di tabel SB_Processing
        const { error: updateError } = await supabase
          .from('SB_Processing')
          .update({ input_amount_kg: totalInput })
          .eq('processing_id', processingId)

        if (updateError) {
          console.error('❌ Update error:', updateError)
          throw updateError
        }

        // 5. Refresh data di UI
        await this.fetchProcesses()
        
        console.log('✅ Materials saved successfully')
        return { success: true }
      } catch (err) {
        console.error('❌ Save materials error:', err)
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    calculateStatistics() {
        const today = new Date().toISOString().split('T')[0]
        this.statistics = {
            totalProcesses: this.processes.length,
            activeProcesses: this.processes.filter(p => p.status === 'in_progress').length,
            completedToday: this.processes.filter(p => p.status === 'completed' && p.completed_at?.split('T')[0] === today).length,
            totalOutput: this.processes.filter(p => p.status === 'completed').reduce((sum, p) => sum + (parseFloat(p.output_amount) || 0), 0)
        }
    }
  }
})