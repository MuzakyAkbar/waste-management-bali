<template>
  <div class="flex h-screen bg-gray-50">
    <LayoutSidebar />

    <div class="flex-1 flex flex-col overflow-hidden">
      <LayoutNavbar />
      
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
        <slot /> </main>
    </div>
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