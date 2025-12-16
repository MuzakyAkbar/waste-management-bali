<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
    <div class="text-center animate-fade-in">
      <!-- Logo Animation -->
      <div class="relative mb-8">
        <div class="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl mx-auto flex items-center justify-center shadow-strong animate-pulse-slow">
          <svg class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <!-- Decorative rings -->
        <div class="absolute inset-0 -z-10">
          <div class="absolute inset-0 rounded-full border-4 border-primary-200 animate-ping opacity-20"></div>
        </div>
      </div>

      <!-- Text -->
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 animate-slide-up">
        Waste Management System
      </h1>
      <p class="text-sm sm:text-base md:text-lg text-gray-600 mb-8 animate-slide-up" style="animation-delay: 0.1s;">
        Redirecting to your dashboard...
      </p>

      <!-- Loading Spinner -->
      <div class="flex justify-center gap-2">
        <div class="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 0s;"></div>
        <div class="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
        <div class="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '~/stores/useAuthStore'

definePageMeta({
  layout: false
})

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.checkAuth()
  
  setTimeout(() => {
    if (authStore.isAuthenticated) {
      navigateTo('/dashboard')
    } else {
      navigateTo('/login')
    }
  }, 1500)
})
</script>