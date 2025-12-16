<template>
  <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30 h-16">
    <div class="px-4 sm:px-6 lg:px-8 h-full">
      <div class="flex justify-between items-center h-full">
        <div class="flex items-center gap-4">
          <button
            @click="$emit('toggle-sidebar')"
            class="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden focus:ring-2 focus:ring-gray-100"
          >
            <span class="sr-only">Open sidebar</span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 class="text-xl font-semibold text-gray-800 hidden sm:block">
            {{ pageTitle }}
          </h1>
        </div>

        <div class="flex items-center">
          <button class="p-2 mr-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
            <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          <ClientOnly>
            <div class="relative ml-3" v-click-outside="closeUserMenu">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center gap-2 focus:outline-none"
              >
                <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-transparent hover:ring-primary-100 transition-all">
                  {{ userInitial }}
                </div>
                <div class="hidden md:block text-left">
                  <p class="text-sm font-medium text-gray-700 leading-none">{{ userName }}</p>
                  <p class="text-xs text-gray-500 mt-1 capitalize">{{ userRole }}</p>
                </div>
                <svg 
                  class="w-4 h-4 text-gray-400 transition-transform duration-200 hidden md:block"
                  :class="{ 'rotate-180': showUserMenu }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 focus:outline-none z-50 origin-top-right"
                >
                  <div class="px-4 py-3 border-b border-gray-100 md:hidden">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ userName }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ userRole }}</p>
                  </div>

                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                    @click.prevent="closeUserMenu"
                  >
                    Your Profile
                  </a>
                  <div class="relative group">
                     <a
                      href="#"
                      class="block px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                      @click.prevent
                    >
                      Settings
                    </a>
                    <span class="absolute right-2 top-2 bg-gray-100 text-[10px] text-gray-500 px-1.5 rounded">Soon</span>
                  </div>
                  
                  <div class="border-t border-gray-100 my-1"></div>
                  
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              </Transition>
            </div>
            
            <template #fallback>
              <div class="h-8 w-8 bg-gray-200 rounded-full animate-pulse ml-3"></div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref } from 'vue'

const emit = defineEmits(['toggle-sidebar', 'logout'])
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const showUserMenu = ref(false)

// Data User
const userName = computed(() => authStore.user?.email?.split('@')[0] || 'User')
const userRole = computed(() => authStore.user?.role || 'Guest')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

// Judul Halaman Otomatis berdasarkan Route
const pageTitle = computed(() => {
  const path = route.path
  if (path === '/dashboard') return 'Dashboard'
  if (path.startsWith('/processing')) return 'Waste Processing'
  if (path.startsWith('/materials')) return 'Materials Management'
  if (path.startsWith('/locations')) return 'Location Master'
  return 'Waste Management'
})

const closeUserMenu = () => {
  showUserMenu.value = false
}

const handleLogout = async () => {
  closeUserMenu()
  const success = await authStore.logout()
  if (success) {
    router.push('/login')
    emit('logout')
  }
}

// Directive Custom untuk klik di luar dropdown
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