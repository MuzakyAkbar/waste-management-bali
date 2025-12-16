<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="!loading && closeModal()"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        
        <!-- Header -->
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg leading-6 font-bold text-gray-900">Kelola Material Input</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-500" :disabled="loading">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="px-4 py-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          
          <!-- Loading State -->
          <div v-if="loadingData" class="text-center py-8">
            <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-500 text-sm">Memuat data material...</p>
          </div>

          <!-- No Materials Warning -->
          <div v-else-if="!loadingData && availableMaterials.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 text-amber-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="text-gray-700 font-medium mb-2">Belum ada master data material</p>
            <p class="text-gray-500 text-sm">Silakan tambahkan material di menu Material atau cek RLS policies di Supabase</p>
            <button 
              @click="retryFetch" 
              class="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              🔄 Coba Lagi
            </button>
          </div>

          <!-- Material Table -->
          <div v-else>
            <!-- Debug Info -->
            <div class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
              <p class="font-semibold text-blue-900 mb-1">🔍 Debug Info:</p>
              <p class="text-blue-700">Materials loaded: {{ availableMaterials.length }}</p>
              <p class="text-blue-700 truncate">Data: {{ JSON.stringify(availableMaterials) }}</p>
            </div>

            <div class="flex justify-between items-center mb-3">
              <p class="text-sm text-gray-600">
                <span class="font-semibold">{{ availableMaterials.length }}</span> material tersedia
              </p>
              <button 
                type="button" 
                @click="addRow" 
                class="text-sm text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1"
                :disabled="loading"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Tambah Baris
              </button>
            </div>

            <div class="border rounded-lg overflow-hidden shadow-sm">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Jenis Material
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Berat (Kg)
                    </th>
                    <th class="px-4 py-3 w-16 text-center"></th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(row, index) in rows" :key="index" class="hover:bg-gray-50">
                    <td class="px-4 py-3">
                      <select 
                        v-model="row.material_id" 
                        class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                        :disabled="loading"
                        required
                      >
                        <option value="">-- Pilih Material --</option>
                        <option 
                          v-for="mat in availableMaterials" 
                          :key="mat.material_id" 
                          :value="mat.material_id"
                        >
                          {{ mat.material_name }}
                        </option>
                      </select>
                    </td>
                    <td class="px-4 py-3">
                      <input 
                        type="number" 
                        step="0.01" 
                        min="0"
                        v-model.number="row.qty" 
                        class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" 
                        placeholder="0.00"
                        :disabled="loading"
                        required
                      >
                    </td>
                    <td class="px-4 py-3 text-center">
                      <button 
                        type="button"
                        @click="removeRow(index)" 
                        class="text-red-500 hover:text-red-700 disabled:opacity-30"
                        :disabled="loading || rows.length === 1"
                        title="Hapus baris"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="rows.length === 0">
                    <td colspan="3" class="px-4 py-8 text-center text-gray-500 text-sm">
                      Klik <strong>Tambah Baris</strong> untuk mulai.
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-blue-50 border-t-2 border-blue-200">
                  <tr>
                    <td class="px-4 py-3 text-right font-bold text-gray-700">Total Input:</td>
                    <td class="px-4 py-3 font-bold text-blue-700 text-lg">{{ totalWeight }} Kg</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <p class="text-xs text-blue-800">
                  Total akan otomatis tersimpan sebagai <strong>Input Amount</strong> di proses ini.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
          <button 
            type="button" 
            class="w-full inline-flex justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto items-center gap-2"
            :disabled="loading || loadingData || !canSave"
            @click="handleSave"
          >
            <svg v-if="loading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
          <button 
            type="button" 
            class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold bg-white text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto" 
            @click="closeModal" 
            :disabled="loading"
          >
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
const supabase = useSupabaseClient()

const rows = ref([])
const loading = ref(false)
const loadingData = ref(false)

const availableMaterials = computed(() => materialStore.materials || [])

const totalWeight = computed(() => {
  const total = rows.value.reduce((sum, row) => {
    const qty = parseFloat(row.qty) || 0
    return sum + qty
  }, 0)
  return total.toFixed(2)
})

const canSave = computed(() => {
  const validRows = rows.value.filter(r => r.material_id && parseFloat(r.qty) > 0)
  return validRows.length > 0 && availableMaterials.value.length > 0
})

watch(() => props.show, async (isOpen) => {
  if (isOpen && props.processId) {
    await loadModalData()
  } else {
    resetModalData()
  }
})

const loadModalData = async () => {
  loadingData.value = true
  console.log('📂 Loading modal for process:', props.processId)
  
  try {
    // 1. Try store fetch first
    console.log('📦 Attempting store fetch...')
    await materialStore.fetchMaterials()
    console.log('✅ Store fetch result:', materialStore.materials.length)

    // 2. If store is empty, try direct query
    if (materialStore.materials.length === 0) {
      console.warn('⚠️ Store empty, trying direct query...')
      const { data, error } = await supabase
        .from('SB_Material')
        .select('material_id, material_name, location_id, created_at')
        .order('material_name')
      
      if (error) {
        console.error('❌ Direct query error:', error)
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          hint: error.hint
        })
      } else if (data) {
        console.log('✅ Direct query success:', data.length, 'materials')
        materialStore.materials = data.map(m => ({
          material_id: m.material_id,
          material_name: m.material_name,
          location_id: m.location_id,
          location_name: 'Unknown',
          created_at: m.created_at
        }))
      }
    }

    // 3. Fetch existing materials used
    console.log('🔍 Fetching materials used...')
    const existingMaterials = await processingStore.fetchMaterialsUsed(props.processId)
    console.log('✅ Existing materials:', existingMaterials.length)
    
    // 4. Populate rows
    if (existingMaterials && existingMaterials.length > 0) {
      rows.value = existingMaterials.map(m => ({
        material_id: m.material_id,
        qty: parseFloat(m.qty) || 0
      }))
    } else {
      rows.value = [{ material_id: '', qty: 0 }]
    }
  } catch (error) {
    console.error('❌ Load error:', error)
    alert('Gagal memuat data: ' + error.message)
  } finally {
    loadingData.value = false
  }
}

const retryFetch = async () => {
  await loadModalData()
}

const resetModalData = () => {
  rows.value = []
  loading.value = false
  loadingData.value = false
}

const addRow = () => {
  rows.value.push({ material_id: '', qty: 0 })
  console.log('➕ Row added')
}

const removeRow = (index) => {
  if (rows.value.length > 1) {
    rows.value.splice(index, 1)
    console.log('🗑️ Row removed')
  }
}

const closeModal = () => {
  if (!loading.value) {
    emit('close')
  }
}

const handleSave = async () => {
  const validRows = rows.value.filter(r => r.material_id && parseFloat(r.qty) > 0)
  
  if (validRows.length === 0) {
    alert('⚠️ Harap isi minimal satu material dengan berat yang valid')
    return
  }

  const materialIds = validRows.map(r => r.material_id)
  if (materialIds.length !== new Set(materialIds).size) {
    alert('⚠️ Material yang sama tidak boleh dipilih lebih dari satu kali')
    return
  }

  const payload = validRows.map(r => ({
    material_id: r.material_id,
    qty: parseFloat(r.qty)
  }))

  console.log('💾 Saving:', payload)
  loading.value = true
  
  try {
    const result = await processingStore.saveMaterialsUsed(props.processId, payload)
    
    if (result.success) {
      console.log('✅ Saved successfully')
      emit('save')
      closeModal()
    } else {
      throw new Error(result.error || 'Unknown error')
    }
  } catch (error) {
    console.error('❌ Save failed:', error)
    alert('Gagal menyimpan: ' + error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}
</style>