<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 class="text-xl font-bold text-gray-800">Waste Management Bali</h1>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome back! 👋</h2>
        <p class="text-gray-600">Here's what's happening with your waste management operations today.</p>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-blue-50 rounded-lg text-blue-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <h3 class="text-3xl font-bold text-gray-900 mb-1">
            {{ totalProcesses }}
          </h3>
          <p class="text-sm text-gray-500 font-medium">Total Processes</p>
        </div>

        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-yellow-50 rounded-lg text-yellow-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 class="text-3xl font-bold text-gray-900 mb-1">
            {{ activeProcesses }}
          </h3>
          <p class="text-sm text-gray-500 font-medium">In Progress</p>
        </div>

        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-green-50 rounded-lg text-green-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 class="text-3xl font-bold text-gray-900 mb-1">
            {{ totalCompleted }}
          </h3>
          <p class="text-sm text-gray-500 font-medium">Completed</p>
        </div>

        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-purple-50 rounded-lg text-purple-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
          </div>
          <h3 class="text-3xl font-bold text-gray-900 mb-1">
            {{ totalOutputFormatted }}
          </h3>
          <p class="text-sm text-gray-500 font-medium">Output (kg)</p>
        </div>
      </div>

      <h3 class="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <div @click="router.push('/processing')" class="group bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
          <div class="w-12 h-12 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h4 class="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">Waste Processing</h4>
          <p class="text-sm text-gray-500">Manage input, processing, and output data</p>
        </div>

        <div @click="router.push('/materials')" class="group bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
          <div class="w-12 h-12 bg-accent-50 text-accent-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h4 class="text-lg font-bold text-gray-900 mb-1 group-hover:text-accent-600 transition-colors">Materials</h4>
          <p class="text-sm text-gray-500">Manage master data for waste materials</p>
        </div>

        <div @click="router.push('/locations')" class="group bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
          <div class="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h4 class="text-lg font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">Locations</h4>
          <p class="text-sm text-gray-500">Manage operational locations and sites</p>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/useAuthStore'
import { useProcessingStore } from '~/stores/useProcessingStore'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const processingStore = useProcessingStore()
const router = useRouter()

// Computed properties untuk menghindari error di template
const totalProcesses = computed(() => processingStore.statistics?.totalProcesses || 0)
const activeProcesses = computed(() => processingStore.statistics?.activeProcesses || 0)
const totalCompleted = computed(() => processingStore.statistics?.totalCompleted || 0)
const totalOutputFormatted = computed(() => {
  const output = processingStore.statistics?.totalOutput || 0
  return output.toFixed(1)
})

onMounted(async () => {
  await authStore.checkAuth()
  await processingStore.fetchProcesses()
})
</script>