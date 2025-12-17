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
        const config = useRuntimeConfig()
        const baseUrl = config.public.supabaseUrl

        console.log('📥 Fetching processes...')

        const { data, error } = await supabase
          .from('SB_Processing')
          .select('*')
          .order('start_datetime', { ascending: false })

        if (error) throw error

        console.log('✅ Fetched processes:', data?.length || 0)

        // ✅ Map processes and fetch materials
        this.processes = await Promise.all((data || []).map(async (item) => {
          console.log('🔍 Process item:', {
            id: item.processing_id,
            kwh_start_images: item.kwh_start_images,
            kwh_end_images: item.kwh_end_images,
            output_images: item.output_images
          })

          // ✅ Fetch materials untuk setiap process
          const materials = await this.fetchMaterialsUsed(item.processing_id)

          return {
            id: item.processing_id,
            activity_date: item.start_datetime,
            completed_at: item.end_datetime,
            input_amount: item.input_amount_kg,
            output_amount: item.output_amount_kg,
            kwh_start: item.kwh_start,
            kwh_end: item.kwh_end,
            kwh_used: item.kwh_used,
            kwh_start_images: this.parseImages(item.kwh_start_images, baseUrl),
            kwh_end_images: this.parseImages(item.kwh_end_images, baseUrl),
            output_images: this.parseImages(item.output_images, baseUrl),
            materials: materials, // ✅ Tambahkan materials
            status: item.end_datetime ? 'completed' : 'in_progress',
            notes: '-' 
          }
        }))
        
        this.calculateStatistics()
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
      if (!imagesData) {
        console.log('⚠️ No images data')
        return []
      }
      
      try {
        let parsed = imagesData
        
        // Jika string, parse dulu
        if (typeof imagesData === 'string') {
          parsed = JSON.parse(imagesData)
        }
        
        // Jika bukan array, return kosong
        if (!Array.isArray(parsed)) {
          console.warn('⚠️ Images data is not an array:', typeof parsed)
          return []
        }

        // Map dan ensure URL ada
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

    async createProcess(processData) {
        this.loading = true
        
        try {
            const supabase = useSupabaseClient()
            const userId = processData.created_by
            
            console.log('🆕 Creating process with user:', userId)
            
            if (!userId) {
              throw new Error('User ID not found')
            }

            // ✅ PERBAIKAN: Upload image terlebih dahulu dengan ID temporary
            let kwhStartImages = []
            
            if (processData.imageFile) {
              console.log('📤 Uploading image:', processData.imageFile.name)
              
              // Upload dengan folder 'temp' dulu, nanti rename setelah dapat processing_id
              const uploadRes = await this.uploadImage(
                processData.imageFile, 
                'kwh-start-images', 
                'temp' // Folder temporary
              )
              
              console.log('📤 Upload result:', uploadRes)
              
              if (uploadRes.success) {
                kwhStartImages = [{
                  url: uploadRes.url,
                  path: uploadRes.path,
                  bucket: uploadRes.bucket
                }]
                console.log('✅ Image uploaded:', kwhStartImages)
              } else {
                throw new Error('Failed to upload image: ' + uploadRes.error)
              }
            }

            console.log('💾 Saving to database...')

            const payload = {
              created_by: userId, 
              start_datetime: processData.activity_date,
              kwh_start: processData.kwh_start || 0,
              kwh_start_images: kwhStartImages, // ✅ Array of objects
              input_amount_kg: 0, 
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
            
            await this.fetchProcesses()
            return { success: true, data }
            
        } catch(err) {
            console.error('❌ Create process error:', err)
            this.error = err.message
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

            // ✅ Generate public URL
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
            console.error('  - Error details:', {
              message: err.message,
              statusCode: err.statusCode,
              error: err.error
            })
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
            
            await this.fetchProcesses()
            return { success: true }
         } catch(err) { 
            console.error('❌ Complete process error:', err)
            return { success: false, error: err.message } 
         } finally { 
            this.loading = false 
         }
    },
    
    async fetchMaterialsUsed(processingId) {
      try {
        const supabase = useSupabaseClient()
        
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
        
        if (error) throw error
        
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

        await this.fetchProcesses()
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