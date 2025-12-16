<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="!loading && closeModal()"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg leading-6 font-bold text-gray-900">Kelola Material Input</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div class="px-4 py-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          
          <div v-if="loadingData" class="text-center py-8">
            <svg class="animate-spin h-8 w-8 text-primary-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p class="text-gray-500 text-sm">Memuat data material...</p>
          </div>

          <div v-else>
            <!-- DEBUG INFO (hapus setelah selesai debugging) -->
            <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
              <p class="font-semibold text-blue-900 mb-1">🔍 Debug Info:</p>
              <p class="text-blue-700">Total Materials: {{ materialStore.materials.length }}</p>
              <p class="text-blue-700">Materials: {{ JSON.stringify(materialStore.materials) }}</p>
            </div>

            <div class="flex justify-end mb-2">
              <button type="button" @click="addRow" class="text-sm text-primary-600 font-semibold hover:text-primary-800 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Tambah Baris
              </button>
            </div>

            <div class="border rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Material</th>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Berat (Kg)</th>
                    <th scope="col" class="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(row, index) in rows" :key="index">
                    <td class="px-4 py-2">
                      <select 
                        v-model="row.material_id" 
                        class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        @change="console.log('Material selected:', row.material_id)"
                      >
                        <option value="" disabled>Pilih Material ({{ materialStore.materials.length }} tersedia)</option>
                        <option 
                          v-for="mat in materialStore.materials" 
                          :key="mat.material_id" 
                          :value="mat.material_id"
                        >
                          {{ mat.material_name }}
                        </option>
                      </select>
                      <!-- Debug selected value -->
                      <p class="text-xs text-gray-400 mt-1">Selected: {{ row.material_id || 'none' }}</p>
                    </td>
                    <td class="px-4 py-2">
                      <input 
                        type="number" 
                        step="0.01" 
                        v-model="row.qty" 
                        class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
                        placeholder="0.0"
                      >
                    </td>
                    <td class="px-4 py-2 text-center">
                      <button @click="removeRow(index)" class="text-red-500 hover:text-red-700">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="rows.length === 0">
                    <td colspan="3" class="px-4 py-8 text-center text-gray-500 text-sm">Belum ada material. Klik 'Tambah Baris'.</td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td class="px-4 py-3 text-right font-bold text-gray-700">Total Input:</td>
                    <td class="px-4 py-3 font-bold text-primary-700">{{ totalWeight }} Kg</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
          <button 
            type="button" 
            class="w-full inline-flex justify-center rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 sm:ml-3 sm:w-auto items-center gap-2"
            :disabled="loading || loadingData"
            @click="handleSave"
          >
            <svg v-if="loading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
          <button type="button" class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto" @click="closeModal" :disabled="loading">
            Batal
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useProcessingStore } from '~/stores/useProcessingStore'
import { useMaterialStore } from '~/stores/useMaterialStore'

const props = defineProps({
  show: Boolean,
  processId: String
})

const emit = defineEmits(['close', 'save'])
const processingStore = useProcessingStore()
const materialStore = useMaterialStore()

const rows = ref([])
const loading = ref(false)
const loadingData = ref(false)

const totalWeight = computed(() => {
  return rows.value.reduce((sum, row) => sum + (parseFloat(row.qty) || 0), 0).toFixed(2)
})

watch(() => props.show, async (newVal) => {
  if (newVal && props.processId) {
    console.log('🔵 Modal opened for process:', props.processId)
    loadingData.value = true
    
    try {
      // SELALU fetch materials untuk memastikan data terbaru
      console.log('📦 Fetching materials...')
      await materialStore.fetchMaterials()
      console.log('✅ Materials loaded:', materialStore.materials.length, materialStore.materials)

      // Fetch Material Used by Process ID
      console.log('📦 Fetching materials used for process:', props.processId)
      const existingMaterials = await processingStore.fetchMaterialsUsed(props.processId)
      console.log('✅ Existing materials:', existingMaterials)
      
      if (existingMaterials.length > 0) {
        rows.value = existingMaterials.map(m => ({
          material_id: m.material_id,
          qty: m.qty
        }))
        console.log('✅ Rows populated with existing data:', rows.value)
      } else {
        rows.value = []
        addRow()
        console.log('✅ Added empty row')
      }
    } catch (error) {
      console.error('❌ Error loading data:', error)
    } finally {
      loadingData.value = false
    }
  }
})

const addRow = () => {
  rows.value.push({ material_id: '', qty: '' })
  console.log('➕ Row added. Total rows:', rows.value.length)
}

const removeRow = (index) => {
  rows.value.splice(index, 1)
  console.log('🗑️ Row removed. Total rows:', rows.value.length)
}

const closeModal = () => {
  console.log('❌ Modal closing')
  emit('close')
  rows.value = []
}

const handleSave = async () => {
  const validRows = rows.value.filter(r => r.material_id && r.qty > 0)
  
  console.log('💾 Saving materials...')
  console.log('Valid rows:', validRows)
  
  if (validRows.length === 0) {
    console.warn('⚠️ No valid rows to save')
  }

  loading.value = true
  const result = await processingStore.saveMaterialsUsed(props.processId, validRows)
  loading.value = false

  if (result.success) {
    console.log('✅ Materials saved successfully')
    emit('save')
    closeModal()
  } else {
    console.error('❌ Save failed:', result.error)
    alert('Gagal menyimpan: ' + result.error)
  }
}
</script>