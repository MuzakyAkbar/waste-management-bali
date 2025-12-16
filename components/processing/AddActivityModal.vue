<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
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
              
              <div class="mt-6 space-y-5">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Start Date & Time</label>
                  <input type="datetime-local" v-model="form.activity_date" class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2.5 border" />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Electricity Meter (Start KWh)</label>
                  <input type="number" step="0.1" v-model="form.kwh_start" class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2.5 border" placeholder="0.0" />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Activity / Meter Photo (Start)</label>
                  <ImageUpload :max-images="1" label="Upload Foto KWh Awal" @images-changed="handleImageChanged" />
                  <p v-if="uploadError" class="mt-1 text-xs text-red-600">{{ uploadError }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed items-center" :disabled="loading" @click="handleSubmit">
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Saving...' : 'Create Activity' }}
          </button>
          <button type="button" class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" @click="$emit('close')" :disabled="loading">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/useAuthStore'
import ImageUpload from '~/components/common/ImageUpload.vue'

const emit = defineEmits(['close', 'save'])
const authStore = useAuthStore()

const loading = ref(false)
const selectedFile = ref(null)
const uploadError = ref(null)

const form = ref({
  activity_date: new Date().toISOString().slice(0, 16),
  kwh_start: ''
})

const handleImageChanged = (images) => {
  if (images && images.length > 0) {
    selectedFile.value = images[0].file 
    uploadError.value = null
  } else {
    selectedFile.value = null
  }
}

const handleSubmit = async () => {
  // 1. Validasi Gambar
  if (!selectedFile.value) {
    uploadError.value = 'Mohon upload foto bukti aktivitas/meteran.'
    return
  }

  loading.value = true
  
  // 2. AMBIL USER ID DENGAN AMAN
  // Cek berbagai kemungkinan struktur object user dari Supabase/Pinia
  let userId = null
  
  if (authStore.user) {
    // Jika user adalah object, cek properti id atau user_id
    userId = authStore.user.id || authStore.user.user_id 
  } else {
    // Jika user null, coba cek local storage sebagai fallback terakhir
    // (Hanya jika Anda menyimpan user di localStorage)
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'))
      if (storedUser) userId = storedUser.id || storedUser.user_id
    } catch (e) {
      console.error('Failed to parse user from storage', e)
    }
  }
  
  // 3. Validasi User ID
  if (!userId) {
    alert('Sesi Anda telah berakhir atau data user tidak ditemukan. Silakan login ulang.')
    loading.value = false
    return // Stop di sini, jangan lanjut kirim event
  }

  // 4. Kirim Data
  emit('save', {
    activity_date: new Date(form.value.activity_date).toISOString(),
    kwh_start: parseFloat(form.value.kwh_start) || 0,
    imageFile: selectedFile.value,
    created_by: userId // Pastikan ini string UUID yang valid
  })
  
  // Safety timeout
  setTimeout(() => { loading.value = false }, 5000) 
}
</script>