import { useAuthStore } from '~/stores/auth'
import { useShopStore } from '~/stores/shop'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const shopStore = useShopStore()
  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }
  const shopSlug = to.params.slug as string
  if (shopSlug) {
    await shopStore.fetchShopBySlug(shopSlug)
    if (shopStore.currentShop?.owner !== authStore.user?.id) {
      return navigateTo('/dashboard')
    }
  }
})
