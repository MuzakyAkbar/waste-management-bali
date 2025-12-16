export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.client) {
    const user = localStorage.getItem('user') // Atau gunakan store pinia
    
    // Daftar halaman yang wajib login
    const protectedRoutes = ['/dashboard', '/processing', '/materials', '/locations']
    const isProtected = protectedRoutes.some(route => to.path.startsWith(route))
    
    // Jika akses halaman rahasia tapi tidak ada user -> Tendang ke login
    if (isProtected && !user) {
      return navigateTo('/login')
    }
    
    // Jika sudah login tapi buka halaman login -> Lempar ke dashboard
    if (to.path === '/login' && user) {
      return navigateTo('/dashboard')
    }
  }
})