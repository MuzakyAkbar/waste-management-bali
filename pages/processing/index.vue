<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar (sama seperti dashboard) -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/dashboard" class="text-gray-600 hover:text-primary">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </NuxtLink>
            <div>
              <h1 class="text-xl font-bold text-gray-800">Pengelolaan Sampah</h1>
              <p class="text-xs text-gray-500">Processing Management</p>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-medium text-gray-700">{{ authStore.user?.username }}</p>
              <p class="text-xs text-gray-500">{{ authStore.user?.organization }}</p>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Actions -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Daftar Aktivitas</h2>
          <p class="text-gray-600 mt-1">Kelola proses pengolahan sampah</p>
        </div>
        <button
          @click="showAddModal = true"
          class="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Activity</span>
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select
              v-model="selectedLocation"
              @change="filterByLocation"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Semua Lokasi</option>
              <option v-for="loc in locationStore.locations" :key="loc.location_id" :value="loc.location_id">
                {{ loc.location_name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              v-model="selectedStatus"
              @change="filterByStatus"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Semua Status</option>
              <option value="active">Sedang Proses</option>
              <option value="completed">Selesai</option>
            </select>
          </div>

          <div class="flex items-end">
            <button
              @click="refreshData"
              class="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Processing Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div v-if="processingStore.loading" class="p-12 text-center">
          <svg class="animate-spin h-10 w-10 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">Loading data...</p>
        </div>

        <div v-else-if="filteredProcesses.length === 0" class="p-12 text-center">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p class="text-gray-600">Belum ada data aktivitas</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tanggal Mulai</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Lokasi</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">KWH Awal</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Input (kg)</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <template v-for="process in filteredProcesses" :key="process.processing_id">
                <!-- Main Row -->
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ formatDate(process.start_datetime) }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ formatTime(process.start_datetime) }}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">{{ process.location?.location_name || '-' }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-semibold text-gray-900">{{ process.kwh_start }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-semibold text-primary">{{ process.input_amount_kg }} kg</div>
                  </td>
                  <td class="px-6 py-4">
                    <span v-if="!process.end_datetime" class="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Proses
                    </span>
                    <span v-else class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Selesai
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <button
                      v-if="!process.end_datetime"
                      @click="openCompleteModal(process)"
                      class="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition"
                    >
                      Selesai
                    </button>
                    <button
                      v-else
                      @click="toggleDetails(process.processing_id)"
                      class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
                    >
                      {{ expandedRows.includes(process.processing_id) ? 'Hide' : 'Details' }}
                    </button>
                  </td>
                </tr>

                <!-- Expanded Details Row -->
                <tr v-if="expandedRows.includes(process.processing_id) && process.end_datetime" class="bg-gray-50">
                  <td colspan="6" class="px-6 py-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <!-- Completion Info -->
                      <div class="space-y-2">
                        <h4 class="text-sm font-semibold text-gray-700">Info Selesai</h4>
                        <div class="text-sm">
                          <p class="text-gray-600">Tanggal: <span class="font-medium text-gray-900">{{ formatDate(process.end_datetime) }}</span></p>
                          <p class="text-gray-600">Jam: <span class="font-medium text-gray-900">{{ formatTime(process.end_datetime) }}</span></p>
                        </div>
                      </div>

                      <!-- KWH Info -->
                      <div class="space-y-2">
                        <h4 class="text-sm font-semibold text-gray-700">KWH Usage</h4>
                        <div class="text-sm">
                          <p class="text-gray-600">KWH Akhir: <span class="font-medium text-gray-900">{{ process.kwh_end }}</span></p>
                          <p class="text-gray-600">KWH Used: <span class="font-semibold text-accent">{{ process.kwh_used }}</span></p>
                        </div>
                      </div>

                      <!-- Output Info -->
                      <div class="space-y-2">
                        <h4 class="text-sm font-semibold text-gray-700">Hasil</h4>
                        <div class="text-sm">
                          <p class="text-gray-600">Output: <span class="font-semibold text-primary">{{ process.output_amount_kg }} kg</span></p>
                          <p class="text-gray-600">Efficiency: <span class="font-medium text-gray-900">{{ ((process.output_amount_kg / process.input_amount_kg) * 100).toFixed(1) }}%</span></p>
                        </div>
                      </div>

                      <!-- Materials Used -->
                      <div class="space-y-2">
                        <h4 class="text-sm font-semibold text-gray-700">Material Digunakan</h4>
                        <div v-if="process.materials && process.materials.length > 0" class="space-y-1">
                          <div v-for="mat in process.materials" :key="mat.used_id" class="text-sm">
                            <p class="text-gray-600">{{ mat.material?.material_name }}: <span class="font-medium text-gray-900">{{ mat.qty }} kg</span></p>
                          </div>
                        </div>
                        <p v-else class="text-sm text-gray-500">Tidak ada material</p>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Activity Modal -->
    <AddActivityModal
      :show="showAddModal"
      @close="showAddModal = false"
      @success="handleAddSuccess"
    />

    <!-- Complete Activity Modal -->
    <CompleteActivityModal
      :show="showCompleteModal"
      :process="selectedProcess"
      @close="showCompleteModal = false"
      @success="handleCompleteSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/useAuthStore'
import { useProcessingStore } from '~/stores/useProcessingStore'
import { useLocationStore } from '~/stores/useMaterialStore'
import AddActivityModal from '~/components/processing/AddActivityModal.vue'
import CompleteActivityModal from '~/components/processing/CompleteActivityModal.vue'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const processingStore = useProcessingStore()
const locationStore = useLocationStore()

const showAddModal = ref(false)
const showCompleteModal = ref(false)
const selectedProcess = ref(null)
const selectedLocation = ref('')
const selectedStatus = ref('')
const expandedRows = ref([])

const filteredProcesses = computed(() => {
  let processes = processingStore.processes

  if (selectedLocation.value) {
    processes = processes.filter(p => p.location_id === selectedLocation.value)
  }

  if (selectedStatus.value === 'active') {
    processes = processes.filter(p => !p.end_datetime)
  } else if (selectedStatus.value === 'completed') {
    processes = processes.filter(p => p.end_datetime)
  }

  return processes
})

onMounted(async () => {
  await Promise.all([
    processingStore.fetchProcesses(),
    locationStore.fetchLocations()
  ])
})

const formatDate = (datetime) => {
  return new Date(datetime).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatTime = (datetime) => {
  return new Date(datetime).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const toggleDetails = (processingId) => {
  const index = expandedRows.value.indexOf(processingId)
  if (index > -1) {
    expandedRows.value.splice(index, 1)
  } else {
    expandedRows.value.push(processingId)
  }
}

const openCompleteModal = (process) => {
  selectedProcess.value = process
  showCompleteModal.value = true
}

const handleAddSuccess = async () => {
  showAddModal.value = false
  await refreshData()
}

const handleCompleteSuccess = async () => {
  showCompleteModal.value = false
  selectedProcess.value = null
  await refreshData()
}

const filterByLocation = async () => {
  await processingStore.fetchProcesses(selectedLocation.value || null)
}

const filterByStatus = () => {
  // Filtering handled by computed property
}

const refreshData = async () => {
  await processingStore.fetchProcesses(selectedLocation.value || null)
}
</script>