export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const api = $fetch.create({
    baseURL: config.public.apiBase as string,

    onRequest({ options }) {
      const token = authStore.accessToken
      if (token) {
        options.headers = {
          ...options.headers as Record<string, string>,
          Authorization: `Bearer ${token}`,
        }
      }
    },

    async onResponseError({ response }) {
      if (response?.status === 401) {
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
