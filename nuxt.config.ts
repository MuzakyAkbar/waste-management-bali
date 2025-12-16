// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY,
    }
  },

  app: {
    head: {
      title: 'Waste Management Bali',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
        { name: 'description', content: 'Sistem Pengelolaan Sampah Bali' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config',
    exposeConfig: false,
    viewer: true
  },

  devtools: { enabled: true },

  compatibilityDate: '2024-12-16',

  // Ensure proper SSR handling
  ssr: true,

  // Development server config
  devServer: {
    port: 3001
  }
})