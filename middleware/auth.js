// middleware/auth.js
export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.client) {
    const user = localStorage.getItem('user')
    
    // Protected routes
    const protectedRoutes = ['/dashboard', '/processing']
    const isProtected = protectedRoutes.some(route => to.path.startsWith(route))
    
    if (isProtected && !user) {
      return navigateTo('/login')
    }
    
    // Redirect to dashboard if already logged in
    if (to.path === '/login' && user) {
      return navigateTo('/dashboard')
    }
  }
})