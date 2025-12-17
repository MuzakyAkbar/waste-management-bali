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
      
      <!-- Desktop Table View -->
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

                    <!-- Export PDF Button -->
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

              <!-- ✅ EXPANDED ROW WITH COMPLETE DATA -->
              <tr v-if="expandedRows.includes(process.id) && process.status === 'completed'" class="bg-gray-50/50">
                <td colspan="5" class="px-6 py-4">
                  <div class="bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-sm">
                    
                    <!-- KWh Details -->
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

                    <!-- Materials Used -->
                    <div v-if="process.materials && process.materials.length > 0" class="pb-6 border-b border-gray-200">
                      <h5 class="text-xs font-bold text-gray-700 uppercase mb-3">📦 Materials Used</h5>
                      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div v-for="material in process.materials" :key="material.material_id" class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p class="text-xs text-gray-500">{{ material.material_name }}</p>
                          <p class="text-sm font-bold text-gray-900">{{ material.qty }} kg</p>
                        </div>
                      </div>
                    </div>

                    <!-- Summary Stats -->
                    <div class="grid grid-cols-3 gap-6 pb-6 border-b border-gray-200">
                      <div>
                        <span class="text-xs text-gray-500 uppercase font-bold block mb-1">Total Input</span>
                        <p class="text-lg font-bold text-gray-900">{{ formatNumber(process.input_amount) }} kg</p>
                      </div>
                      <div>
                        <span class="text-xs text-gray-500 uppercase font-bold block mb-1">Total Output</span>
                        <p class="text-lg font-bold text-primary-600">{{ formatNumber(process.output_amount) }} kg</p>
                      </div>
                      <div>
                        <span class="text-xs text-gray-500 uppercase font-bold block mb-1">Efficiency</span>
                        <p class="text-lg font-bold text-green-600">{{ calculateEfficiency(process) }}%</p>
                      </div>
                    </div>

                    <!-- Images Section -->
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

                    <!-- Completion Time -->
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

      <!-- Mobile Card View (simplified for brevity) -->
      <div class="lg:hidden space-y-4 p-4">
        <!-- Same mobile view as before -->
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

const exportPDF = async (process) => {
  // ✅ Export to PDF menggunakan jsPDF
  try {
    // Dynamic import jsPDF
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()

    // Title
    doc.setFontSize(18)
    doc.text('Waste Processing Report', 20, 20)

    // Details
    doc.setFontSize(12)
    doc.text(`Date: ${formatDate(process.activity_date)}`, 20, 35)
    doc.text(`KWh Start: ${process.kwh_start} kWh`, 20, 45)
    doc.text(`KWh End: ${process.kwh_end} kWh`, 20, 55)
    doc.text(`KWh Used: ${(process.kwh_end - process.kwh_start).toFixed(1)} kWh`, 20, 65)
    doc.text(`Input: ${formatNumber(process.input_amount)} kg`, 20, 75)
    doc.text(`Output: ${formatNumber(process.output_amount)} kg`, 20, 85)
    doc.text(`Efficiency: ${calculateEfficiency(process)}%`, 20, 95)

    // Materials
    if (process.materials && process.materials.length > 0) {
      doc.text('Materials Used:', 20, 110)
      process.materials.forEach((mat, idx) => {
        doc.text(`  - ${mat.material_name}: ${mat.qty} kg`, 25, 120 + (idx * 10))
      })
    }

    // Save PDF
    doc.save(`waste-processing-${process.id}.pdf`)
  } catch (error) {
    console.error('Export PDF error:', error)
    alert('Failed to export PDF. Install jsPDF: npm install jspdf')
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

const calculateEfficiency = (process) => {
  if (!process.input_amount || !process.output_amount || process.input_amount == 0) return '0.0'
  return ((process.output_amount / process.input_amount) * 100).toFixed(1)
}
</script>