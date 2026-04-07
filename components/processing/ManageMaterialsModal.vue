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
                Tambahkan material, deskripsi tekstur, dan foto bukti.
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
             <span>{{ errorMessage }}</span>
          </div>

          <div v-if="loadingData" class="py-12 text-center">
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
                Tambah Material
              </button>
            </div>

            <div class="hidden md:block border rounded-lg overflow-hidden shadow-sm">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-12">#</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-48">Material</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-20">Ember</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tekstur / Deskripsi</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[120px]">Foto Bukti</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Berat (Kg)</th>
                    <th class="px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(row, index) in rows" :key="row._id">
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
                      <input type="text" v-model="row.container_content" placeholder="Cth: Kasar, Basah" class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </td>
                    <td class="px-4 py-4 align-top">
                      <button 
                        @click="openUploadSelector(index)"
                        class="w-[80px] h-[80px] flex-shrink-0 rounded-lg border flex items-center justify-center transition overflow-hidden shadow-sm hover:shadow-md"
                        :class="row.imageUrl ? 'border-green-300 bg-white ring-2 ring-green-100' : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:text-blue-500 text-gray-400'"
                        title="Upload Bukti Foto"
                      >
                        <img v-if="row.imageUrl" :src="row.imageUrl" class="w-full h-full object-cover">
                        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </button>
                      <p v-if="row.imageUrl" class="text-xs text-green-600 mt-1">✓ Foto tersimpan</p>
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
                    <td colspan="5" class="px-4 py-3 text-right text-sm font-bold text-gray-700">Total Berat:</td>
                    <td class="px-4 py-3 text-left text-sm font-bold text-blue-700">{{ totalWeight }} kg</td>
                    <td></td>
                   </tr>
                </tfoot>
              </table>
            </div>

            <div class="md:hidden space-y-4">
              <div v-for="(row, index) in rows" :key="row._id" class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
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
                    <div>
                      <label class="block text-xs font-bold text-gray-700 mb-1">Tekstur / Deskripsi</label>
                      <input type="text" v-model="row.container_content" placeholder="Contoh: Kasar, Basah" class="block w-full border-gray-300 rounded-lg text-sm">
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
                       <button 
                        @click="openUploadSelector(index)"
                        class="w-full h-[100px] rounded-lg border flex items-center justify-center transition overflow-hidden shadow-sm hover:shadow-md"
                        :class="row.imageUrl ? 'border-green-300 bg-white ring-2 ring-green-100' : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:text-blue-500 text-gray-400'"
                       >
                        <img v-if="row.imageUrl" :src="row.imageUrl" class="w-full h-full object-cover">
                        <div v-else class="text-center">
                          <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          <p class="text-xs mt-1">Upload Foto</p>
                        </div>
                       </button>
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
    
    <div v-if="showSelectionModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" @click.self="showSelectionModal = false">
      <div class="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl relative animate-fade-in">
        <button @click="showSelectionModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">✕</button>
        <h3 class="font-bold text-gray-900 mb-6 text-center text-lg">Upload Bukti Foto</h3>
        
        <div class="space-y-3">
          <button @click="openCamera" class="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Ambil Foto (Kamera)
          </button>
          <button @click="triggerFileInput" class="w-full flex items-center justify-center gap-3 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-200 border border-gray-200 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Pilih dari Galeri
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="showCameraModal" class="fixed inset-0 bg-black z-[70] flex flex-col">
       <div class="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-30">
        <button @click="closeCameraModal" class="text-white bg-black/50 px-4 py-2 rounded-full backdrop-blur font-medium text-sm shadow-lg">Batal</button>
        <button @click="switchCamera" class="text-white bg-black/50 p-2 rounded-full backdrop-blur shadow-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>
      <div class="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
        <div class="relative w-full max-w-[100vh] mx-auto" style="aspect-ratio: 3/4;">
          <video ref="videoElement" autoplay playsinline class="absolute inset-0 w-full h-full object-cover"></video>
        </div>
        <canvas ref="canvasElement" class="hidden"></canvas>
      </div>
      <div class="absolute bottom-0 left-0 right-0 p-8 flex justify-center bg-gradient-to-t from-black/80 to-transparent items-center gap-8 z-30">
        <button @click="takePhoto" class="w-20 h-20 rounded-full border-4 border-white bg-white/20 hover:bg-white/40 transition flex items-center justify-center shadow-lg">
          <div class="w-16 h-16 bg-white rounded-full"></div>
        </button>
      </div>
    </div>

    <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onFileSelected">

    <div v-if="isUploading" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center text-white font-bold flex-col gap-3">
      <div class="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full"></div>
      <p>Mengunggah Foto...</p>
    </div>

  </div>
</template>
<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { useProcessingStore } from '~/stores/useProcessingStore'

const props = defineProps({
  show: Boolean,
  processId: String
})

const emit = defineEmits(['close', 'save'])
const processingStore = useProcessingStore()
const supabase = useSupabaseClient()
const config = useRuntimeConfig()

// State
const loading = ref(false)
const loadingData = ref(false)
const errorMessage = ref(null)
const rows = ref([])
const availableMaterials = ref([])
const rowIdCounter = ref(0)

// Upload states
const showSelectionModal = ref(false)
const showCameraModal = ref(false)
const isUploading = ref(false)
const activeRowIndex = ref(null)
const fileInput = ref(null)

// Camera states
const videoElement = ref(null)
const canvasElement = ref(null)
const mediaStream = ref(null)
const facingMode = ref('environment')

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
    stopCamera()
    resetForm()
  }
})

const resetForm = () => {
  rows.value = []
  availableMaterials.value = []
  errorMessage.value = null
  loading.value = false
  loadingData.value = false
  rowIdCounter.value = 0
  showSelectionModal.value = false
  showCameraModal.value = false
  activeRowIndex.value = null
}

const loadData = async () => {
  loadingData.value = true
  errorMessage.value = null
  
  try {
    console.log('📥 Loading data for process:', props.processId)

    // 1. Load Master Material
    const { data: materials, error: matError } = await supabase
      .from('SB_Material')
      .select('material_id, material_name')
      .order('material_name')
    
    if (matError) throw matError
    availableMaterials.value = materials || []

    // 2. Load Existing Data
    // PERUBAHAN: Menambahkan 'container_content' ke dalam select
    const { data: usedData, error: usedError } = await supabase
      .from('SB_Material_Used')
      .select('material_id, container_number, qty, material_images, container_content')
      .eq('processing_id', props.processId)
      .order('container_number', { ascending: true })

    if (usedError) throw usedError

    if (usedData && usedData.length > 0) {
      rows.value = usedData.map(item => {
        let imageUrl = null
        let imagePath = null
        
        if (item.material_images) {
          try {
            const parsedImages = typeof item.material_images === 'string' 
              ? JSON.parse(item.material_images) 
              : item.material_images
            
            if (Array.isArray(parsedImages) && parsedImages.length > 0) {
              imageUrl = parsedImages[0].url
              imagePath = parsedImages[0].path
            }
          } catch (e) {
            console.error('❌ Error parsing material_images:', e)
          }
        }

        rowIdCounter.value++
        return {
          _id: rowIdCounter.value,
          material_id: item.material_id,
          container_number: item.container_number,
          qty: parseFloat(item.qty) || 0,
          container_content: item.container_content || '', // Load content dari DB
          imageUrl: imageUrl,
          imagePath: imagePath,
          newImageFile: null
        }
      })
    } else {
      addRow()
    }

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
  
  rowIdCounter.value++
  const newRow = {
    _id: rowIdCounter.value,
    material_id: '',
    container_number: maxContainer + 1,
    qty: 0,
    container_content: '', // Init field baru
    imageUrl: null,
    imagePath: null,
    newImageFile: null
  }
  
  rows.value.push(newRow)
}

const removeRow = (index) => {
  if (rows.value.length > 1) {
    rows.value.splice(index, 1)
  }
}

const closeModal = () => {
  stopCamera()
  emit('close')
}

// === UPLOAD LOGIC ===
const openUploadSelector = (rowIndex) => {
  console.log('📸 Opening upload selector for row:', rowIndex)
  activeRowIndex.value = rowIndex
  showSelectionModal.value = true
}

const triggerFileInput = () => {
  console.log('📁 Triggering file input')
  showSelectionModal.value = false
  fileInput.value.click()
}

const onFileSelected = async (e) => {
  if (e.target.files.length > 0) {
    console.log('📄 File selected:', e.target.files[0].name)
    await handleFileUpload(e.target.files[0])
  }
  // Reset file input
  e.target.value = ''
}

const handleFileUpload = async (file) => {
  if (!file || activeRowIndex.value === null) {
    console.log('❌ No file or no active row')
    return
  }
  
  console.log('📤 Starting file upload for row:', activeRowIndex.value)
  console.log('   File:', file.name, file.size, 'bytes')
  
  isUploading.value = true
  showSelectionModal.value = false
  showCameraModal.value = false

  try {
    const row = rows.value[activeRowIndex.value]
    const bucket = 'material_input_images'
    const ext = file.name.split('.').pop() || 'jpg'
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    
    // Generate used_id placeholder for folder structure
    const tempUsedId = `${timestamp}-${random}`
    // Format: processing_id-used_id/filename
    const filePath = `${props.processId}-${tempUsedId}/${timestamp}-${random}.${ext}`

    console.log('   📤 Uploading to path:', filePath)

    // Delete old image if exists
    if (row.imagePath) {
      try {
        console.log('   🗑️ Deleting old image:', row.imagePath)
        await supabase.storage.from(bucket).remove([row.imagePath])
      } catch (e) {
        console.log('   ⚠️ Could not remove old file:', e)
      }
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { 
        cacheControl: '3600',
        upsert: false,
        contentType: file.type 
      })
    
    if (uploadError) {
      console.error('   ❌ Upload error:', uploadError)
      throw new Error(uploadError.message || 'Upload gagal')
    }

    console.log('   ✅ Upload success:', uploadData)

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
    
    row.imageUrl = data.publicUrl
    row.imagePath = filePath
    row.newImageFile = file

    console.log('   ✅ Image URL set:', row.imageUrl)
    alert('✅ Foto berhasil diupload!')

  } catch (err) {
    console.error('❌ Upload error:', err)
    alert("❌ Gagal upload: " + err.message)
  } finally {
    isUploading.value = false
    activeRowIndex.value = null
  }
}

// === CAMERA LOGIC ===
const openCamera = async () => {
  console.log('📷 Opening camera')
  showSelectionModal.value = false
  showCameraModal.value = true
  await nextTick()
  startCamera()
}

const startCamera = async () => {
  if (mediaStream.value) stopCamera()
  
  try {
    console.log('📷 Starting camera with facingMode:', facingMode.value)
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: facingMode.value, 
        width: { ideal: 1280 }, 
        height: { ideal: 720 } 
      } 
    })
    mediaStream.value = stream
    if (videoElement.value) {
      videoElement.value.srcObject = stream
    }
    console.log('✅ Camera started')
  } catch (err) {
    console.error('❌ Camera error:', err)
    alert("Gagal akses kamera: " + err.message)
    showCameraModal.value = false
  }
}

const stopCamera = () => {
  if (mediaStream.value) {
    console.log('📷 Stopping camera')
    mediaStream.value.getTracks().forEach(t => t.stop())
    mediaStream.value = null
  }
}

const switchCamera = () => {
  console.log('🔄 Switching camera')
  facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment'
  startCamera()
}

const closeCameraModal = () => {
  console.log('❌ Closing camera modal')
  showCameraModal.value = false
  stopCamera()
}

const takePhoto = () => {
  console.log('📸 Taking photo')
  const video = videoElement.value
  const canvas = canvasElement.value
  if (!video || !canvas) {
    console.error('❌ Video or canvas not found')
    return
  }

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  
  if (facingMode.value === 'user') {
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
  }
  
  ctx.drawImage(video, 0, 0)
  
  canvas.toBlob(blob => {
    const file = new File([blob], `cam_${Date.now()}.jpg`, { type: 'image/jpeg' })
    console.log('✅ Photo captured:', file.name)
    handleFileUpload(file)
  }, 'image/jpeg', 0.8)
}

onBeforeUnmount(() => {
  stopCamera()
})

// === SUBMIT ===
const handleSubmit = async () => {
  errorMessage.value = null
  const validRows = rows.value.filter(r => r.material_id && r.qty > 0)
  
  if (validRows.length === 0) {
    errorMessage.value = "Harap isi minimal satu material dengan berat yang valid."
    return
  }

  loading.value = true

  try {
    const { error: deleteError } = await supabase
      .from('SB_Material_Used')
      .delete()
      .eq('processing_id', props.processId)
    
    if (deleteError) throw deleteError

    const payload = []

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i]
      let materialImages = []
      
      if (row.imageUrl && row.imagePath) {
        materialImages.push({
          name: row.imagePath.split('/').pop(),
          path: row.imagePath,
          url: row.imageUrl,
          size: row.newImageFile ? row.newImageFile.size : 0,
          type: row.newImageFile ? row.newImageFile.type : 'image/jpeg'
        })
      }

      payload.push({
        processing_id: props.processId,
        material_id: row.material_id,
        container_number: row.container_number,
        qty: parseFloat(row.qty),
        container_content: row.container_content || null, // PERUBAHAN: Simpan ke DB
        material_images: materialImages
      })
    }

    const { error: insertError } = await supabase
      .from('SB_Material_Used')
      .insert(payload)

    if (insertError) throw insertError

    const totalInput = validRows.reduce((sum, r) => sum + parseFloat(r.qty), 0)
    
    const { error: updateError } = await supabase
      .from('SB_Processing')
      .update({ input_amount_kg: totalInput })
      .eq('processing_id', props.processId)

    if (updateError) throw updateError

    await processingStore.updateProcessInputAmount(props.processId, totalInput)
    
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
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
</style>