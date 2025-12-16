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
import ManageMaterialsModal from '~/components/processing/ManageMaterialsModal.vue' // Import Baru
import ProcessingTable from '~/components/processing/ProcessingTable.vue'

const processingStore = useProcessingStore()
const { processes, loading, statistics } = storeToRefs(processingStore)

// State Modals
const showAddModal = ref(false)
const showCompleteModal = ref(false)
const showMaterialModal = ref(false) // State Baru

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

const handleCreate = async (data) => {
  const result = await processingStore.createProcess(data)
  if (result.success) {
    showAddModal.value = false
  } else {
    alert('Failed to create: ' + result.error)
  }
}

const handleMaterialSaved = () => {
  // Data sudah auto refresh di store, tinggal tutup modal
  showMaterialModal.value = false
}

const handleComplete = async () => {
  // Modal complete handle logicnya sendiri via store, jadi kita cuma refresh UI jika perlu
  showCompleteModal.value = false
  selectedProcess.value = null
  // Fetch ulang sudah otomatis di store action
}

onMounted(() => {
  processingStore.fetchProcesses()
})
</script>