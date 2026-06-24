export default defineNuxtConfig({
  compatibilityDate: '2026-06-24',
  devtools: { enabled: true },

  ssr: false,

  modules: ['@pinia/nuxt'],

  css: ['~/assets/css/main.css'],

  build: {
    transpile: ['naive-ui', 'vueuc', 'date-fns', 'evtd'],
  },

  vite: {
    ssr: {
      noExternal: ['naive-ui', 'vueuc', 'date-fns', 'evtd'],
    },
    optimizeDeps: {
      include: ['naive-ui', 'vueuc'],
    },
  },
  
  devServer: {
    port: 8080,
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
    },
  },
})