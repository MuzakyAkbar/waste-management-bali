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
        v-if="filteredProcesses.length > 0"
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

    <!-- Table -->
    <div v-else-if="selectedMonth && filteredProcesses.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
              <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">
                No.
              </th>
              <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">
                Tanggal Mulai
              </th>
              <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">
                Tanggal Selesai
              </th>
              <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">
                Jam
              </th>
              <th :colspan="materialColumns.length" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300 bg-blue-50">
                Jenis Bahan
              </th>
              <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">
                Total Bahan (kg)
              </th>
              <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">
                Kwh Awal
              </th>
              <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">
                Kwh Akhir
              </th>
              <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-yellow-700 uppercase border border-gray-300 bg-yellow-50">
                Pemakaian
              </th>
              <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">
                Hasil Pengolahan (kg)
              </th>
              <th rowspan="2" class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">
                Penyusutan (kg)
              </th>
            </tr>
            <tr>
              <th v-for="mat in materialColumns" :key="mat" class="px-3 py-2 text-center text-xs font-bold text-gray-700 border border-gray-300 bg-blue-50">
                {{ mat }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-300">
            <tr v-for="(process, index) in filteredProcesses" :key="process.processing_id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-center border border-gray-300">
                {{ index + 1 }}.
              </td>
              <td class="px-4 py-3 text-center border border-gray-300">
                {{ formatDate(process.start_datetime) }}
              </td>
              <td class="px-4 py-3 text-center border border-gray-300">
                {{ formatDate(process.end_datetime) }}
              </td>
              <td class="px-4 py-3 text-center border border-gray-300">
                {{ calculateDuration(process) }}
              </td>
              
              <!-- Material Columns -->
              <td v-for="mat in materialColumns" :key="`${process.processing_id}-${mat}`" class="px-3 py-3 text-center border border-gray-300">
                {{ getMaterialQty(process, mat) }}
              </td>
              
              <td class="px-4 py-3 text-center font-semibold border border-gray-300">
                {{ process.input_amount_kg.toFixed(2) }}
              </td>
              <td class="px-4 py-3 text-center border border-gray-300">
                {{ process.kwh_start }}
              </td>
              <td class="px-4 py-3 text-center border border-gray-300">
                {{ process.kwh_end }}
              </td>
              <td class="px-4 py-3 text-center font-bold text-yellow-700 bg-yellow-50 border border-gray-300">
                {{ (process.kwh_end - process.kwh_start).toFixed(2) }}
              </td>
              <td class="px-4 py-3 text-center font-semibold border border-gray-300">
                {{ process.output_amount_kg.toFixed(2) }}
              </td>
              <td class="px-4 py-3 text-center border border-gray-300">
                {{ (process.input_amount_kg - process.output_amount_kg).toFixed(2) }}
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-yellow-100 border-t-2 border-gray-400">
            <tr>
              <td colspan="4" class="px-4 py-3 text-center font-bold border border-gray-300">
                Total
              </td>
              <td v-for="mat in materialColumns" :key="`total-${mat}`" class="px-3 py-3 text-center font-bold border border-gray-300">
                {{ getTotalMaterial(mat) }}
              </td>
              <td class="px-4 py-3 text-center font-bold border border-gray-300">
                {{ summary.totalInput.toFixed(2) }}
              </td>
              <td colspan="2" class="px-4 py-3 text-center border border-gray-300"></td>
              <td class="px-4 py-3 text-center font-bold text-yellow-700 bg-yellow-100 border border-gray-300">
                {{ summary.totalKwhUsed.toFixed(2) }}
              </td>
              <td class="px-4 py-3 text-center font-bold border border-gray-300">
                {{ summary.totalOutput.toFixed(2) }}
              </td>
              <td class="px-4 py-3 text-center font-bold border border-gray-300">
                {{ (summary.totalInput - summary.totalOutput).toFixed(2) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>

    <div v-else-if="!selectedMonth" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <p class="text-gray-600">Silakan pilih bulan untuk menampilkan data</p>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <p class="text-gray-600">Tidak ada data untuk bulan yang dipilih</p>
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
const selectedMonth = ref('')

// HELPER: Safe JSON Parse for Images (same as ProcessingTable.vue)
const safeParseImages = (imageData) => {
  if (!imageData) return []
  
  if (Array.isArray(imageData)) {
    return imageData
  }
  
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

// Fetch processes from Supabase
const fetchProcesses = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
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
      .order('start_datetime', { ascending: true })

    if (error) throw error

    // Transform data to include materials (UPDATED: Handle same way as ProcessingTable)
    processes.value = (data || []).map(p => {
      const rawMaterials = p.SB_Material_Used || []
      
      // Map materials with proper parsing
      const materials = rawMaterials.map(item => {
        const rawImg = item.material_images || item.images 
        const parsedImages = safeParseImages(rawImg)
        const matName = item.material_name || item.SB_Material?.material_name || 'Unknown'
        const qty = item.qty ? parseFloat(item.qty) : 0

        return {
          material_id: item.material_id,
          material_name: matName,
          container_number: item.container_number || 1,
          container_content: item.container_content || '',
          qty: qty,
          images: parsedImages
        }
      })

      return {
        ...p,
        materials: materials
      }
    })

    // Debug: log materials for first process
    if (processes.value.length > 0) {
      console.log('Sample process materials:', processes.value[0].materials)
    }

    // Set default selected month to latest
    if (processes.value.length > 0) {
      const latestMonth = processes.value[processes.value.length - 1].start_datetime.substring(0, 7)
      selectedMonth.value = latestMonth
    }
  } catch (err) {
    console.error('Error fetching processes:', err)
  } finally {
    loading.value = false
  }
}

// Get unique months
const months = computed(() => {
  const monthSet = new Set(
    processes.value.map(p => p.start_datetime.substring(0, 7))
  )
  return [...monthSet].sort()
})

// Filter processes by selected month
const filteredProcesses = computed(() => {
  if (!selectedMonth.value) return []
  return processes.value.filter(p => 
    p.start_datetime.startsWith(selectedMonth.value)
  )
})

// Get all unique material names across filtered processes
const materialColumns = computed(() => {
  const materials = new Set()
  filteredProcesses.value.forEach(p => {
    p.materials.forEach(m => {
      materials.add(m.material_name)
    })
  })
  const cols = Array.from(materials).sort()
  console.log('Material columns:', cols)
  return cols
})

// Get material quantity for a specific process and material (FIXED: Sum all containers)
const getMaterialQty = (process, materialName) => {
  const materialsOfType = process.materials.filter(m => m.material_name === materialName)
  
  if (materialsOfType.length === 0) return '-'
  
  // Sum all quantities for this material type
  const totalQty = materialsOfType.reduce((sum, m) => sum + m.qty, 0)
  
  return totalQty > 0 ? totalQty.toFixed(2) : '-'
}

// Get total for a specific material
const getTotalMaterial = (materialName) => {
  const total = filteredProcesses.value.reduce((sum, p) => {
    const materialsOfType = p.materials.filter(m => m.material_name === materialName)
    const processTotal = materialsOfType.reduce((pSum, m) => pSum + m.qty, 0)
    return sum + processTotal
  }, 0)
  return total > 0 ? total.toFixed(2) : '-'
}

// Calculate summary
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

const calculateDuration = (process) => {
  if (!process.start_datetime || !process.end_datetime) return '-'
  const start = new Date(process.start_datetime.replace(' ', 'T'))
  const end = new Date(process.end_datetime.replace(' ', 'T'))
  const hours = (end - start) / (1000 * 60 * 60)
  return Math.round(hours)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString.replace(' ', 'T')).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatMonthYear = (monthString) => {
  const [year, month] = monthString.split('-')
  return new Date(year, month - 1).toLocaleDateString('id-ID', {
    month: 'short',
    year: 'numeric'
  })
}

const formatMonthYearLong = (monthString) => {
  const [year, month] = monthString.split('-')
  return new Date(year, month - 1).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric'
  })
}

// Export PDF (Manual Table - WITHOUT IMAGES)
const exportPDF = async () => {
  try {
    const { default: jsPDF } = await import('jspdf')
    
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })
    
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    const margin = 10
    
    // Title
    doc.setFontSize(16)
    doc.setFont(undefined, 'bold')
    doc.text('Pengolahan pupuk organik', margin, 15)
    
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text(`Pengolahan Bahan: ${formatMonthYearLong(selectedMonth.value)}`, margin, 22)
    
    // Manual table drawing
    let startY = 30
    const headerHeight = 10
    const rowHeight = 8
    
    // Calculate column widths
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
    
    const colWidths = [
      colNo,
      colDate,
      colDate,
      colJam,
      ...Array(numMaterials).fill(materialColWidth),
      colTotal,
      colKwh,
      colKwh,
      colPemakaian,
      colHasil,
      colPenyusutan
    ]
    
    // Draw Header
    doc.setDrawColor(0, 0, 0)
    doc.setLineWidth(0.3)
    doc.setFillColor(220, 220, 220)
    doc.setFontSize(8)
    doc.setFont(undefined, 'bold')
    
    const headers = [
      'No.',
      'Tanggal\nMulai',
      'Tanggal\nSelesai',
      'Jam',
      ...materialColumns.value.map(m => {
        const words = m.split(' ')
        return words.length > 1 ? words.join('\n') + '\n(kg)' : m + '\n(kg)'
      }),
      'Total\nBahan\n(kg)',
      'Kwh\nAwal',
      'Kwh\nAkhir',
      'Pemakaian',
      'Hasil\nPengolahan\n(kg)',
      'Penyusutan\n(kg)'
    ]
    
    let x = margin
    
    // Draw header backgrounds first
    headers.forEach((header, i) => {
      doc.setFillColor(220, 220, 220)
      doc.rect(x, startY, colWidths[i], headerHeight, 'FD')
      x += colWidths[i]
    })
    
    // Reset x and draw header text
    x = margin
    doc.setTextColor(0, 0, 0)
    headers.forEach((header, i) => {
      const lines = header.split('\n')
      const lineHeight = 3
      const totalTextHeight = lines.length * lineHeight
      const startTextY = startY + (headerHeight - totalTextHeight) / 2 + lineHeight
      
      lines.forEach((line, lineIdx) => {
        doc.text(line, x + colWidths[i] / 2, startTextY + (lineIdx * lineHeight), { align: 'center' })
      })
      
      x += colWidths[i]
    })
    
    startY += headerHeight
    
    // Draw Body Rows
    doc.setFont(undefined, 'normal')
    doc.setFontSize(8)
    
    filteredProcesses.value.forEach((p, idx) => {
      // Check if we need new page
      if (startY > pageHeight - 30) {
        doc.addPage()
        startY = 20
      }
      
      x = margin
      const rowData = [
        (idx + 1) + '.',
        formatDate(p.start_datetime),
        formatDate(p.end_datetime),
        calculateDuration(p).toString(),
        ...materialColumns.value.map(mat => getMaterialQty(p, mat)),
        p.input_amount_kg.toFixed(2),
        p.kwh_start.toString(),
        p.kwh_end.toString(),
        (p.kwh_end - p.kwh_start).toFixed(2),
        p.output_amount_kg.toFixed(2),
        (p.input_amount_kg - p.output_amount_kg).toFixed(2)
      ]
      
      // Draw row background and borders first
      rowData.forEach((data, i) => {
        if (idx % 2 === 0) {
          doc.setFillColor(255, 255, 255)
        } else {
          doc.setFillColor(248, 248, 248)
        }
        
        doc.rect(x, startY, colWidths[i], rowHeight, 'FD')
        x += colWidths[i]
      })
      
      // Reset x and draw text on top
      x = margin
      doc.setTextColor(0, 0, 0)
      rowData.forEach((data, i) => {
        const text = data.toString()
        doc.text(text, x + colWidths[i] / 2, startY + rowHeight / 2 + 2.5, { align: 'center' })
        x += colWidths[i]
      })
      
      startY += rowHeight
    })
    
    // Draw Footer (Total Row)
    doc.setFillColor(255, 255, 200)
    doc.setFont(undefined, 'bold')
    doc.setFontSize(9)
    
    x = margin
    const footerData = [
      'Total',
      '',
      '',
      '',
      ...materialColumns.value.map(mat => getTotalMaterial(mat)),
      summary.value.totalInput.toFixed(2),
      '',
      '',
      summary.value.totalKwhUsed.toFixed(2),
      summary.value.totalOutput.toFixed(2),
      (summary.value.totalInput - summary.value.totalOutput).toFixed(2)
    ]
    
    // Draw footer backgrounds first
    footerData.forEach((data, i) => {
      doc.rect(x, startY, colWidths[i], rowHeight, 'FD')
      x += colWidths[i]
    })
    
    // Reset x and draw footer text
    x = margin
    doc.setTextColor(0, 0, 0)
    footerData.forEach((data, i) => {
      if (data) {
        doc.text(data.toString(), x + colWidths[i] / 2, startY + rowHeight / 2 + 2.5, { align: 'center' })
      }
      x += colWidths[i]
    })
    
    startY += rowHeight
    
    // Note
    doc.setFontSize(8)
    doc.setFont(undefined, 'italic')
    doc.setTextColor(100, 100, 100)
    doc.text('Keterangan: FW 30/10/2025 = Tanpa Di cacah', margin, startY + 6)
    
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