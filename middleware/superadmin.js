// middleware/superadmin.js
export default defineNuxtRouteMiddleware((to, from) => {
  // Hanya jalankan di sisi client
  if (import.meta.client) {
    const authStore = useAuthStore()
    
    // Check if user is logged in first
    if (!authStore.isAuthenticated) {
      return navigateTo('/login')
    }
    
    // Check if user is SuperAdmin
    const userRole = authStore.user?.role?.toLowerCase()
    
    if (userRole !== 'superadmin') {
      // Show toast notification if available
      try {
        const { showError } = useToast()
        showError(
          'Akses Ditolak',
          'Halaman ini hanya dapat diakses oleh SuperAdmin'
        )
      } catch (e) {
        // If toast not available, just redirect
        console.warn('Toast notification not available')
      }
      
      // Redirect to dashboard
      return navigateTo('/dashboard')
    }
  }
})