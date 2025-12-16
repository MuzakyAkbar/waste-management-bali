<template>
  <div class="min-h-screen bg-white flex items-center justify-center">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <h1 class="text-xl font-bold text-gray-800">Memuat Aplikasi...</h1>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '~/stores/useAuthStore'

// Matikan layout default agar splash screen tampil penuh
definePageMeta({
  layout: false
})

const authStore = useAuthStore()

onMounted(async () => {
  // 1. Cek status login
  await authStore.checkAuth()
  
  // 2. Tunggu sebentar (opsional, untuk efek splash screen) lalu redirect
  setTimeout(() => {
    if (authStore.isAuthenticated) {
      navigateTo('/dashboard') // Ke dashboard jika sudah login
    } else {
      navigateTo('/login') // Ke login jika belum
    }
  }, 1000)
})
</script>