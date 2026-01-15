// composables/useToast.js
export const useToast = () => {
  // Use useState to make it reactive across components
  const toasts = useState('toasts', () => [])

  const addToast = (toast) => {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, ...toast })
    
    // Auto remove toast after duration
    const duration = toast.duration !== undefined ? toast.duration : 5000
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const showError = (title, message, duration = 5000) => {
    return addToast({ type: 'error', title, message, duration })
  }

  const showSuccess = (title, message, duration = 3000) => {
    return addToast({ type: 'success', title, message, duration })
  }

  const showWarning = (title, message, duration = 4000) => {
    return addToast({ type: 'warning', title, message, duration })
  }

  const showInfo = (title, message, duration = 3000) => {
    return addToast({ type: 'info', title, message, duration })
  }

  return {
    toasts: computed(() => toasts.value),
    addToast,
    removeToast,
    showError,
    showSuccess,
    showWarning,
    showInfo
  }
}