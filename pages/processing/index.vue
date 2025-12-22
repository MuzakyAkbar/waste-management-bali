<template>
  <div class="space-y-6">
    <ProcessingTable
      :processes="processes"
      :loading="loading"
      @add-new="showAddModal = true"
      @manage-materials="openMaterialModal"  
      @complete="openCompleteModal"
    />

    <AddActivityModal 
      v-if="showAddModal" 
      :show="showAddModal"
      @close="showAddModal = false" 
      @save="handleCreate" 
    />
    
    <ManageMaterialsModal
      v-if="showMaterialModal"
      :show="showMaterialModal"
      :process-id="selectedProcessId"
      @close="showMaterialModal = false"
      @save="handleMaterialSaved"
    />

    <CompleteActivityModal 
      v-if="showCompleteModal" 
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
  selectedProcessId.value = id
  showMaterialModal.value = true
}

// ✅ PERBAIKAN: handleCreate dengan validation
const handleCreate = async (formData) => {
  console.log('📥 Received data from modal:', formData)
  
  // ✅ Validation
  if (!formData) {
    console.error('❌ No data received from modal')
    alert('Error: Data tidak valid')
    return
  }
  
  if (!formData.created_by) {
    console.error('❌ No user ID in formData')
    alert('Error: User ID tidak ditemukan. Silakan login ulang.')
    return
  }
  
  if (!formData.imageFile) {
    console.error('❌ No image file in formData')
    alert('Error: Foto wajib diupload')
    return
  }
  
  console.log('✅ Data validated, calling store...')
  
  try {
    const result = await processingStore.createProcess(formData)
    
    if (result.success) {
      console.log('✅ Process created successfully')
      showAddModal.value = false
    } else {
      console.error('❌ Failed to create:', result.error)
      alert('Gagal membuat aktivitas: ' + result.error)
    }
  } catch (error) {
    console.error('❌ Exception in handleCreate:', error)
    alert('Terjadi kesalahan: ' + error.message)
  }
}

const handleMaterialSaved = () => {
  showMaterialModal.value = false
  console.log('✅ Materials saved, refreshing...')
  processingStore.fetchProcesses()
}

const handleComplete = async () => {
  showCompleteModal.value = false
  selectedProcess.value = null
  console.log('✅ Process completed, refreshing...')
  await processingStore.fetchProcesses()
}

onMounted(() => {
  processingStore.fetchProcesses()
})
</script>