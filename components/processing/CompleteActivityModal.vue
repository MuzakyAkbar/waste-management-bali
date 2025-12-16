<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show && process" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeModal"></div>

        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl transform transition-all max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="border-b border-gray-200 px-6 py-4 sticky top-0 bg-white rounded-t-2xl">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-xl font-bold text-gray-900">Complete Activity</h3>
                  <p class="text-sm text-gray-600 mt-1">Processing ID: {{ process.processing_id.slice(0, 8) }}...</p>
                </div>
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

              <!-- Process Info -->
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">Info Proses Awal</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="text-gray-600">Tanggal Mulai:</p>
                    <p class="font-medium text-gray-900">{{ formatDate(process.start_datetime) }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">KWH Awal:</p>
                    <p class="font-semibold text-primary">{{ process.kwh_start }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Input Material:</p>
                    <p class="font-semibold text-primary">{{ process.input_amount_kg }} kg</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Lokasi:</p>
                    <p class="font-medium text-gray-900">{{ process.location?.location_name }}</p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- End Date -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Tanggal Selesai *</label>
                  <input
                    v-model="formData.end_date"
                    type="date"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                </div>

                <!-- End Time -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Jam Selesai *
                    <button
                      type="button"
                      @click="setNow"
                      class="ml-2 text-xs text-primary hover:underline"
                    >
                      (Now)
                    </button>
                  </label>
                  <input
                    v-model="formData.end_time"
                    type="time"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- KWH End -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">KWH Akhir *</label>
                  <input
                    v-model.number="formData.kwh_end"
                    type="number"
                    step="0.01"
                    required
                    @input="calculateKwhUsed"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="0.00"
                  />
                </div>

                <!-- KWH Used (auto calculated) -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">KWH Digunakan</label>
                  <input
                    :value="kwhUsed"
                    type="number"
                    readonly
                    class="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg text-accent font-semibold"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <!-- Output Amount -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Hasil Akhir (kg) *</label>
                <input
                  v-model.number="formData.output_amount_kg"
                  type="number"
                  step="0.01"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="0.00"
                />
              </div>

              <!-- KWH End Image -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Foto KWH Akhir *</label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary transition">
                  <input
                    ref="kwhEndImageInput"
                    type="file"
                    accept="image/*"
                    @change="handleKwhEndImage"
                    class="hidden"
                  />
                  <button
                    type="button"
                    @click="$refs.kwhEndImageInput.click()"
                    class="w-full flex flex-col items-center justify-center py-4 text-gray-600 hover:text-primary transition"
                  >
                    <svg v-if="!kwhEndImagePreview" class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <img v-else :src="kwhEndImagePreview" class="max-h-40 rounded-lg mb-2" />
                    <span class="text-sm font-medium">
                      {{ kwhEndImagePreview ? 'Change Image' : 'Upload Image' }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Output Image (Optional) -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Foto Hasil (Optional)</label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary transition">
                  <input
                    ref="outputImageInput"
                    type="file"
                    accept="image/*"
                    @change="handleOutputImage"
                    class="hidden"
                  />
                  <button
                    type="button"
                    @click="$refs.outputImageInput.click()"
                    class="w-full flex flex-col items-center justify-center py-4 text-gray-600 hover:text-primary transition"
                  >
                    <svg v-if="!outputImagePreview" class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <img v-else :src="outputImagePreview" class="max-h-40 rounded-lg mb-2" />
                    <span class="text-sm font-medium">
                      {{ outputImagePreview ? 'Change Image' : 'Upload Image' }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Materials Used -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <label class="block text-sm font-semibold text-gray-700">Material Digunakan</label>
                  <button
                    type="button"
                    @click="addMaterial"
                    class="text-sm text-primary hover:text-primary/80 font-medium flex items-center space-x-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Material</span>
                  </button>
                </div>

                <div v-if="materials.length === 0" class="text-sm text-gray-500 text-center py-4 border border-gray-200 rounded-lg">
                  Belum ada material. Klik "Add Material" untuk menambahkan.
                </div>

                <div v-else class="space-y-3">
                  <div
                    v-for="(material, index) in materials"
                    :key="index"
                    class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <select
                      v-model="material.material_id"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    >
                      <option value="">Pilih Material</option>
                      <option
                        v-for="mat in availableMaterials"
                        :key="mat.material_id"
                        :value="mat.material_id"
                      >
                        {{ mat.material_name }}
                      </option>
                    </select>
                    <input
                      v-model.number="material.qty"
                      type="number"
                      step="0.01"
                      placeholder="Qty (kg)"
                      class="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                    <button
                      type="button"
                      @click="removeMaterial(index)"
                      class="text-red-600 hover:text-red-700 transition"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3 sticky bottom-0 bg-white rounded-b-2xl">
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
                <span>{{ loading ? 'Saving...' : 'Complete Activity' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useProcessingStore } from '~/stores/useProcessingStore'
import { useMaterialStore } from '~/stores/useMaterialStore'

const props = defineProps({
  show: Boolean,
  process: Object
})

const emit = defineEmits(['close', 'success'])

const processingStore = useProcessingStore()
const materialStore = useMaterialStore()

const loading = ref(false)
const error = ref(null)

const formData = ref({
  end_date: '',
  end_time: '',
  kwh_end: 0,
  output_amount_kg: 0,
})

const materials = ref([])
const availableMaterials = ref([])

const kwhEndImageFile = ref(null)
const kwhEndImagePreview = ref(null)
const outputImageFile = ref(null)
const outputImagePreview = ref(null)

const kwhUsed = computed(() => {
  if (formData.value.kwh_end && props.process) {
    return (formData.value.kwh_end - props.process.kwh_start).toFixed(2)
  }
  return '0.00'
})

watch(() => props.show, async (newVal) => {
  if (newVal && props.process) {
    const now = new Date()
    formData.value.end_date = now.toISOString().split('T')[0]
    formData.value.end_time = now.toTimeString().slice(0, 5)
    
    // Fetch materials for this location
    await materialStore.fetchMaterials(props.process.location_id)
    availableMaterials.value = materialStore.materials
  }
})

const setNow = () => {
  const now = new Date()
  formData.value.end_date = now.toISOString().split('T')[0]
  formData.value.end_time = now.toTimeString().slice(0, 5)
}

const calculateKwhUsed = () => {
  // Computed property handles this
}

const handleKwhEndImage = (event) => {
  const file = event.target.files[0]
  if (file) {
    kwhEndImageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      kwhEndImagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleOutputImage = (event) => {
  const file = event.target.files[0]
  if (file) {
    outputImageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      outputImagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const addMaterial = () => {
  materials.value.push({
    material_id: '',
    qty: 0
  })
}

const removeMaterial = (index) => {
  materials.value.splice(index, 1)
}

const formatDate = (datetime) => {
  return new Date(datetime).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleSubmit = async () => {
  error.value = null

  if (!formData.value.end_date || !formData.value.end_time || !formData.value.kwh_end || !kwhEndImageFile.value) {
    error.value = 'Field wajib harus diisi'
    return
  }

  loading.value = true

  try {
    // Upload KWH End image
    const kwhEndUpload = await processingStore.uploadImage(kwhEndImageFile.value, 'kwh_end_images')
    if (!kwhEndUpload.success) {
      throw new Error('Failed to upload KWH end image')
    }

    // Upload Output image (optional)
    let outputUpload = null
    if (outputImageFile.value) {
      outputUpload = await processingStore.uploadImage(outputImageFile.value, 'output_images')
    }

    // Prepare completion data
    const endDatetime = `${formData.value.end_date}T${formData.value.end_time}:00`
    
    const completionData = {
      end_datetime: endDatetime,
      kwh_end: formData.value.kwh_end,
      kwh_used: parseFloat(kwhUsed.value),
      output_amount_kg: formData.value.output_amount_kg,
      kwh_end_img_path: kwhEndUpload.path,
      kwh_end_bucket_id: kwhEndUpload.bucket,
    }

    if (outputUpload) {
      completionData.output_img_path = outputUpload.path
      completionData.output_bucket_id = outputUpload.bucket
    }

    // Complete the process
    const result = await processingStore.completeProcess(props.process.processing_id, completionData)

    if (!result.success) {
      throw new Error(result.error)
    }

    // Add materials if any
    const validMaterials = materials.value.filter(m => m.material_id && m.qty > 0)
    if (validMaterials.length > 0) {
      await processingStore.addMaterialUsed(props.process.processing_id, validMaterials)
    }

    emit('success')
    resetForm()
  } catch (err) {
    error.value = err.message || 'Terjadi kesalahan'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    end_date: '',
    end_time: '',
    kwh_end: 0,
    output_amount_kg: 0,
  }
  materials.value = []
  kwhEndImageFile.value = null
  kwhEndImagePreview.value = null
  outputImageFile.value = null
  outputImagePreview.value = null
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