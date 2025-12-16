<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Date Input -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          {{ dateLabel }} {{ required ? '*' : '' }}
        </label>
        <input
          :value="dateValue"
          @input="$emit('update:date', $event.target.value)"
          type="date"
          :required="required"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-gray-900"
          :min="minDate"
          :max="maxDate"
        />
      </div>

      <!-- Time Input with Now Button -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          {{ timeLabel }} {{ required ? '*' : '' }}
          <button
            v-if="showNowButton"
            type="button"
            @click="setNow"
            class="ml-2 text-xs text-primary hover:text-primary/80 font-medium hover:underline transition"
          >
            (Set Now)
          </button>
        </label>
        <input
          :value="timeValue"
          @input="$emit('update:time', $event.target.value)"
          type="time"
          :required="required"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-gray-900"
        />
      </div>
    </div>

    <!-- Combined DateTime Display -->
    <div v-if="showPreview && dateValue && timeValue" class="p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div class="flex items-center gap-2 text-sm">
        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-gray-600">Preview:</span>
        <span class="font-semibold text-gray-900">{{ formattedDateTime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  dateValue: {
    type: String,
    default: ''
  },
  timeValue: {
    type: String,
    default: ''
  },
  dateLabel: {
    type: String,
    default: 'Tanggal'
  },
  timeLabel: {
    type: String,
    default: 'Waktu'
  },
  required: {
    type: Boolean,
    default: false
  },
  showNowButton: {
    type: Boolean,
    default: true
  },
  showPreview: {
    type: Boolean,
    default: true
  },
  minDate: {
    type: String,
    default: ''
  },
  maxDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:date', 'update:time', 'datetime-changed'])

const formattedDateTime = computed(() => {
  if (!props.dateValue || !props.timeValue) return ''
  
  try {
    const datetime = new Date(`${props.dateValue}T${props.timeValue}`)
    return datetime.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return ''
  }
})

const setNow = () => {
  const now = new Date()
  const date = now.toISOString().split('T')[0]
  const time = now.toTimeString().slice(0, 5)
  
  emit('update:date', date)
  emit('update:time', time)
  emit('datetime-changed', { date, time })
}

// Initialize with current date/time if empty
const initializeDateTime = () => {
  if (!props.dateValue && !props.timeValue) {
    setNow()
  }
}

// You can call this manually if needed
defineExpose({
  setNow,
  initializeDateTime
})
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  filter: invert(0.5);
}

input[type="date"]::-webkit-calendar-picker-indicator:hover,
input[type="time"]::-webkit-calendar-picker-indicator:hover {
  filter: invert(0.3);
}
</style>