<template>
  <div class="min-h-screen flex">
    <LayoutSidebar v-model="isSidebarOpen" />

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <LayoutNavbar 
        :show-mobile-menu="true" 
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
      />

      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isSidebarOpen = ref(false)
</script>