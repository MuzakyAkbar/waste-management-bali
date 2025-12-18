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
      <!-- Desktop View -->
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

                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ formatNumber(process.input_amount) }}
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

                    <div v-if="process.status === 'completed'" class="flex gap-1">
                      <button
                        @click="exportPDF(process)"
                        class="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition text-xs font-semibold"
                      >
                        PDF
                      </button>
                      <button
                        @click="exportExcel(process)"
                        class="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-md transition text-xs font-semibold"
                      >
                        Excel
                      </button>
                    </div>
                  </div>
                </td>
              </tr>

              <tr v-if="expandedRows.includes(process.id) && process.status === 'completed'" class="bg-gray-50/50">
                <td colspan="5" class="px-6 py-8">
                  <div class="bg-white border-2 border-gray-300 rounded-lg p-8 shadow-md max-w-6xl mx-auto">
                    
                    <div class="mb-8 pb-4 border-b-4 border-gray-800">
                      <div class="flex justify-between items-end">
                        <div>
                          <h4 class="text-2xl font-black text-gray-900 uppercase tracking-tighter">Laporan Pengolahan Sampah</h4>
                          <p class="text-md font-bold text-gray-600">
                            ID Laporan: {{ process.id }}
                          </p>
                          <p class="text-sm font-semibold text-gray-500 mt-1">
                            Tgl: {{ formatDateSimple(process.activity_date) }} | Durasi: {{ formatDuration(process) }}
                          </p>
                        </div>
                        <div class="text-right">
                          <p class="text-xs font-bold text-gray-400 uppercase">Status: Completed</p>
                        </div>
                      </div>
                    </div>

                    <div class="overflow-x-auto mb-10">
                      <table class="w-full border-collapse border-2 border-gray-800 text-sm">
                        <thead>
                          <tr class="bg-gray-100">
                            <th colspan="3" class="border-2 border-gray-800 px-4 py-3 text-center font-black uppercase bg-gray-200">KWh</th>
                            <th :colspan="getUniqueMaterials(process).length" class="border-2 border-gray-800 px-4 py-3 text-center font-black uppercase bg-blue-50 text-blue-900">Bahan Masuk</th>
                            <th rowspan="2" class="border-2 border-gray-800 px-4 py-3 text-center font-black uppercase align-middle bg-green-50 text-green-900">Hasil (Kg)</th>
                          </tr>
                          <tr class="bg-gray-50">
                            <th class="border-2 border-gray-800 px-3 py-2 text-center font-bold">Awal</th>
                            <th class="border-2 border-gray-800 px-3 py-2 text-center font-bold">Akhir</th>
                            <th class="border-2 border-gray-800 px-3 py-2 text-center font-bold text-red-600">Pemakaian</th>
                            <th v-for="matName in getUniqueMaterials(process)" :key="matName" class="border-2 border-gray-800 px-3 py-2 text-center font-bold">
                              {{ matName }} (Kg)
                            </th>
                          </tr>
                        </thead>
                        <tbody class="divide-y-2 divide-gray-800">
                          <tr class="text-lg">
                            <td class="border-2 border-gray-800 px-4 py-6 text-center font-medium">{{ process.kwh_start }}</td>
                            <td class="border-2 border-gray-800 px-4 py-6 text-center font-medium">{{ process.kwh_end }}</td>
                            <td class="border-2 border-gray-800 px-4 py-6 text-center font-black text-red-600 bg-red-50">
                              {{ (process.kwh_end - process.kwh_start).toFixed(2) }}
                            </td>
                            
                            <td v-for="matName in getUniqueMaterials(process)" :key="matName" class="border-2 border-gray-800 px-4 py-6 text-center font-medium">
                              {{ getMaterialQty(process, matName) }}
                            </td>
                            
                            <td class="border-2 border-gray-800 px-4 py-6 text-center font-black text-green-700 bg-green-100">
                              {{ formatNumber(process.output_amount) }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h5 class="text-sm font-black uppercase mb-4 text-gray-500 border-l-4 border-primary-600 pl-2">Dokumentasi Visual</h5>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div class="space-y-3">
                        <div class="bg-gray-800 text-white text-xs font-bold py-2 px-3 rounded flex justify-between">
                          <span>1. KWh AWAL</span>
                          <span class="opacity-50">Start Reading</span>
                        </div>
                        <div class="border-2 border-dashed border-gray-200 rounded-lg p-2 min-h-[200px] flex flex-col">
                          <ImageGalleryViewer :images="process.kwh_start_images || []" :columns="1" empty-text="Tidak ada foto" />
                        </div>
                      </div>
                      
                      <div class="space-y-3">
                        <div class="bg-gray-800 text-white text-xs font-bold py-2 px-3 rounded flex justify-between">
                          <span>2. KWh AKHIR</span>
                          <span class="opacity-50">End Reading</span>
                        </div>
                        <div class="border-2 border-dashed border-gray-200 rounded-lg p-2 min-h-[200px] flex flex-col">
                          <ImageGalleryViewer :images="process.kwh_end_images || []" :columns="1" empty-text="Tidak ada foto" />
                        </div>
                      </div>
                      
                      <div class="space-y-3">
                        <div class="bg-primary-700 text-white text-xs font-bold py-2 px-3 rounded flex justify-between">
                          <span>3. HASIL (OUTPUT)</span>
                          <span class="opacity-50">Production Result</span>
                        </div>
                        <div class="border-2 border-dashed border-primary-100 rounded-lg p-2 min-h-[200px] flex flex-col">
                          <ImageGalleryViewer :images="process.output_images || []" :columns="1" empty-text="Tidak ada foto" />
                        </div>
                      </div>
                    </div>

                    <div v-if="process.notes" class="mt-10 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                      <p class="text-xs font-black text-yellow-800 uppercase mb-1">Keterangan / Catatan:</p>
                      <p class="text-sm text-yellow-900 leading-relaxed">{{ process.notes }}</p>
                    </div>

                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Mobile View -->
      <div class="lg:hidden space-y-4 p-4">
        <div v-for="process in processes" :key="`mobile-${process.id}`" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-4 border-b border-gray-100">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-gray-500 uppercase">{{ formatDate(process.activity_date) }}</span>
              <span :class="process.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">
                {{ process.status === 'in_progress' ? 'In Progress' : 'Completed' }}
              </span>
            </div>
            <p class="text-xs text-gray-500">{{ formatTime(process.activity_date) }}</p>
          </div>

          <div class="p-4 space-y-3 text-sm">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500 mb-1">Input</p>
                <p class="font-bold text-gray-900">{{ formatNumber(process.input_amount) }} kg</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Output</p>
                <p class="font-bold" :class="process.status === 'completed' ? 'text-primary-600' : 'text-gray-400'">
                  {{ process.status === 'completed' ? formatNumber(process.output_amount) + ' kg' : '-' }}
                </p>
              </div>
            </div>
          </div>

          <div class="p-3 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2">
            <button 
              v-if="process.status === 'in_progress'" 
              @click="$emit('complete', process)" 
              class="flex-1 bg-primary-600 text-white py-2 rounded-md text-xs font-bold"
            >
              Complete
            </button>
            
            <button 
              v-if="process.status === 'completed'"
              @click="toggleDetails(process.id)" 
              class="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md text-xs font-bold"
            >
              {{ expandedRows.includes(process.id) ? 'Hide Details' : 'Show Details' }}
            </button>

            <button
              v-if="process.status === 'completed'"
              @click="exportPDF(process)"
              class="flex-1 bg-red-50 text-red-600 py-2 rounded-md text-xs font-bold"
            >
              PDF
            </button>
            <button
              v-if="process.status === 'completed'"
              @click="exportExcel(process)"
              class="flex-1 bg-green-50 text-green-600 py-2 rounded-md text-xs font-bold"
            >
              Excel
            </button>
          </div>

          <!-- Mobile Details View -->
          <div v-if="expandedRows.includes(process.id) && process.status === 'completed'" class="p-4 bg-gray-50 border-t border-gray-200">
            <div class="bg-white border border-gray-300 rounded-lg p-4">
              <h4 class="text-lg font-bold text-gray-900 mb-2">Detail Pengolahan</h4>
              <p class="text-xs text-gray-500 mb-4">ID: {{ process.id }} | Durasi: {{ formatDuration(process) }}</p>
              
              <!-- KWh Info -->
              <div class="mb-4">
                <h5 class="font-bold text-sm mb-2 text-gray-700">KWh</h5>
                <div class="grid grid-cols-3 gap-2 text-xs">
                  <div class="bg-gray-100 p-2 rounded text-center">
                    <p class="text-gray-500">Awal</p>
                    <p class="font-bold">{{ process.kwh_start }}</p>
                  </div>
                  <div class="bg-gray-100 p-2 rounded text-center">
                    <p class="text-gray-500">Akhir</p>
                    <p class="font-bold">{{ process.kwh_end }}</p>
                  </div>
                  <div class="bg-red-50 p-2 rounded text-center">
                    <p class="text-gray-500">Pakai</p>
                    <p class="font-bold text-red-600">{{ (process.kwh_end - process.kwh_start).toFixed(2) }}</p>
                  </div>
                </div>
              </div>

              <!-- Materials Info -->
              <div class="mb-4">
                <h5 class="font-bold text-sm mb-2 text-gray-700">Bahan Masuk</h5>
                <div class="space-y-2 text-xs">
                  <div v-for="matName in getUniqueMaterials(process)" :key="matName" class="bg-blue-50 p-2 rounded flex justify-between">
                    <span>{{ matName }}</span>
                    <span class="font-bold">{{ getMaterialQty(process, matName) }} kg</span>
                  </div>
                </div>
              </div>

              <!-- Result -->
              <div class="mb-4">
                <h5 class="font-bold text-sm mb-2 text-gray-700">Hasil</h5>
                <div class="bg-green-50 p-3 rounded text-center">
                  <p class="font-bold text-2xl text-green-700">{{ formatNumber(process.output_amount) }} kg</p>
                </div>
              </div>

              <!-- Images -->
              <div class="space-y-3">
                <div>
                  <p class="text-xs font-bold mb-1">KWh Awal:</p>
                  <ImageGalleryViewer :images="process.kwh_start_images || []" :columns="1" empty-text="Tidak ada foto" />
                </div>
                <div>
                  <p class="text-xs font-bold mb-1">KWh Akhir:</p>
                  <ImageGalleryViewer :images="process.kwh_end_images || []" :columns="1" empty-text="Tidak ada foto" />
                </div>
                <div>
                  <p class="text-xs font-bold mb-1">Foto Hasil:</p>
                  <ImageGalleryViewer :images="process.output_images || []" :columns="1" empty-text="Tidak ada foto" />
                </div>
              </div>

              <!-- Notes -->
              <div v-if="process.notes" class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p class="text-xs font-bold text-yellow-800 mb-1">Keterangan:</p>
                <p class="text-xs text-yellow-900">{{ process.notes }}</p>
              </div>
            </div>
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
import * as XLSX from 'xlsx'

const props = defineProps({
  processes: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['complete', 'add-new', 'manage-materials'])

const processingStore = useProcessingStore()
const expandedRows = ref([])
const loadingMaterials = ref(null)

const formatDateSimple = (dt) => dt ? new Date(dt).toLocaleDateString('id-ID') : '-'
const formatNumber = (num) => num ? parseFloat(num).toFixed(2) : '0.00'

const formatDateTimeFull = (dt) => {
  if (!dt) return '-'
  const date = new Date(dt)
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + 
         ' ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const getUniqueMaterials = (process) => {
  const materials = getMaterials(process)
  return [...new Set(materials.map(m => m.material_name))]
}

const getMaterialQty = (process, name) => {
  const materials = getMaterials(process)
  const found = materials.find(m => m.material_name === name)
  return found ? parseFloat(found.qty).toFixed(2) : '0.00'
}

const getMaterials = (process) => {
  if (process.materials && Array.isArray(process.materials)) {
    return process.materials
  }
  if (process.SB_Material_Used && Array.isArray(process.SB_Material_Used)) {
    return process.SB_Material_Used.map(item => ({
      material_name: item.SB_Material?.material_name || item.material_name || 'Material',
      qty: item.qty
    }))
  }
  return []
}

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

const exportExcel = async (process) => {
  try {
    const materials = getMaterials(process)
    const kwhUsage = (process.kwh_end - process.kwh_start).toFixed(2)
    
    const uniqueMats = getUniqueMaterials(process)
    const matCols = uniqueMats.length
    
    // Build table data matching the display
    const wsData = [
      ['Percobaan I', '', '', '', '', '', ''],
      [`Tgl: ${formatDateSimple(process.activity_date)}`, '', '', '', '', '', `${formatDuration(process)}`],
      ['', '', '', '', '', '', ''],
      ['', 'Kwh', '', '', 'Bahan Masuk', ...Array(matCols - 1).fill(''), 'Hasil (Kg)'],
      ['Awal', 'Akhir', 'Pemakaian', ...uniqueMats.map(m => `${m} (Kg)`), '']
    ]

    // Data row
    const dataRow = [
      process.kwh_start,
      process.kwh_end,
      kwhUsage,
      ...uniqueMats.map(m => getMaterialQty(process, m)),
      formatNumber(process.output_amount)
    ]
    wsData.push(dataRow)
    
    // Total row
    const totalRow = ['', '', '', ...uniqueMats.map(m => getMaterialQty(process, m)), formatNumber(process.output_amount)]
    wsData.push(totalRow)
    
    // Grand total
    const grandTotal = uniqueMats.reduce((sum, m) => sum + parseFloat(getMaterialQty(process, m)), 0).toFixed(2)
    const totalTextRow = ['', '', '', ...Array(matCols - 1).fill(''), `Total: ${grandTotal}`, '']
    wsData.push(totalTextRow)
    
    if (process.notes) {
      wsData.push(['', '', '', '', '', '', ''])
      wsData.push(['Keterangan', '', '', '', '', '', ''])
      wsData.push([process.notes, '', '', '', '', '', ''])
    }

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(wsData)

    ws['!cols'] = Array(7).fill({ wch: 15 })
    
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Title
      { s: { r: 3, c: 1 }, e: { r: 3, c: 2 } }, // Kwh
      { s: { r: 3, c: 4 }, e: { r: 3, c: 3 + matCols } }, // Bahan Masuk
      { s: { r: 3, c: 4 + matCols }, e: { r: 4, c: 4 + matCols } } // Hasil
    ]

    XLSX.utils.book_append_sheet(wb, ws, 'Laporan')
    XLSX.writeFile(wb, `Laporan_${formatDateSimple(process.activity_date).replace(/\//g, '-')}.xlsx`)
  } catch (err) {
    console.error('Error exporting Excel:', err)
    alert('Gagal export Excel')
  }
}

const exportPDF = async (process) => {
  try {
    // FETCH MATERIALS FIRST if not loaded
    const currentMaterials = getMaterials(process)
    if (!currentMaterials || currentMaterials.length === 0) {
      await processingStore.fetchMaterialsForProcess(process.id)
      // Re-fetch the updated process data
      const updatedProcess = props.processes.find(p => p.id === process.id)
      if (updatedProcess) {
        process = updatedProcess
      }
    }

    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    
    const pageWidth = doc.internal.pageSize.width
    const leftMargin = 15
    const rightMargin = pageWidth - 15
    const tableWidth = rightMargin - leftMargin
    let y = 20

    // ========== HEADER ==========
    doc.setFontSize(18).setFont(undefined, 'bold')
    doc.text('LAPORAN PENGOLAHAN SAMPAH', leftMargin, y)
    y += 8
    
    doc.setFontSize(10).setFont(undefined, 'normal')
    doc.text(`ID Laporan: ${process.id}`, leftMargin, y)
    y += 6
    
    doc.text(`Tgl: ${formatDateSimple(process.activity_date)} | Durasi: ${formatDuration(process)}`, leftMargin, y)
    doc.setFont(undefined, 'bold')
    doc.text('STATUS: COMPLETED', rightMargin, y, { align: 'right' })
    doc.setFont(undefined, 'normal')
    y += 8
    
    doc.setLineWidth(1.5)
    doc.line(leftMargin, y, rightMargin, y)
    y += 15

    // ========== TABLE ==========
    const uniqueMats = getUniqueMaterials(process)
    const kwhUsage = (process.kwh_end - process.kwh_start).toFixed(2)
    
    const numMaterials = uniqueMats.length
    
    // Fixed column widths
    const colAwal = 25
    const colAkhir = 25
    const colPemakaian = 30
    const kwhTotalWidth = colAwal + colAkhir + colPemakaian
    const colHasil = 35
    const remainingWidth = tableWidth - kwhTotalWidth - colHasil
    const colMaterial = numMaterials > 0 ? remainingWidth / numMaterials : 30
    
    const row1H = 12
    const row2H = 12
    const row3H = 14
    
    doc.setLineWidth(0.5)
    doc.setDrawColor(0, 0, 0)
    doc.setTextColor(0, 0, 0)

    // ===== ROW 1: Main Headers =====
    let x = leftMargin
    
    // KWH Header
    doc.rect(x, y, kwhTotalWidth, row1H, 'D')
    doc.setFontSize(11).setFont(undefined, 'bold')
    doc.text('KWH', x + kwhTotalWidth/2, y + 8, { align: 'center' })
    x += kwhTotalWidth
    
    // BAHAN MASUK Header
    if (numMaterials > 0) {
      doc.rect(x, y, remainingWidth, row1H, 'D')
      doc.text('BAHAN MASUK', x + remainingWidth/2, y + 8, { align: 'center' })
      x += remainingWidth
    }
    
    // HASIL (KG) Header (rowspan 2)
    doc.rect(x, y, colHasil, row1H + row2H, 'D')
    doc.setFontSize(10)
    doc.text('HASIL (KG)', x + colHasil/2, y + 13, { align: 'center' })
    
    y += row1H

    // ===== ROW 2: Sub Headers =====
    x = leftMargin
    doc.setFontSize(9).setFont(undefined, 'bold')
    
    // Awal
    doc.rect(x, y, colAwal, row2H, 'D')
    doc.text('Awal', x + colAwal/2, y + 8, { align: 'center' })
    x += colAwal
    
    // Akhir
    doc.rect(x, y, colAkhir, row2H, 'D')
    doc.text('Akhir', x + colAkhir/2, y + 8, { align: 'center' })
    x += colAkhir
    
    // Pemakaian
    doc.rect(x, y, colPemakaian, row2H, 'D')
    doc.text('Pemakaian', x + colPemakaian/2, y + 8, { align: 'center' })
    x += colPemakaian
    
    // Material sub-headers
    doc.setFontSize(8)
    uniqueMats.forEach(matName => {
      doc.rect(x, y, colMaterial, row2H, 'D')
      const lines = doc.splitTextToSize(`${matName} (Kg)`, colMaterial - 4)
      const textY = y + (lines.length === 1 ? 8 : 6)
      doc.text(lines, x + colMaterial/2, textY, { align: 'center' })
      x += colMaterial
    })
    
    y += row2H

    // ===== ROW 3: Data =====
    x = leftMargin
    doc.setFontSize(11).setFont(undefined, 'normal')
    
    // KWH Awal
    doc.rect(x, y, colAwal, row3H, 'D')
    doc.text(String(process.kwh_start), x + colAwal/2, y + 9.5, { align: 'center' })
    x += colAwal
    
    // KWH Akhir
    doc.rect(x, y, colAkhir, row3H, 'D')
    doc.text(String(process.kwh_end), x + colAkhir/2, y + 9.5, { align: 'center' })
    x += colAkhir
    
    // KWH Pemakaian
    doc.rect(x, y, colPemakaian, row3H, 'D')
    doc.text(kwhUsage, x + colPemakaian/2, y + 9.5, { align: 'center' })
    x += colPemakaian
    
    // Materials data
    uniqueMats.forEach(matName => {
      doc.rect(x, y, colMaterial, row3H, 'D')
      doc.text(getMaterialQty(process, matName), x + colMaterial/2, y + 9.5, { align: 'center' })
      x += colMaterial
    })
    
    // HASIL data
    doc.rect(x, y, colHasil, row3H, 'D')
    doc.setFont(undefined, 'bold')
    doc.setFontSize(13)
    doc.text(formatNumber(process.output_amount), x + colHasil/2, y + 9.5, { align: 'center' })
    doc.setFont(undefined, 'normal')
    
    y += row3H + 12

    // ========== DOKUMENTASI VISUAL ==========
    doc.setFontSize(10).setFont(undefined, 'bold')
    doc.setTextColor(107, 114, 128)
    doc.text('DOKUMENTASI VISUAL', leftMargin, y)
    y += 8

    const sectionWidth = (tableWidth - 10) / 3
    const sectionHeight = 70
    const spacing = 5

    const addImageSection = async (xPos, title, subtitle, images, bgColor) => {
      doc.setFillColor(...bgColor)
      doc.rect(xPos, y, sectionWidth, 8, 'F')
      doc.setFontSize(7).setFont(undefined, 'bold')
      doc.setTextColor(255, 255, 255)
      doc.text(title, xPos + 2, y + 5.5)
      doc.setFontSize(6).setFont(undefined, 'normal')
      doc.text(subtitle, xPos + sectionWidth - 2, y + 5.5, { align: 'right' })
      
      const boxY = y + 8
      const boxHeight = sectionHeight - 8
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.3)
      doc.setLineDash([2, 2])
      doc.rect(xPos, boxY, sectionWidth, boxHeight)
      doc.setLineDash([])
      
      if (images && images.length > 0) {
        try {
          const base64 = await getBase64ImageFromURL(images[0].url)
          if (base64) {
            const imgSize = Math.min(sectionWidth - 6, boxHeight - 6)
            const imgX = xPos + (sectionWidth - imgSize) / 2
            const imgY = boxY + (boxHeight - imgSize) / 2
            doc.addImage(base64, 'JPEG', imgX, imgY, imgSize, imgSize)
          }
        } catch (e) {
          console.error('Image load error:', e)
          doc.setFontSize(7).setTextColor(150, 150, 150)
          doc.text('Tidak ada foto', xPos + sectionWidth/2, boxY + boxHeight/2, { align: 'center' })
        }
      } else {
        doc.setFontSize(7).setTextColor(150, 150, 150)
        doc.text('Tidak ada foto', xPos + sectionWidth/2, boxY + boxHeight/2, { align: 'center' })
      }
      
      doc.setTextColor(0, 0, 0)
    }

    await addImageSection(leftMargin, '1. KWh AWAL', 'Start Reading', process.kwh_start_images, [55, 65, 81])
    await addImageSection(leftMargin + sectionWidth + spacing, '2. KWh AKHIR', 'End Reading', process.kwh_end_images, [55, 65, 81])
    await addImageSection(leftMargin + (sectionWidth + spacing) * 2, '3. HASIL (OUTPUT)', 'Production Result', process.output_images, [29, 78, 216])

    y += sectionHeight + 10

    // ========== NOTES ==========
    if (process.notes && process.notes !== '-' && process.notes.trim() !== '') {
      if (y > 240) {
        doc.addPage()
        y = 20
      }
      
      const notesHeight = 20
      doc.setFillColor(254, 252, 232)
      doc.rect(leftMargin, y, tableWidth, notesHeight, 'F')
      
      doc.setDrawColor(251, 191, 36)
      doc.setLineWidth(3)
      doc.line(leftMargin, y, leftMargin, y + notesHeight)
      
      doc.setFontSize(7).setFont(undefined, 'bold')
      doc.setTextColor(146, 64, 14)
      doc.text('KETERANGAN / CATATAN:', leftMargin + 4, y + 5)
      
      doc.setFontSize(9).setFont(undefined, 'normal')
      doc.setTextColor(113, 63, 18)
      const splitNotes = doc.splitTextToSize(process.notes, tableWidth - 10)
      doc.text(splitNotes, leftMargin + 4, y + 11)
      
      doc.setTextColor(0, 0, 0)
    }

    const fileName = `Laporan_${formatDateSimple(process.activity_date).replace(/\//g, '-')}.pdf`
    doc.save(fileName)
    
  } catch (err) {
    console.error('PDF error:', err)
    alert('Gagal export PDF: ' + err.message)
  }
}
const getBase64ImageFromURL = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.setAttribute('crossOrigin', 'anonymous')
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      } catch (e) {
        reject(e)
      }
    }
    img.onerror = reject
    img.src = url
  })
}

const formatDate = (dt) => {
  if (!dt) return '-'
  return new Date(dt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatTime = (dt) => {
  if (!dt) return '-'
  return new Date(dt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const formatDuration = (p) => {
  if (!p.activity_date || !p.completed_at) return '-'
  const hrs = Math.abs(new Date(p.completed_at) - new Date(p.activity_date)) / 36e5
  return `${hrs.toFixed(0)} jam`
}
</script>

