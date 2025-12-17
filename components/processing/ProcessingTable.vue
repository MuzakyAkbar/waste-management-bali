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

                    <div v-if="getMaterials(process).length > 0" class="pb-6 border-b border-gray-200">
                      <h5 class="text-xs font-bold text-gray-700 uppercase mb-3">📦 Materials Used</h5>
                      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div v-for="(mat, idx) in getMaterials(process)" :key="idx" class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p class="text-xs text-gray-500">{{ mat.material_name }}</p>
                          <p class="text-sm font-bold text-gray-900">{{ mat.qty }} kg</p>
                        </div>
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

                    <div class="pt-4 border-t border-gray-200">
                      <span class="text-xs text-gray-500 uppercase font-bold">Completion Time</span>
                      <p class="text-sm font-medium text-gray-900 mt-1">{{ formatDate(process.completed_at) }} {{ formatTime(process.completed_at) }}</p>
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

              <div v-if="getMaterials(process).length > 0" class="bg-blue-50 rounded-lg p-3">
                <p class="text-xs font-bold text-blue-800 mb-2">Materials</p>
                <div class="space-y-1">
                  <div v-for="(mat, idx) in getMaterials(process)" :key="idx" class="flex justify-between text-xs">
                    <span class="text-gray-700">{{ mat.material_name }}</span>
                    <span class="font-bold text-gray-900">{{ mat.qty }} kg</span>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <p class="text-xs font-bold text-gray-700">Photos</p>
                <ImageGalleryViewer :images="process.kwh_start_images || []" label="KWh Start" :columns="3" />
                <ImageGalleryViewer :images="process.kwh_end_images || []" label="KWh End" :columns="3" />
                <ImageGalleryViewer :images="process.output_images || []" label="Output" :columns="3" />
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

const expandedRows = ref([])

const toggleDetails = (processId) => {
  const index = expandedRows.value.indexOf(processId)
  if (index > -1) {
    expandedRows.value.splice(index, 1)
  } else {
    expandedRows.value.push(processId)
  }
}

// ✅ NEW HELPER: Handles both 'materials' (flat) and 'SB_Material_Used' (nested Supabase)
const getMaterials = (process) => {
  // If data is already flattened by Store
  if (process.materials && Array.isArray(process.materials)) {
    return process.materials
  }
  
  // If data is raw from Supabase Query (Nested)
  if (process.SB_Material_Used && Array.isArray(process.SB_Material_Used)) {
    return process.SB_Material_Used.map(item => ({
      // Handle both possible structures if material name is nested or joined
      material_name: item.SB_Material?.material_name || item.material_name || 'Material Info Unavailable',
      qty: item.qty
    }))
  }

  return []
}

const exportPDF = async (process) => {
  try {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()

    let yPos = 20

    // Header
    doc.setFontSize(20)
    doc.setFont(undefined, 'bold')
    doc.text('Laporan Pengolahan Sampah', 105, yPos, { align: 'center' })
    yPos += 10
    
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text(`ID Laporan: ${process.id}`, 105, yPos, { align: 'center' })
    yPos += 15

    // Box border
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.5)
    
    // Section 1: Date & Time
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

    // Section 2: KWh Details
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

    // Section 3: Materials (UPDATED to use helper)
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

    // Section 4: Input/Output
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

    // Section 5: Images
    if (process.status === 'completed') {
      const addImageToPDF = async (imageUrl, label, x, y, width, height) => {
        try {
          const response = await fetch(imageUrl)
          const blob = await response.blob()
          
          return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => {
              try {
                const base64 = reader.result
                doc.addImage(base64, 'JPEG', x, y, width, height)
                doc.setFontSize(8)
                doc.text(label, x, y + height + 4)
                resolve(true)
              } catch (err) {
                console.error('Error adding image:', err)
                resolve(false)
              }
            }
            reader.readAsDataURL(blob)
          })
        } catch (err) {
          console.error('Error loading image:', err)
          return false
        }
      }

      doc.addPage()
      yPos = 20
      
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('Bukti Foto', 105, yPos, { align: 'center' })
      yPos += 15

      // KWh Start Images
      if (process.kwh_start_images && process.kwh_start_images.length > 0) {
        doc.setFontSize(11)
        doc.setFont(undefined, 'bold')
        doc.text('Foto KWh Awal:', 20, yPos)
        yPos += 8
        
        for (let i = 0; i < Math.min(process.kwh_start_images.length, 2); i++) {
          const img = process.kwh_start_images[i]
          const xPos = 20 + (i * 85)
          await addImageToPDF(img.url, `Awal ${i + 1}`, xPos, yPos, 80, 60)
        }
        yPos += 70
      }

      // KWh End Images
      if (process.kwh_end_images && process.kwh_end_images.length > 0) {
        doc.setFontSize(11)
        doc.setFont(undefined, 'bold')
        doc.text('Foto KWh Akhir:', 20, yPos)
        yPos += 8
        
        for (let i = 0; i < Math.min(process.kwh_end_images.length, 2); i++) {
          const img = process.kwh_end_images[i]
          const xPos = 20 + (i * 85)
          await addImageToPDF(img.url, `Akhir ${i + 1}`, xPos, yPos, 80, 60)
        }
        yPos += 70
      }

      // Output Images
      if (process.output_images && process.output_images.length > 0) {
        if (yPos > 200) {
          doc.addPage()
          yPos = 20
        }
        
        doc.setFontSize(11)
        doc.setFont(undefined, 'bold')
        doc.text('Foto Output:', 20, yPos)
        yPos += 8
        
        for (let i = 0; i < Math.min(process.output_images.length, 2); i++) {
          const img = process.output_images[i]
          const xPos = 20 + (i * 85)
          await addImageToPDF(img.url, `Output ${i + 1}`, xPos, yPos, 80, 60)
        }
      }
    }

    doc.setPage(1)
    doc.setFontSize(8)
    doc.setFont(undefined, 'italic')
    doc.text(`Dibuat pada: ${new Date().toLocaleString('id-ID')}`, 105, 285, { align: 'center' })

    doc.save(`laporan-pengolahan-sampah-${process.id}.pdf`)
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