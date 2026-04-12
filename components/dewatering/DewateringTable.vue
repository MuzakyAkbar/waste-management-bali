<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">

    <div v-if="!loading && processes && processes.length > 0" class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
      <h3 class="font-bold text-gray-800 text-lg">Dewatering Activity List</h3>
      <button
        @click="$emit('add-new')"
        class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 shadow-sm transition-all"
      >
        <svg class="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Activity
      </button>
    </div>

    <div v-if="loading" class="p-12 text-center flex-1 flex flex-col justify-center items-center">
      <svg class="animate-spin h-12 w-12 text-cyan-600 mb-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600 font-medium">Memuat data dewatering...</p>
    </div>

    <div v-else-if="!processes || processes.length === 0" class="p-12 text-center flex-1 flex flex-col justify-center items-center">
      <div class="w-20 h-20 bg-cyan-50 rounded-full mb-4 flex items-center justify-center">
        <svg class="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Belum ada aktivitas dewatering</h3>
      <p class="text-gray-500 mb-6 max-w-sm mx-auto">Mulai dengan mencatat aktivitas dewatering baru.</p>
      <button
        @click="$emit('add-new')"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-cyan-600 hover:bg-cyan-700 shadow-sm transition-all"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Buat Aktivitas Baru
      </button>
    </div>

    <div v-else class="flex-1 bg-gray-50/50">

      <!-- Desktop Table -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Process Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Input (kg)</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Output (kg)</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-for="process in sortedProcesses" :key="process.id">
              <tr class="hover:bg-gray-50 transition-colors group">
                <td class="px-6 py-4">
                  <span class="text-sm font-bold text-gray-900">{{ process.process_name }}</span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span v-if="process.activity_date" class="text-sm font-semibold text-gray-900">{{ formatDate(process.activity_date) }}</span>
                    <span v-else class="text-sm text-gray-400 italic">Not started</span>
                    <span v-if="process.activity_date" class="text-xs text-gray-500">{{ formatTime(process.activity_date) }}</span>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ formatNumber(process.input_amount) }}
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium" :class="process.status === 'completed' ? 'text-cyan-600' : 'text-gray-400'">
                    {{ process.status === 'completed' ? formatNumber(process.output_amount) : '-' }}
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="process.status === 'created'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Created
                  </span>
                  <span v-else-if="process.status === 'in_progress'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    In Progress
                  </span>
                  <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                    Completed
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      v-if="process.status === 'created'"
                      @click="$emit('input-kwh', process)"
                      class="text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-md transition text-xs font-semibold shadow-sm"
                    >
                      ⚡ Input KWh
                    </button>

                    <button
                      v-if="process.status === 'created' || process.status === 'in_progress'"
                      @click="$emit('manage-materials', process.id)"
                      class="text-cyan-600 hover:text-cyan-900 bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 rounded-md transition text-xs font-semibold"
                    >
                      + Materials
                    </button>

                    <button
                      v-if="process.status === 'in_progress'"
                      @click="$emit('complete', process)"
                      class="text-white bg-cyan-600 hover:bg-cyan-700 px-3 py-1.5 rounded-md transition text-xs font-semibold shadow-sm"
                    >
                      Complete
                    </button>

                    <button
                      v-if="process.status === 'completed'"
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

              <!-- Detail Row -->
              <tr v-if="expandedRows.includes(process.id) && process.status === 'completed'" class="bg-gray-50/50">
                <td colspan="6" class="px-6 py-8">
                  <div class="bg-white border-2 border-gray-300 rounded-lg p-8 shadow-md max-w-6xl mx-auto">

                    <div class="mb-8 pb-4 border-b-4 border-cyan-700">
                      <div class="flex justify-between items-end">
                        <div>
                          <h4 class="text-2xl font-black text-gray-900 uppercase tracking-tighter">{{ process.process_name }}</h4>
                          <p class="text-md font-bold text-gray-600">ID Laporan: {{ process.id }}</p>
                          <p class="text-sm font-semibold text-gray-500 mt-1">Mulai: {{ formatDateTime(process.activity_date) }}</p>
                          <p class="text-sm font-semibold text-gray-500">Selesai: {{ formatDateTime(process.completed_at) }}</p>
                          <p class="text-sm font-semibold text-gray-500">Durasi: {{ formatDuration(process) }}</p>
                        </div>
                        <span class="text-xs font-bold text-cyan-700 uppercase bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">Dewatering</span>
                      </div>
                    </div>

                    <!-- Summary Table -->
                    <div class="mb-8 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                      <table class="w-full border-collapse text-center text-sm">
                        <thead>
                          <tr class="divide-x divide-gray-300 border-b border-gray-300">
                            <th colspan="3" class="bg-gray-200 py-3 font-bold text-gray-800 tracking-wider">KWH</th>
                            <th :colspan="getGroupedMaterials(process).length > 0 ? getGroupedMaterials(process).length : 1" class="bg-cyan-50 py-3 font-bold text-cyan-900 tracking-wider">BAHAN MASUK</th>
                            <th rowspan="2" class="bg-green-50 w-48 border-l border-gray-300 font-bold text-green-800 tracking-wider align-middle">HASIL (KG)</th>
                          </tr>
                          <tr class="divide-x divide-gray-200 border-b border-gray-200 bg-white">
                            <th class="py-2 px-4 font-semibold text-gray-600 w-24">Awal</th>
                            <th class="py-2 px-4 font-semibold text-gray-600 w-24">Akhir</th>
                            <th class="py-2 px-4 font-bold text-red-600 bg-red-50 w-28">Pemakaian</th>
                            <template v-if="getGroupedMaterials(process).length > 0">
                              <th v-for="mat in getGroupedMaterials(process)" :key="'h-'+mat.material_id" class="py-2 px-4 font-semibold text-gray-700 min-w-[120px]">{{ mat.material_name }}</th>
                            </template>
                            <template v-else>
                              <th class="py-2 px-4 text-gray-400 italic">Belum ada material</th>
                            </template>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-x divide-gray-200">
                          <tr class="divide-x divide-gray-200">
                            <td class="py-4 text-gray-900">{{ process.kwh_start }}</td>
                            <td class="py-4 text-gray-900">{{ process.kwh_end }}</td>
                            <td class="py-4 font-bold text-red-600 bg-red-50">{{ (process.kwh_end - process.kwh_start).toFixed(2) }}</td>
                            <template v-if="getGroupedMaterials(process).length > 0">
                              <td v-for="mat in getGroupedMaterials(process)" :key="'v-'+mat.material_id" class="py-4 align-top">
                                <div class="font-bold text-cyan-700 text-lg">{{ mat.total_qty }}</div>
                                <div class="text-xs text-gray-500">({{ mat.containers.length }} ember)</div>
                              </td>
                            </template>
                            <template v-else>
                              <td class="py-4 text-gray-300">-</td>
                            </template>
                            <td class="py-4 bg-green-50 align-middle">
                              <span class="text-3xl font-bold text-green-700">{{ formatNumber(process.output_amount) }}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <!-- Detail Material Table -->
                    <h5 class="text-sm font-black uppercase mb-4 text-gray-500 border-l-4 border-cyan-600 pl-2">Detail Material Per-Ember</h5>
                    <div class="overflow-x-auto mb-10">
                      <table class="w-full border-collapse border-2 border-gray-800 text-sm">
                        <thead class="bg-gray-100">
                          <tr>
                            <th class="border-2 border-gray-800 px-4 py-3 text-center font-bold">No</th>
                            <th class="border-2 border-gray-800 px-4 py-3 text-left font-bold">Nama Material</th>
                            <th class="border-2 border-gray-800 px-4 py-3 text-center font-bold">Ember #</th>
                            <th class="border-2 border-gray-800 px-4 py-3 text-center font-bold">Berat (kg)</th>
                            <th class="border-2 border-gray-800 px-4 py-3 text-center font-bold">Foto Bukti</th>

                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y-2 divide-gray-800">
                          <tr v-if="getAllMaterialContainers(process).length === 0">
                            <td colspan="6" class="border-2 border-gray-800 px-4 py-6 text-center text-gray-500 italic">Tidak ada data material</td>
                          </tr>
                          <tr v-for="(item, idx) in getAllMaterialContainers(process)" :key="`${item.material_name}-${item.container_number}`" class="hover:bg-gray-50">
                            <td class="border-2 border-gray-800 px-4 py-3 text-center text-gray-600">{{ idx + 1 }}</td>
                            <td class="border-2 border-gray-800 px-4 py-3 font-semibold">{{ item.material_name }}</td>
                            <td class="border-2 border-gray-800 px-4 py-3 text-center font-mono bg-cyan-50">{{ item.container_number }}</td>
                            <td class="border-2 border-gray-800 px-4 py-3 text-center font-bold text-cyan-700">{{ item.qty }}</td>
                            <td class="border-2 border-gray-800 px-4 py-3 text-center">
                              <div v-if="item.images && item.images.length > 0" class="flex justify-center gap-3 flex-wrap">
                                <div v-for="(img, imgIdx) in item.images" :key="imgIdx">
                                  <img :src="img.url" class="w-16 h-16 object-cover rounded border border-gray-300 cursor-pointer hover:brightness-90" @click="openImagePreview(img.url)" alt="Foto material">
                                </div>
                              </div>
                              <span v-else class="text-xs text-gray-400 italic">Tidak ada foto</span>
                            </td>
                            <td class="border-2 border-gray-800 px-4 py-3 text-gray-700 italic">{{ item.content || '-' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <!-- Visual Documentation -->
                    <h5 class="text-sm font-black uppercase mb-4 text-gray-500 border-l-4 border-cyan-600 pl-2">Dokumentasi Visual</h5>
                    <div class="flex flex-col gap-8">

                      <div class="space-y-2">
                        <div class="bg-gray-800 text-white text-xs font-bold py-2 px-3 rounded-t flex justify-between">
                          <span>1. KWh AWAL</span>
                          <span class="opacity-50">Start</span>
                        </div>
                        <div class="border border-gray-300 rounded-b p-2 bg-gray-50 min-h-[150px]">
                          <ImageGalleryViewer :images="process.kwh_start_images || []" :columns="4" empty-text="Tidak ada foto" />
                        </div>
                      </div>

                      <div class="space-y-2">
                        <div class="bg-gray-800 text-white text-xs font-bold py-2 px-3 rounded-t flex justify-between">
                          <span>2. KWh AKHIR</span>
                          <span class="opacity-50">End</span>
                        </div>
                        <div class="border border-gray-300 rounded-b p-2 bg-gray-50 min-h-[150px]">
                          <ImageGalleryViewer :images="process.kwh_end_images || []" :columns="4" empty-text="Tidak ada foto" />
                        </div>
                      </div>

                      <div class="space-y-2">
                        <div class="bg-cyan-700 text-white text-xs font-bold py-2 px-3 rounded-t flex justify-between">
                          <span>3. HASIL (OUTPUT)</span>
                          <span class="opacity-80">Result</span>
                        </div>
                        <div class="border border-cyan-200 rounded-b p-3 bg-cyan-50/30 flex flex-col gap-3 min-h-[150px]">
                          <div class="bg-white p-3 rounded border border-cyan-100 text-sm shadow-sm">
                            <div class="flex flex-wrap gap-x-8 gap-y-2">
                              <div class="flex-1 min-w-[200px]">
                                <span class="text-gray-500 font-bold block sm:inline mr-2">Catatan:</span>
                                <span class="text-gray-800">{{ process.notes && process.notes !== '-' ? process.notes : '-' }}</span>
                              </div>
                            </div>
                          </div>
                          <ImageGalleryViewer :images="process.output_images || []" :columns="4" empty-text="Tidak ada foto hasil" />
                        </div>
                      </div>

                    </div>

                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="lg:hidden space-y-4 p-4">
        <div v-for="process in sortedProcesses" :key="`mobile-${process.id}`" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-4 border-b border-gray-100">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-bold text-gray-900">{{ process.process_name }}</span>
              <span
                :class="{
                  'bg-gray-100 text-gray-800': process.status === 'created',
                  'bg-yellow-100 text-yellow-800': process.status === 'in_progress',
                  'bg-cyan-100 text-cyan-800': process.status === 'completed'
                }"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              >
                {{ process.status === 'created' ? 'Created' : process.status === 'in_progress' ? 'In Progress' : 'Completed' }}
              </span>
            </div>
            <div v-if="process.activity_date" class="text-xs text-gray-500">
              {{ formatDate(process.activity_date) }} {{ formatTime(process.activity_date) }}
            </div>
            <div v-else class="text-xs text-gray-400 italic">Not started yet</div>
          </div>

          <div class="p-4 space-y-3 text-sm">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500 mb-1">Input</p>
                <p class="font-bold text-gray-900">{{ formatNumber(process.input_amount) }} kg</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Output</p>
                <p class="font-bold" :class="process.status === 'completed' ? 'text-cyan-600' : 'text-gray-400'">
                  {{ process.status === 'completed' ? formatNumber(process.output_amount) + ' kg' : '-' }}
                </p>
              </div>
            </div>
          </div>

          <div class="p-3 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
            <div v-if="process.status === 'created'" class="flex flex-col gap-2">
              <button @click="$emit('input-kwh', process)" class="w-full bg-emerald-600 text-white py-2 rounded-md text-xs font-bold shadow-sm">⚡ Input KWh Start</button>
              <button @click="$emit('manage-materials', process.id)" class="w-full bg-cyan-600 text-white py-2 rounded-md text-xs font-bold">+ Add Materials</button>
            </div>
            <div v-if="process.status === 'in_progress'" class="flex flex-col gap-2">
              <button @click="$emit('manage-materials', process.id)" class="w-full bg-cyan-600 text-white py-2 rounded-md text-xs font-bold">+ Manage Materials</button>
              <button @click="$emit('complete', process)" class="w-full bg-cyan-700 text-white py-2 rounded-md text-xs font-bold">Complete Dewatering</button>
            </div>
            <div v-if="process.status === 'completed'" class="flex flex-col gap-2">
              <button @click="toggleDetails(process.id)" class="w-full bg-gray-200 text-gray-800 py-2 rounded-md text-xs font-bold">{{ expandedRows.includes(process.id) ? 'Hide Details' : 'Show Details' }}</button>
              <div class="grid grid-cols-2 gap-2">
                <button @click="exportPDF(process)" class="bg-red-50 text-red-600 py-2 rounded-md text-xs font-bold">📄 PDF</button>
                <button @click="exportExcel(process)" class="bg-green-50 text-green-600 py-2 rounded-md text-xs font-bold">📊 Excel</button>
              </div>
            </div>
          </div>

          <div v-if="expandedRows.includes(process.id) && process.status === 'completed'" class="p-4 bg-gray-50 border-t border-gray-200">
            <div class="bg-white border border-gray-300 rounded-lg p-4">
              <h4 class="text-lg font-bold text-gray-900 mb-2">{{ process.process_name }}</h4>
              <p class="text-xs text-gray-500 mb-1">ID: {{ process.id }}</p>
              <div class="mt-4 mb-4 bg-gray-50 p-3 rounded border border-gray-200">
                <h5 class="text-xs font-bold text-gray-700 uppercase mb-3">Informasi Hasil</h5>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Catatan:</p>
                  <p class="text-xs text-gray-800 bg-white p-2 rounded border border-gray-100">{{ process.notes || '-' }}</p>
                </div>
              </div>
              <div class="space-y-3">
                <div>
                  <p class="text-xs font-bold mb-1">Foto Hasil:</p>
                  <ImageGalleryViewer :images="process.output_images || []" :columns="2" empty-text="Tidak ada foto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ImageGalleryViewer from '~/components/common/ImageGalleryViewer.vue'
import { useDewateringStore } from '~/stores/useDewateringStore'
import * as XLSX from 'xlsx'

const props = defineProps({
  processes: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['complete', 'add-new', 'manage-materials', 'input-kwh'])
const dewateringStore = useDewateringStore()
const expandedRows = ref([])
const loadingMaterials = ref(null)

const sortedProcesses = computed(() => {
  if (!props.processes) return []
  return [...props.processes].sort((a, b) => {
    const dateA = new Date(a.activity_date || a.created_at || 0)
    const dateB = new Date(b.activity_date || b.created_at || 0)
    return dateB - dateA
  })
})

const formatDateSimple = (dt) => dt ? new Date(dt).toLocaleDateString('id-ID') : '-'
const formatNumber = (num) => num ? parseFloat(num).toFixed(2) : '0.00'

const formatDateTime = (dt) => {
  if (!dt) return '-'
  const dateStr = String(dt).replace(' ', 'T')
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'
  const day = String(date.getDate()).padStart(2, '0')
  const month = date.toLocaleString('id-ID', { month: 'short' })
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day} ${month} ${year}, ${hours}:${minutes}`
}

const formatDate = (dt) => {
  if (!dt) return '-'
  const dateStr = String(dt).replace(' ', 'T')
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'
  const day = String(date.getDate()).padStart(2, '0')
  const month = date.toLocaleString('id-ID', { month: 'short' })
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

const formatTime = (dt) => {
  if (!dt) return '-'
  const dateStr = String(dt).replace(' ', 'T')
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const formatDuration = (p) => {
  const startStr = p.start_datetime || p.activity_date
  const endStr = p.end_datetime || p.completed_at
  if (!startStr || !endStr) return '-'
  const start = new Date(String(startStr).replace(' ', 'T'))
  const end = new Date(String(endStr).replace(' ', 'T'))
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-'
  const hours = (end - start) / (1000 * 60 * 60)
  return `${Math.abs(hours).toFixed(1)} jam`
}

const safeParseImages = (imageData) => {
  if (!imageData) return []
  if (Array.isArray(imageData)) return imageData
  if (typeof imageData === 'string') {
    try {
      const parsed = JSON.parse(imageData.trim())
      return Array.isArray(parsed) ? parsed : []
    } catch (e) { return [] }
  }
  return []
}

const getMaterials = (process) => {
  const rawMaterials = (process.materials && process.materials.length > 0) ? process.materials : []
  return rawMaterials.map(item => ({
    material_id: item.material_id,
    material_name: item.material_name || 'Unknown',
    container_number: item.container_number || 1,
    container_content: item.container_content || '',
    qty: parseFloat(item.qty) || 0,
    images: safeParseImages(item.material_images || item.images)
  }))
}

const getGroupedMaterials = (process) => {
  const materials = getMaterials(process)
  const grouped = {}
  materials.forEach(m => {
    const name = m.material_name || 'Material'
    if (!grouped[name]) {
      grouped[name] = { material_id: m.material_id, material_name: name, total_qty: 0, containers: [] }
    }
    grouped[name].total_qty += parseFloat(m.qty || 0)
    grouped[name].containers.push({ container_number: m.container_number, qty: parseFloat(m.qty || 0), content: m.container_content || '', images: m.images || [] })
  })
  return Object.values(grouped).map(g => ({ ...g, total_qty: g.total_qty.toFixed(2) }))
}

const getAllMaterialContainers = (process) => {
  return getMaterials(process).map(m => ({
    material_name: m.material_name || 'Material',
    container_number: m.container_number || 1,
    qty: parseFloat(m.qty || 0).toFixed(2),
    content: m.container_content || '',
    images: m.images || []
  })).sort((a, b) => {
    if (a.material_name !== b.material_name) return a.material_name.localeCompare(b.material_name)
    return a.container_number - b.container_number
  })
}

const toggleDetails = async (processId) => {
  const index = expandedRows.value.indexOf(processId)
  if (index > -1) {
    expandedRows.value.splice(index, 1)
  } else {
    expandedRows.value.push(processId)
    const process = props.processes.find(p => p.id === processId)
    if (process && (!process.materials || process.materials.length === 0)) {
      loadingMaterials.value = processId
      await dewateringStore.fetchMaterialsForProcess(processId)
      loadingMaterials.value = null
    }
  }
}

const openImagePreview = (url) => window.open(url, '_blank')

const getBase64ImageFromURL = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.setAttribute('crossOrigin', 'anonymous')
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        canvas.getContext('2d').drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      } catch (e) { reject(e) }
    }
    img.onerror = reject
    img.src = url
  })
}

const exportExcel = async (process) => {
  try {
    const groupedMats = getGroupedMaterials(process)
    const allContainers = getAllMaterialContainers(process)
    const kwhUsage = (process.kwh_end - process.kwh_start).toFixed(2)

    const wsData = [
      [`[DEWATERING] ${process.process_name}`],
      [`ID: ${process.id}`],
      [`Tgl: ${formatDateSimple(process.activity_date)}`, '', '', '', '', '', `${formatDuration(process)}`],
      [''],
      ['', 'KWh', '', '', 'Bahan Masuk (Total)', '', 'Hasil (Kg)'],
      ['Awal', 'Akhir', 'Pemakaian', ...groupedMats.map(m => `${m.material_name} (${m.containers.length} ember)`), '']
    ]

    wsData.push([process.kwh_start, process.kwh_end, kwhUsage, ...groupedMats.map(m => m.total_qty), formatNumber(process.output_amount)])
    wsData.push([''])
    wsData.push(['DETAIL MATERIAL PER-EMBER'])
    wsData.push(['No', 'Material', 'Ember #', 'Deskripsi', 'Berat (kg)', 'Ada Foto?', ''])

    allContainers.forEach((item, idx) => {
      wsData.push([idx + 1, item.material_name, item.container_number, item.content || '-', item.qty, (item.images && item.images.length > 0) ? 'Ya' : 'Tidak', ''])
    })

    if (process.notes && process.notes !== '-') {
      wsData.push([''])
      wsData.push(['Catatan:'])
      wsData.push([process.notes])
    }

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    ws['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 10 }, { wch: 25 }, { wch: 15 }, { wch: 20 }]
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Dewatering')
    XLSX.writeFile(wb, `DW_${process.process_name.replace(/\s+/g, '_')}_${formatDateSimple(process.activity_date).replace(/\//g, '-')}.xlsx`)
  } catch (err) {
    console.error('Error exporting Excel:', err)
    alert('Gagal export Excel')
  }
}

const exportPDF = async (process) => {
  try {
    let currentMaterials = getMaterials(process)
    if (!currentMaterials || currentMaterials.length === 0) {
      await dewateringStore.fetchMaterialsForProcess(process.id)
      const updatedProcess = props.processes.find(p => p.id === process.id)
      if (updatedProcess) process = updatedProcess
    }

    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const leftMargin = 15
    const rightMargin = pageWidth - 15
    const tableWidth = rightMargin - leftMargin
    let y = 20

    doc.setLineWidth(0.1)
    doc.setDrawColor(0, 0, 0)

    // Header
    doc.setFontSize(18).setFont(undefined, 'bold')
    doc.text(`[DEWATERING] ${process.process_name.toUpperCase()}`, leftMargin, y)
    y += 8
    doc.setFontSize(10).setFont(undefined, 'normal')
    doc.text(`ID: ${process.id}`, leftMargin, y); y += 6
    doc.text(`Mulai: ${formatDateTime(process.start_datetime)}`, leftMargin, y); y += 5
    doc.text(`Selesai: ${formatDateTime(process.end_datetime)}`, leftMargin, y); y += 5
    doc.text(`Durasi: ${formatDuration(process)}`, leftMargin, y); y += 1
    doc.setFont(undefined, 'bold').setFontSize(9)
    doc.text('STATUS: COMPLETED', rightMargin, y, { align: 'right' })
    doc.setFont(undefined, 'normal').setFontSize(10)
    y += 8
    doc.setLineWidth(0.5)
    doc.line(leftMargin, y, rightMargin, y)
    doc.setLineWidth(0.1)
    y += 15

    // Summary Table
    const groupedMats = getGroupedMaterials(process)
    const kwhUsage = (process.kwh_end - process.kwh_start).toFixed(2)
    const numMaterials = groupedMats.length
    const colAwal = 25, colAkhir = 25, colPemakaian = 30, colHasil = 35
    const kwhTotalWidth = colAwal + colAkhir + colPemakaian
    const remainingWidth = tableWidth - kwhTotalWidth - colHasil
    const colMaterial = numMaterials > 0 ? remainingWidth / numMaterials : 30
    const row1H = 12, row2H = 12, row3H = 16
    const colorGray200 = [229, 231, 235], colorCyan50 = [236, 254, 255], colorGreen50 = [240, 253, 244], colorGray50 = [249, 250, 251]

    let x = leftMargin
    doc.setFillColor(...colorGray200); doc.rect(x, y, kwhTotalWidth, row1H, 'FD')
    doc.setFontSize(11).setFont(undefined, 'bold'); doc.text('KWH', x + kwhTotalWidth/2, y + 8, { align: 'center' }); x += kwhTotalWidth
    if (numMaterials > 0) {
      doc.setFillColor(...colorCyan50); doc.rect(x, y, remainingWidth, row1H, 'FD')
      doc.setTextColor(14, 116, 144); doc.text('BAHAN MASUK', x + remainingWidth/2, y + 8, { align: 'center' }); x += remainingWidth
    }
    doc.setFillColor(...colorGreen50); doc.rect(x, y, colHasil, row1H + row2H, 'FD')
    doc.setFontSize(10).setTextColor(20, 83, 45); doc.text('HASIL (KG)', x + colHasil/2, y + 13, { align: 'center' })
    y += row1H

    x = leftMargin; doc.setFontSize(9).setFont(undefined, 'bold').setTextColor(0, 0, 0)
    doc.setFillColor(...colorGray50); doc.rect(x, y, colAwal, row2H, 'FD'); doc.text('Awal', x + colAwal/2, y + 8, { align: 'center' }); x += colAwal
    doc.setFillColor(...colorGray50); doc.rect(x, y, colAkhir, row2H, 'FD'); doc.text('Akhir', x + colAkhir/2, y + 8, { align: 'center' }); x += colAkhir
    doc.setFillColor(...colorGray50); doc.rect(x, y, colPemakaian, row2H, 'FD'); doc.setTextColor(220, 38, 38); doc.text('Pemakaian', x + colPemakaian/2, y + 8, { align: 'center' }); x += colPemakaian
    doc.setTextColor(0, 0, 0)
    groupedMats.forEach(mat => {
      doc.setFillColor(...colorGray50); doc.rect(x, y, colMaterial, row2H, 'FD')
      doc.text(doc.splitTextToSize(mat.material_name, colMaterial - 4), x + colMaterial/2, y + 8, { align: 'center' }); x += colMaterial
    })
    y += row2H

    x = leftMargin; doc.setFontSize(11).setFont(undefined, 'normal')
    doc.setFillColor(255, 255, 255); doc.rect(x, y, colAwal, row3H, 'FD'); doc.text(String(process.kwh_start), x + colAwal/2, y + 9.5, { align: 'center' }); x += colAwal
    doc.setFillColor(255, 255, 255); doc.rect(x, y, colAkhir, row3H, 'FD'); doc.text(String(process.kwh_end), x + colAkhir/2, y + 9.5, { align: 'center' }); x += colAkhir
    doc.setFillColor(254, 242, 242); doc.rect(x, y, colPemakaian, row3H, 'FD'); doc.setTextColor(220, 38, 38).setFont(undefined, 'bold')
    doc.text(kwhUsage, x + colPemakaian/2, y + 9.5, { align: 'center' }); doc.setFont(undefined, 'normal').setTextColor(0, 0, 0); x += colPemakaian
    groupedMats.forEach(mat => {
      doc.setFillColor(255, 255, 255); doc.rect(x, y, colMaterial, row3H, 'FD')
      doc.setFontSize(10).setTextColor(14, 116, 144).setFont(undefined, 'bold')
      doc.text(mat.total_qty, x + colMaterial/2, y + 7, { align: 'center' })
      doc.setFont(undefined, 'normal').setFontSize(7).setTextColor(107, 114, 128)
      doc.text(`(${mat.containers.length} ember)`, x + colMaterial/2, y + 12, { align: 'center' })
      doc.setTextColor(0, 0, 0); x += colMaterial
    })
    doc.setFillColor(...colorGreen50); doc.rect(x, y, colHasil, row3H, 'FD')
    doc.setTextColor(21, 128, 61).setFont(undefined, 'bold').setFontSize(13)
    doc.text(formatNumber(process.output_amount), x + colHasil/2, y + 9.5, { align: 'center' })
    doc.setTextColor(0, 0, 0)
    y += row3H + 15

    // Detail Material Table
    const detailContainers = getAllMaterialContainers(process)
    if (y > 200) { doc.addPage(); y = 20; }
    doc.setFontSize(11).setFont(undefined, 'bold'); doc.text('DETAIL MATERIAL PER-EMBER', leftMargin, y); y += 8
    const colNo = 10, colName = 50, colEmber = 20, colQty = 25, colPhoto = 35, colContent = 40, rowHeight = 20
    doc.setFontSize(8).setFont(undefined, 'bold')
    x = leftMargin
    const headers = [
      { text: 'No', width: colNo }, { text: 'Material', width: colName }, { text: 'Ember', width: colEmber },
      { text: 'Berat', width: colQty }, { text: 'Foto', width: colPhoto }
    ]
    headers.forEach(h => {
      doc.setFillColor(255, 255, 255); doc.rect(x, y, h.width, 8, 'FD')
      doc.setTextColor(0, 0, 0); doc.text(h.text, x + h.width/2, y + 5.5, { align: 'center' }); x += h.width
    })
    y += 8; doc.setFont(undefined, 'normal').setFontSize(8)
    for (let i = 0; i < detailContainers.length; i++) {
      const item = detailContainers[i]
      if (y > 270) { doc.addPage(); y = 20; }
      x = leftMargin
      doc.setFillColor(255, 255, 255); doc.rect(x, y, colNo, rowHeight, 'FD'); doc.text(String(i + 1), x + colNo/2, y + 5, { align: 'center' }); x += colNo
      doc.setFillColor(255, 255, 255); doc.rect(x, y, colName, rowHeight, 'FD'); doc.text(doc.splitTextToSize(item.material_name, colName - 4), x + 2, y + 5); x += colName
      doc.setFillColor(255, 255, 255); doc.rect(x, y, colEmber, rowHeight, 'FD'); doc.text(String(item.container_number), x + colEmber/2, y + 5, { align: 'center' }); x += colEmber
      doc.setFillColor(255, 255, 255); doc.rect(x, y, colQty, rowHeight, 'FD'); doc.setFont(undefined, 'bold'); doc.text(item.qty, x + colQty/2, y + 5, { align: 'center' }); doc.setFont(undefined, 'normal'); x += colQty
      doc.setFillColor(255, 255, 255); doc.rect(x, y, colPhoto, rowHeight, 'FD')
      if (item.images && item.images.length > 0) {
        try {
          const base64 = await getBase64ImageFromURL(item.images[0].url)
          if (base64) { const imgSize = Math.min(colPhoto - 4, rowHeight - 4); doc.addImage(base64, 'JPEG', x + 2, y + 2, imgSize, imgSize) }
        } catch (e) { doc.text('Error', x + colPhoto/2, y + 10, { align: 'center' }) }
      } else { doc.text('Tidak ada', x + colPhoto/2, y + 10, { align: 'center' }) }
      x += colPhoto
      y += rowHeight
    }
    y += 15

    // Visual Docs
    if (y > 200) { doc.addPage(); y = 20; }
    doc.setFontSize(11).setFont(undefined, 'bold').setTextColor(0, 0, 0); doc.text('DOKUMENTASI KWH & HASIL', leftMargin, y); y += 8

    const addStackedSection = async (title, subtitle, images, bgColor, textContent = null) => {
      if (y > 220) { doc.addPage(); y = 20; }
      doc.setFillColor(...bgColor); doc.rect(leftMargin, y, tableWidth, 8, 'F')
      doc.setFontSize(7).setFont(undefined, 'bold').setTextColor(255, 255, 255)
      doc.text(title, leftMargin + 2, y + 5.5)
      doc.setFontSize(6).setFont(undefined, 'normal'); doc.text(subtitle, leftMargin + tableWidth - 2, y + 5.5, { align: 'right' })

      let boxY = y + 8
      if (textContent) {
        doc.setFontSize(8).setFont(undefined, 'normal').setTextColor(0, 0, 0)
        const textStartY = boxY + 4
        const noteY = textStartY
        doc.setFont(undefined, 'bold').text('Catatan:', leftMargin + 2, noteY)
        const splitNote = doc.splitTextToSize(textContent.notes || '-', tableWidth - 4)
        doc.setFont(undefined, 'normal').text(splitNote, leftMargin + 2, noteY + 4)
        boxY += 10 + (splitNote.length * 4)
      }

      const imgCount = images && images.length > 0 ? images.length : 0
      const gap = 4, maxCols = 4
      const imgW = (tableWidth - (gap * (maxCols + 1))) / maxCols, imgH = imgW * 0.75
      const actualImgHeight = imgCount > 0 ? imgH + (gap * 2) : 30
      const totalSectionHeight = (boxY - y) + actualImgHeight
      doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3); doc.setLineDash([2, 2])
      doc.rect(leftMargin, y + 8, tableWidth, totalSectionHeight - 8)
      doc.setLineDash([]); doc.setLineWidth(0.1); doc.setDrawColor(0)

      if (imgCount > 0) {
        for (let i = 0; i < Math.min(imgCount, 4); i++) {
          const ix = leftMargin + gap + (i * (imgW + gap)), iy = boxY + gap
          doc.setDrawColor(230); doc.rect(ix, iy, imgW, imgH)
          try {
            const base64 = await getBase64ImageFromURL(images[i].url)
            if (base64) doc.addImage(base64, 'JPEG', ix, iy, imgW, imgH)
          } catch (e) {}
        }
      } else {
        doc.setTextColor(150, 150, 150); doc.text('Tidak ada foto', leftMargin + tableWidth/2, boxY + 15, { align: 'center' })
      }
      y += totalSectionHeight + 10
    }

    await addStackedSection('1. KWh AWAL', 'Start Reading', process.kwh_start_images, [55, 65, 81])
    await addStackedSection('2. KWh AKHIR', 'End Reading', process.kwh_end_images, [55, 65, 81])
    await addStackedSection('3. HASIL (OUTPUT)', 'Production Result', process.output_images, [14, 116, 144], { notes: process.notes })

    doc.save(`DW_${process.process_name.replace(/\s+/g, '_')}_${formatDateSimple(process.activity_date).replace(/\//g, '-')}.pdf`)
  } catch (err) {
    console.error('PDF error:', err)
    alert('Gagal export PDF: ' + err.message)
  }
}
</script>