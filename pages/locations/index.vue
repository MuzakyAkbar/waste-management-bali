<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Master Locations</h1>
      <button @click="showModal = true" class="btn btn-primary px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">
        + Add Location
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
            <th class="px-6 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="loc in locationStore.locations" :key="loc.location_id">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ loc.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ loc.address || '-' }}</td>
            <td class="px-6 py-4 text-right">
              <button @click="handleDelete(loc.location_id)" class="text-red-600 hover:text-red-900 text-sm">Delete</button>
            </td>
          </tr>
          <tr v-if="locationStore.locations.length === 0">
            <td colspan="3" class="px-6 py-8 text-center text-gray-500">No locations found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-bold mb-4">Add New Location</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Name</label>
            <input v-model="form.name" type="text" class="w-full border rounded-lg p-2">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Address</label>
            <textarea v-model="form.address" class="w-full border rounded-lg p-2"></textarea>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <button @click="showModal = false" class="px-4 py-2 border rounded-lg">Cancel</button>
          <button @click="handleSubmit" :disabled="loading" class="px-4 py-2 bg-primary-600 text-white rounded-lg">
            {{ loading ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLocationStore } from '~/stores/useLocationStore'

const locationStore = useLocationStore()
const showModal = ref(false)
const loading = ref(false)
const form = ref({ name: '', address: '' })

onMounted(() => locationStore.fetchLocations())

const handleSubmit = async () => {
  if (!form.value.name) return alert('Name is required')
  loading.value = true
  const res = await locationStore.addLocation(form.value)
  loading.value = false
  if (res.success) {
    showModal.value = false
    form.value = { name: '', address: '' }
  } else {
    alert(res.error)
  }
}

const handleDelete = async (id) => {
  if (confirm('Are you sure?')) await locationStore.deleteLocation(id)
}
</script>