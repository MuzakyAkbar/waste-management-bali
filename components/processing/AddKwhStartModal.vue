<template>
  <div v-if="show && process" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="!loading && $emit('close')"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                Input KWh Awal
              </h3>
              <p class="text-xs text-gray-500 mt-1">{{ process.process_name }}</p>
              
              <div v-if="error" class="mt-3 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">{{ error }}</div>
              
              <div class="mt-6 space-y-5">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input 
                      type="date" 
                      v-model="form.start_date" 
                      class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2.5 border" 
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Start Time *
                    </label>
                    <input 
                      type="time" 
                      v-model="form.start_time" 
                      class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2.5 border" 
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    KWh Meter Start Reading *
                  </label>
                  <input 
                    type="number" 
                    step="0.1" 
                    v-model="form.kwh_start" 
                    class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2.5 border" 
                    placeholder="0.0" 
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Meter Photo (Start) *
                  </label>
                  <ImageUpload 
                    :max-images="1" 
                    label="Upload Foto KWh Awal" 
                    @images-changed="handleImageChanged" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button" 
            class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed items-center" 
            :disabled="loading" 
            @click="handleSubmit"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Saving...' : 'Save KWh Start' }}
          </button>
          <button 
            type="button" 
            class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" 
            @click="$emit('close')" 
            :disabled="loading"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useProcessingStore } from '~/stores/useProcessingStore'
import ImageUpload from '~/components/common/ImageUpload.vue'

const props = defineProps({
  show: Boolean,
  process: Object
})

const emit = defineEmits(['close', 'save'])
const processingStore = useProcessingStore()

const loading = ref(false)
const error = ref(null)
const imageFile = ref(null)

const form = ref({
  start_date: '',
  start_time: '',
  kwh_start: ''
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    const now = new Date()
    form.value = {
      start_date: now.toISOString().split('T')[0],
      start_time: now.toTimeString().slice(0, 5),
      kwh_start: ''
    }
    imageFile.value = null
    error.value = null
    loading.value = false
    
    console.log('📝 KWh Start form reset')
  }
})

const handleImageChanged = (images) => {
  if (images && images.length > 0) {
    imageFile.value = images[0].file 
    error.value = null
  } else {
    imageFile.value = null
  }
  console.log('📸 Start image:', imageFile.value?.name)
}

const handleSubmit = async () => {
  error.value = null
  
  // Validation
  if (!form.value.start_date || !form.value.start_time) {
    return error.value = 'Mohon isi tanggal dan waktu mulai.'
  }
  if (!form.value.kwh_start || parseFloat(form.value.kwh_start) < 0) {
    return error.value = 'Mohon isi nilai KWh Start yang valid.'
  }
  if (!imageFile.value) {
    return error.value = 'Upload minimal 1 foto meteran awal.'
  }

  loading.value = true

  try {
    const start_datetime = `${form.value.start_date}T${form.value.start_time}:00`
    
    const kwhData = {
      start_datetime: start_datetime,
      kwh_start: parseFloat(form.value.kwh_start),
      imageFile: imageFile.value
    }

    console.log('💾 Saving KWh start:', kwhData)
    
    const result = await processingStore.addKwhStart(props.process.id, kwhData)
    
    if (!result.success) {
      throw new Error(result.error || 'Gagal menyimpan KWh awal')
    }

    console.log('✅ KWh start saved successfully')

    emit('save')
    emit('close')

  } catch (err) {
    console.error('❌ Error:', err)
    error.value = err.message || 'Terjadi kesalahan'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>