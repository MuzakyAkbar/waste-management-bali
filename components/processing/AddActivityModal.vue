<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="!loading && $emit('close')"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                New Processing Activity
              </h3>
              
              <div v-if="error" class="mt-3 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">{{ error }}</div>
              
              <div class="mt-6 space-y-5">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Process Name *
                  </label>
                  <input 
                    type="text" 
                    v-model="form.process_name" 
                    class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2.5 border" 
                    placeholder="e.g. Pengolahan Pagi - Batch 1"
                  />
                  <p class="mt-1 text-xs text-gray-500">Nama untuk identifikasi proses ini</p>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Created Date
                  </label>
                  <input 
                    type="date" 
                    :value="form.created_date" 
                    disabled
                    class="block w-full border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed sm:text-sm p-2.5 border" 
                  />
                  <p class="mt-1 text-xs text-gray-500">Tanggal otomatis diisi hari ini (tidak dapat diubah)</p>
                </div>
              </div>

              <div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                <div class="flex items-start gap-2">
                  <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-xs text-blue-800">
                    Setelah proses dibuat, Anda perlu mengisi KWh awal untuk memulai proses, lalu tambahkan material input.
                  </p>
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
            {{ loading ? 'Creating...' : 'Create Process' }}
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
import { useAuthStore } from '~/stores/useAuthStore'
import { useProcessingStore } from '~/stores/useProcessingStore'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'save'])
const authStore = useAuthStore()
const processingStore = useProcessingStore()

const loading = ref(false)
const error = ref(null)

// Helper: Ambil tanggal hari ini format YYYY-MM-DD (Local Time)
const getTodayDate = () => {
  return new Date().toLocaleDateString('en-CA')
}

const form = ref({
  process_name: '',
  created_date: getTodayDate()
})

// Reset form saat modal dibuka
watch(() => props.show, (newVal) => {
  if (newVal) {
    form.value = {
      process_name: '',
      created_date: getTodayDate()
    }
    error.value = null
    loading.value = false
  }
})

const handleSubmit = async () => {
  error.value = null
  
  if (!form.value.process_name) {
    return error.value = 'Mohon isi Nama Proses.'
  }

  loading.value = true

  try {
    let userId = null
    if (authStore.user) {
      userId = authStore.user.user_id || authStore.user.id
    } else {
      const storedUser = JSON.parse(localStorage.getItem('user'))
      if (storedUser) userId = storedUser.user_id || storedUser.id
    }
    
    if (!userId) throw new Error('Sesi Anda telah berakhir. Silakan login ulang.')

    // ✅ FIX: Format manual untuk created_at (tanpa timezone)
    const now = new Date()
    const created_at = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`

    const createData = {
      created_by: userId,
      process_name: form.value.process_name,
      created_at: created_at
    }

    console.log('💾 Creating process:', createData)
    
    const result = await processingStore.createProcess(createData)
    
    if (!result.success) {
      throw new Error(result.error || 'Gagal membuat proses')
    }

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