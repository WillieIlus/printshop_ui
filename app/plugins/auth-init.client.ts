import { useAuthStore } from '~/stores/auth'

/**
 * Runs on client after app mount.
 * Refreshes tokens when we have a refresh token so the first API call
 * doesn't fail with 401 due to expired access token (access expires in 15 min).
 */
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  if (authStore.tokens?.refresh) {
    await authStore.refreshTokens()
  }
  if (authStore.isAuthenticated && !authStore.user) {
    await authStore.fetchUser()
  }
})
