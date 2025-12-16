<template>
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors group">
    <!-- Material Select -->
    <div class="flex-1 min-w-0">
      <label class="block text-xs font-medium text-gray-700 mb-1 sm:hidden">
        Material
      </label>
      <select
        :value="material.material_id"
        @input="updateMaterial('material_id', $event.target.value)"
        class="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
        :class="{ 'border-red-300 bg-red-50': !material.material_id && showValidation }"
      >
        <option value="">Select Material</option>
        <option
          v-for="mat in availableMaterials"
          :key="mat.material_id || mat.id"
          :value="mat.material_id || mat.id"
        >
          {{ mat.material_name || mat.name }}
        </option>
      </select>
      <p v-if="!material.material_id && showValidation" class="text-xs text-red-600 mt-1">
        Please select a material
      </p>
    </div>

    <!-- Quantity Input -->
    <div class="sm:w-36 flex-shrink-0">
      <label class="block text-xs font-medium text-gray-700 mb-1 sm:hidden">
        Quantity (kg)
      </label>
      <div class="relative">
        <input
          :value="material.qty"
          @input="updateMaterial('qty', parseFloat($event.target.value) || 0)"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          class="w-full px-3 py-2 sm:py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
          :class="{ 'border-red-300 bg-red-50': material.qty <= 0 && showValidation }"
        />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
          kg
        </span>
      </div>
      <p v-if="material.qty <= 0 && showValidation" class="text-xs text-red-600 mt-1">
        Quantity must be greater than 0
      </p>
    </div>

    <!-- Delete Button -->
    <div class="flex items-end sm:items-center">
      <button
        type="button"
        @click="$emit('remove')"
        class="w-full sm:w-auto px-4 py-2 sm:py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all flex items-center justify-center gap-2 border border-red-200 sm:border-0"
        :title="'Remove ' + (materialName || 'material')"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span class="text-sm font-medium sm:hidden">Remove</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  material: {
    type: Object,
    required: true,
    default: () => ({
      material_id: '',
      qty: 0
    })
  },
  availableMaterials: {
    type: Array,
    default: () => []
  },
  showValidation: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update', 'remove'])

const materialName = computed(() => {
  if (!props.material.material_id) return ''
  const mat = props.availableMaterials.find(
    m => (m.material_id || m.id) === props.material.material_id
  )
  return mat ? (mat.material_name || mat.name) : ''
})

const updateMaterial = (field, value) => {
  emit('update', {
    ...props.material,
    [field]: value
  })
}
</script>

<style scoped>
/* Remove spinner from number input */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>