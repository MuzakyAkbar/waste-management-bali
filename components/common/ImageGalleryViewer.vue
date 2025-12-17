<template>
  <div>
    <!-- Thumbnails Grid -->
    <div class="grid gap-2" :class="gridClass">
      <div 
        v-for="(image, index) in images" 
        :key="index"
        @click="openLightbox(index)"
        class="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:border-primary-400 transition-all hover:shadow-lg aspect-[4/3]"
      >
        <img
          :src="image.url"
          :alt="`${label} ${index + 1}`"
          class="w-full h-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
          <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
          <span class="text-white text-xs font-medium">{{ index + 1 }}/{{ images.length }}</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="images.length === 0" class="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
      <svg class="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-sm text-gray-500">{{ emptyText }}</p>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showLightbox"
          class="fixed inset-0 z-[999] bg-black bg-opacity-95 flex items-center justify-center p-4"
          @click="closeLightbox"
        >
          <!-- Close Button -->
          <button
            @click="closeLightbox"
            class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Image Counter -->
          <div class="absolute top-4 left-4 text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-full">
            {{ currentIndex + 1 }} / {{ images.length }}
          </div>

          <!-- Navigation -->
          <button
            v-if="images.length > 1"
            @click.stop="prevImage"
            class="absolute left-4 text-white hover:text-gray-300 transition-colors bg-black/30 hover:bg-black/50 p-3 rounded-full"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Image -->
          <div @click.stop class="max-w-6xl max-h-[90vh] w-full flex items-center justify-center">
            <img
              :src="images[currentIndex]?.url"
              :alt="`${label} ${currentIndex + 1}`"
              class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>

          <button
            v-if="images.length > 1"
            @click.stop="nextImage"
            class="absolute right-4 text-white hover:text-gray-300 transition-colors bg-black/30 hover:bg-black/50 p-3 rounded-full"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <!-- Image Info -->
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
            <p class="font-medium">{{ label }}</p>
            <p class="text-xs text-gray-300 mt-1">{{ images[currentIndex]?.path }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
    validator: (value) => {
      return value.every(img => img.url && img.path && img.bucket)
    }
  },
  label: {
    type: String,
    default: 'Image'
  },
  columns: {
    type: Number,
    default: 3,
    validator: (value) => [1, 2, 3, 4].includes(value)
  },
  emptyText: {
    type: String,
    default: 'Tidak ada gambar'
  }
})

const showLightbox = ref(false)
const currentIndex = ref(0)

const gridClass = computed(() => {
  const cols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4'
  }
  return cols[props.columns] || cols[3]
})

const openLightbox = (index) => {
  currentIndex.value = index
  showLightbox.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  showLightbox.value = false
  document.body.style.overflow = ''
}

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

// Keyboard navigation
const handleKeydown = (e) => {
  if (!showLightbox.value) return
  
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

if (process.client) {
  window.addEventListener('keydown', handleKeydown)
}
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