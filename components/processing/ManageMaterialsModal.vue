<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="!loading && closeModal()"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
        
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100">
          <div class="sm:flex sm:items-start justify-between">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                Kelola Material Input
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                Tambahkan material dan foto bukti penimbangan.
              </p>
            </div>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-500" :disabled="loading">
              <span class="sr-only">Close</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
          
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 flex items-start gap-2">
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>
            <span>{{ errorMessage }}</span>
          </div>

          <div v-if="loadingData" class="py-12 text-center">
            <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-sm text-gray-500">Memuat data...</p>
          </div>

          <div v-else class="space-y-5">
            
            <div class="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100 pb-4">
              <div class="text-sm text-gray-600">
                Total item: <span class="font-bold">{{ rows.length }}</span>
              </div>
              <button 
                type="button" 
                @click="addRow" 
                class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none shadow-sm"
                :disabled="loading"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tambah Material
              </button>
            </div>

            <div class="hidden md:block border rounded-lg overflow-hidden shadow-sm">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-12">#</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-64">Material</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-24">Ember</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[150px]">Foto Bukti</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Berat (Kg)</th>
                    <th class="px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(row, index) in rows" :key="index">
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 align-top pt-6">{{ index + 1 }}</td>
                    <td class="px-4 py-4 whitespace-nowrap align-top">
                      <select v-model="row.material_id" class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option value="">-- Pilih Material --</option>
                        <option v-for="mat in availableMaterials" :key="mat.material_id" :value="mat.material_id">{{ mat.material_name }}</option>
                      </select>
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap align-top">
                      <input type="number" min="1" v-model.number="row.container_number" class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center">
                    </td>
                    <td class="px-4 py-4 align-top">
                      <ImageUpload 
                        :key="`image-${index}`"
                        :max-images="1" 
                        label="Foto Bukti"
                        @images-changed="(images) => handleImageChange(index, images)" 
                      />
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap align-top">
                      <div class="relative">
                        <input type="number" step="0.01" v-model.number="row.qty" class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="0.00">
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span class="text-gray-500 sm:text-xs">kg</span>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium align-top pt-6">
                      <button @click="removeRow(index)" class="text-red-600 hover:text-red-900" :disabled="rows.length === 1">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                   <tr>
                    <td colspan="4" class="px-4 py-3 text-right text-sm font-bold text-gray-700">Total Berat:</td>
                    <td class="px-4 py-3 text-left text-sm font-bold text-blue-700">{{ totalWeight }} kg</td>
                    <td></td>
                   </tr>
                </tfoot>
              </table>
            </div>

            <div class="md:hidden space-y-4">
              <div v-for="(row, index) in rows" :key="index" class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                 <div class="flex justify-between items-center mb-3">
                    <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">#{{ index + 1 }}</span>
                    <button @click="removeRow(index)" class="text-red-500" :disabled="rows.length === 1">
                       <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                 </div>
                 <div class="space-y-3">
                    <div>
                      <label class="block text-xs font-bold text-gray-700 mb-1">Material</label>
                      <select v-model="row.material_id" class="block w-full border-gray-300 rounded-lg text-sm">
                        <option value="">-- Pilih Material --</option>
                        <option v-for="mat in availableMaterials" :key="mat.material_id" :value="mat.material_id">{{ mat.material_name }}</option>
                      </select>
                    </div>
                    <div class="flex gap-3">
                       <div class="w-1/3">
                          <label class="block text-xs font-bold text-gray-700 mb-1">Ember</label>
                          <input type="number" v-model.number="row.container_number" class="block w-full border-gray-300 rounded-lg text-center text-sm">
                       </div>
                       <div class="w-2/3">
                          <label class="block text-xs font-bold text-gray-700 mb-1">Berat (Kg)</label>
                          <input type="number" step="0.01" v-model.number="row.qty" class="block w-full border-gray-300 rounded-lg text-sm">
                       </div>
                    </div>
                    <div>
                       <label class="block text-xs font-bold text-gray-700 mb-1">Foto Bukti</label>
                       <ImageUpload 
                        :key="`mobile-image-${index}`"
                        :max-images="1" 
                        label="Foto Bukti"
                        @images-changed="(images) => handleImageChange(index, images)" 
                      />
                    </div>
                 </div>
              </div>
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center">
                 <span class="font-bold text-gray-700">Total Input:</span>
                 <span class="font-bold text-blue-700 text-lg">{{ totalWeight }} Kg</span>
              </div>
            </div>

          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
          <button 
            type="button" 
            class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed items-center" 
            :disabled="loading || loadingData" 
            @click="handleSubmit"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
          <button 
            type="button" 
            class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" 
            @click="closeModal" 
            :disabled="loading"
          >
            Batal
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useProcessingStore } from '~/stores/useProcessingStore'
import ImageUpload from '~/components/common/ImageUpload.vue'

const props = defineProps({
  show: Boolean,
  processId: String
})

const emit = defineEmits(['close', 'save'])
const processingStore = useProcessingStore()
const supabase = useSupabaseClient()

// State
const loading = ref(false)
const loadingData = ref(false)
const errorMessage = ref(null)
const rows = ref([])
const availableMaterials = ref([])

// Computed
const totalWeight = computed(() => {
  return rows.value.reduce((sum, row) => sum + (parseFloat(row.qty) || 0), 0).toFixed(2)
})

// Watcher
watch(() => props.show, async (newVal) => {
  if (newVal) {
    if (props.processId) {
      if (process.client) document.body.style.overflow = 'hidden'
      await loadData()
    }
  } else {
    if (process.client) document.body.style.overflow = ''
    resetForm()
  }
})

const resetForm = () => {
  rows.value = []
  errorMessage.value = null
  loading.value = false
}

const loadData = async () => {
  loadingData.value = true
  errorMessage.value = null
  
  try {
    // 1. Load Master Material
    const { data: materials, error: matError } = await supabase
      .from('SB_Material')
      .select('material_id, material_name')
      .order('material_name')
    
    if (matError) throw matError
    availableMaterials.value = materials || []

    // 2. Load Existing Data
    const { data: usedData, error: usedError } = await supabase
      .from('SB_Material_Used')
      .select('material_id, container_number, qty, material_images')
      .eq('processing_id', props.processId)
      .order('container_number', { ascending: true })

    if (usedError) throw usedError

    if (usedData && usedData.length > 0) {
      rows.value = usedData.map(item => {
        const images = item.material_images || []
        return {
          material_id: item.material_id,
          container_number: item.container_number,
          qty: item.qty,
          material_images: images,
          material_files: [] // Files untuk new uploads
        }
      })
    } else {
      addRow()
    }

    console.log('✅ Data loaded')

  } catch (error) {
    console.error('❌ Load Error:', error)
    errorMessage.value = 'Gagal memuat data: ' + error.message
  } finally {
    loadingData.value = false
  }
}

const addRow = () => {
  const maxContainer = rows.value.length > 0 
    ? Math.max(...rows.value.map(r => r.container_number || 0)) 
    : 0
  
  rows.value.push({
    material_id: '',
    container_number: maxContainer + 1,
    qty: 0,
    material_images: [],
    material_files: []
  })
}

const removeRow = (index) => {
  if (rows.value.length > 1) {
    rows.value.splice(index, 1)
  }
}

const closeModal = () => {
  emit('close')
}

// Handle image change dari ImageUpload component
const handleImageChange = (rowIndex, images) => {
  console.log(`📸 Row ${rowIndex} images changed:`, images.length)
  const files = images.map(img => img.file).filter(f => f)
  rows.value[rowIndex].material_files = files
}

const handleSubmit = async () => {
  errorMessage.value = null
  
  // Validation
  const validRows = rows.value.filter(r => r.material_id && r.qty > 0)
  if (validRows.length === 0) {
    errorMessage.value = "Harap isi minimal satu material dengan berat yang valid."
    return
  }

  loading.value = true

  try {
    console.log('📝 Starting submit...')

    // 1. Delete existing
    const { error: deleteError } = await supabase
      .from('SB_Material_Used')
      .delete()
      .eq('processing_id', props.processId)
    
    if (deleteError) throw deleteError
    console.log('✅ Existing data deleted')

    // 2. Upload images dan prepare payload
    const payload = []

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i]
      let imagesToSave = [...row.material_images] // Existing images

      // Upload new files jika ada
      if (row.material_files && row.material_files.length > 0) {
        for (const file of row.material_files) {
          try {
            const bucket = 'material_input_images'
            const ext = file.name.split('.').pop() || 'jpg'
            const timestamp = Date.now()
            const path = `${props.processId}/${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`

            console.log('📤 Uploading:', path)

            // Upload file
            const { error } = await supabase.storage
              .from(bucket)
              .upload(path, file, { upsert: false })
            
            if (error) throw error

            // Get public URL
            const { data } = supabase.storage
              .from(bucket)
              .getPublicUrl(path)

            imagesToSave.push({
              name: file.name,
              path: path,
              url: data.publicUrl,
              size: file.size,
              type: file.type
            })

            console.log('✅ Image uploaded:', path)
          } catch (err) {
            console.error('❌ Upload error:', err)
            throw err
          }
        }
      }

      payload.push({
        processing_id: props.processId,
        material_id: row.material_id,
        container_number: row.container_number,
        qty: parseFloat(row.qty),
        material_images: imagesToSave
      })
    }

    console.log('💾 Payload ready:', payload.length, 'rows')

    // 3. Insert new data
    const { error: insertError } = await supabase
      .from('SB_Material_Used')
      .insert(payload)

    if (insertError) throw insertError
    console.log('✅ Data inserted')

    // 4. Update total
    const totalInput = validRows.reduce((sum, r) => sum + parseFloat(r.qty), 0)
    
    const { error: updateError } = await supabase
      .from('SB_Processing')
      .update({ input_amount_kg: totalInput })
      .eq('processing_id', props.processId)

    if (updateError) throw updateError
    console.log('✅ Total updated:', totalInput)

    await processingStore.updateProcessInputAmount(props.processId, totalInput)
    
    console.log('✅ Material input saved successfully')

    emit('save', { 
      processId: props.processId, 
      totalInput: totalInput 
    })
    closeModal()

  } catch (error) {
    console.error('❌ Save Error:', error)
    errorMessage.value = 'Gagal menyimpan: ' + error.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Optional: custom scrollbar if needed */
</style>