<!-- pages/electricity/recap.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h1 class="text-3xl font-bold text-gray-900">Rekap Bulanan Pengolahan</h1>
        </div>
        <p class="text-gray-600">Laporan detail pengolahan pupuk organik per bulan</p>
      </div>
      <button 
        v-if="filteredProcesses.length > 0 || filteredDewaterings.length > 0"
        @click="exportPDF" 
        class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export PDF
      </button>
    </div>

    <!-- Month Filter -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center gap-4 flex-wrap">
        <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Pilih Bulan:
        </label>
        <select
          v-model="selectedMonth"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">-- Pilih Bulan --</option>
          <option v-for="month in months" :key="month" :value="month">
            {{ formatMonthYear(month) }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <svg class="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600 font-medium">Loading data...</p>
    </div>

    <template v-else-if="selectedMonth">

      <!-- ===== DEWATERING TABLE ===== -->
      <div v-if="filteredDewaterings.length > 0" class="bg-white rounded-xl shadow-sm border border-cyan-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-cyan-200 bg-cyan-50">
          <h3 class="text-lg font-bold text-cyan-900">
            Dewatering - {{ formatMonthYear(selectedMonth) }}
          </h3>
          <p class="text-sm text-cyan-600 mt-1">Bulan: {{ formatMonthYearLong(selectedMonth) }}</p>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-300 text-sm">
            <thead class="bg-cyan-50">
              <tr>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">No.</th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">Nama Proses</th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">Tanggal Mulai</th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">Tanggal Selesai</th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">Jam</th>
                <th :colspan="dewateringMaterialColumns.length || 1" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300 bg-blue-50">
                  Jenis Bahan
                </th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">Total Bahan (kg)</th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">Kwh Awal</th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">Kwh Akhir</th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-yellow-700 uppercase border border-gray-300 bg-yellow-50">Pemakaian</th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">Hasil (kg)</th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">Penyusutan (kg)</th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">Tekstur</th>
              </tr>
              <tr>
                <th v-if="dewateringMaterialColumns.length === 0" class="px-3 py-2 text-center text-xs font-bold text-gray-700 border border-gray-300 bg-blue-50">-</th>
                <th v-for="mat in dewateringMaterialColumns" :key="mat" class="px-3 py-2 text-center text-xs font-bold text-gray-700 border border-gray-300 bg-blue-50">
                  {{ mat }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-300">
              <tr v-for="(dw, index) in filteredDewaterings" :key="dw.dewatering_id" class="hover:bg-cyan-50">
                <td class="px-4 py-3 text-center border border-gray-300">{{ index + 1 }}.</td>
                <td class="px-4 py-3 text-center border border-gray-300 font-medium">{{ dw.process_name }}</td>
                <td class="px-4 py-3 text-center border border-gray-300">{{ formatDate(dw.start_datetime) }}</td>
                <td class="px-4 py-3 text-center border border-gray-300">{{ formatDate(dw.end_datetime) }}</td>
                <td class="px-4 py-3 text-center border border-gray-300">{{ calculateDuration(dw) }}</td>
                <!-- Material Columns -->
                <td v-if="dewateringMaterialColumns.length === 0" class="px-3 py-3 text-center border border-gray-300">-</td>
                <td v-for="mat in dewateringMaterialColumns" :key="`${dw.dewatering_id}-${mat}`" class="px-3 py-3 text-center border border-gray-300">
                  {{ getDewateringMaterialQty(dw, mat) }}
                </td>
                <td class="px-4 py-3 text-center font-semibold border border-gray-300">{{ (dw.input_amount_kg || 0).toFixed(2) }}</td>
                <td class="px-4 py-3 text-center border border-gray-300">{{ dw.kwh_start }}</td>
                <td class="px-4 py-3 text-center border border-gray-300">{{ dw.kwh_end }}</td>
                <td class="px-4 py-3 text-center font-bold text-yellow-700 bg-yellow-50 border border-gray-300">
                  {{ ((dw.kwh_end || 0) - (dw.kwh_start || 0)).toFixed(2) }}
                </td>
                <td class="px-4 py-3 text-center font-semibold border border-gray-300">{{ (dw.output_amount_kg || 0).toFixed(2) }}</td>
                <td class="px-4 py-3 text-center border border-gray-300">
                  {{ ((dw.input_amount_kg || 0) - (dw.output_amount_kg || 0)).toFixed(2) }}
                </td>
                <td class="px-4 py-3 text-center border border-gray-300">{{ dw.output_texture || '-' }}</td>
              </tr>
            </tbody>
            <tfoot class="bg-yellow-100 border-t-2 border-gray-400">
              <tr>
                <td colspan="5" class="px-4 py-3 text-center font-bold border border-gray-300">Total</td>
                <td v-if="dewateringMaterialColumns.length === 0" class="px-3 py-3 text-center font-bold border border-gray-300">-</td>
                <td v-for="mat in dewateringMaterialColumns" :key="`total-dw-${mat}`" class="px-3 py-3 text-center font-bold border border-gray-300">
                  {{ getTotalDewateringMaterial(mat) }}
                </td>
                <td class="px-4 py-3 text-center font-bold border border-gray-300">{{ dewateringSummary.totalInput.toFixed(2) }}</td>
                <td colspan="2" class="px-4 py-3 text-center border border-gray-300"></td>
                <td class="px-4 py-3 text-center font-bold text-yellow-700 bg-yellow-100 border border-gray-300">{{ dewateringSummary.totalKwhUsed.toFixed(2) }}</td>
                <td class="px-4 py-3 text-center font-bold border border-gray-300">{{ dewateringSummary.totalOutput.toFixed(2) }}</td>
                <td class="px-4 py-3 text-center font-bold border border-gray-300">{{ (dewateringSummary.totalInput - dewateringSummary.totalOutput).toFixed(2) }}</td>
                <td class="px-4 py-3 text-center border border-gray-300"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div v-else-if="selectedMonth" class="bg-white rounded-xl shadow-sm border border-cyan-200 p-6 text-center text-cyan-600">
        Tidak ada data Dewatering untuk bulan yang dipilih
      </div>

      <!-- ===== PENGOLAHAN TABLE ===== -->
      <div v-if="filteredProcesses.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 class="text-lg font-bold text-gray-900">
            Pengolahan Pupuk Organik - {{ formatMonthYear(selectedMonth) }}
          </h3>
          <p class="text-sm text-gray-500 mt-1">Pengolahan Bahan: {{ formatMonthYearLong(selectedMonth) }}</p>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-300 text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">No.</th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">Tanggal Mulai</th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">Tanggal Selesai</th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">Jam</th>
                <th :colspan="materialColumns.length" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300 bg-blue-50">
                  Jenis Bahan
                </th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">Total Bahan (kg)</th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">Kwh Awal</th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">Kwh Akhir</th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-yellow-700 uppercase border border-gray-300 bg-yellow-50">Pemakaian</th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">Hasil Pengolahan (kg)</th>
                <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">Penyusutan (kg)</th>
              </tr>
              <tr>
                <th v-for="mat in materialColumns" :key="mat" class="px-3 py-2 text-center text-xs font-bold text-gray-700 border border-gray-300 bg-blue-50">
                  {{ mat }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-300">
              <tr v-for="(process, index) in filteredProcesses" :key="process.processing_id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-center border border-gray-300">{{ index + 1 }}.</td>
                <td class="px-4 py-3 text-center border border-gray-300">{{ formatDate(process.start_datetime) }}</td>
                <td class="px-4 py-3 text-center border border-gray-300">{{ formatDate(process.end_datetime) }}</td>
                <td class="px-4 py-3 text-center border border-gray-300">{{ calculateDuration(process) }}</td>
                <!-- Material Columns -->
                <td v-for="mat in materialColumns" :key="`${process.processing_id}-${mat}`" class="px-3 py-3 text-center border border-gray-300">
                  {{ getMaterialQty(process, mat) }}
                </td>
                <td class="px-4 py-3 text-center font-semibold border border-gray-300">{{ process.input_amount_kg.toFixed(2) }}</td>
                <td class="px-4 py-3 text-center border border-gray-300">{{ process.kwh_start }}</td>
                <td class="px-4 py-3 text-center border border-gray-300">{{ process.kwh_end }}</td>
                <td class="px-4 py-3 text-center font-bold text-yellow-700 bg-yellow-50 border border-gray-300">
                  {{ (process.kwh_end - process.kwh_start).toFixed(2) }}
                </td>
                <td class="px-4 py-3 text-center font-semibold border border-gray-300">{{ process.output_amount_kg.toFixed(2) }}</td>
                <td class="px-4 py-3 text-center border border-gray-300">
                  {{ (process.input_amount_kg - process.output_amount_kg).toFixed(2) }}
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-yellow-100 border-t-2 border-gray-400">
              <tr>
                <td colspan="4" class="px-4 py-3 text-center font-bold border border-gray-300">Total</td>
                <td v-for="mat in materialColumns" :key="`total-${mat}`" class="px-3 py-3 text-center font-bold border border-gray-300">
                  {{ getTotalMaterial(mat) }}
                </td>
                <td class="px-4 py-3 text-center font-bold border border-gray-300">{{ summary.totalInput.toFixed(2) }}</td>
                <td colspan="2" class="px-4 py-3 text-center border border-gray-300"></td>
                <td class="px-4 py-3 text-center font-bold text-yellow-700 bg-yellow-100 border border-gray-300">{{ summary.totalKwhUsed.toFixed(2) }}</td>
                <td class="px-4 py-3 text-center font-bold border border-gray-300">{{ summary.totalOutput.toFixed(2) }}</td>
                <td class="px-4 py-3 text-center font-bold border border-gray-300">{{ (summary.totalInput - summary.totalOutput).toFixed(2) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center text-gray-600">
        Tidak ada data Pengolahan untuk bulan yang dipilih
      </div>

    </template>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <p class="text-gray-600">Silakan pilih bulan untuk menampilkan data</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const loading = ref(true)
const processes = ref([])
const dewaterings = ref([])
const selectedMonth = ref('')

// HELPER: Safe JSON Parse for Images
const safeParseImages = (imageData) => {
  if (!imageData) return []
  if (Array.isArray(imageData)) return imageData
  if (typeof imageData === 'string') {
    try {
      const cleaned = imageData.trim()
      if (cleaned === '[]' || cleaned === '') return []
      const parsed = JSON.parse(cleaned)
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      console.error('Error parsing images JSON:', e)
      return []
    }
  }
  return []
}

// Fetch pengolahan processes
const fetchProcesses = async () => {
  loading.value = true
  try {
    const [processingResult, dewateringResult] = await Promise.all([
      supabase
        .from('SB_Processing')
        .select(`
          processing_id,
          start_datetime,
          end_datetime,
          kwh_start,
          kwh_end,
          input_amount_kg,
          output_amount_kg,
          SB_Material_Used (
            material_id,
            qty,
            container_number,
            container_content,
            material_images,
            SB_Material (
              material_name
            )
          )
        `)
        .not('end_datetime', 'is', null)
        .order('start_datetime', { ascending: true }),

      supabase
        .from('SB_Dewatering')
        .select(`
          dewatering_id,
          process_name,
          start_datetime,
          end_datetime,
          kwh_start,
          kwh_end,
          input_amount_kg,
          output_amount_kg,
          output_texture,
          SB_Material_Dewatering (
            material_id,
            qty,
            container_number,
            container_content,
            material_images,
            SB_Material (
              material_name
            )
          )
        `)
        .not('end_datetime', 'is', null)
        .order('start_datetime', { ascending: true })
    ])

    if (processingResult.error) throw processingResult.error
    if (dewateringResult.error) throw dewateringResult.error

    // Transform pengolahan data
    processes.value = (processingResult.data || []).map(p => {
      const rawMaterials = p.SB_Material_Used || []
      const materials = rawMaterials.map(item => {
        const rawImg = item.material_images || item.images
        const parsedImages = safeParseImages(rawImg)
        const matName = item.material_name || item.SB_Material?.material_name || 'Unknown'
        return {
          material_id: item.material_id,
          material_name: matName,
          container_number: item.container_number || 1,
          container_content: item.container_content || '',
          qty: item.qty ? parseFloat(item.qty) : 0,
          images: parsedImages
        }
      })
      return { ...p, materials }
    })

    // Transform dewatering data
    dewaterings.value = (dewateringResult.data || []).map(d => {
      const rawMaterials = d.SB_Material_Dewatering || []
      const materials = rawMaterials.map(item => {
        const rawImg = item.material_images || item.images
        const parsedImages = safeParseImages(rawImg)
        const matName = item.material_name || item.SB_Material?.material_name || 'Unknown'
        return {
          material_id: item.material_id,
          material_name: matName,
          container_number: item.container_number || 1,
          container_content: item.container_content || '',
          qty: item.qty ? parseFloat(item.qty) : 0,
          images: parsedImages
        }
      })
      return { ...d, materials }
    })

    // Set default selected month to latest across both datasets
    const allDates = [
      ...processes.value.map(p => p.start_datetime.substring(0, 7)),
      ...dewaterings.value.map(d => d.start_datetime.substring(0, 7))
    ]
    if (allDates.length > 0) {
      selectedMonth.value = [...allDates].sort().pop()
    }
  } catch (err) {
    console.error('Error fetching data:', err)
  } finally {
    loading.value = false
  }
}

// Get unique months from both datasets
const months = computed(() => {
  const monthSet = new Set([
    ...processes.value.map(p => p.start_datetime.substring(0, 7)),
    ...dewaterings.value.map(d => d.start_datetime.substring(0, 7))
  ])
  return [...monthSet].sort()
})

// Filter pengolahan by selected month
const filteredProcesses = computed(() => {
  if (!selectedMonth.value) return []
  return processes.value.filter(p => p.start_datetime.startsWith(selectedMonth.value))
})

// Filter dewaterings by selected month
const filteredDewaterings = computed(() => {
  if (!selectedMonth.value) return []
  return dewaterings.value.filter(d => d.start_datetime.startsWith(selectedMonth.value))
})

// ===== PENGOLAHAN COMPUTED =====
const materialColumns = computed(() => {
  const materials = new Set()
  filteredProcesses.value.forEach(p => p.materials.forEach(m => materials.add(m.material_name)))
  return Array.from(materials).sort()
})

const getMaterialQty = (process, materialName) => {
  const items = process.materials.filter(m => m.material_name === materialName)
  if (items.length === 0) return '-'
  const total = items.reduce((sum, m) => sum + m.qty, 0)
  return total > 0 ? total.toFixed(2) : '-'
}

const getTotalMaterial = (materialName) => {
  const total = filteredProcesses.value.reduce((sum, p) => {
    const items = p.materials.filter(m => m.material_name === materialName)
    return sum + items.reduce((s, m) => s + m.qty, 0)
  }, 0)
  return total > 0 ? total.toFixed(2) : '-'
}

const summary = computed(() => {
  return filteredProcesses.value.reduce((acc, p) => {
    const kwhUsed = (p.kwh_end || 0) - (p.kwh_start || 0)
    return {
      totalKwhUsed: acc.totalKwhUsed + kwhUsed,
      totalInput: acc.totalInput + (p.input_amount_kg || 0),
      totalOutput: acc.totalOutput + (p.output_amount_kg || 0),
    }
  }, { totalKwhUsed: 0, totalInput: 0, totalOutput: 0 })
})

// ===== DEWATERING COMPUTED =====
const dewateringMaterialColumns = computed(() => {
  const materials = new Set()
  filteredDewaterings.value.forEach(d => d.materials.forEach(m => materials.add(m.material_name)))
  return Array.from(materials).sort()
})

const getDewateringMaterialQty = (dw, materialName) => {
  const items = dw.materials.filter(m => m.material_name === materialName)
  if (items.length === 0) return '-'
  const total = items.reduce((sum, m) => sum + m.qty, 0)
  return total > 0 ? total.toFixed(2) : '-'
}

const getTotalDewateringMaterial = (materialName) => {
  const total = filteredDewaterings.value.reduce((sum, d) => {
    const items = d.materials.filter(m => m.material_name === materialName)
    return sum + items.reduce((s, m) => s + m.qty, 0)
  }, 0)
  return total > 0 ? total.toFixed(2) : '-'
}

const dewateringSummary = computed(() => {
  return filteredDewaterings.value.reduce((acc, d) => {
    const kwhUsed = (d.kwh_end || 0) - (d.kwh_start || 0)
    return {
      totalKwhUsed: acc.totalKwhUsed + kwhUsed,
      totalInput: acc.totalInput + (d.input_amount_kg || 0),
      totalOutput: acc.totalOutput + (d.output_amount_kg || 0),
    }
  }, { totalKwhUsed: 0, totalInput: 0, totalOutput: 0 })
})

// ===== SHARED HELPERS =====
const calculateDuration = (record) => {
  if (!record.start_datetime || !record.end_datetime) return '-'
  const start = new Date(record.start_datetime.replace(' ', 'T'))
  const end = new Date(record.end_datetime.replace(' ', 'T'))
  const hours = (end - start) / (1000 * 60 * 60)
  return Math.round(hours)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString.replace(' ', 'T')).toLocaleDateString('id-ID', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
}

const formatMonthYear = (monthString) => {
  const [year, month] = monthString.split('-')
  return new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
}

const formatMonthYearLong = (monthString) => {
  const [year, month] = monthString.split('-')
  return new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
}

// Export PDF
const exportPDF = async () => {
  try {
    const { default: jsPDF } = await import('jspdf')

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    const margin = 10

    // ===== DEWATERING SECTION =====
    if (filteredDewaterings.value.length > 0) {
      doc.setFontSize(16)
      doc.setFont(undefined, 'bold')
      doc.text('Dewatering', margin, 15)

      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      doc.text(`Bulan: ${formatMonthYearLong(selectedMonth.value)}`, margin, 22)

      let startY = 30
      const headerHeight = 10
      const rowHeight = 8

      const numDwMats = dewateringMaterialColumns.value.length || 1
      const colNo = 8
      const colName = 30
      const colDate = 20
      const colJam = 10
      const colTotal = 18
      const colKwh = 13
      const colPemakaian = 16
      const colHasil = 18
      const colPenyusutan = 18
      const colTekstur = 14

      const fixedWidth = colNo + colName + (colDate * 2) + colJam + colTotal + (colKwh * 2) + colPemakaian + colHasil + colPenyusutan + colTekstur
      const availableWidth = pageWidth - (2 * margin) - fixedWidth
      const matColWidth = availableWidth / numDwMats

      const dwColWidths = [colNo, colName, colDate, colDate, colJam, ...Array(numDwMats).fill(matColWidth), colTotal, colKwh, colKwh, colPemakaian, colHasil, colPenyusutan, colTekstur]

      const dwHeaders = [
        'No.', 'Nama Proses', 'Tgl\nMulai', 'Tgl\nSelesai', 'Jam',
        ...(dewateringMaterialColumns.value.length > 0 ? dewateringMaterialColumns.value.map(m => m.split(' ').join('\n') + '\n(kg)') : ['-']),
        'Total\nBahan\n(kg)', 'Kwh\nAwal', 'Kwh\nAkhir', 'Pemakaian', 'Hasil\n(kg)', 'Penyusutan\n(kg)', 'Tekstur'
      ]

      doc.setDrawColor(0, 0, 0)
      doc.setLineWidth(0.3)
      doc.setFontSize(7)
      doc.setFont(undefined, 'bold')

      let x = margin
      dwHeaders.forEach((header, i) => {
        doc.setFillColor(207, 250, 254)
        doc.rect(x, startY, dwColWidths[i], headerHeight, 'FD')
        x += dwColWidths[i]
      })

      x = margin
      doc.setTextColor(0, 0, 0)
      dwHeaders.forEach((header, i) => {
        const lines = header.split('\n')
        const lineH = 3
        const totalTextH = lines.length * lineH
        const startTextY = startY + (headerHeight - totalTextH) / 2 + lineH
        lines.forEach((line, li) => {
          doc.text(line, x + dwColWidths[i] / 2, startTextY + li * lineH, { align: 'center' })
        })
        x += dwColWidths[i]
      })

      startY += headerHeight
      doc.setFont(undefined, 'normal')
      doc.setFontSize(7)

      filteredDewaterings.value.forEach((dw, idx) => {
        if (startY > pageHeight - 30) { doc.addPage(); startY = 20 }
        x = margin
        const rowData = [
          (idx + 1) + '.',
          dw.process_name || '',
          formatDate(dw.start_datetime),
          formatDate(dw.end_datetime),
          calculateDuration(dw).toString(),
          ...(dewateringMaterialColumns.value.length > 0
            ? dewateringMaterialColumns.value.map(mat => getDewateringMaterialQty(dw, mat))
            : ['-']),
          (dw.input_amount_kg || 0).toFixed(2),
          (dw.kwh_start || '').toString(),
          (dw.kwh_end || '').toString(),
          ((dw.kwh_end || 0) - (dw.kwh_start || 0)).toFixed(2),
          (dw.output_amount_kg || 0).toFixed(2),
          ((dw.input_amount_kg || 0) - (dw.output_amount_kg || 0)).toFixed(2),
          dw.output_texture || '-'
        ]

        rowData.forEach((data, i) => {
          doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 248)
          doc.rect(x, startY, dwColWidths[i], rowHeight, 'FD')
          x += dwColWidths[i]
        })

        x = margin
        doc.setTextColor(0, 0, 0)
        rowData.forEach((data, i) => {
          doc.text(data.toString(), x + dwColWidths[i] / 2, startY + rowHeight / 2 + 2.5, { align: 'center' })
          x += dwColWidths[i]
        })
        startY += rowHeight
      })

      // Dewatering footer
      doc.setFillColor(255, 255, 200)
      doc.setFont(undefined, 'bold')
      doc.setFontSize(8)
      x = margin
      const dwFooter = [
        'Total', '', '', '', '',
        ...(dewateringMaterialColumns.value.length > 0
          ? dewateringMaterialColumns.value.map(mat => getTotalDewateringMaterial(mat))
          : ['-']),
        dewateringSummary.value.totalInput.toFixed(2), '', '',
        dewateringSummary.value.totalKwhUsed.toFixed(2),
        dewateringSummary.value.totalOutput.toFixed(2),
        (dewateringSummary.value.totalInput - dewateringSummary.value.totalOutput).toFixed(2),
        ''
      ]
      dwFooter.forEach((data, i) => {
        doc.rect(x, startY, dwColWidths[i], rowHeight, 'FD')
        x += dwColWidths[i]
      })
      x = margin
      doc.setTextColor(0, 0, 0)
      dwFooter.forEach((data, i) => {
        if (data) doc.text(data.toString(), x + dwColWidths[i] / 2, startY + rowHeight / 2 + 2.5, { align: 'center' })
        x += dwColWidths[i]
      })
      startY += rowHeight + 10
    }

    // ===== PENGOLAHAN SECTION =====
    if (filteredProcesses.value.length > 0) {
      // If dewatering was already printed, add new page or continue
      if (filteredDewaterings.value.length > 0) doc.addPage()

      doc.setFontSize(16)
      doc.setFont(undefined, 'bold')
      doc.text('Pengolahan pupuk organik', margin, 15)

      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      doc.text(`Pengolahan Bahan: ${formatMonthYearLong(selectedMonth.value)}`, margin, 22)

      let startY = 30
      const headerHeight = 10
      const rowHeight = 8

      const numMaterials = materialColumns.value.length
      const colNo = 10
      const colDate = 23
      const colJam = 12
      const colTotal = 22
      const colKwh = 15
      const colPemakaian = 18
      const colHasil = 22
      const colPenyusutan = 18

      const fixedWidth = colNo + (colDate * 2) + colJam + colTotal + (colKwh * 2) + colPemakaian + colHasil + colPenyusutan
      const availableWidth = pageWidth - (2 * margin) - fixedWidth
      const materialColWidth = numMaterials > 0 ? availableWidth / numMaterials : 20

      const colWidths = [colNo, colDate, colDate, colJam, ...Array(numMaterials).fill(materialColWidth), colTotal, colKwh, colKwh, colPemakaian, colHasil, colPenyusutan]

      const headers = [
        'No.', 'Tanggal\nMulai', 'Tanggal\nSelesai', 'Jam',
        ...materialColumns.value.map(m => {
          const words = m.split(' ')
          return words.length > 1 ? words.join('\n') + '\n(kg)' : m + '\n(kg)'
        }),
        'Total\nBahan\n(kg)', 'Kwh\nAwal', 'Kwh\nAkhir', 'Pemakaian', 'Hasil\nPengolahan\n(kg)', 'Penyusutan\n(kg)'
      ]

      doc.setDrawColor(0, 0, 0)
      doc.setLineWidth(0.3)
      doc.setFillColor(220, 220, 220)
      doc.setFontSize(8)
      doc.setFont(undefined, 'bold')

      let x = margin
      headers.forEach((header, i) => {
        doc.setFillColor(220, 220, 220)
        doc.rect(x, startY, colWidths[i], headerHeight, 'FD')
        x += colWidths[i]
      })

      x = margin
      doc.setTextColor(0, 0, 0)
      headers.forEach((header, i) => {
        const lines = header.split('\n')
        const lineHeight = 3
        const totalTextHeight = lines.length * lineHeight
        const startTextY = startY + (headerHeight - totalTextHeight) / 2 + lineHeight
        lines.forEach((line, lineIdx) => {
          doc.text(line, x + colWidths[i] / 2, startTextY + lineIdx * lineHeight, { align: 'center' })
        })
        x += colWidths[i]
      })

      startY += headerHeight
      doc.setFont(undefined, 'normal')
      doc.setFontSize(8)

      filteredProcesses.value.forEach((p, idx) => {
        if (startY > pageHeight - 30) { doc.addPage(); startY = 20 }
        x = margin
        const rowData = [
          (idx + 1) + '.', formatDate(p.start_datetime), formatDate(p.end_datetime),
          calculateDuration(p).toString(),
          ...materialColumns.value.map(mat => getMaterialQty(p, mat)),
          p.input_amount_kg.toFixed(2), p.kwh_start.toString(), p.kwh_end.toString(),
          (p.kwh_end - p.kwh_start).toFixed(2),
          p.output_amount_kg.toFixed(2),
          (p.input_amount_kg - p.output_amount_kg).toFixed(2)
        ]

        rowData.forEach((data, i) => {
          doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 248)
          doc.rect(x, startY, colWidths[i], rowHeight, 'FD')
          x += colWidths[i]
        })

        x = margin
        doc.setTextColor(0, 0, 0)
        rowData.forEach((data, i) => {
          doc.text(data.toString(), x + colWidths[i] / 2, startY + rowHeight / 2 + 2.5, { align: 'center' })
          x += colWidths[i]
        })
        startY += rowHeight
      })

      // Pengolahan footer
      doc.setFillColor(255, 255, 200)
      doc.setFont(undefined, 'bold')
      doc.setFontSize(9)
      x = margin
      const footerData = [
        'Total', '', '', '',
        ...materialColumns.value.map(mat => getTotalMaterial(mat)),
        summary.value.totalInput.toFixed(2), '', '',
        summary.value.totalKwhUsed.toFixed(2),
        summary.value.totalOutput.toFixed(2),
        (summary.value.totalInput - summary.value.totalOutput).toFixed(2)
      ]

      footerData.forEach((data, i) => {
        doc.rect(x, startY, colWidths[i], rowHeight, 'FD')
        x += colWidths[i]
      })
      x = margin
      doc.setTextColor(0, 0, 0)
      footerData.forEach((data, i) => {
        if (data) doc.text(data.toString(), x + colWidths[i] / 2, startY + rowHeight / 2 + 2.5, { align: 'center' })
        x += colWidths[i]
      })
      startY += rowHeight

      doc.setFontSize(8)
      doc.setFont(undefined, 'italic')
      doc.setTextColor(100, 100, 100)
      doc.text('Keterangan: FW 30/10/2025 = Tanpa Di cacah', margin, startY + 6)
    }

    doc.save(`Rekap_${formatMonthYear(selectedMonth.value).replace(/\s+/g, '_')}.pdf`)
  } catch (err) {
    console.error('Error exporting PDF:', err)
    alert('Gagal export PDF: ' + err.message)
  }
}

onMounted(() => {
  fetchProcesses()
})
</script>