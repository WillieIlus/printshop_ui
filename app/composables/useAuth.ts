import type { SignupCredentials } from '~/shared/types'
import { useAuthStore } from '~/stores/auth'
import { useProfileStore } from '~/stores/profile'

export function useAuth() {
  const authStore = useAuthStore()
  const profileStore = useProfileStore()
  const router = useRouter()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const loading = computed(() => authStore.loading)

  async function login(email: string, password: string, rememberMe = false) {
    const result = await authStore.login({ email, password, remember_me: rememberMe })
    if (result.success) {
      try {
        await profileStore.fetchProfile()
      } catch {
        // Profile fetch may fail (e.g. 500) - still allow navigation
      }
      await router.push('/dashboard')
    }
    return result
  }

  async function signup(data: SignupCredentials) {
    const result = await authStore.signup(data)
    if (result.success) {
      // Backend requires email confirmation before login; redirect to login
      await router.push('/auth/login')
    }
    return result
  }

  function logout() {
    authStore.logout()
    router.push('/auth/login')
  }

  return {
    isAuthenticated,
    user,
    loading,
    login,
    signup,
    logout,
  }
}
