<template>
  <div v-if="show && process" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="!loading && closeModal()"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg leading-6 font-bold text-gray-900">Selesaikan Aktivitas</h3>
              <p class="text-xs text-gray-500 mt-1">ID: {{ process.id }}</p>
            </div>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div class="px-4 py-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h4 class="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3">Data Awal (Referensi)</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div><p class="text-gray-500 text-xs">Waktu Mulai</p><p class="font-medium">{{ formatDate(process.activity_date) }}</p></div>
              <div><p class="text-gray-500 text-xs">KWh Awal</p><p class="font-bold">{{ process.kwh_start }}</p></div>
            </div>
          </div>

          <div v-if="error" class="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">{{ error }}</div>

          <hr class="border-gray-200" />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div class="sm:col-span-2 grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                <input type="date" v-model="form.end_date" class="block w-full border-gray-300 rounded-lg p-2.5 border">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
                <input type="time" v-model="form.end_time" class="block w-full border-gray-300 rounded-lg p-2.5 border">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">KWh Meter Akhir</label>
              <input type="number" step="0.1" v-model="form.kwh_end" class="block w-full border-gray-300 rounded-lg p-2.5 border" placeholder="0.0">
              <p class="mt-1 text-xs text-gray-500" v-if="kwhUsed >= 0">Pemakaian: <b>{{ kwhUsed }} kWh</b></p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Hasil Output (Qty kg)</label>
              <input type="number" step="0.01" v-model="form.output_amount" class="block w-full border-gray-300 rounded-lg p-2.5 border" placeholder="0.00">
            </div>
          </div>

          <div class="space-y-4">
            <!-- ✅ PERBAIKAN: Support multiple images -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Foto KWh Akhir (Max 3)</label>
              <ImageUpload 
                :max-images="3" 
                label="Foto Meteran Akhir" 
                @images-changed="(imgs) => handleImageChange('kwh', imgs)" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Foto Hasil Output (Max 3)</label>
              <ImageUpload 
                :max-images="3" 
                label="Foto Tumpukan/Hasil" 
                @images-changed="(imgs) => handleImageChange('output', imgs)" 
              />
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
          <button type="button" class="w-full inline-flex justify-center rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 sm:ml-3 sm:w-auto items-center" :disabled="loading" @click="handleSubmit">
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ loading ? 'Menyimpan...' : 'Selesaikan' }}
          </button>
          <button type="button" class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto" @click="closeModal" :disabled="loading">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useProcessingStore } from '~/stores/useProcessingStore'
import ImageUpload from '~/components/common/ImageUpload.vue'

const props = defineProps({ show: Boolean, process: Object })
const emit = defineEmits(['close', 'save'])
const processingStore = useProcessingStore()

const loading = ref(false)
const error = ref(null)
const form = ref({ end_date: '', end_time: '', kwh_end: '', output_amount: '' })

// ✅ PERBAIKAN: Support multiple files
const kwhEndFiles = ref([])
const outputFiles = ref([])

const kwhUsed = computed(() => {
  const start = parseFloat(props.process?.kwh_start || 0)
  const end = parseFloat(form.value.kwh_end || 0)
  return (end - start).toFixed(1)
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    const now = new Date()
    form.value.end_date = now.toISOString().split('T')[0]
    form.value.end_time = now.toTimeString().slice(0, 5)
    form.value.kwh_end = ''
    form.value.output_amount = ''
    kwhEndFiles.value = []
    outputFiles.value = []
    error.value = null
  }
})

// ✅ PERBAIKAN: Handle multiple images
const handleImageChange = (type, images) => {
  const files = images.map(img => img.file)
  if (type === 'kwh') {
    kwhEndFiles.value = files
  } else {
    outputFiles.value = files
  }
  console.log(`📸 ${type} images:`, files.length)
}

const formatDate = (dateString) => new Date(dateString).toLocaleString('id-ID')
const closeModal = () => emit('close')

const handleSubmit = async () => {
  error.value = null
  
  // Validation
  if (!form.value.kwh_end || !form.value.output_amount) {
    return error.value = 'Data wajib diisi.'
  }
  if (kwhEndFiles.value.length === 0 || outputFiles.value.length === 0) {
    return error.value = 'Upload minimal 1 foto untuk setiap kategori.'
  }
  
  loading.value = true

  try {
    // ✅ PERBAIKAN: Upload multiple images
    const kwhEndImagesArray = []
    for (const file of kwhEndFiles.value) {
      const uploadRes = await processingStore.uploadImage(
        file, 
        'kwh-end-images', 
        props.process.id
      )
      if (uploadRes.success) {
        kwhEndImagesArray.push({
          url: uploadRes.url,
          path: uploadRes.path,
          bucket: uploadRes.bucket
        })
      }
    }

    const outputImagesArray = []
    for (const file of outputFiles.value) {
      const uploadRes = await processingStore.uploadImage(
        file, 
        'output-images', 
        props.process.id
      )
      if (uploadRes.success) {
        outputImagesArray.push({
          url: uploadRes.url,
          path: uploadRes.path,
          bucket: uploadRes.bucket
        })
      }
    }

    if (kwhEndImagesArray.length === 0 || outputImagesArray.length === 0) {
      throw new Error('Gagal upload gambar')
    }

    console.log('✅ Uploaded images:', {
      kwh: kwhEndImagesArray.length,
      output: outputImagesArray.length
    })

    // ✅ PERBAIKAN: Simpan sebagai array
    const completionData = {
      end_datetime: `${form.value.end_date}T${form.value.end_time}:00`,
      kwh_end: parseFloat(form.value.kwh_end),
      output_amount_kg: parseFloat(form.value.output_amount),
      kwh_end_images: kwhEndImagesArray,
      output_images: outputImagesArray
    }

    const result = await processingStore.completeProcess(props.process.id, completionData)
    
    if (result.success) {
      emit('save')
      closeModal()
    } else {
      error.value = result.error
    }
  } catch (err) {
    console.error('❌ Complete error:', err)
    error.value = err.message || 'Error'
  } finally {
    loading.value = false
  }
}
</script>