<template>
  <div class="flex h-screen bg-gray-50">
    <LayoutSidebar v-model="isSidebarOpen" />

    <div class="flex-1 flex flex-col overflow-hidden relative">
      <LayoutNavbar 
        @toggle-sidebar="toggleSidebar"
      />

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>