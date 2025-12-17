<template>
  <div class="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
    <div class="flex items-center justify-between mb-3">
      <h4 class="text-sm font-bold text-gray-700 uppercase flex items-center gap-2">
        <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-xs">{{ label }}</span>
      </h4>
      <span v-if="maxImages > 1" class="text-xs text-gray-500">
        {{ uploadedImages.length }}/{{ maxImages }} foto
      </span>
    </div>

    <!-- Preview Images -->
    <div v-if="uploadedImages.length > 0" class="mb-4 grid gap-3" :class="maxImages > 1 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'">
      <div 
        v-for="(image, index) in uploadedImages" 
        :key="index"
        class="relative group"
      >
        <div class="relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-gray-300 shadow-md bg-gray-100">
          <img
            :src="image.preview || image.url"
            alt="Preview Foto"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
            <button
              type="button"
              @click.stop="removeImage(index)"
              :disabled="isDeleting"
              class="opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              title="Hapus Gambar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <p v-if="maxImages > 1" class="text-xs text-gray-500 mt-1 text-center truncate">
          Foto {{ index + 1 }}
        </p>
      </div>
    </div>

    <!-- Upload Button -->
    <div v-if="uploadedImages.length < maxImages">
      <button
        type="button"
        @click="showSelectionModal = true"
        :disabled="isUploading"
        class="w-full bg-white hover:bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg border-2 border-gray-300 transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg v-if="isUploading" class="w-5 h-5 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-else class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ isUploading ? 'Mengunggah...' : 'Tambah Foto' }}
        </span>
      </button>
      <p v-if="maxImages > 1" class="text-xs text-gray-500 mt-2 text-center">
        Maks. {{ maxImages }} foto. Format: JPG, PNG (Max 5MB)
      </p>
    </div>
    <div v-else>
      <p class="text-sm text-gray-600 text-center py-3">
        ✓ Maksimal {{ maxImages }} foto telah tercapai
      </p>
    </div>

    <!-- Hidden File Inputs -->
    <input
      ref="galleryInput"
      type="file"
      @change="handleGalleryFileChange"
      accept="image/*"
      :multiple="maxImages > 1"
      class="hidden"
    />

    <input
      ref="cameraGalleryInput"
      type="file"
      @change="handleCameraGalleryFileChange"
      accept="image/*"
      :multiple="maxImages > 1"
      class="hidden"
    />

    <!-- Selection Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showSelectionModal"
          class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          @click.self="showSelectionModal = false"
        >
          <div class="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl transform transition-all scale-100">
            <div class="bg-gray-50 px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 class="text-lg font-bold text-gray-800">Upload Foto</h3>
              <button @click="showSelectionModal = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="p-5">
              <p class="text-sm text-gray-500 mb-6 text-center">
                Pilih metode pengambilan gambar untuk dokumentasi.
              </p>
              
              <div class="space-y-3">
                <button
                  type="button"
                  @click="openCustomCamera"
                  class="w-full group flex items-center justify-between px-4 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <div class="flex items-center gap-4">
                    <div class="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div class="text-left">
                      <span class="block font-bold text-base">Buka Kamera</span>
                      <span class="block text-xs text-emerald-100">Ambil foto langsung</span>
                    </div>
                  </div>
                  <svg class="w-5 h-5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button
                  type="button"
                  @click="triggerGallery"
                  class="w-full group flex items-center justify-between px-4 py-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl transition-all shadow-sm hover:border-emerald-300"
                >
                  <div class="flex items-center gap-4">
                     <div class="p-2 bg-gray-100 rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-600 transition">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div class="text-left">
                      <span class="block font-bold text-base">Pilih Galeri</span>
                      <span class="block text-xs text-gray-500">Ambil dari penyimpanan</span>
                    </div>
                  </div>
                  <svg class="w-5 h-5 text-gray-300 group-hover:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Camera Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showCameraModal"
          class="fixed inset-0 bg-black flex flex-col justify-between items-center z-[100] p-4"
        >
          <!-- Header -->
          <div class="w-full flex justify-between items-center p-4">
            <button 
              type="button" 
              @click="closeCamera" 
              class="text-white text-lg font-semibold hover:text-gray-300 transition"
            >
              Batal
            </button>
            <span class="text-white text-xs font-light opacity-70">Photo 3:4</span>
          </div>

          <!-- Camera View -->
          <div class="relative w-full aspect-[3/4] max-w-sm rounded-lg overflow-hidden flex items-center justify-center bg-gray-900 shadow-2xl border border-gray-800">
            <video 
              ref="videoElement" 
              autoplay 
              playsinline 
              :class="{ 'scale-x-[-1]': facingMode === 'user' }"
              class="w-full h-full object-cover"
            ></video>
            <canvas ref="canvasElement" class="hidden"></canvas>
            
            <!-- Grid Overlay -->
            <div class="absolute inset-0 grid grid-cols-3 pointer-events-none opacity-30">
              <div class="border-r border-white"></div>
              <div class="border-r border-white"></div>
              <div></div>
            </div>
            <div class="absolute inset-0 grid grid-rows-3 pointer-events-none opacity-30">
              <div class="border-b border-white"></div>
              <div class="border-b border-white"></div>
              <div></div>
            </div>
          </div>

          <!-- Camera Controls -->
          <div class="w-full max-w-md flex justify-around items-center py-6 bg-black bg-opacity-50 rounded-t-lg">
            <!-- Flash Button -->
            <div class="w-12 flex justify-center">
              <button 
                type="button"
                @click="toggleFlash" 
                :disabled="!hasFlash"
                class="p-3 rounded-full transition"
                :class="[
                  isFlashOn ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white',
                  !hasFlash ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-600'
                ]"
                title="Flash / Torch"
              >
                <svg v-if="isFlashOn" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
                </svg>
                <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10h-4l4-8H7v11h3v9l7-12z"/>
                </svg>
              </button>
            </div>
            
            <!-- Capture Button -->
            <button 
              type="button" 
              @click="takePhoto" 
              class="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-gray-300 transform active:scale-95 transition shadow-lg"
            >
              <div class="w-12 h-12 rounded-full bg-white"></div>
            </button>

            <!-- Switch Camera Button -->
            <div class="w-12 flex justify-center">
              <button 
                type="button" 
                @click="switchCamera" 
                class="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition shadow-lg"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            <!-- Gallery from Camera Button -->
            <button 
              type="button"
              @click="triggerCameraGallery"
              class="w-12 h-12 flex justify-center items-center bg-gray-700 bg-opacity-50 text-white rounded-full hover:bg-gray-600 transition"
              title="Pilih dari Galeri"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: 'Upload Foto'
  },
  maxImages: {
    type: Number,
    default: 1
  },
  existingImages: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['images-changed', 'upload-complete'])

// State
const showSelectionModal = ref(false)
const showCameraModal = ref(false)
const uploadedImages = ref([...props.existingImages])
const isUploading = ref(false)
const isDeleting = ref(false)

// Refs
const galleryInput = ref(null)
const cameraGalleryInput = ref(null)
const videoElement = ref(null)
const canvasElement = ref(null)

// Camera State
const mediaStream = ref(null)
const facingMode = ref('environment')
const hasFlash = ref(false)
const isFlashOn = ref(false)

watch(() => props.existingImages, (newImages) => {
  uploadedImages.value = [...newImages]
}, { deep: true })

// =============================
// MODAL FUNCTIONS
// =============================
const openCustomCamera = () => {
  showSelectionModal.value = false
  showCameraModal.value = true
  startCamera()
}

const triggerGallery = async () => {
  showSelectionModal.value = false
  await nextTick()
  if (galleryInput.value) {
    galleryInput.value.click()
  }
}

const triggerCameraGallery = async () => {
  await nextTick()
  if (cameraGalleryInput.value) {
    cameraGalleryInput.value.click()
  }
}

// =============================
// FILE HANDLING
// =============================
const handleGalleryFileChange = async (event) => {
  const files = Array.from(event.target.files || [])
  if (files.length === 0) return
  
  const remainingSlots = props.maxImages - uploadedImages.value.length
  const filesToUpload = files.slice(0, remainingSlots)
  
  if (files.length > remainingSlots) {
    alert(`⚠️ Hanya ${remainingSlots} foto yang akan diupload (maksimal ${props.maxImages} foto)`)
  }
  
  for (const file of filesToUpload) {
    if (file.size > 5 * 1024 * 1024) {
      alert(`⚠️ File ${file.name} melebihi batas 5MB dan akan dilewati`)
      continue
    }
    await processFile(file)
  }
  
  if (galleryInput.value) {
    galleryInput.value.value = null
  }
}

const handleCameraGalleryFileChange = async (event) => {
  const files = Array.from(event.target.files || [])
  if (files.length === 0) return

  stopCamera()
  
  const remainingSlots = props.maxImages - uploadedImages.value.length
  const filesToUpload = files.slice(0, remainingSlots)
  
  for (const file of filesToUpload) {
    if (file.size > 5 * 1024 * 1024) continue
    await processFile(file)
  }
  
  showCameraModal.value = false
  
  if (cameraGalleryInput.value) {
    cameraGalleryInput.value.value = null
  }
}

const processFile = async (file) => {
  if (uploadedImages.value.length >= props.maxImages) {
    return
  }

  isUploading.value = true
  
  try {
    const preview = URL.createObjectURL(file)
    
    const imageData = {
      file: file,
      preview: preview,
      name: file.name
    }
    
    uploadedImages.value.push(imageData)
    
    emit('images-changed', uploadedImages.value)
    emit('upload-complete', imageData)
    
  } catch (error) {
    console.error('Error processing file:', error)
    alert('Gagal memproses file')
  } finally {
    isUploading.value = false
  }
}

// =============================
// CAMERA FUNCTIONS
// =============================
const startCamera = async () => {
  if (mediaStream.value) {
    stopCamera()
  }
  
  try {
    hasFlash.value = false
    isFlashOn.value = false

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { 
        facingMode: facingMode.value,
        width: { ideal: 1280 }, 
        height: { ideal: 1720 }
      }
    })
    
    mediaStream.value = stream
    
    if (videoElement.value) {
      videoElement.value.srcObject = stream
    }

    const track = stream.getVideoTracks()[0]
    const capabilities = track.getCapabilities ? track.getCapabilities() : {}
    if (capabilities.torch) {
      hasFlash.value = true
    }

  } catch (err) {
    console.error('Gagal mengakses kamera:', err)
    alert('Gagal mengakses kamera. Pastikan izin kamera aktif.')
    closeCamera()
  }
}

const stopCamera = () => {
  if (mediaStream.value) {
    if (isFlashOn.value) {
      const track = mediaStream.value.getVideoTracks()[0]
      try {
        track.applyConstraints({ advanced: [{ torch: false }] })
      } catch(e) {}
    }

    mediaStream.value.getTracks().forEach((track) => track.stop())
    mediaStream.value = null
    
    if (videoElement.value) {
      videoElement.value.srcObject = null
    }
  }
}

const switchCamera = () => {
  facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment'
  startCamera()
}

const toggleFlash = async () => {
  if (!mediaStream.value) return
  const track = mediaStream.value.getVideoTracks()[0]
  try {
    await track.applyConstraints({
      advanced: [{ torch: !isFlashOn.value }]
    })
    isFlashOn.value = !isFlashOn.value
  } catch (err) {
    console.error('Error toggling flash:', err)
  }
}

const takePhoto = () => {
  if (videoElement.value && canvasElement.value) {
    const video = videoElement.value
    const canvas = canvasElement.value
    const context = canvas.getContext('2d')

    const targetRatio = 3 / 4
    const videoWidth = video.videoWidth
    const videoHeight = video.videoHeight
    const videoRatio = videoWidth / videoHeight

    let sourceWidth, sourceHeight, startX, startY

    if (videoRatio > targetRatio) {
      sourceHeight = videoHeight
      sourceWidth = sourceHeight * targetRatio
      startX = (videoWidth - sourceWidth) / 2
      startY = 0
    } else {
      sourceWidth = videoWidth
      sourceHeight = sourceWidth / targetRatio
      startX = 0
      startY = (videoHeight - sourceHeight) / 2
    }

    canvas.width = sourceWidth
    canvas.height = sourceHeight

    if (facingMode.value === 'user') {
      context.translate(sourceWidth, 0)
      context.scale(-1, 1)
    }

    context.drawImage(
      video,
      startX, startY, sourceWidth, sourceHeight,
      0, 0, sourceWidth, sourceHeight
    )

    canvas.toBlob(async (blob) => {
      if (blob) {
        const photoFile = new File([blob], `photo_${Date.now()}.png`, { type: 'image/png' })
        await processFile(photoFile)
        closeCamera()
      } else {
        alert('Gagal mengambil foto')
      }
    }, 'image/png')
  }
}

const closeCamera = () => {
  stopCamera()
  showCameraModal.value = false
}

// =============================
// DELETE IMAGE
// =============================
const removeImage = (index) => {
  if (confirm('Anda yakin ingin menghapus foto ini?')) {
    isDeleting.value = true
    
    const image = uploadedImages.value[index]
    if (image.preview) {
      URL.revokeObjectURL(image.preview)
    }
    
    uploadedImages.value.splice(index, 1)
    emit('images-changed', uploadedImages.value)
    
    isDeleting.value = false
  }
}

// =============================
// CLEANUP
// =============================
onBeforeUnmount(() => {
  stopCamera()
  uploadedImages.value.forEach(img => {
    if (img.preview) {
      URL.revokeObjectURL(img.preview)
    }
  })
})

// Expose methods if needed
defineExpose({
  getImages: () => uploadedImages.value,
  clearImages: () => {
    uploadedImages.value = []
    emit('images-changed', [])
  }
})
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>