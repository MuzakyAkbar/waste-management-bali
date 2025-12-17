<template>
  <div class="space-y-6">
    <ProcessingTable
      :processes="processes"
      :loading="loading"
      @add-new="showAddModal = true"
      @manage-materials="openMaterialModal"  
      @complete="openCompleteModal"
    />

    <!-- ✅ PERBAIKAN: Gunakan v-show atau pindahkan v-if ke dalam modal -->
    <!-- ✅ Pass show prop explicitly -->
    <AddActivityModal 
      :show="showAddModal"
      @close="showAddModal = false" 
      @save="handleCreate" 
    />
    
    <!-- ✅ PERBAIKAN: Hanya render sekali, kontrol visibility dengan prop show -->
    <ManageMaterialsModal
      :show="showMaterialModal"
      :process-id="selectedProcessId"
      @close="closeMaterialModal"
      @save="handleMaterialSaved"
    />

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
import CompleteActivityModal from '~/components/processing/CompleteActivityModal.vue'
import ManageMaterialsModal from '~/components/processing/ManageMaterialsModal.vue'
import ProcessingTable from '~/components/processing/ProcessingTable.vue'

const processingStore = useProcessingStore()
const { processes, loading, statistics } = storeToRefs(processingStore)

// State Modals
const showAddModal = ref(false)
const showCompleteModal = ref(false)
const showMaterialModal = ref(false)

const selectedProcess = ref(null)
const selectedProcessId = ref(null)

// Handlers
const openCompleteModal = (process) => {
  selectedProcess.value = process
  showCompleteModal.value = true
}

const openMaterialModal = (id) => {
  console.log('🔓 Opening material modal for process:', id)
  selectedProcessId.value = id
  showMaterialModal.value = true
}

const closeMaterialModal = () => {
  console.log('🔒 Closing material modal')
  showMaterialModal.value = false
  selectedProcessId.value = null // ✅ Reset process ID
}

const handleCreate = async (data) => {
  console.log('📝 Creating process with data:', data)
  
  const result = await processingStore.createProcess(data)
  
  if (result.success) {
    console.log('✅ Process created successfully')
    showAddModal.value = false
    
    // Optional: Show success message
    // You can add a toast notification here
  } else {
    console.error('❌ Failed to create:', result.error)
    alert('Failed to create: ' + result.error)
  }
}

const handleMaterialSaved = async (data) => {
  console.log('✅ Materials saved successfully, input amount updated to:', data.totalInput)
  
  // Close modal immediately - data sudah update di store
  showMaterialModal.value = false
  
  // Optional: Show success notification
  console.log('🎉 Material input berhasil disimpan!')
}

const handleComplete = async () => {
  showCompleteModal.value = false
  selectedProcess.value = null
}

onMounted(() => {
  processingStore.fetchProcesses()
})
</script>