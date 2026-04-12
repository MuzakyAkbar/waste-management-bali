<template>
  <div class="space-y-6">
    <DewateringTable
      :processes="processes"
      :loading="loading"
      @add-new="showAddModal = true"
      @input-kwh="openKwhStartModal"
      @manage-materials="openMaterialModal"
      @complete="openCompleteModal"
    />

    <!-- Modal 1: Create Dewatering (Step 1 - Nama & Tanggal) -->
    <AddDewateringModal
      :show="showAddModal"
      @close="showAddModal = false"
      @save="handleCreate"
    />

    <!-- Modal 2: Input KWh Start (Step 2 - KWh + Foto) -->
    <AddDewateringKwhStartModal
      :show="showKwhStartModal"
      :process="selectedProcessForKwh"
      @close="closeKwhStartModal"
      @save="handleKwhStartSaved"
    />

    <!-- Modal 3: Manage Materials (Step 3 atau sebelum Complete) -->
    <ManageDewateringMaterialsModal
      :show="showMaterialModal"
      :process-id="selectedProcessId"
      @close="closeMaterialModal"
      @save="handleMaterialSaved"
    />

    <!-- Modal 4: Complete Dewatering (Step 4 - KWh End + Output + Foto) -->
    <CompleteDewateringModal
      :show="showCompleteModal"
      :process="selectedProcess"
      @close="showCompleteModal = false"
      @save="handleComplete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDewateringStore } from '~/stores/useDewateringStore'

// Import Components
import AddDewateringModal from '~/components/dewatering/AddDewateringModal.vue'
import AddDewateringKwhStartModal from '~/components/dewatering/AddDewateringKwhStartModal.vue'
import CompleteDewateringModal from '~/components/dewatering/CompleteDewateringModal.vue'
import ManageDewateringMaterialsModal from '~/components/dewatering/ManageDewateringMaterialsModal.vue'
import DewateringTable from '~/components/dewatering/DewateringTable.vue'

definePageMeta({
  middleware: 'auth'
})

const dewateringStore = useDewateringStore()
const { processes, loading, statistics } = storeToRefs(dewateringStore)

// State Modals
const showAddModal = ref(false)
const showKwhStartModal = ref(false)
const showCompleteModal = ref(false)
const showMaterialModal = ref(false)

const selectedProcess = ref(null)
const selectedProcessForKwh = ref(null)
const selectedProcessId = ref(null)

// Handler: Create Process (Step 1)
const handleCreate = async (data) => {
  console.log('📝 Creating new dewatering:', data)
  showAddModal.value = false
}

// Handler: Open KWh Start Modal (Step 2)
const openKwhStartModal = (process) => {
  console.log('⚡ Opening KWh start modal for:', process.process_name)
  selectedProcessForKwh.value = process
  showKwhStartModal.value = true
}

const closeKwhStartModal = () => {
  showKwhStartModal.value = false
  selectedProcessForKwh.value = null
}

const handleKwhStartSaved = async () => {
  console.log('✅ KWh start dewatering saved successfully')
  showKwhStartModal.value = false
  selectedProcessForKwh.value = null
}

// Handler: Open Material Modal (Step 3)
const openMaterialModal = (id) => {
  console.log('🔓 Opening material modal for dewatering:', id)
  selectedProcessId.value = id
  showMaterialModal.value = true
}

const closeMaterialModal = () => {
  showMaterialModal.value = false
  selectedProcessId.value = null
}

const handleMaterialSaved = async (data) => {
  console.log('✅ Materials dewatering saved successfully, input amount:', data?.totalInput)
  showMaterialModal.value = false
}

// Handler: Open Complete Modal (Step 4)
const openCompleteModal = (process) => {
  console.log('🏁 Opening complete modal for:', process.process_name)
  selectedProcess.value = process
  showCompleteModal.value = true
}

const handleComplete = async () => {
  console.log('✅ Dewatering process completed successfully')
  showCompleteModal.value = false
  selectedProcess.value = null
}

// Initial Load
onMounted(() => {
  dewateringStore.fetchProcesses()
})
</script>
s