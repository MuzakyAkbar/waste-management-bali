<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
    
    <div v-if="!loading && processes && processes.length > 0" class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
      <h3 class="font-bold text-gray-800 text-lg">Activity List</h3>
      <button
        @click="$emit('add-new')"
        class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm transition-all"
      >
        <svg class="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Activity
      </button>
    </div>

    <div v-if="loading" class="p-12 text-center flex-1 flex flex-col justify-center items-center">
      <svg class="animate-spin h-12 w-12 text-primary-600 mb-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600 font-medium">Memuat data...</p>
    </div>

    <div v-else-if="!processes || processes.length === 0" class="p-12 text-center flex-1 flex flex-col justify-center items-center">
      <div class="w-20 h-20 bg-gray-50 rounded-full mb-4 flex items-center justify-center">
        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Belum ada aktivitas</h3>
      <p class="text-gray-500 mb-6 max-w-sm mx-auto">Mulai dengan mencatat aktivitas pengolahan sampah baru.</p>
      <button
        @click="$emit('add-new')"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-all"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Buat Aktivitas Baru
      </button>
    </div>

    <div v-else class="flex-1 bg-gray-50/50">
      
      <div class="hidden lg:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Input (kg)</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Output (kg)</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-for="process in processes" :key="process.id">
              <tr class="hover:bg-gray-50 transition-colors group">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-gray-900">{{ formatDate(process.activity_date) }}</span>
                    <span class="text-xs text-gray-500">{{ formatTime(process.activity_date) }}</span>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ formatNumber(process.input_amount) }}</div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium" :class="process.status === 'completed' ? 'text-primary-600' : 'text-gray-400'">
                    {{ process.status === 'completed' ? formatNumber(process.output_amount) : '-' }}
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="process.status === 'in_progress'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    In Progress
                  </span>
                  <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      v-if="process.status === 'in_progress'"
                      @click="$emit('manage-materials', process.id)"
                      class="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition text-xs font-semibold"
                      title="Manage Materials"
                    >
                      + Materials
                    </button>

                    <button
                      v-if="process.status === 'in_progress'"
                      @click="$emit('complete', process)"
                      class="text-white bg-primary-600 hover:bg-primary-700 px-3 py-1.5 rounded-md transition text-xs font-semibold shadow-sm"
                    >
                      Complete
                    </button>
                    
                    <button
                      v-else
                      @click="toggleDetails(process.id)"
                      class="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition text-xs font-semibold"
                    >
                      {{ expandedRows.includes(process.id) ? 'Hide' : 'Details' }}
                    </button>

                    <button
                      v-if="process.status === 'completed'"
                      @click="exportPDF(process)"
                      class="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition text-xs font-semibold"
                      title="Export to PDF"
                    >
                      PDF
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="expandedRows.includes(process.id) && process.status === 'completed'" class="bg-gray-50/50">
                <td colspan="5" class="px-6 py-4">
                  <div class="bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-sm">
                    
                    <div class="grid grid-cols-3 gap-6 pb-6 border-b border-gray-200">
                      <div>
                        <span class="text-xs text-gray-500 uppercase font-bold block mb-1">⚡ KWh Start</span>
                        <p class="text-lg font-bold text-gray-900">{{ process.kwh_start }} kWh</p>
                      </div>
                      <div>
                        <span class="text-xs text-gray-500 uppercase font-bold block mb-1">⚡ KWh End</span>
                        <p class="text-lg font-bold text-gray-900">{{ process.kwh_end }} kWh</p>
                      </div>
                      <div>
                        <span class="text-xs text-gray-500 uppercase font-bold block mb-1">⚡ KWh Used</span>
                        <p class="text-lg font-bold text-primary-600">{{ (process.kwh_end - process.kwh_start).toFixed(1) }} kWh</p>
                      </div>
                    </div>

                    <div class="pb-6 border-b border-gray-200">
                      <h5 class="text-xs font-bold text-gray-700 uppercase mb-3">📦 Materials Used</h5>
                      
                      <div v-if="!getMaterials(process).length && loadingMaterials === process.id" class="text-sm text-gray-500 italic">
                        Memuat data material...
                      </div>

                      <div v-else-if="getMaterials(process).length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div v-for="(mat, idx) in getMaterials(process)" :key="idx" class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p class="text-xs text-gray-500">{{ mat.material_name }}</p>
                          <p class="text-sm font-bold text-gray-900">{{ mat.qty }} kg</p>
                        </div>
                      </div>

                      <div v-else class="text-sm text-gray-400 italic">
                        Tidak ada material yang tercatat.
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-6 pb-6 border-b border-gray-200">
                      <div>
                        <span class="text-xs text-gray-500 uppercase font-bold block mb-1">Total Input</span>
                        <p class="text-lg font-bold text-gray-900">{{ formatNumber(process.input_amount) }} kg</p>
                      </div>
                      <div>
                        <span class="text-xs text-gray-500 uppercase font-bold block mb-1">Total Output</span>
                        <p class="text-lg font-bold text-primary-600">{{ formatNumber(process.output_amount) }} kg</p>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <h5 class="text-xs font-bold text-gray-700 uppercase mb-2">📸 Foto KWh Start</h5>
                        <ImageGalleryViewer 
                          :images="process.kwh_start_images || []" 
                          label="KWh Start"
                          :columns="2"
                          empty-text="Tidak ada foto KWh awal"
                        />
                      </div>
                      <div>
                        <h5 class="text-xs font-bold text-gray-700 uppercase mb-2">📸 Foto KWh End</h5>
                        <ImageGalleryViewer 
                          :images="process.kwh_end_images || []" 
                          label="KWh End"
                          :columns="2"
                          empty-text="Tidak ada foto KWh akhir"
                        />
                      </div>
                      <div class="lg:col-span-2">
                        <h5 class="text-xs font-bold text-gray-700 uppercase mb-2">📸 Foto Output</h5>
                        <ImageGalleryViewer 
                          :images="process.output_images || []" 
                          label="Output"
                          :columns="3"
                          empty-text="Tidak ada foto output"
                        />
                      </div>
                    </div>

                    <div class="pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                      <div>
                        <span class="text-xs text-gray-500 uppercase font-bold">Start Time</span>
                        <p class="text-sm font-medium text-gray-900 mt-1">{{ formatDate(process.activity_date) }} {{ formatTime(process.activity_date) }}</p>
                      </div>
                      <div>
                        <span class="text-xs text-gray-500 uppercase font-bold">Completion Time</span>
                        <p class="text-sm font-medium text-gray-900 mt-1">{{ formatDate(process.completed_at) }} {{ formatTime(process.completed_at) }}</p>
                      </div>
                    </div>

                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="lg:hidden space-y-4 p-4">
        <div v-for="process in processes" :key="process.id" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          
          <div class="p-4 border-b border-gray-100">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-gray-500 uppercase">{{ formatDate(process.activity_date) }}</span>
              <span v-if="process.status === 'in_progress'" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                In Progress
              </span>
              <span v-else class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Completed
              </span>
            </div>
            <p class="text-xs text-gray-500">{{ formatTime(process.activity_date) }}</p>
          </div>

          <div class="p-4 space-y-3">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500 mb-1">Input</p>
                <p class="text-sm font-bold text-gray-900">{{ formatNumber(process.input_amount) }} kg</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Output</p>
                <p class="text-sm font-bold" :class="process.status === 'completed' ? 'text-primary-600' : 'text-gray-400'">
                  {{ process.status === 'completed' ? formatNumber(process.output_amount) + ' kg' : '-' }}
                </p>
              </div>
            </div>

            <div v-if="expandedRows.includes(process.id) && process.status === 'completed'" class="pt-3 border-t border-gray-100 space-y-3">
              
              <div class="grid grid-cols-3 gap-2 text-center bg-gray-50 rounded-lg p-3">
                <div>
                  <p class="text-xs text-gray-500 mb-1">KWh Start</p>
                  <p class="text-sm font-bold text-gray-900">{{ process.kwh_start }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">KWh End</p>
                  <p class="text-sm font-bold text-gray-900">{{ process.kwh_end }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Used</p>
                  <p class="text-sm font-bold text-primary-600">{{ (process.kwh_end - process.kwh_start).toFixed(1) }}</p>
                </div>
              </div>

              <div class="bg-blue-50 rounded-lg p-3">
                <p class="text-xs font-bold text-blue-800 mb-2">Materials Used</p>
                
                <div v-if="!getMaterials(process).length && loadingMaterials === process.id" class="text-xs text-gray-500 italic">
                  Memuat data...
                </div>
                
                <div v-else-if="getMaterials(process).length > 0" class="space-y-1">
                  <div v-for="(mat, idx) in getMaterials(process)" :key="idx" class="flex justify-between text-xs">
                    <span class="text-gray-700">{{ mat.material_name }}</span>
                    <span class="font-bold text-gray-900">{{ mat.qty }} kg</span>
                  </div>
                </div>

                <div v-else class="text-xs text-gray-400 italic">
                  Tidak ada material.
                </div>
              </div>

              <div class="space-y-2">
                <p class="text-xs font-bold text-gray-700">Photos</p>
                <ImageGalleryViewer :images="process.kwh_start_images || []" label="KWh Start" :columns="3" />
                <ImageGalleryViewer :images="process.kwh_end_images || []" label="KWh End" :columns="3" />
                <ImageGalleryViewer :images="process.output_images || []" label="Output" :columns="3" />
              </div>
              
              <div class="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100">
                <div>
                   <p class="text-gray-500 font-bold">Start</p>
                   <p>{{ formatDate(process.activity_date) }} {{ formatTime(process.activity_date) }}</p>
                </div>
                <div class="text-right">
                   <p class="text-gray-500 font-bold">End</p>
                   <p>{{ formatDate(process.completed_at) }} {{ formatTime(process.completed_at) }}</p>
                </div>
              </div>

            </div>
          </div>

          <div class="p-3 bg-gray-50 border-t border-gray-100 flex gap-2">
            <button
              v-if="process.status === 'in_progress'"
              @click="$emit('manage-materials', process.id)"
              class="flex-1 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md text-xs font-semibold transition"
            >
              + Materials
            </button>

            <button
              v-if="process.status === 'in_progress'"
              @click="$emit('complete', process)"
              class="flex-1 text-white bg-primary-600 hover:bg-primary-700 px-3 py-2 rounded-md text-xs font-semibold transition"
            >
              Complete
            </button>

            <button
              v-if="process.status === 'completed'"
              @click="toggleDetails(process.id)"
              class="flex-1 text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-xs font-semibold transition"
            >
              {{ expandedRows.includes(process.id) ? 'Hide' : 'Details' }}
            </button>

            <button
              v-if="process.status === 'completed'"
              @click="exportPDF(process)"
              class="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md text-xs font-semibold transition"
            >
              PDF
            </button>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ImageGalleryViewer from '~/components/common/ImageGalleryViewer.vue'
import { useProcessingStore } from '~/stores/useProcessingStore'

const props = defineProps({
  processes: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['complete', 'add-new', 'manage-materials'])

const processingStore = useProcessingStore()
const expandedRows = ref([])
const loadingMaterials = ref(null)

const toggleDetails = async (processId) => {
  const index = expandedRows.value.indexOf(processId)
  if (index > -1) {
    expandedRows.value.splice(index, 1)
  } else {
    expandedRows.value.push(processId)
    const process = props.processes.find(p => p.id === processId)
    const currentMaterials = getMaterials(process)
    if (process && (!currentMaterials || currentMaterials.length === 0)) {
       loadingMaterials.value = processId
       await processingStore.fetchMaterialsForProcess(processId)
       loadingMaterials.value = null
    }
  }
}

const getMaterials = (process) => {
  if (process.materials && Array.isArray(process.materials)) {
    return process.materials
  }
  if (process.SB_Material_Used && Array.isArray(process.SB_Material_Used)) {
    return process.SB_Material_Used.map(item => ({
      material_name: item.SB_Material?.material_name || item.material_name || 'Material Info Unavailable',
      qty: item.qty
    }))
  }
  return []
}

// ---------------------------------------------------------
// HELPER: Convert Image to Base64 (Wajib untuk PDF Images)
// ---------------------------------------------------------
const getBase64ImageFromURL = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.setAttribute('crossOrigin', 'anonymous') // KUNCI: Izin akses lintas domain
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      try {
        const dataURL = canvas.toDataURL('image/jpeg', 0.8)
        resolve(dataURL)
      } catch (e) {
        console.error('Canvas tainted (CORS issue):', e)
        resolve(null)
      }
    }
    
    img.onerror = (e) => {
      console.error('Image load error:', url)
      resolve(null)
    }

    img.src = url
  })
}

// ---------------------------------------------------------
// EXPORT PDF FUNCTION (Revised)
// ---------------------------------------------------------
const exportPDF = async (process) => {
  try {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    let yPos = 20

    // HEADER
    doc.setFontSize(20)
    doc.setFont(undefined, 'bold')
    doc.text('Laporan Pengolahan Sampah', 105, yPos, { align: 'center' })
    yPos += 10
    
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text(`ID Laporan: ${process.id}`, 105, yPos, { align: 'center' })
    yPos += 15
    
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.5)
    doc.line(20, yPos, 190, yPos)
    yPos += 10
    
    // 1. INFORMASI AKTIVITAS
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Informasi Aktivitas', 20, yPos)
    yPos += 8
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text(`Tanggal Mulai: ${formatDate(process.activity_date)} ${formatTime(process.activity_date)}`, 25, yPos)
    yPos += 6
    if (process.completed_at) {
      doc.text(`Tanggal Selesai: ${formatDate(process.completed_at)} ${formatTime(process.completed_at)}`, 25, yPos)
      yPos += 6
    }
    doc.text(`Status: ${process.status === 'completed' ? 'Selesai' : 'Dalam Proses'}`, 25, yPos)
    yPos += 12

    // 2. KONSUMSI ENERGI
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Konsumsi Energi', 20, yPos)
    yPos += 8
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text(`KWh Awal: ${process.kwh_start} kWh`, 25, yPos)
    yPos += 6
    if (process.kwh_end) {
      doc.text(`KWh Akhir: ${process.kwh_end} kWh`, 25, yPos)
      yPos += 6
      doc.setFont(undefined, 'bold')
      doc.text(`KWh Terpakai: ${(process.kwh_end - process.kwh_start).toFixed(1)} kWh`, 25, yPos)
      doc.setFont(undefined, 'normal')
      yPos += 12
    } else {
      yPos += 12
    }

    // 3. MATERIALS
    const materialsList = getMaterials(process)
    if (materialsList && materialsList.length > 0) {
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('Material Digunakan', 20, yPos)
      yPos += 8
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      materialsList.forEach((mat) => {
        doc.text(`- ${mat.material_name}: ${mat.qty} kg`, 25, yPos)
        yPos += 6
      })
      yPos += 6
    }

    // 4. RINGKASAN PRODUKSI
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Ringkasan Produksi', 20, yPos)
    yPos += 8
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text(`Total Input: ${formatNumber(process.input_amount)} kg`, 25, yPos)
    yPos += 6
    if (process.output_amount) {
      doc.text(`Total Output: ${formatNumber(process.output_amount)} kg`, 25, yPos)
      yPos += 12
    } else {
      yPos += 12
    }

    // 5. BUKTI FOTO (Implemented Logic)
    if (process.status === 'completed') {
      doc.addPage()
      yPos = 20
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('Bukti Foto', 105, yPos, { align: 'center' })
      yPos += 15

      // Helper lokal untuk menambah section gambar
      const addSectionImages = async (title, images) => {
        if (!images || images.length === 0) return

        if (yPos > 250) {
          doc.addPage()
          yPos = 20
        }

        doc.setFontSize(11)
        doc.setFont(undefined, 'bold')
        doc.text(title, 20, yPos)
        yPos += 10

        // Loop gambar (max 2 per baris)
        for (let i = 0; i < Math.min(images.length, 2); i++) {
          const imgUrl = images[i].url
          // Konversi ke Base64 menggunakan helper yang sudah dibuat
          const base64Img = await getBase64ImageFromURL(imgUrl)
          
          if (base64Img) {
            const xPos = 20 + (i * 85)
            doc.addImage(base64Img, 'JPEG', xPos, yPos, 80, 60)
          }
        }
        yPos += 70
      }

      await addSectionImages('Foto KWh Awal:', process.kwh_start_images)
      await addSectionImages('Foto KWh Akhir:', process.kwh_end_images)
      await addSectionImages('Foto Output:', process.output_images)
    }

    doc.setPage(1)
    doc.setFontSize(8)
    doc.setFont(undefined, 'italic')
    doc.text(`Dibuat pada: ${new Date().toLocaleString('id-ID')}`, 105, 285, { align: 'center' })

    doc.save(`Laporan_${process.id}.pdf`)
  } catch (error) {
    console.error('Export PDF error:', error)
    alert('Gagal mengekspor PDF: ' + error.message)
  }
}

const formatDate = (datetime) => {
  if (!datetime) return '-'
  return new Date(datetime).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatTime = (datetime) => {
  if (!datetime) return '-'
  return new Date(datetime).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatNumber = (num) => {
  if (num === undefined || num === null) return '0'
  return parseFloat(num).toFixed(2)
}
</script>