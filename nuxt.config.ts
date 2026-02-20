export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@vee-validate/nuxt',
    '@nuxt/eslint',
  ],

  // Button hierarchy: primary (solid), secondary (outline/ghost), destructive (error)
  ui: {
    button: {
      default: {
        rounded: 'rounded-xl',
      },
      primary: {
        color: 'primary',
        variant: 'solid',
      },
      secondary: {
        color: 'neutral',
        variant: 'outline',
      },
      destructive: {
        color: 'error',
        variant: 'solid',
      },
    },
  },

  css: ['~/assets/css/main.css'], // Fixed path

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api',
      mediaBase: process.env.NUXT_PUBLIC_MEDIA_BASE || 'http://localhost:8000/media',
    },
  },

  pinia: {
    storesDirs: ['./app/stores/**'],
  },

  // Pinia persistence: opt-in per store. Sensitive data (tokens) MUST use cookies.
  piniaPluginPersistedstate: {
    auto: false, // Only stores with explicit persist: true | {} are persisted
    storage: 'localStorage', // Default for opt-in stores; auth overrides with cookies (stores/auth.ts)
  },

  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },

  image: {
    domains: ['localhost', 'printy.ke', 'willieilus.pythonanywhere.com'],
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'printshop-color-mode',
  },

  // CSR only for private app; public pages (shops, index) use SSR for SEO + share previews
  routeRules: {
    '/auth/**': { ssr: false },
    '/dashboard/**': { ssr: false },
    '/onboarding/**': { ssr: false },
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      title: 'PrintShop - Pricing Engine & Gallery',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      ],
      htmlAttrs: {
        lang: 'en',
        class: 'scroll-smooth',
      },
    },
  },
})