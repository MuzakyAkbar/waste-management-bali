<template>
  <div>
    <!-- Mobile Overlay -->
    <Transition name="fade">
      <div
        v-if="isOpen && isMobile"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        @click="closeSidebar"
      ></div>
    </Transition>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 z-50',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:z-0',
        collapsed ? 'lg:w-20' : 'lg:w-64',
        'w-64'
      ]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <div v-if="!collapsed" class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold text-gray-800">WM Bali</h1>
            <p class="text-xs text-gray-500">Management</p>
          </div>
        </div>

        <!-- Collapse Button (Desktop) -->
        <button
          @click="toggleCollapse"
          class="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!collapsed" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Close Button (Mobile) -->
        <button
          @click="closeSidebar"
          class="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
        <!-- Dashboard -->
        <NuxtLink
          to="/dashboard"
          :class="[
            'flex items-center space-x-3 px-4 py-3 rounded-lg transition group',
            isActive('/dashboard') 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          ]"
          @click="handleLinkClick"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span v-if="!collapsed" class="font-medium">Dashboard</span>
        </NuxtLink>

        <!-- Processing -->
        <NuxtLink
          to="/processing"
          :class="[
            'flex items-center space-x-3 px-4 py-3 rounded-lg transition group',
            isActive('/processing') 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          ]"
          @click="handleLinkClick"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span v-if="!collapsed" class="font-medium">Pengelolaan Sampah</span>
        </NuxtLink>

        <!-- Divider -->
        <div class="py-2">
          <div class="border-t border-gray-200"></div>
        </div>

        <!-- Materials -->
        <NuxtLink
          to="/materials"
          :class="[
            'flex items-center space-x-3 px-4 py-3 rounded-lg transition group',
            isActive('/materials') 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          ]"
          @click="handleLinkClick"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span v-if="!collapsed" class="font-medium">Material</span>
          <span v-if="!collapsed" class="ml-auto px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">Soon</span>
        </NuxtLink>

        <!-- Locations -->
        <NuxtLink
          to="/locations"
          :class="[
            'flex items-center space-x-3 px-4 py-3 rounded-lg transition group',
            isActive('/locations') 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          ]"
          @click="handleLinkClick"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span v-if="!collapsed" class="font-medium">Lokasi</span>
          <span v-if="!collapsed" class="ml-auto px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">Soon</span>
        </NuxtLink>

        <!-- Reports -->
        <NuxtLink
          to="/reports"
          :class="[
            'flex items-center space-x-3 px-4 py-3 rounded-lg transition group',
            isActive('/reports') 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          ]"
          @click="handleLinkClick"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span v-if="!collapsed" class="font-medium">Laporan</span>
          <span v-if="!collapsed" class="ml-auto px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">Soon</span>
        </NuxtLink>

        <!-- Divider -->
        <div class="py-2">
          <div class="border-t border-gray-200"></div>
        </div>

        <!-- Settings -->
        <NuxtLink
          to="/settings"
          :class="[
            'flex items-center space-x-3 px-4 py-3 rounded-lg transition group',
            isActive('/settings') 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          ]"
          @click="handleLinkClick"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span v-if="!collapsed" class="font-medium">Pengaturan</span>
          <span v-if="!collapsed" class="ml-auto px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">Soon</span>
        </NuxtLink>
      </nav>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const route = useRoute()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const collapsed = ref(false)
const isMobile = ref(false)

// Check if route is active
const isActive = (path) => {
  return route.path.startsWith(path)
}

// Toggle collapsed state (desktop only)
const toggleCollapse = () => {
  if (!isMobile.value) {
    collapsed.value = !collapsed.value
  }
}

// Close sidebar (mobile)
const closeSidebar = () => {
  if (isMobile.value) {
    isOpen.value = false
  }
}

// Handle link click
const handleLinkClick = () => {
  if (isMobile.value) {
    closeSidebar()
  }
}

// Check screen size
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) {
    isOpen.value = true // Always open on desktop
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar */
nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>