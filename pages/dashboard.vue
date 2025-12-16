<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="flex justify-between items-center h-14 sm:h-16">
          <!-- Logo & Title -->
          <div class="flex items-center gap-2 sm:gap-4">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 class="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                Waste Management
              </h1>
              <p class="text-xs text-gray-500 hidden sm:block">Dashboard</p>
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex items-center gap-2 sm:gap-4">
            <!-- User Info (Hidden on mobile) -->
            <div class="text-right hidden md:block">
              <p class="text-sm font-semibold text-gray-700">
                {{ authStore.userName }}
              </p>
              <p class="text-xs text-gray-500">
                {{ authStore.userRole }}
              </p>
            </div>

            <!-- User Avatar -->
            <div class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary-100 flex items-center justify-center">
                  <span class="text-sm sm:text-base font-semibold text-primary-700">
                    {{ authStore.userName?.charAt(0) || 'U' }}
                  </span>
                </div>
                <svg class="w-4 h-4 text-gray-500 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <Transition name="dropdown">
                <div
                  v-if="showUserMenu"
                  v-click-outside="() => showUserMenu = false"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-strong border border-gray-100 py-2 z-50"
                >
                  <!-- User Info (Mobile only) -->
                  <div class="px-4 py-3 border-b border-gray-100 md:hidden">
                    <p class="text-sm font-semibold text-gray-700">
                      {{ authStore.userName }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ authStore.userRole }}
                    </p>
                  </div>

                  <button
                    @click="handleLogout"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto container-padding py-4 sm:py-6 lg:py-8">
      <!-- Header -->
      <div class="mb-6 sm:mb-8">
        <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {{ authStore.userName }}! 👋
        </h2>
        <p class="text-sm sm:text-base text-gray-600">
          Here's what's happening with your waste management system today.
        </p>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <!-- Total Processes -->
        <div class="card p-4 sm:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">
                Total Processes
              </p>
              <p class="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                {{ processingStore.statistics.totalProcesses }}
              </p>
              <p class="text-xs text-gray-500">All time</p>
            </div>
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Active Processes -->
        <div class="card p-4 sm:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">
                Active Now
              </p>
              <p class="text-2xl sm:text-3xl font-bold text-yellow-600 mb-1">
                {{ processingStore.statistics.activeProcesses }}
              </p>
              <p class="text-xs text-gray-500">In progress</p>
            </div>
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Completed Today -->
        <div class="card p-4 sm:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">
                Completed Today
              </p>
              <p class="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                {{ processingStore.statistics.completedToday }}
              </p>
              <p class="text-xs text-gray-500">Today's work</p>
            </div>
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Output -->
        <div class="card p-4 sm:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">
                Total Output
              </p>
              <p class="text-2xl sm:text-3xl font-bold text-primary-600 mb-1">
                {{ processingStore.statistics.totalOutput.toFixed(1) }}
              </p>
              <p class="text-xs text-gray-500">Kilograms</p>
            </div>
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <!-- Processing Management -->
        <NuxtLink
          to="/processing"
          class="card p-4 sm:p-6 group hover:shadow-lg hover:border-primary-200 transition-all duration-300"
        >
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 sm:w-7 sm:h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-base sm:text-lg font-bold text-gray-800 mb-1">
                Processing
              </h3>
              <p class="text-xs sm:text-sm text-gray-600">
                Manage activities
              </p>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <p class="text-xs sm:text-sm text-gray-500">
            Start new processing activities and manage ongoing operations
          </p>
        </NuxtLink>

        <!-- Materials -->
        <div class="card p-4 sm:p-6 group hover:shadow-lg hover:border-accent-200 transition-all duration-300 cursor-pointer opacity-75">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-accent-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 sm:w-7 sm:h-7 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-base sm:text-lg font-bold text-gray-800 mb-1">
                Materials
              </h3>
              <p class="text-xs sm:text-sm text-gray-600">
                Inventory management
              </p>
            </div>
            <span class="badge badge-warning text-xs">Soon</span>
          </div>
          <p class="text-xs sm:text-sm text-gray-500">
            Track and manage material inventory and supplies
          </p>
        </div>

        <!-- Reports -->
        <div class="card p-4 sm:p-6 group hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer opacity-75">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-base sm:text-lg font-bold text-gray-800 mb-1">
                Reports
              </h3>
              <p class="text-xs sm:text-sm text-gray-600">
                Analytics & insights
              </p>
            </div>
            <span class="badge badge-warning text-xs">Soon</span>
          </div>
          <p class="text-xs sm:text-sm text-gray-500">
            Generate reports and view analytics dashboard
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/useAuthStore'
import { useProcessingStore } from '~/stores/useProcessingStore'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const processingStore = useProcessingStore()
const router = useRouter()

const showUserMenu = ref(false)

onMounted(async () => {
  await authStore.checkAuth()
  await processingStore.fetchProcesses()
})

const handleLogout = async () => {
  const success = await authStore.logout()
  if (success) {
    router.push('/login')
  }
}

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>