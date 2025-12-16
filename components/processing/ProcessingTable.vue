<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Loading State -->
    <div v-if="loading" class="p-8 sm:p-12 text-center">
      <svg class="animate-spin h-10 w-10 sm:h-12 sm:w-12 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-sm sm:text-base text-gray-600">Loading data...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!processes || processes.length === 0" class="p-8 sm:p-12 text-center">
      <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
        <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-2">No activities yet</h3>
      <p class="text-sm sm:text-base text-gray-600 mb-6">Start by creating a new processing activity</p>
      <button
        @click="$emit('add-new')"
        class="btn btn-primary text-sm sm:text-base"
      >
        <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Activity
      </button>
    </div>

    <!-- Table (Desktop) -->
    <div v-else class="hidden lg:block overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 xl:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Date & Time
            </th>
            <th class="px-4 xl:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Location
            </th>
            <th class="px-4 xl:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Input (kg)
            </th>
            <th class="px-4 xl:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Output (kg)
            </th>
            <th class="px-4 xl:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th class="px-4 xl:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <template v-for="process in processes" :key="process.id">
            <!-- Main Row -->
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-4 xl:px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatDate(process.activity_date) }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ formatTime(process.activity_date) }}
                </div>
              </td>
              <td class="px-4 xl:px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div class="text-sm text-gray-900 font-medium">
                    {{ process.location?.name || '-' }}
                  </div>
                </div>
              </td>
              <td class="px-4 xl:px-6 py-4">
                <div class="text-sm font-semibold text-gray-900">
                  {{ formatNumber(process.input_amount) || '-' }}
                </div>
              </td>
              <td class="px-4 xl:px-6 py-4">
                <div class="text-sm font-semibold" :class="process.status === 'completed' ? 'text-primary-600' : 'text-gray-400'">
                  {{ process.status === 'completed' ? formatNumber(process.output_amount) : '-' }}
                </div>
              </td>
              <td class="px-4 xl:px-6 py-4">
                <span v-if="process.status === 'in_progress'" class="badge badge-warning">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  In Progress
                </span>
                <span v-else-if="process.status === 'completed'" class="badge badge-success">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Completed
                </span>
              </td>
              <td class="px-4 xl:px-6 py-4">
                <div class="flex items-center gap-2">
                  <button
                    v-if="process.status === 'in_progress'"
                    @click="$emit('complete', process)"
                    class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
                  >
                    Complete
                  </button>
                  <button
                    v-else
                    @click="toggleDetails(process.id)"
                    class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-all"
                  >
                    {{ expandedRows.includes(process.id) ? 'Hide' : 'Details' }}
                  </button>
                </div>
              </td>
            </tr>

            <!-- Expanded Details Row -->
            <tr v-if="expandedRows.includes(process.id) && process.status === 'completed'" class="bg-gray-50">
              <td colspan="6" class="px-4 xl:px-6 py-6">
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  <!-- Completion Info -->
                  <div class="space-y-2">
                    <h4 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Completion Info
                    </h4>
                    <div class="text-sm space-y-1">
                      <p class="text-gray-600">Date: <span class="font-medium text-gray-900">{{ formatDate(process.completed_at) }}</span></p>
                      <p class="text-gray-600">Time: <span class="font-medium text-gray-900">{{ formatTime(process.completed_at) }}</span></p>
                    </div>
                  </div>

                  <!-- Output Info -->
                  <div class="space-y-2">
                    <h4 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                      Results
                    </h4>
                    <div class="text-sm space-y-1">
                      <p class="text-gray-600">Output: <span class="font-semibold text-primary-600">{{ formatNumber(process.output_amount) }} kg</span></p>
                      <p class="text-gray-600">Efficiency: <span class="font-medium text-gray-900">{{ calculateEfficiency(process) }}%</span></p>
                    </div>
                  </div>

                  <!-- Materials Used -->
                  <div class="space-y-2">
                    <h4 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <svg class="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Materials
                    </h4>
                    <div v-if="process.materials && process.materials.length > 0" class="space-y-1">
                      <div v-for="mat in process.materials" :key="mat.id" class="text-sm">
                        <p class="text-gray-600">{{ mat.material?.name }}: <span class="font-medium text-gray-900">{{ formatNumber(mat.weight_received) }} kg</span></p>
                      </div>
                    </div>
                    <p v-else class="text-sm text-gray-500">No materials</p>
                  </div>

                  <!-- Notes -->
                  <div class="space-y-2">
                    <h4 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      Notes
                    </h4>
                    <p class="text-sm text-gray-600">
                      {{ process.notes || 'No notes available' }}
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Cards (Mobile & Tablet) -->
    <div class="lg:hidden divide-y divide-gray-200">
      <div
        v-for="process in processes"
        :key="process.id"
        class="p-4 hover:bg-gray-50 transition-colors"
      >
        <!-- Card Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-sm font-semibold text-gray-900 truncate">
                  {{ process.location?.name || 'Unknown Location' }}
                </h3>
                <p class="text-xs text-gray-500">
                  {{ formatDate(process.activity_date) }} • {{ formatTime(process.activity_date) }}
                </p>
              </div>
            </div>
          </div>
          <span v-if="process.status === 'in_progress'" class="badge badge-warning text-xs flex-shrink-0">
            In Progress
          </span>
          <span v-else class="badge badge-success text-xs flex-shrink-0">
            Completed
          </span>
        </div>

        <!-- Card Body -->
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-600 mb-1">Input</p>
            <p class="text-base font-bold text-gray-900">{{ formatNumber(process.input_amount) }} <span class="text-xs font-normal">kg</span></p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-600 mb-1">Output</p>
            <p class="text-base font-bold" :class="process.status === 'completed' ? 'text-primary-600' : 'text-gray-400'">
              {{ process.status === 'completed' ? formatNumber(process.output_amount) : '-' }} <span class="text-xs font-normal">kg</span>
            </p>
          </div>
        </div>

        <!-- Card Actions -->
        <div class="flex gap-2">
          <button
            v-if="process.status === 'in_progress'"
            @click="$emit('complete', process)"
            class="flex-1 btn btn-primary text-sm py-2"
          >
            Complete Activity
          </button>
          <button
            v-else
            @click="toggleDetails(process.id)"
            class="flex-1 btn btn-secondary text-sm py-2"
          >
            {{ expandedRows.includes(process.id) ? 'Hide Details' : 'View Details' }}
          </button>
        </div>

        <!-- Expanded Mobile Details -->
        <Transition name="expand">
          <div v-if="expandedRows.includes(process.id) && process.status === 'completed'" class="mt-4 pt-4 border-t border-gray-200 space-y-3">
            <div class="bg-gray-50 rounded-lg p-3">
              <h4 class="text-xs font-semibold text-gray-700 mb-2">Completion Info</h4>
              <p class="text-xs text-gray-600">Date: <span class="font-medium text-gray-900">{{ formatDate(process.completed_at) }}</span></p>
              <p class="text-xs text-gray-600">Efficiency: <span class="font-medium text-gray-900">{{ calculateEfficiency(process) }}%</span></p>
            </div>

            <div v-if="process.materials && process.materials.length > 0" class="bg-gray-50 rounded-lg p-3">
              <h4 class="text-xs font-semibold text-gray-700 mb-2">Materials Used</h4>
              <div class="space-y-1">
                <p v-for="mat in process.materials" :key="mat.id" class="text-xs text-gray-600">
                  {{ mat.material?.name }}: <span class="font-medium text-gray-900">{{ formatNumber(mat.weight_received) }} kg</span>
                </p>
              </div>
            </div>

            <div v-if="process.notes" class="bg-gray-50 rounded-lg p-3">
              <h4 class="text-xs font-semibold text-gray-700 mb-2">Notes</h4>
              <p class="text-xs text-gray-600">{{ process.notes }}</p>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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

const emit = defineEmits(['complete', 'add-new'])

const expandedRows = ref([])

const toggleDetails = (processId) => {
  const index = expandedRows.value.indexOf(processId)
  if (index > -1) {
    expandedRows.value.splice(index, 1)
  } else {
    expandedRows.value.push(processId)
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
  if (!num) return '0'
  return parseFloat(num).toFixed(2)
}

const calculateEfficiency = (process) => {
  if (!process.input_amount || !process.output_amount) return '0.0'
  return ((process.output_amount / process.input_amount) * 100).toFixed(1)
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>