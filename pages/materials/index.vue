<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Master Materials</h1>
        <p class="text-sm text-gray-500 mt-0.5">Daftar jenis material yang tersedia</p>
      </div>
      <button
        @click="showMasterModal = true"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm font-medium transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Material
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Material Name</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
            <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="materialStore.loading">
            <td colspan="3" class="px-6 py-8 text-center text-gray-400 text-sm">Memuat data...</td>
          </tr>
          <tr
            v-for="mat in materialStore.materials"
            :key="mat.material_id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ mat.material_name }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">
              <span class="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                {{ getLocationName(mat.location_id) }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button
                @click="handleDeleteMaster(mat.material_id)"
                class="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="!materialStore.loading && materialStore.materials.length === 0">
            <td colspan="3" class="px-6 py-10 text-center text-gray-400 text-sm">Belum ada data material.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Tambah Master Material -->
    <div v-if="showMasterModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-lg font-bold text-gray-900">Tambah Master Material</h3>
          <button @click="showMasterModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select v-model="masterForm.location_id" class="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-primary-500 focus:border-primary-500 text-sm">
              <option :value="null" disabled>-- Pilih Lokasi --</option>
              <option v-for="loc in locationStore.locations" :key="loc.location_id" :value="loc.location_id">
                {{ loc.location_name || loc.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Material Name</label>
            <input
              v-model="masterForm.material_name"
              type="text"
              class="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder="Contoh: Serbuk Kayu"
            >
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button @click="showMasterModal = false" class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Batal</button>
          <button
            @click="handleSubmitMaster"
            :disabled="masterLoading"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
          >
            {{ masterLoading ? 'Menyimpan...' : 'Simpan' }}
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

definePageMeta({
  middleware: 'auth'
})

const materialStore = useMaterialStore()
const locationStore = useLocationStore()

const showMasterModal = ref(false)
const masterLoading = ref(false)
const masterForm = ref({ material_name: '', location_id: null })

const getLocationName = (locationId) => {
  if (!locationId) return 'Unknown'
  const loc = locationStore.locations.find(l => l.location_id === locationId)
  return loc?.location_name || loc?.name || 'Unknown'
}

const handleSubmitMaster = async () => {
  if (!masterForm.value.material_name || !masterForm.value.location_id) {
    return alert('Harap isi semua field.')
  }
  masterLoading.value = true
  const res = await materialStore.addMaterial(masterForm.value)
  masterLoading.value = false
  if (res.success) {
    showMasterModal.value = false
    masterForm.value = { material_name: '', location_id: null }
  } else {
    alert(res.error)
  }
}

const handleDeleteMaster = async (id) => {
  if (confirm('Hapus material ini?')) await materialStore.deleteMaterial(id)
}

onMounted(async () => {
  await Promise.all([
    materialStore.fetchMaterials(),
    locationStore.fetchLocations()
  ])
})
</script>