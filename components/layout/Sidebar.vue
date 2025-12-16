<template>
  <div>
    <Transition name="fade">
      <div
        v-if="isOpen && isMobile"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        @click="closeSidebar"
      ></div>
    </Transition>

    <aside
      :class="[
        'fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 z-50',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:z-0',
        collapsed ? 'lg:w-20' : 'lg:w-64',
        'w-64'
      ]"
    >
      <div class="flex items-center justify-between p-4 border-b border-gray-200 h-16">
        <div v-if="!collapsed" class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <span class="text-lg font-bold text-gray-800">WasteManagement</span>
        </div>
        <div v-else class="w-full flex justify-center">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
             <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>

        <button
          v-if="!isMobile"
          @click="toggleCollapse"
          class="hidden lg:flex p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
        >
          <svg
            class="w-5 h-5 transition-transform duration-300"
            :class="{ 'rotate-180': collapsed }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          v-if="isMobile"
          @click="closeSidebar"
          class="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
        <template v-for="item in navigationItems" :key="item.name">
          <NuxtLink
            v-if="!item.soon"
            :to="item.to"
            class="flex items-center px-3 py-2.5 rounded-lg transition-colors group"
            :class="isActive(item.to) 
              ? 'bg-primary-50 text-primary-600 font-medium' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            @click="handleLinkClick"
            :title="collapsed ? item.name : ''"
          >
            <component 
              :is="item.icon" 
              class="w-5 h-5 flex-shrink-0 transition-colors"
              :class="isActive(item.to) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'" 
            />
            <span 
              class="ml-3 whitespace-nowrap transition-opacity duration-300"
              :class="collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'"
            >
              {{ item.name }}
            </span>
          </NuxtLink>

          <div
            v-else
            class="flex items-center px-3 py-2.5 rounded-lg text-gray-400 cursor-not-allowed group relative"
            :title="collapsed ? item.name + ' (Soon)' : ''"
          >
            <component 
              :is="item.icon" 
              class="w-5 h-5 flex-shrink-0 text-gray-300" 
            />
            <span 
              class="ml-3 whitespace-nowrap flex-1"
              :class="collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'"
            >
              {{ item.name }}
            </span>
            <span 
              v-if="!collapsed" 
              class="bg-gray-100 text-gray-500 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            >
              SOON
            </span>
          </div>
        </template>
      </nav>

      <div class="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-white">
        <button
          @click="handleLogout"
          class="flex items-center w-full px-3 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors group"
          :title="collapsed ? 'Sign Out' : ''"
        >
          <svg class="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span 
            class="ml-3 whitespace-nowrap font-medium"
            :class="collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'"
          >
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { 
  HomeIcon, 
  SwatchIcon, // Untuk Processing (pake icon yg mirip)
  CubeIcon, // Untuk Materials
  MapPinIcon, // Untuk Locations
  Cog6ToothIcon // Untuk Settings
} from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'logout'])
const route = useRoute()
const authStore = useAuthStore()
const router = useRouter()

// Components map for dynamic rendering
// Kita buat object icon manual jika tidak menggunakan library heroicons secara langsung
// Atau definisikan SVG langsung di template jika ingin tanpa dependency tambahan.
// Di sini saya pakai "component :is" dengan asumsi Anda mungkin setup auto-import heroicons.
// Jika tidak, saya akan ganti dengan SVG manual di bawah.

// --- DEFINISI NAVIGASI ---
const navigationItems = [
  { 
    name: 'Dashboard', 
    to: '/dashboard', 
    icon: HomeIcon,
    soon: false
  },
  { 
    name: 'Processing', 
    to: '/processing', 
    icon: SwatchIcon, 
    soon: false
  },
  { 
    name: 'Materials', 
    to: '/materials', 
    icon: CubeIcon, 
    soon: false
  },
  { 
    name: 'Locations', 
    to: '/locations', 
    icon: MapPinIcon, 
    soon: false
  },
  { 
    name: 'Settings', 
    to: '/settings', 
    icon: Cog6ToothIcon, 
    soon: true 
  }
]

// --- LOGIC ---

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const collapsed = ref(false)
const isMobile = ref(false)

const isActive = (path) => {
  if (path === '/dashboard' && route.path === '/dashboard') return true
  if (path !== '/dashboard' && route.path.startsWith(path)) return true
  return false
}

const toggleCollapse = () => {
  if (!isMobile.value) {
    collapsed.value = !collapsed.value
  }
}

const closeSidebar = () => {
  if (isMobile.value) {
    isOpen.value = false
  }
}

const handleLinkClick = () => {
  if (isMobile.value) {
    closeSidebar()
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
  emit('logout') // Emit event agar parent tau jika perlu
}

const checkScreenSize = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 1024
    if (!isMobile.value) {
      isOpen.value = true
    } else {
      isOpen.value = false
    }
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
</style>