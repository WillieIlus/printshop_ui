import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBase as string,
    // JWT auth via Authorization header - no credentials/cookies needed for CORS.
    // Backend must allow origin (e.g. https://printy.ke) in CORS for production.
    // credentials: 'include' not used - we rely on Bearer token in header.

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

    async onResponseError({ response, request }) {
      const status = response?.status
      const url = typeof request === 'string' ? request : (request as Request)?.url ?? ''

      // Log API errors for debugging (400/403/500) - callers surface messages via parseApiError
      if (status && status >= 400) {
        const body = response._data as Record<string, unknown> | undefined
        console.error(`[API Error] ${status} ${url}`, body ?? response.statusText)
      }

      if (status === 401) {
        if (url.includes('api-auth/login') || url.includes('token/refresh')) return
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
