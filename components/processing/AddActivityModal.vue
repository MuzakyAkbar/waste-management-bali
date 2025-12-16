<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeModal"></div>

        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
            <!-- Header -->
            <div class="border-b border-gray-200 px-6 py-4">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold text-gray-900">Add New Activity</h3>
                <button
                  @click="closeModal"
                  class="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="px-6 py-6 space-y-6">
              <!-- Error Message -->
              <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-600">{{ error }}</p>
              </div>

              <!-- Location -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Lokasi *</label>
                <select
                  v-model="formData.location_id"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                >
                  <option value="">Pilih Lokasi</option>
                  <option v-for="loc in locationStore.locations" :key="loc.location_id" :value="loc.location_id">
                    {{ loc.location_name }}
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Start Date -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Tanggal Mulai *</label>
                  <input
                    v-model="formData.start_date"
                    type="date"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                </div>

                <!-- Start Time -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Jam Mulai *</label>
                  <input
                    v-model="formData.start_time"
                    type="time"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- KWH Start -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">KWH Awal *</label>
                  <input
                    v-model.number="formData.kwh_start"
                    type="number"
                    step="0.01"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="0.00"
                  />
                </div>

                <!-- Input Amount -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Jumlah Input (kg) *</label>
                  <input
                    v-model.number="formData.input_amount_kg"
                    type="number"
                    step="0.01"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <!-- KWH Start Image -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Foto KWH Awal *</label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary transition">
                  <input
                    ref="kwhStartImageInput"
                    type="file"
                    accept="image/*"
                    @change="handleKwhStartImage"
                    class="hidden"
                  />
                  <button
                    type="button"
                    @click="$refs.kwhStartImageInput.click()"
                    class="w-full flex flex-col items-center justify-center py-4 text-gray-600 hover:text-primary transition"
                  >
                    <svg v-if="!kwhStartImagePreview" class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <img v-else :src="kwhStartImagePreview" class="max-h-40 rounded-lg mb-2" />
                    <span class="text-sm font-medium">
                      {{ kwhStartImagePreview ? 'Change Image' : 'Upload Image' }}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
              <button
                @click="closeModal"
                type="button"
                class="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                @click="handleSubmit"
                :disabled="loading"
                class="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ loading ? 'Saving...' : 'Save Activity' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '~/stores/useAuthStore'
import { useProcessingStore } from '~/stores/useProcessingStore'
import { useLocationStore } from '~/stores/useMaterialStore'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'success'])

const authStore = useAuthStore()
const processingStore = useProcessingStore()
const locationStore = useLocationStore()

const loading = ref(false)
const error = ref(null)

const formData = ref({
  location_id: '',
  start_date: '',
  start_time: '',
  kwh_start: 0,
  input_amount_kg: 0,
})

const kwhStartImageFile = ref(null)
const kwhStartImagePreview = ref(null)

// Set default date and time
watch(() => props.show, (newVal) => {
  if (newVal) {
    const now = new Date()
    formData.value.start_date = now.toISOString().split('T')[0]
    formData.value.start_time = now.toTimeString().slice(0, 5)
  }
})

const handleKwhStartImage = (event) => {
  const file = event.target.files[0]
  if (file) {
    kwhStartImageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      kwhStartImagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = async () => {
  error.value = null

  if (!formData.value.location_id || !formData.value.start_date || !formData.value.start_time || !kwhStartImageFile.value) {
    error.value = 'Semua field wajib diisi'
    return
  }

  loading.value = true

  try {
    // Upload image first
    const uploadResult = await processingStore.uploadImage(kwhStartImageFile.value, 'kwh_start_images')
    
    if (!uploadResult.success) {
      throw new Error('Failed to upload image')
    }

    // Create processing record
    const startDatetime = `${formData.value.start_date}T${formData.value.start_time}:00`
    
    const processData = {
      created_by: authStore.userId,
      location_id: formData.value.location_id,
      start_datetime: startDatetime,
      kwh_start: formData.value.kwh_start,
      input_amount_kg: formData.value.input_amount_kg,
      kwh_start_img_path: uploadResult.path,
      kwh_start_bucket_id: uploadResult.bucket,
    }

    const result = await processingStore.createProcess(processData)

    if (result.success) {
      emit('success')
      resetForm()
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = err.message || 'Terjadi kesalahan'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    location_id: '',
    start_date: '',
    start_time: '',
    kwh_start: 0,
    input_amount_kg: 0,
  }
  kwhStartImageFile.value = null
  kwhStartImagePreview.value = null
  error.value = null
}

const closeModal = () => {
  if (!loading.value) {
    resetForm()
    emit('close')
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>