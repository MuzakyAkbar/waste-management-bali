<template>
  <div class="space-y-6">
    <ProcessingTable
      :processes="processes"
      :loading="loading"
      @add-new="showAddModal = true"
      @input-kwh="openKwhStartModal"
      @manage-materials="openMaterialModal"  
      @complete="openCompleteModal"
    />

    <!-- Modal 1: Create Process (Step 1 - Nama & Tanggal) -->
    <AddActivityModal 
      :show="showAddModal"
      @close="showAddModal = false" 
      @save="handleCreate" 
    />
    
    <!-- Modal 2: Input KWh Start (Step 2 - KWh + Foto) -->
    <AddKwhStartModal 
      :show="showKwhStartModal"
      :process="selectedProcessForKwh"
      @close="closeKwhStartModal" 
      @save="handleKwhStartSaved" 
    />
    
    <!-- Modal 3: Manage Materials (Step 3 atau sebelum Complete) -->
    <ManageMaterialsModal
      :show="showMaterialModal"
      :process-id="selectedProcessId"
      @close="closeMaterialModal"
      @save="handleMaterialSaved"
    />

    <!-- Modal 4: Complete Activity (Step 4 - KWh End + Output + Foto) -->
    <CompleteActivityModal 
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
import { useProcessingStore } from '~/stores/useProcessingStore'

// Import Components
import AddActivityModal from '~/components/processing/AddActivityModal.vue'
import AddKwhStartModal from '~/components/processing/AddKwhStartModal.vue'
import CompleteActivityModal from '~/components/processing/CompleteActivityModal.vue'
import ManageMaterialsModal from '~/components/processing/ManageMaterialsModal.vue'
import ProcessingTable from '~/components/processing/ProcessingTable.vue'

const processingStore = useProcessingStore()
const { processes, loading, statistics } = storeToRefs(processingStore)

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
  console.log('📝 Creating new process:', data)
  
  const result = await processingStore.createProcess(data)
  
  if (result.success) {
    console.log('✅ Process created successfully')
    showAddModal.value = false
    
    // Optional: Auto-open KWh modal
    // if (result.data) {
    //   selectedProcessForKwh.value = {
    //     id: result.data.processing_id,
    //     process_name: result.data.process_name
    //   }
    //   showKwhStartModal.value = true
    // }
  } else {
    console.error('❌ Failed to create:', result.error)
    alert('Failed to create: ' + result.error)
  }
}

// Handler: Open KWh Start Modal (Step 2)
const openKwhStartModal = (process) => {
  console.log('⚡ Opening KWh start modal for:', process.process_name)
  selectedProcessForKwh.value = process
  showKwhStartModal.value = true
}

const closeKwhStartModal = () => {
  console.log('🔒 Closing KWh start modal')
  showKwhStartModal.value = false
  selectedProcessForKwh.value = null
}

const handleKwhStartSaved = async () => {
  console.log('✅ KWh start saved successfully')
  showKwhStartModal.value = false
  selectedProcessForKwh.value = null
  
  // Optional: Show success notification
  console.log('🎉 KWh awal berhasil disimpan!')
}

// Handler: Open Material Modal (Step 3 atau kapan saja)
const openMaterialModal = (id) => {
  console.log('🔓 Opening material modal for process:', id)
  selectedProcessId.value = id
  showMaterialModal.value = true
}

const closeMaterialModal = () => {
  console.log('🔒 Closing material modal')
  showMaterialModal.value = false
  selectedProcessId.value = null
}

const handleMaterialSaved = async (data) => {
  console.log('✅ Materials saved successfully, input amount:', data.totalInput)
  
  showMaterialModal.value = false
  
  console.log('🎉 Material input berhasil disimpan!')
}

// Handler: Open Complete Modal (Step 4)
const openCompleteModal = (process) => {
  console.log('🏁 Opening complete modal for:', process.process_name)
  selectedProcess.value = process
  showCompleteModal.value = true
}

const handleComplete = async () => {
  console.log('✅ Process completed successfully')
  showCompleteModal.value = false
  selectedProcess.value = null
}

// Initial Load
onMounted(() => {
  processingStore.fetchProcesses()
})
</script>