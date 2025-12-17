<template>
  <!-- ✅ PERBAIKAN: Tambahkan touch-action untuk mobile -->
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto touch-none" aria-labelledby="modal-title" role="dialog" aria-modal="true" @touchmove.prevent>
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      
      <!-- ✅ PERBAIKAN: Fixed overlay untuk mobile -->
      <div 
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity touch-none" 
        aria-hidden="true" 
        @click.stop="!loading && closeModal()"
        @touchend.stop="!loading && closeModal()"
      ></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Modal panel -->
      <!-- ✅ PERBAIKAN: Prevent click propagation di mobile -->
      <div 
        class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
        @click.stop
        @touchend.stop
      >
        
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

          <!-- Error State -->
          <div v-else-if="errorMessage" class="text-center py-8">
            <svg class="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-700 font-medium mb-2">Gagal memuat data</p>
            <p class="text-gray-500 text-sm mb-4">{{ errorMessage }}</p>
            <button 
              @click="retryFetch" 
              class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium"
            >
              🔄 Coba Lagi
            </button>
          </div>

          <!-- No Materials Warning -->
          <div v-else-if="!loadingData && availableMaterials.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 text-amber-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="text-gray-700 font-medium mb-2">Belum ada master data material</p>
            <p class="text-gray-500 text-sm">Silakan tambahkan material di menu Material Management</p>
            <button 
              @click="retryFetch" 
              class="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              🔄 Coba Lagi
            </button>
          </div>

          <!-- Material Table -->
          <div v-else>
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
                  <tr v-for="(row, index) in rows" :key="index" class="hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-3">
                      <select 
                        v-model="row.material_id" 
                        @change="console.log('Material selected:', row.material_id)"
                        class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                        :class="{ 'border-red-300 bg-red-50': !row.material_id }"
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
                        v-model="row.qty"
                        @input="handleQtyInput($event, index)"
                        @blur="console.log('Qty blur:', row.qty)"
                        class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm transition-all" 
                        :class="{ 'border-red-300 bg-red-50': row.qty <= 0 }"
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
import { useMaterialStore } from '~/stores/useMaterialStore'
import { useProcessingStore } from '~/stores/useProcessingStore'

const props = defineProps({
  show: Boolean,
  processId: String
})

const emit = defineEmits(['close', 'save'])
const materialStore = useMaterialStore()
const processingStore = useProcessingStore()
const supabase = useSupabaseClient()

const rows = ref([])
const loading = ref(false)
const loadingData = ref(false)
const errorMessage = ref('')
const dataLoaded = ref(false) // ✅ Track if data already loaded

const availableMaterials = ref([]) // ✅ Local cache

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

// ✅ PERBAIKAN: Only load once per modal open + handle body overflow
watch(() => props.show, async (isOpen, wasOpen) => {
  if (isOpen && !wasOpen && props.processId) {
    // Modal just opened
    console.log('🔓 Modal opened for process:', props.processId)
    
    // ✅ Prevent body scroll on mobile
    if (process.client) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    }
    
    // Only load if not already loaded OR if processId changed
    if (!dataLoaded.value) {
      await loadModalData()
    }
  } else if (!isOpen && wasOpen) {
    // Modal just closed
    console.log('🔒 Modal closed')
    
    // ✅ Restore body scroll
    if (process.client) {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
    
    resetModalData()
  }
})

const loadModalData = async () => {
  // ✅ Prevent multiple simultaneous loads
  if (loadingData.value) {
    console.log('⚠️ Already loading, skipping...')
    return
  }

  loadingData.value = true
  errorMessage.value = ''
  console.log('📂 Loading modal data for process:', props.processId)
  
  try {
    // ✅ Single batch query
    const { data: materialsData, error: materialsError } = await supabase
      .from('SB_Material')
      .select('material_id, material_name, location_id')
      .order('material_name')
    
    if (materialsError) throw new Error('Gagal memuat data material: ' + materialsError.message)

    availableMaterials.value = materialsData || []
    console.log('✅ Materials loaded:', availableMaterials.value.length)

    // ✅ Load existing materials used
    const { data: usedData, error: usedError } = await supabase
      .from('SB_Material_Used')
      .select('used_id, material_id, qty')
      .eq('processing_id', props.processId)
    
    if (usedError) throw new Error('Gagal memuat material yang digunakan: ' + usedError.message)

    console.log('✅ Existing materials used:', usedData?.length || 0)
    console.log('📦 Raw used data:', JSON.stringify(usedData))

    // Populate rows
    if (usedData && usedData.length > 0) {
      rows.value = usedData.map(m => {
        const row = {
          material_id: m.material_id,
          qty: parseFloat(m.qty) || 0
        }
        console.log('  Mapping row:', JSON.stringify(row))
        return row
      })
    } else {
      rows.value = [{ material_id: '', qty: 0 }]
    }

    console.log('✅ Final rows:', JSON.stringify(rows.value))

    dataLoaded.value = true
    console.log('✅ Modal data loaded successfully')
  } catch (error) {
    console.error('❌ Load error:', error)
    errorMessage.value = error.message
  } finally {
    loadingData.value = false
  }
}

const retryFetch = async () => {
  errorMessage.value = ''
  dataLoaded.value = false
  await loadModalData()
}

const resetModalData = () => {
  rows.value = []
  loading.value = false
  loadingData.value = false
  errorMessage.value = ''
  dataLoaded.value = false
  availableMaterials.value = [] // ✅ Clear cache
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

const handleQtyInput = (event, index) => {
  const value = event.target.value
  const numValue = parseFloat(value) || 0
  
  console.log(`📝 Qty input at index ${index}: "${value}" → ${numValue}`)
  
  // Force update the row
  rows.value[index].qty = numValue
  
  console.log(`✅ Row ${index} updated:`, JSON.stringify(rows.value[index]))
}

const closeModal = () => {
  if (!loading.value) {
    emit('close')
  }
}

const handleSave = async () => {
  console.log('🔍 Current rows before validation:', JSON.stringify(rows.value))
  
  const validRows = rows.value.filter(r => {
    const hasId = r.material_id && r.material_id !== ''
    const hasQty = parseFloat(r.qty) > 0
    console.log(`  Row check - ID: ${r.material_id}, Qty: ${r.qty}, Valid: ${hasId && hasQty}`)
    return hasId && hasQty
  })
  
  console.log('✅ Valid rows:', validRows.length, JSON.stringify(validRows))
  
  if (validRows.length === 0) {
    alert('⚠️ Harap isi minimal satu material dengan berat yang valid')
    return
  }

  const materialIds = validRows.map(r => r.material_id)
  const uniqueIds = new Set(materialIds)
  
  console.log('🔍 Material IDs:', materialIds)
  console.log('🔍 Unique IDs:', [...uniqueIds])
  
  if (materialIds.length !== uniqueIds.size) {
    alert('⚠️ Material yang sama tidak boleh dipilih lebih dari satu kali')
    return
  }

  loading.value = true
  
  try {
    console.log('💾 Saving materials for process:', props.processId)

    // 1. Delete existing materials
    console.log('🗑️ Deleting existing materials...')
    const { error: deleteError } = await supabase
      .from('SB_Material_Used')
      .delete()
      .eq('processing_id', props.processId)
    
    if (deleteError) {
      console.error('❌ Delete error:', deleteError)
      throw deleteError
    }
    
    console.log('✅ Existing materials deleted')

    // 2. Insert new materials
    const payload = validRows.map(r => ({
      processing_id: props.processId,
      material_id: r.material_id,
      qty: parseFloat(r.qty)
    }))

    console.log('📦 Insert payload:', JSON.stringify(payload, null, 2))

    const { error: insertError } = await supabase
      .from('SB_Material_Used')
      .insert(payload)
    
    if (insertError) {
      console.error('❌ Insert error:', insertError)
      throw insertError
    }
    
    console.log('✅ Materials inserted')

    // 3. Update total input_amount_kg in processing
    const totalInput = validRows.reduce((sum, r) => {
      const qty = parseFloat(r.qty) || 0
      console.log(`  Adding ${qty} to total`)
      return sum + qty
    }, 0)

    console.log('📊 Total input calculated:', totalInput)

    const { error: updateError } = await supabase
      .from('SB_Processing')
      .update({ input_amount_kg: totalInput })
      .eq('processing_id', props.processId)

    if (updateError) {
      console.error('❌ Update error:', updateError)
      throw updateError
    }

    console.log('✅ Processing updated with total input')
    console.log('✅ Save completed successfully!')

    // ✅ Update store immediately for instant UI feedback
    await processingStore.updateProcessInputAmount(props.processId, totalInput)
    
    console.log('✅ Store updated with new input amount')

    // ✅ Emit save with data
    emit('save', { processId: props.processId, totalInput })
    
    console.log('📢 Emitted save event')
    
    closeModal()
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

/* ✅ PERBAIKAN: Prevent scrolling issues on mobile */
.touch-none {
  touch-action: none;
}

/* ✅ Ensure modal is always on top */
.z-50 {
  z-index: 9999 !important;
}
</style>