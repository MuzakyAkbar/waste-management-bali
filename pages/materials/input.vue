<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Material Input</h1>
        <p class="text-sm text-gray-500 mt-0.5">Pencatatan penerimaan material dari berbagai lokasi</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="exportPDF"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-sm font-bold transition-colors disabled:opacity-50"
          :disabled="materialInputs.length === 0 || pdfGenerating"
        >
          <span v-if="pdfGenerating">Memproses...</span>
          <span v-else>📄 PDF</span>
        </button>
        <button
          @click="exportExcel"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 text-sm font-bold transition-colors disabled:opacity-50"
          :disabled="materialInputs.length === 0"
        >
          📊 Excel
        </button>
        <button
          @click="showInputModal = true"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium transition-colors ml-2 shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Input
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Material</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lokasi</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Periode</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Jumlah (kg)</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Foto</th>
              <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="inputLoading">
              <td colspan="7" class="px-6 py-8 text-center text-gray-400 text-sm">Memuat data...</td>
            </tr>
            <tr
              v-for="item in materialInputs"
              :key="item.input_id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(item.input_date) }}</td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ getMaterialName(item.material_id) }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">
                <span class="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium border border-blue-100">
                  {{ getLocationName(item.location_id) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                <span v-if="item.pickup_period" class="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium">
                  {{ item.pickup_period }}
                </span>
                <span v-else class="text-gray-400 italic text-xs">-</span>
              </td>
              <td class="px-6 py-4 text-sm font-bold text-gray-900">
                {{ item.quantity_kg?.toLocaleString('id-ID') }} kg
              </td>
              <td class="px-6 py-4">
                <div v-if="item.image_url">
                  <img
                    :src="item.image_url"
                    class="w-10 h-10 rounded-lg object-cover border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                    @click="previewImage = item.image_url"
                    alt="foto material"
                  />
                </div>
                <span v-else class="text-xs text-gray-400 italic">Tidak ada foto</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="handleDeleteInput(item.input_id)"
                  class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition text-xs font-semibold"
                >
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="!inputLoading && materialInputs.length === 0">
              <td colspan="7" class="px-6 py-10 text-center text-gray-400 text-sm">Belum ada data input material.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="materialInputs.length > 0" class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center gap-6 text-sm">
        <span class="text-gray-500">Total records: <b class="text-gray-700">{{ materialInputs.length }}</b></span>
        <span class="text-gray-500">Total material: <b class="text-emerald-700">{{ totalQuantity.toLocaleString('id-ID') }} kg</b></span>
      </div>
    </div>

    <!-- Modal Tambah Material Input -->
    <div v-if="showInputModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl overflow-y-auto max-h-[90vh]">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-lg font-bold text-gray-900">Tambah Material Input</h3>
          <button @click="closeInputModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Input</label>
              <input
                v-model="inputForm.input_date"
                type="date"
                class="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Periode Pengambilan</label>
              <select v-model="inputForm.pickup_period" class="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-sm focus:ring-emerald-500 focus:border-emerald-500">
                <option :value="null" disabled>-- Pilih Periode --</option>
                <option value="Harian">Harian</option>
                <option value="Mingguan">Mingguan</option>
                <option value="Bulanan">Bulanan</option>
                <option value="Tahunan">Tahunan</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi Asal</label>
            <select v-model="inputForm.location_id" class="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-sm focus:ring-emerald-500 focus:border-emerald-500">
              <option :value="null" disabled>-- Pilih Lokasi --</option>
              <option v-for="loc in locationStore.locations" :key="loc.location_id" :value="loc.location_id">
                {{ loc.location_name || loc.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Material</label>
            <select v-model="inputForm.material_id" class="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-sm focus:ring-emerald-500 focus:border-emerald-500">
              <option :value="null" disabled>-- Pilih Material --</option>
              <option v-for="mat in materialStore.materials" :key="mat.material_id" :value="mat.material_id">
                {{ mat.material_name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah (kg)</label>
            <input
              v-model.number="inputForm.quantity_kg"
              type="number"
              step="0.01"
              min="0"
              class="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="0.00"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Foto Material <span class="text-gray-400 font-normal">(opsional)</span></label>
            <ImageUpload
              ref="imageUploadRef"
              :max-images="1"
              label="Upload Foto Material"
              @images-changed="handleMaterialImageChanged"
            />
          </div>
        </div>

        <div v-if="inputError" class="mt-3 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">{{ inputError }}</div>

        <div class="mt-6 flex justify-end gap-2">
          <button @click="closeInputModal" class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Batal</button>
          <button
            @click="handleSubmitInput"
            :disabled="inputSubmitLoading"
            class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
          >
            {{ inputSubmitLoading ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Preview Image -->
    <div v-if="previewImage" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" @click="previewImage = null">
      <img :src="previewImage" class="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMaterialStore } from '~/stores/useMaterialStore'
import { useLocationStore } from '~/stores/useLocationStore'
import ImageUpload from '~/components/common/ImageUpload.vue'
import * as XLSX from 'xlsx'

definePageMeta({
  middleware: 'auth'
})

const materialStore = useMaterialStore()
const locationStore = useLocationStore()
const supabase = useSupabaseClient()

const showInputModal = ref(false)
const inputLoading = ref(false)
const inputSubmitLoading = ref(false)
const inputError = ref(null)
const materialInputs = ref([])
const previewImage = ref(null)
const selectedFile = ref(null)
const imageUploadRef = ref(null)
const pdfGenerating = ref(false)

const inputForm = ref({
  input_date: new Date().toISOString().split('T')[0],
  location_id: null,
  material_id: null,
  quantity_kg: null,
  pickup_period: null
})

const totalQuantity = computed(() =>
  materialInputs.value.reduce((sum, item) => sum + (item.quantity_kg || 0), 0)
)

const getLocationName = (locationId) => {
  if (!locationId) return 'Unknown'
  const loc = locationStore.locations.find(l => l.location_id === locationId)
  return loc?.location_name || loc?.name || 'Unknown'
}

const getMaterialName = (materialId) => {
  if (!materialId) return 'Unknown'
  const mat = materialStore.materials.find(m => m.material_id === materialId)
  return mat?.material_name || 'Unknown'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
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
      } catch (e) { reject(e) }
    }
    img.onerror = reject
    img.src = url
  })
}

const exportExcel = () => {
  if (materialInputs.value.length === 0) return alert('Tidak ada data untuk diexport.')
  try {
    const wsData = [
      ['REKAP DATA MATERIAL INPUT'],
      [`Tanggal Export: ${formatDate(new Date())}`],
      [`Total Data: ${materialInputs.value.length} Record`],
      [`Total Keseluruhan Berat: ${totalQuantity.value.toLocaleString('id-ID')} Kg`],
      [''],
      ['No', 'Tanggal Input', 'Nama Material', 'Lokasi Asal', 'Periode Pengambilan', 'Jumlah Berat (kg)', 'Ada Foto?']
    ]
    materialInputs.value.forEach((item, index) => {
      wsData.push([
        index + 1,
        formatDate(item.input_date),
        getMaterialName(item.material_id),
        getLocationName(item.location_id),
        item.pickup_period || '-',
        item.quantity_kg,
        item.image_url ? 'Ya' : 'Tidak'
      ])
    })
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    ws['!cols'] = [{ wch: 5 }, { wch: 15 }, { wch: 25 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 10 }]
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Material')
    XLSX.writeFile(wb, `Material_Input_${new Date().getTime()}.xlsx`)
  } catch (err) {
    console.error('Excel export error:', err)
    alert('Gagal membuat file Excel.')
  }
}

const exportPDF = async () => {
  if (materialInputs.value.length === 0) return alert('Tidak ada data untuk diexport.')
  pdfGenerating.value = true
  try {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    let y = 20
    const margin = 10

    doc.setFontSize(16).setFont(undefined, 'bold')
    doc.setTextColor(16, 185, 129)
    doc.text('LAPORAN MATERIAL INPUT', margin, y)
    y += 10
    doc.setFontSize(10).setFont(undefined, 'normal')
    doc.setTextColor(75, 85, 99)
    doc.text(`Tanggal Cetak: ${formatDate(new Date())}`, margin, y)
    y += 6
    doc.text(`Total Records: ${materialInputs.value.length} data`, margin, y)
    y += 6
    doc.text(`Total Keseluruhan Berat: ${totalQuantity.value.toLocaleString('id-ID')} Kg`, margin, y)
    y += 12

    const cols = [
      { name: 'No', w: 10 },
      { name: 'Tanggal', w: 22 },
      { name: 'Nama Material', w: 35 },
      { name: 'Lokasi Asal', w: 35 },
      { name: 'Periode', w: 25 },
      { name: 'Qty (Kg)', w: 18 },
      { name: 'Foto', w: 35 }
    ]

    doc.setFillColor(243, 244, 246)
    doc.rect(margin, y, pageWidth - (margin * 2), 10, 'F')
    doc.setFontSize(9).setFont(undefined, 'bold')
    doc.setTextColor(31, 41, 55)

    let xPos = margin
    cols.forEach(col => {
      doc.text(col.name, xPos + 2, y + 6.5)
      xPos += col.w
    })
    y += 10

    doc.setFont(undefined, 'normal').setFontSize(8)

    for (let i = 0; i < materialInputs.value.length; i++) {
      const item = materialInputs.value[i]
      const rowH = 25

      if (y + rowH > 280) {
        doc.addPage()
        y = 20
        doc.setFillColor(243, 244, 246)
        doc.rect(margin, y, pageWidth - (margin * 2), 10, 'F')
        doc.setFontSize(9).setFont(undefined, 'bold')
        xPos = margin
        cols.forEach(col => {
          doc.text(col.name, xPos + 2, y + 6.5)
          xPos += col.w
        })
        y += 10
        doc.setFont(undefined, 'normal').setFontSize(8)
      }

      xPos = margin
      doc.text(String(i + 1), xPos + 2, y + 8)
      xPos += cols[0].w
      doc.text(formatDate(item.input_date), xPos + 2, y + 8)
      xPos += cols[1].w
      const matName = doc.splitTextToSize(getMaterialName(item.material_id), cols[2].w - 4)
      doc.text(matName, xPos + 2, y + 8)
      xPos += cols[2].w
      const locName = doc.splitTextToSize(getLocationName(item.location_id), cols[3].w - 4)
      doc.text(locName, xPos + 2, y + 8)
      xPos += cols[3].w
      doc.text(item.pickup_period || '-', xPos + 2, y + 8)
      xPos += cols[4].w
      doc.setFont(undefined, 'bold')
      doc.text(String(item.quantity_kg), xPos + 2, y + 8)
      doc.setFont(undefined, 'normal')
      xPos += cols[5].w

      if (item.image_url) {
        try {
          const base64 = await getBase64ImageFromURL(item.image_url)
          if (base64) doc.addImage(base64, 'JPEG', xPos + 2, y + 2, 21, 21)
        } catch (e) {
          doc.setTextColor(239, 68, 68)
          doc.text('Img Err', xPos + 2, y + 12)
          doc.setTextColor(31, 41, 55)
        }
      } else {
        doc.setTextColor(156, 163, 175)
        doc.text('Tidak ada', xPos + 2, y + 12)
        doc.setTextColor(31, 41, 55)
      }

      y += rowH
      doc.setDrawColor(229, 231, 235)
      doc.line(margin, y, pageWidth - margin, y)
    }

    doc.save(`Material_Input_${new Date().getTime()}.pdf`)
  } catch (err) {
    console.error('PDF export error:', err)
    alert('Gagal membuat file PDF. Pastikan module jspdf sudah terinstall.')
  } finally {
    pdfGenerating.value = false
  }
}

const fetchMaterialInputs = async () => {
  inputLoading.value = true
  try {
    const { data, error } = await supabase
      .from('SB_Material_Input')
      .select('*')
      .order('input_date', { ascending: false })
    if (error) throw error
    materialInputs.value = data || []
  } catch (err) {
    console.error('Fetch material inputs error:', err)
  } finally {
    inputLoading.value = false
  }
}

const handleMaterialImageChanged = (images) => {
  if (images && images.length > 0) {
    selectedFile.value = images[0].file
  } else {
    selectedFile.value = null
  }
}

const closeInputModal = () => {
  showInputModal.value = false
  inputError.value = null
  selectedFile.value = null
  if (imageUploadRef.value) imageUploadRef.value.clearImages()
  inputForm.value = {
    input_date: new Date().toISOString().split('T')[0],
    location_id: null,
    material_id: null,
    quantity_kg: null,
    pickup_period: null
  }
}

const handleSubmitInput = async () => {
  inputError.value = null
  if (!inputForm.value.input_date || !inputForm.value.location_id || !inputForm.value.material_id || !inputForm.value.quantity_kg) {
    inputError.value = 'Harap isi semua field yang wajib.'
    return
  }
  inputSubmitLoading.value = true
  try {
    let image_url = null
    let image_path = null
    if (selectedFile.value) {
      const res = await materialStore.uploadImage(selectedFile.value, 'material-input-images', 'photos')
      if (!res.success) throw new Error('Gagal upload foto: ' + res.error)
      image_url = res.url
      image_path = res.path
    }
    const { error } = await supabase
      .from('SB_Material_Input')
      .insert([{
        input_date: inputForm.value.input_date,
        location_id: inputForm.value.location_id,
        material_id: inputForm.value.material_id,
        quantity_kg: inputForm.value.quantity_kg,
        pickup_period: inputForm.value.pickup_period,
        image_url,
        image_path
      }])
    if (error) throw error
    await fetchMaterialInputs()
    closeInputModal()
  } catch (err) {
    console.error('Submit input error:', err)
    inputError.value = err.message || 'Terjadi kesalahan.'
  } finally {
    inputSubmitLoading.value = false
  }
}

const handleDeleteInput = async (id) => {
  if (!confirm('Hapus record ini?')) return
  try {
    const { error } = await supabase
      .from('SB_Material_Input')
      .delete()
      .eq('input_id', id)
    if (error) throw error
    await fetchMaterialInputs()
  } catch (err) {
    alert('Gagal menghapus: ' + err.message)
  }
}

onMounted(async () => {
  await Promise.all([
    materialStore.fetchMaterials(),
    locationStore.fetchLocations(),
    fetchMaterialInputs()
  ])
})
</script>