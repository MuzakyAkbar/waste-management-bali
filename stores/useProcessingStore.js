// stores/useProcessingStore.js
import { defineStore } from 'pinia'

export const useProcessingStore = defineStore('processing', {
  state: () => ({
    processes: [],
    loading: false,
    error: null,
    statistics: {
      totalProcesses: 0,
      activeProcesses: 0,
      totalCompleted: 0,
      totalOutput: 0,
    },
    lastFetch: null,
  }),

  getters: {
    // Get process status with more states
    getProcessStatus: (state) => (processId) => {
      const process = state.processes.find(p => p.id === processId)
      if (!process) return 'unknown'
      
      if (process.end_datetime) return 'completed'
      if (process.start_datetime && process.kwh_start) return 'in_progress'
      if (process.process_name) return 'created'
      return 'unknown'
    }
  },

  actions: {
    async fetchProcesses(force = false) {
      if (force) {
        console.log('🔄 Force refresh - clearing cache')
        this.lastFetch = null
      }
      
      if (this.loading && !force) {
        console.log('⚠️ Already fetching, skipping...')
        return { success: true, data: this.processes }
      }

      const now = Date.now()
      if (!force && this.lastFetch && (now - this.lastFetch) < 5000) {
        console.log('⚡ Using cached data')
        return { success: true, data: this.processes }
      }

      this.loading = true
      this.error = null
      
      try {
        const supabase = useSupabaseClient()
        const config = useRuntimeConfig()
        const baseUrl = config.public.supabaseUrl

        console.log('🔥 Fetching processes...')

        const { data, error } = await supabase
          .from('SB_Processing')
          .select('*')
          .order('created_by', { ascending: false })

        if (error) throw error

        console.log('✅ Fetched processes:', data?.length || 0)

        this.processes = (data || []).map((item) => {
          // Determine status based on data completeness
          let status = 'created'
          if (item.end_datetime) {
            status = 'completed'
          } else if (item.start_datetime && item.kwh_start) {
            status = 'in_progress'
          }

          return {
            id: item.processing_id,
            process_name: item.process_name || 'Unnamed Process',
            created_at: item.created_at,
            activity_date: item.start_datetime,
            completed_at: item.end_datetime,
            input_amount: item.input_amount_kg || 0,
            output_amount: item.output_amount_kg,
            kwh_start: item.kwh_start || 0,
            kwh_end: item.kwh_end,
            kwh_used: item.kwh_used,
            kwh_start_images: this.parseImages(item.kwh_start_images, baseUrl),
            kwh_end_images: this.parseImages(item.kwh_end_images, baseUrl),
            output_images: this.parseImages(item.output_images, baseUrl),
            material_input_images: this.parseImages(item.material_input_images, baseUrl),
            bucket_name: item.bucket_name,
            materials: [],
            status: status,
            notes: '-'
          }
        })
        
        this.calculateStatistics()
        this.lastFetch = Date.now()
        
        return { success: true, data: this.processes }
      } catch (err) {
        console.error('❌ Fetch processes error:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    parseImages(imagesData, baseUrl) {
      if (!imagesData) return []
      
      try {
        let parsed = imagesData
        
        if (typeof imagesData === 'string') {
          parsed = JSON.parse(imagesData)
        }
        
        if (!Array.isArray(parsed)) {
          console.warn('⚠️ Images data is not an array:', typeof parsed)
          return []
        }

        return parsed.map(img => ({
          url: img.url || `${baseUrl}/storage/v1/object/public/${img.bucket}/${img.path}`,
          path: img.path,
          bucket: img.bucket
        }))
      } catch (err) {
        console.error('❌ Parse images error:', err)
        return []
      }
    },

    // ✅ NEW: Create process (step 1 - hanya nama dan tanggal)
    async createProcess(processData) {
      this.loading = true
      
      try {
        const supabase = useSupabaseClient()
        const userId = processData.created_by
        
        console.log('🆕 Creating process with user:', userId)
        
        if (!userId) {
          throw new Error('User ID not found')
        }

        const payload = {
          created_by: userId,
          process_name: processData.process_name,
          created_at: processData.created_at || new Date().toISOString(),
        }
        
        console.log('📦 Payload:', JSON.stringify(payload, null, 2))
        
        const { data, error } = await supabase
          .from('SB_Processing')
          .insert([payload])
          .select()
          .single()
          
        if (error) {
          console.error('❌ Insert error:', error)
          throw error
        }
        
        console.log('✅ Process created:', data)
        
        await this.fetchProcesses(true)
        return { success: true, data }
        
      } catch (err) {
        console.error('❌ Create process error:', err)
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    // ✅ NEW: Add KWh Start (step 2 - input kwh awal + foto + set start_datetime)
    async addKwhStart(processingId, kwhData) {
      this.loading = true
      
      try {
        const supabase = useSupabaseClient()
        
        console.log('⚡ Adding KWh start for process:', processingId)
        
        let kwhStartImages = []
        
        if (kwhData.imageFile) {
          console.log('📤 Uploading image:', kwhData.imageFile.name)
          
          const uploadRes = await this.uploadImage(
            kwhData.imageFile, 
            'kwh-start-images', 
            processingId
          )
          
          if (uploadRes.success) {
            kwhStartImages = [{
              url: uploadRes.url,
              path: uploadRes.path,
              bucket: uploadRes.bucket
            }]
          } else {
            throw new Error('Failed to upload image: ' + uploadRes.error)
          }
        }

        const updatePayload = {
          start_datetime: kwhData.start_datetime || new Date().toISOString(),
          kwh_start: parseFloat(kwhData.kwh_start) || 0,
          kwh_start_images: kwhStartImages
        }
        
        console.log('💾 Update payload:', JSON.stringify(updatePayload, null, 2))
        
        const { error } = await supabase
          .from('SB_Processing')
          .update(updatePayload)
          .eq('processing_id', processingId)
          
        if (error) {
          console.error('❌ Update error:', error)
          throw error
        }
        
        console.log('✅ KWh start added')
        
        await this.fetchProcesses(true)
        return { success: true }
        
      } catch (err) {
        console.error('❌ Add KWh start error:', err)
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

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

    async completeProcess(id, data) {
      this.loading = true
      try {
        const supabase = useSupabaseClient()
        
        console.log('✅ Completing process:', id)
        console.log('📦 Data:', data)
        
        const updatePayload = {
          end_datetime: data.end_datetime,
          output_amount_kg: data.output_amount_kg,
          kwh_end: data.kwh_end,
          kwh_end_images: data.kwh_end_images || [],
          output_images: data.output_images || []
        }

        console.log('💾 Update payload:', JSON.stringify(updatePayload, null, 2))

        const { error } = await supabase
          .from('SB_Processing')
          .update(updatePayload)
          .eq('processing_id', id)
          
        if (error) {
          console.error('❌ Update error:', error)
          throw error
        }
        
        console.log('✅ Process completed successfully')
        
        await this.fetchProcesses(true)
        return { success: true }
      } catch(err) { 
        console.error('❌ Complete process error:', err)
        return { success: false, error: err.message } 
      } finally { 
        this.loading = false 
      }
    },
    
    async fetchMaterialsForProcess(processingId) {
      try {
        const supabase = useSupabaseClient()
        
        console.log('🔍 Fetching materials for process:', processingId)
        
        const { data, error } = await supabase
          .from('SB_Material_Used')
          .select(`
            used_id,
            material_id,
            container_number,
            container_content,
            qty,
            SB_Material (
              material_name
            )
          `)
          .eq('processing_id', processingId)
          .order('container_number', { ascending: true })
        
        if (error) throw error
        
        const materials = (data || []).map(m => ({
          used_id: m.used_id,
          material_id: m.material_id,
          material_name: m.SB_Material?.material_name || 'Unknown',
          container_number: m.container_number,
          container_content: m.container_content || '',
          qty: parseFloat(m.qty) || 0
        }))

        const processIndex = this.processes.findIndex(p => p.id === processingId)
        if (processIndex !== -1) {
          this.processes[processIndex].materials = materials
        }

        return materials
      } catch (err) {
        console.error('❌ Fetch materials error:', err)
        return []
      }
    },

    async saveMaterialsUsed(processingId, materials) {
      this.loading = true
      try {
        const supabase = useSupabaseClient()

        const { error: deleteError } = await supabase
          .from('SB_Material_Used')
          .delete()
          .eq('processing_id', processingId)
        
        if (deleteError) throw deleteError

        if (materials.length > 0) {
          const payload = materials.map(m => ({
            processing_id: processingId,
            material_id: m.material_id,
            container_number: m.container_number,
            container_content: m.container_content || '',
            qty: parseFloat(m.qty)
          }))

          const { error: insertError } = await supabase
            .from('SB_Material_Used')
            .insert(payload)
          
          if (insertError) throw insertError
        }

        const totalInput = materials.reduce((sum, m) => 
          sum + (parseFloat(m.qty) || 0), 0
        )

        const { error: updateError } = await supabase
          .from('SB_Processing')
          .update({ input_amount_kg: totalInput })
          .eq('processing_id', processingId)

        if (updateError) throw updateError

        await this.fetchProcesses(true)
        return { success: true }
      } catch (err) {
        console.error('❌ Save materials error:', err)
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async updateProcessInputAmount(processingId, inputAmount) {
      try {
        const processIndex = this.processes.findIndex(p => p.id === processingId)
        
        if (processIndex !== -1) {
          console.log(`🔄 Updating process ${processingId} input amount: ${this.processes[processIndex].input_amount} → ${inputAmount}`)
          
          this.processes[processIndex].input_amount = inputAmount
          
          console.log('✅ Process updated in store')
          
          this.calculateStatistics()
          
          return true
        } else {
          console.warn('⚠️ Process not found in store, will fetch all')
          await this.fetchProcesses(true)
          return true
        }
      } catch (err) {
        console.error('❌ Update process error:', err)
        return false
      }
    },

    calculateStatistics() {
      this.statistics = {
        totalProcesses: this.processes.length,
        activeProcesses: this.processes.filter(p => 
          p.status === 'in_progress' || p.status === 'created'
        ).length,
        totalCompleted: this.processes.filter(p => p.status === 'completed').length,
        totalOutput: this.processes
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + (parseFloat(p.output_amount) || 0), 0)
      }
    }
  }
})