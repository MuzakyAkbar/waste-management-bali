<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Master Materials</h1>
      <button @click="showModal = true" class="btn btn-primary px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">
        + Add Material
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
            <th class="px-6 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="mat in materialStore.materials" :key="mat.material_id">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ mat.material_name }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">
              <span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                {{ getLocationName(mat.location_id) }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button @click="handleDelete(mat.material_id)" class="text-red-600 hover:text-red-900 text-sm">Delete</button>
            </td>
          </tr>
          <tr v-if="materialStore.materials.length === 0">
            <td colspan="3" class="px-6 py-8 text-center text-gray-500">No materials found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-bold mb-4">Add New Material</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Location</label>
            <select v-model="form.location_id" class="w-full border rounded-lg p-2 bg-white">
              <option :value="null" disabled>Select Location</option>
              <option v-for="loc in locationStore.locations" :key="loc.location_id" :value="loc.location_id">
                {{ loc.location_name || loc.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Material Name</label>
            <input v-model="form.material_name" type="text" class="w-full border rounded-lg p-2" placeholder="e.g. Plastik PET">
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
import { useMaterialStore } from '~/stores/useMaterialStore'
import { useLocationStore } from '~/stores/useLocationStore'

const materialStore = useMaterialStore()
const locationStore = useLocationStore()

const showModal = ref(false)
const loading = ref(false)
const form = ref({ material_name: '', location_id: null })

onMounted(async () => {
  // Gunakan await atau Promise.all agar data lebih sinkron, meski tidak wajib
  await Promise.all([
    materialStore.fetchMaterials(),
    locationStore.fetchLocations()
  ])
})

// PERBAIKAN: Fungsi Helper untuk mendapatkan nama lokasi berdasarkan ID
const getLocationName = (locationId) => {
  if (!locationId) return 'Unknown'
  
  // Mencari object location yang ID-nya cocok
  const location = locationStore.locations.find(l => l.location_id === locationId)
  
  // Mengembalikan nama (cek properti 'location_name' dari SQL atau 'name' dari store)
  if (location) {
    return location.location_name || location.name || 'Unknown'
  }
  
  return 'Unknown'
}

const handleSubmit = async () => {
  if (!form.value.material_name || !form.value.location_id) {
    return alert('Please fill all fields')
  }

  loading.value = true
  const res = await materialStore.addMaterial(form.value)
  loading.value = false

  if (res.success) {
    showModal.value = false
    form.value = { material_name: '', location_id: null }
  } else {
    alert(res.error)
  }
}

const handleDelete = async (id) => {
  if (confirm('Are you sure?')) await materialStore.deleteMaterial(id)
}
</script>