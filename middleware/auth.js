// middleware/auth.js
export default defineNuxtRouteMiddleware((to, from) => {
  // Hanya jalankan di sisi client (browser) agar tidak error 'localStorage is not defined'
  if (import.meta.client) {
    const user = localStorage.getItem('user') 
    
    // Daftar halaman yang wajib login
    const protectedRoutes = ['/dashboard', '/processing', '/materials', '/locations']
    
    // Cek apakah halaman yang dituju termasuk halaman rahasia
    const isProtected = protectedRoutes.some(route => to.path.startsWith(route))
    
    // 1. Jika akses halaman rahasia tapi tidak ada user -> Tendang ke login
    if (isProtected && !user) {
      return navigateTo('/login')
    }
    
    // 2. Jika sudah login tapi buka halaman login -> Lempar ke dashboard
    if (to.path === '/login' && user) {
      return navigateTo('/dashboard')
    }
  }
})