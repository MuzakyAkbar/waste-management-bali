<!-- pages/electricity/summary.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h1 class="text-3xl font-bold text-gray-900">Pemakaian Listrik</h1>
        </div>
        <p class="text-gray-600">Laporan biaya listrik per kg hasil produksi</p>
      </div>
      <button 
        v-if="groupedData.length > 0"
        @click="exportPDF" 
        class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export PDF
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            Dari Bulan:
          </label>
          <select
            v-model="startMonth"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option v-for="month in availableMonths" :key="month" :value="month">
              {{ formatMonthName(month) }}
            </option>
          </select>
        </div>

        <div>
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            Sampai Bulan:
          </label>
          <select
            v-model="endMonth"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option v-for="month in availableMonths" :key="month" :value="month">
              {{ formatMonthName(month) }}
            </option>
          </select>
        </div>
      </div>

      <div class="mt-4 pt-4 border-t border-gray-200">
        <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Harga Listrik per kWh:
        </label>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">Rp</span>
          <input
            v-model.number="kwhPrice"
            type="number"
            step="100"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
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

    <!-- Summary Table -->
    <div v-else-if="groupedData.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 class="text-lg font-bold text-gray-900">
          Pemakaian Listrik - {{ formatMonthName(startMonth) }} s/d {{ formatMonthName(endMonth) }}
        </h3>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">
                No.
              </th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">
                Tanggal
              </th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">
                Hasil (kg)
              </th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">
                Total Jam
              </th>
              <th class="px-4 py-3 text-center text-xs font-bold text-yellow-700 uppercase border border-gray-300 bg-yellow-50">
                Listrik Dipakai
              </th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">
                Rupiah Listrik
              </th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300 bg-green-50">
                Rupiah Listrik/Kg
              </th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300 bg-blue-50">
                Bulan
              </th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <template v-for="(monthGroup, monthIndex) in groupedData" :key="monthGroup.month">
              <!-- Month rows -->
              <tr v-for="(item, itemIndex) in monthGroup.items" :key="item.dateRange" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-center border border-gray-300">
                  {{ item.rowNumber }}.
                </td>
                <td class="px-4 py-3 text-center border border-gray-300 font-medium">
                  {{ item.dateRange }}
                </td>
                <td class="px-4 py-3 text-center border border-gray-300 font-semibold">
                  {{ item.totalOutput.toFixed(2) }}
                </td>
                <td class="px-4 py-3 text-center border border-gray-300">
                  {{ item.totalHours }}
                </td>
                <td class="px-4 py-3 text-center border border-gray-300 font-bold text-yellow-700 bg-yellow-50">
                  {{ item.totalKwh.toFixed(2) }}
                </td>
                <td class="px-4 py-3 text-center border border-gray-300 font-semibold">
                  {{ formatCurrency(item.electricityCost) }}
                </td>
                <td class="px-4 py-3 text-center border border-gray-300 font-semibold text-green-700 bg-green-50">
                  {{ formatCurrency(item.costPerKg) }}
                </td>
                <td v-if="itemIndex === 0" :rowspan="monthGroup.items.length" class="px-4 py-3 text-center border border-gray-300 font-bold text-blue-700 bg-blue-50 align-middle">
                  {{ monthGroup.monthName }}
                </td>
              </tr>
              
            </template>
          </tbody>
          <tfoot class="bg-yellow-100">
            <tr>
              <td colspan="2" class="px-4 py-3 text-center font-bold border border-gray-300">
                TOTAL
              </td>
              <td class="px-4 py-3 text-center font-bold border border-gray-300">
                {{ grandTotal.totalOutput.toFixed(2) }}
              </td>
              <td class="px-4 py-3 text-center font-bold border border-gray-300">
                {{ grandTotal.totalHours }}
              </td>
              <td class="px-4 py-3 text-center font-bold text-yellow-700 bg-yellow-100 border border-gray-300">
                {{ grandTotal.totalKwh.toFixed(2) }}
              </td>
              <td class="px-4 py-3 text-center font-bold border border-gray-300">
                {{ formatCurrency(grandTotal.electricityCost) }}
              </td>
              <td class="px-4 py-3 text-center font-bold text-green-700 bg-green-100 border border-gray-300">
                {{ formatCurrency(grandTotal.avgCostPerKg) }}
              </td>
              <td class="px-4 py-3 border border-gray-300"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <p class="text-gray-600">Tidak ada data untuk periode yang dipilih</p>
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
const allProcesses = ref([])
const startMonth = ref('')
const endMonth = ref('')
const kwhPrice = ref(1700)

const fetchProcesses = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('SB_Processing')
      .select('start_datetime, end_datetime, kwh_start, kwh_end, output_amount_kg')
      .not('end_datetime', 'is', null)
      .order('start_datetime', { ascending: true })

    if (error) throw error

    allProcesses.value = data || []
    
    if (availableMonths.value.length > 0) {
      startMonth.value = availableMonths.value[0]
      endMonth.value = availableMonths.value[availableMonths.value.length - 1]
    }
  } catch (err) {
    console.error('Error fetching processes:', err)
  } finally {
    loading.value = false
  }
}

const availableMonths = computed(() => {
  const months = new Set(
    allProcesses.value.map(p => p.start_datetime.substring(0, 7))
  )
  return [...months].sort()
})

const filteredSummary = computed(() => {
  if (!startMonth.value || !endMonth.value) return []
  
  const processes = allProcesses.value.filter(p => {
    const pMonth = p.start_datetime.substring(0, 7)
    return pMonth >= startMonth.value && pMonth <= endMonth.value
  })

  const grouped = {}
  
  processes.forEach(p => {
    const startDate = p.start_datetime.split(' ')[0]
    const endDate = p.end_datetime.split(' ')[0]
    const dateRange = `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`
    
    if (!grouped[dateRange]) {
      grouped[dateRange] = {
        dateRange,
        month: p.start_datetime.substring(0, 7),
        processes: [],
        totalOutput: 0,
        totalKwh: 0,
        totalHours: 0
      }
    }
    
    const kwh = (p.kwh_end || 0) - (p.kwh_start || 0)
    const hours = calculateHours(p.start_datetime, p.end_datetime)
    
    grouped[dateRange].processes.push(p)
    grouped[dateRange].totalOutput += p.output_amount_kg || 0
    grouped[dateRange].totalKwh += kwh
    grouped[dateRange].totalHours += hours
  })
  
  return Object.values(grouped).map(item => {
    const electricityCost = item.totalKwh * kwhPrice.value
    const costPerKg = item.totalOutput > 0 ? electricityCost / item.totalOutput : 0
    
    return {
      ...item,
      electricityCost,
      costPerKg
    }
  })
})

// Group data by month
const groupedData = computed(() => {
  const grouped = {}
  let rowNumber = 1
  
  filteredSummary.value.forEach(item => {
    const month = item.month
    
    if (!grouped[month]) {
      grouped[month] = {
        month,
        monthName: formatMonthName(month),
        items: []
      }
    }
    
    grouped[month].items.push({
      ...item,
      rowNumber: rowNumber++
    })
  })
  
  return Object.values(grouped)
})

const grandTotal = computed(() => {
  const total = filteredSummary.value.reduce((acc, item) => ({
    totalOutput: acc.totalOutput + item.totalOutput,
    totalKwh: acc.totalKwh + item.totalKwh,
    totalHours: acc.totalHours + item.totalHours,
    electricityCost: acc.electricityCost + item.electricityCost
  }), { totalOutput: 0, totalKwh: 0, totalHours: 0, electricityCost: 0 })
  
  const avgCostPerKg = total.totalOutput > 0 ? total.electricityCost / total.totalOutput : 0
  
  return {
    ...total,
    avgCostPerKg
  }
})

const calculateHours = (start, end) => {
  if (!start || !end) return 0
  const startDate = new Date(start.replace(' ', 'T'))
  const endDate = new Date(end.replace(' ', 'T'))
  return Math.round((endDate - startDate) / (1000 * 60 * 60))
}

const formatDateShort = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatMonthName = (monthStr) => {
  const [year, month] = monthStr.split('-')
  return new Date(year, month - 1).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric'
  })
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

// Export PDF
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
    doc.text('Pemakaian Listrik', margin, 15)
    
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text(`Periode: ${formatMonthName(startMonth.value)} s/d ${formatMonthName(endMonth.value)}`, margin, 22)
    doc.text(`Harga Listrik: Rp ${kwhPrice.value}/kWh`, margin, 28)
    
    // Table
    let startY = 35
    const headerHeight = 8
    const rowHeight = 7
    
    // Column widths
    const colNo = 10
    const colDate = 45
    const colHasil = 25
    const colJam = 20
    const colKwh = 25
    const colRupiah = 30
    const colPerKg = 35
    const colBulan = 30
    
    const colWidths = [colNo, colDate, colHasil, colJam, colKwh, colRupiah, colPerKg, colBulan]
    
    // Draw Header
    doc.setDrawColor(0, 0, 0)
    doc.setLineWidth(0.3)
    doc.setFillColor(220, 220, 220)
    doc.setFontSize(8)
    doc.setFont(undefined, 'bold')
    doc.setTextColor(0, 0, 0)
    
    let x = margin
    const headers = ['No.', 'Tanggal', 'Hasil (kg)', 'Total Jam', 'Listrik Dipakai', 'Rupiah Listrik', 'Rupiah Listrik/Kg', 'Bulan']
    
    headers.forEach((header, i) => {
      doc.setFillColor(220, 220, 220)
      if (i === 4) doc.setFillColor(255, 255, 200)
      if (i === 6) doc.setFillColor(220, 252, 231)
      if (i === 7) doc.setFillColor(219, 234, 254)
      
      doc.rect(x, startY, colWidths[i], headerHeight, 'FD')
      doc.text(header, x + colWidths[i] / 2, startY + 5.5, { align: 'center' })
      x += colWidths[i]
    })
    
    startY += headerHeight
    
    // Draw Body Rows (grouped by month)
    doc.setFont(undefined, 'normal')
    doc.setFontSize(8)
    
    let currentMonth = ''
    let monthStartY = 0
    let monthRowCount = 0
    
    groupedData.value.forEach((monthGroup, monthIndex) => {
      monthStartY = startY
      monthRowCount = monthGroup.items.length
      
      monthGroup.items.forEach((item, itemIndex) => {
        if (startY > pageHeight - 25) {
          doc.addPage()
          startY = 20
          monthStartY = startY
        }
        
        x = margin
        const rowData = [
          item.rowNumber + '.',
          item.dateRange,
          item.totalOutput.toFixed(2),
          item.totalHours.toString(),
          item.totalKwh.toFixed(2),
          formatCurrency(item.electricityCost),
          formatCurrency(item.costPerKg),
          '' // Bulan - will be drawn with rowspan
        ]
        
        // Draw backgrounds (except month column)
        for (let i = 0; i < rowData.length - 1; i++) {
          doc.setFillColor(255, 255, 255)
          
          if (i === 4) doc.setFillColor(255, 255, 230)
          if (i === 6) doc.setFillColor(240, 253, 244)
          
          doc.rect(x, startY, colWidths[i], rowHeight, 'FD')
          x += colWidths[i]
        }
        
        // Draw month column with rowspan (only on first row)
        if (itemIndex === 0) {
          doc.setFillColor(219, 234, 254)
          doc.rect(x, startY, colBulan, rowHeight * monthRowCount, 'FD')
          
          // Draw month text centered vertically
          doc.setTextColor(30, 64, 175)
          doc.setFont(undefined, 'bold')
          doc.setFontSize(9)
          const monthTextY = startY + (rowHeight * monthRowCount / 2) + 2.5
          doc.text(monthGroup.monthName, x + colBulan / 2, monthTextY, { align: 'center' })
        }
        
        // Draw text for data columns
        x = margin
        doc.setTextColor(0, 0, 0)
        for (let i = 0; i < rowData.length - 1; i++) {
          if (i === 4) {
            doc.setTextColor(180, 83, 9)
            doc.setFont(undefined, 'bold')
          } else if (i === 6) {
            doc.setTextColor(22, 101, 52)
            doc.setFont(undefined, 'bold')
          } else {
            doc.setTextColor(0, 0, 0)
            doc.setFont(undefined, 'normal')
          }
          
          doc.setFontSize(8)
          doc.text(rowData[i].toString(), x + colWidths[i] / 2, startY + rowHeight / 2 + 2.5, { align: 'center' })
          x += colWidths[i]
        }
        
        startY += rowHeight
      })
    })
    
    // Draw Footer (Total)
    startY += 2
    doc.setFillColor(255, 255, 200)
    doc.setFont(undefined, 'bold')
    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    
    x = margin
    const footerData = [
      'TOTAL',
      '',
      grandTotal.value.totalOutput.toFixed(2),
      grandTotal.value.totalHours.toString(),
      grandTotal.value.totalKwh.toFixed(2),
      formatCurrency(grandTotal.value.electricityCost),
      formatCurrency(grandTotal.value.avgCostPerKg),
      ''
    ]
    
    // Draw footer backgrounds
    footerData.forEach((data, i) => {
      if (i === 0 || i === 1) {
        if (i === 0) {
          doc.setFillColor(255, 255, 200)
          doc.rect(x, startY, colNo + colDate, rowHeight, 'FD')
        }
      } else if (i === 7) {
        // Empty month column
        doc.setFillColor(255, 255, 200)
        doc.rect(x, startY, colWidths[i], rowHeight, 'FD')
      } else {
        doc.setFillColor(255, 255, 200)
        if (i === 4) doc.setFillColor(255, 255, 150)
        if (i === 6) doc.setFillColor(220, 252, 231)
        
        doc.rect(x, startY, colWidths[i], rowHeight, 'FD')
      }
      x += colWidths[i]
    })
    
    // Draw footer text
    x = margin
    footerData.forEach((data, i) => {
      if (i === 0) {
        doc.setTextColor(0, 0, 0)
        doc.text('TOTAL', x + (colNo + colDate) / 2, startY + rowHeight / 2 + 2.5, { align: 'center' })
      } else if (i > 1 && i < 7 && data) {
        if (i === 4) {
          doc.setTextColor(180, 83, 9)
        } else if (i === 6) {
          doc.setTextColor(22, 101, 52)
        } else {
          doc.setTextColor(0, 0, 0)
        }
        
        doc.text(data.toString(), x + colWidths[i] / 2, startY + rowHeight / 2 + 2.5, { align: 'center' })
      }
      x += colWidths[i]
    })
    
    const fileName = `Pemakaian_Listrik_${formatMonthName(startMonth.value).replace(/\s+/g, '_')}_sd_${formatMonthName(endMonth.value).replace(/\s+/g, '_')}.pdf`
    doc.save(fileName)
  } catch (err) {
    console.error('Error exporting PDF:', err)
    alert('Gagal export PDF: ' + err.message)
  }
}

onMounted(() => {
  fetchProcesses()
})
</script>