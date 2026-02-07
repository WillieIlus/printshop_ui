import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBase as string,

    onRequest({ options }) {
      // Get auth store lazily to avoid initialization issues
      const authStore = useAuthStore()
      const token = authStore.accessToken
      if (token) {
        const headers = new Headers(options.headers as HeadersInit)
        headers.set('Authorization', `Bearer ${token}`)
        options.headers = headers
      }
    },

    async onResponseError({ response }) {
      if (response?.status === 401) {
        const authStore = useAuthStore()
        const refreshed = await authStore.refreshTokens()
        if (!refreshed) {
          authStore.logout()
        }
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})
