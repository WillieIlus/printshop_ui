import type { AuthTokens, AuthUser, LoginCredentials, SignupCredentials } from '~/shared/types'
import { API } from '~/shared/api-paths'

export const useAuthStore = defineStore('auth', () => {
  const tokens = ref<AuthTokens | null>(null)
  const user = ref<AuthUser | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!tokens.value?.access)
  const accessToken = computed(() => tokens.value?.access)
  const refreshToken = computed(() => tokens.value?.refresh)

  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      const response = await $api<AuthTokens>(API.auth.login, {
        method: 'POST',
        body: credentials,
      })
      tokens.value = response
      await fetchUser()
      return { success: true }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  async function signup(credentials: SignupCredentials) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      await $api(API.users(), {
        method: 'POST',
        body: credentials,
      })
      return await login({
        email: credentials.email,
        password: credentials.password,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!tokens.value?.access) return
    try {
      const { $api } = useNuxtApp()
      user.value = await $api<AuthUser>(API.userMe())
    } catch (err) {
      console.error('Failed to fetch user:', err)
    }
  }

  async function refreshTokens() {
    if (!tokens.value?.refresh) return false
    try {
      const { $api } = useNuxtApp()
      const response = await $api<{ access: string }>(API.auth.refresh, {
        method: 'POST',
        body: { refresh: tokens.value.refresh },
      })
      tokens.value = {
        ...tokens.value,
        access: response.access,
      }
      return true
    } catch {
      logout()
      return false
    }
  }

  function logout() {
    tokens.value = null
    user.value = null
    navigateTo('/auth/login')
  }

  function setTokens(newTokens: AuthTokens) {
    tokens.value = newTokens
  }

  return {
    tokens,
    user,
    loading,
    error,
    isAuthenticated,
    accessToken,
    refreshToken,
    login,
    signup,
    fetchUser,
    refreshTokens,
    logout,
    setTokens,
  }
}, {
  persist: {
    pick: ['tokens'],
  },
})
