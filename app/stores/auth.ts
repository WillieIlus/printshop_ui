import type { AuthTokens, AuthUser, LoginCredentials, SignupCredentials } from '~/shared/types'
import { API } from '~/shared/api-paths'
import { authCookieStorage } from '~/utils/auth-cookie-storage'

const AUTH_STORAGE_KEY = 'auth'

function extractErrorMessage(err: unknown, rateLimitStatus: number, rateLimitMessage: string): string {
  if (err && typeof err === 'object') {
    const e = err as { statusCode?: number; status?: number; data?: { detail?: string }; response?: { _data?: { detail?: string } } }
    if (e.statusCode === rateLimitStatus || e.status === rateLimitStatus) return rateLimitMessage
    const data = e.data ?? e.response?._data
    if (data && typeof data === 'object' && 'detail' in data && typeof (data as { detail: unknown }).detail === 'string') {
      return (data as { detail: string }).detail
    }
  }
  return err instanceof Error ? err.message : 'Login failed'
}

export const useAuthStore = defineStore('auth', () => {
  const tokens = ref<AuthTokens | null>(null)
  const user = ref<AuthUser | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const rememberMe = ref(true)
  const rateLimitUntil = ref<number>(0)

  const isAuthenticated = computed(() => !!tokens.value?.access)
  const accessToken = computed(() => tokens.value?.access)
  const refreshToken = computed(() => tokens.value?.refresh)

  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null
    rememberMe.value = !!credentials.remember_me
    try {
      const { $api } = useNuxtApp()
      const response = await $api<AuthTokens>(API.auth.login, {
        method: 'POST',
        body: { email: credentials.email, password: credentials.password },
      })
      tokens.value = response
      await fetchUser()
      return { success: true }
    } catch (err: unknown) {
      const e = err as { statusCode?: number; status?: number }
      const is429 = e?.statusCode === 429 || e?.status === 429
      if (is429) rateLimitUntil.value = Date.now() + 60_000
      const message = extractErrorMessage(err, 429, 'Too many requests. Please wait a minute before trying again.')
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
      const response = await $api<{ access: string; refresh?: string }>(API.auth.refresh, {
        method: 'POST',
        body: { refresh: tokens.value.refresh },
      })
      tokens.value = {
        access: response.access,
        refresh: response.refresh ?? tokens.value.refresh,
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

  /** Request password reset email (when backend endpoint exists) */
  async function requestPasswordReset(email: string) {
    error.value = null
    try {
      const { $api } = useNuxtApp()
      await $api(API.auth.forgotPassword, {
        method: 'POST',
        body: { email },
      })
      return { success: true }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Request failed'
      error.value = message
      return { success: false, error: message }
    }
  }

  /** Confirm password reset with token from email (when backend endpoint exists) */
  async function resetPassword(uid: string, token: string, newPassword: string) {
    error.value = null
    try {
      const { $api } = useNuxtApp()
      await $api(API.auth.resetConfirm, {
        method: 'POST',
        body: { uid, token, new_password: newPassword },
      })
      return { success: true }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Reset failed'
      error.value = message
      return { success: false, error: message }
    }
  }

  return {
    tokens,
    user,
    loading,
    error,
    rateLimitUntil,
    rememberMe,
    isAuthenticated,
    accessToken,
    refreshToken,
    login,
    signup,
    fetchUser,
    refreshTokens,
    logout,
    setTokens,
    requestPasswordReset,
    resetPassword,
  }
}, {
  persist: {
    key: AUTH_STORAGE_KEY,
    storage: authCookieStorage, // Cookies only — see utils/auth-cookie-storage.ts
    pick: ['tokens', 'rememberMe'],
  },
})
