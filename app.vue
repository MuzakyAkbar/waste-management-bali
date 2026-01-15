<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <!-- Toast Container for Global Notifications -->
    <ClientOnly>
      <ToastContainer />
    </ClientOnly>
  </div>
</template>

<script setup>
// Optional: You can add global setup logic here
import { useAuthStore } from '../stores/useAuthStore'

const authStore = useAuthStore()

// Check authentication on app mount
if (import.meta.client) {
  authStore.checkAuth()
}
</script>

<style>
/* Global styles are handled in assets/css/main.css */
</style>