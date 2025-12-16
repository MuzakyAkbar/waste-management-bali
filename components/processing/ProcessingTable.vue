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
                  </div>
                </td>
              </tr>

              <tr v-if="expandedRows.includes(process.id) && process.status === 'completed'" class="bg-gray-50/50">
                <td colspan="5" class="px-6 py-4">
                  <div class="bg-white border border-gray-200 rounded-lg p-4 grid grid-cols-3 gap-4 shadow-sm">
                    <div>
                      <span class="text-xs text-gray-500 uppercase font-bold">KWh Used</span>
                      <p class="text-sm font-medium text-gray-900 mt-1">
                        {{ (process.kwh_end - process.kwh_start).toFixed(1) }} kWh 
                        <span class="text-gray-400 text-xs">({{ process.kwh_start }} - {{ process.kwh_end }})</span>
                      </p>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500 uppercase font-bold">Efficiency</span>
                      <p class="text-sm font-medium text-gray-900 mt-1">{{ calculateEfficiency(process) }}%</p>
                    </div>
                    <div>
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
        <div v-for="process in processes" :key="process.id" class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          
          <div class="p-4 border-b border-gray-100 flex justify-between items-start bg-gray-50/30">
            <div>
              <p class="text-sm font-bold text-gray-900">{{ formatDate(process.activity_date) }}</p>
              <p class="text-xs text-gray-500">{{ formatTime(process.activity_date) }}</p>
            </div>
            <span 
              class="px-2 py-1 text-xs font-semibold rounded-full"
              :class="process.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'"
            >
              {{ process.status === 'in_progress' ? 'In Progress' : 'Completed' }}
            </span>
          </div>

          <div class="p-4 grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-gray-500 mb-1">Input</p>
              <p class="text-lg font-bold text-gray-800">{{ formatNumber(process.input_amount) }} <span class="text-xs font-normal text-gray-500">kg</span></p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">Output</p>
              <p class="text-lg font-bold" :class="process.status === 'completed' ? 'text-primary-600' : 'text-gray-400'">
                {{ process.status === 'completed' ? formatNumber(process.output_amount) : '-' }} <span class="text-xs font-normal text-gray-500">kg</span>
              </p>
            </div>
          </div>

          <div class="p-3 bg-gray-50 flex gap-2">
            <template v-if="process.status === 'in_progress'">
              <button
                @click="$emit('manage-materials', process.id)"
                class="flex-1 py-2 px-3 bg-white border border-blue-200 text-blue-600 text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-50 transition"
              >
                + Materials
              </button>
              <button
                @click="$emit('complete', process)"
                class="flex-1 py-2 px-3 bg-primary-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary-700 transition"
              >
                Complete
              </button>
            </template>

            <template v-else>
              <button
                @click="toggleDetails(process.id)"
                class="w-full py-2 px-3 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
              >
                {{ expandedRows.includes(process.id) ? 'Hide Details' : 'View Details' }}
              </button>
            </template>
          </div>

          <div v-if="expandedRows.includes(process.id) && process.status === 'completed'" class="p-4 bg-gray-50 border-t border-gray-200 text-sm">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-500">KWh Used:</span>
                <span class="font-medium">{{ (process.kwh_end - process.kwh_start).toFixed(1) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Efficiency:</span>
                <span class="font-medium">{{ calculateEfficiency(process) }}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Completed:</span>
                <span class="font-medium">{{ formatDate(process.completed_at) }}</span>
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