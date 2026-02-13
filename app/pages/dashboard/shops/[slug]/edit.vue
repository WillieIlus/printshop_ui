<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edit shop</h1>
        <p class="text-gray-600 dark:text-gray-400">{{ slug }}</p>
      </div>
      <UButton :to="`/dashboard/shops/${slug}`" variant="ghost" size="sm">Back</UButton>
    </div>
    <CommonLoadingSpinner v-if="shopStore.loading && !shopStore.currentShop" />
    <ShopsShopForm
      v-else-if="shopStore.currentShop"
      :shop="shopStore.currentShop"
      :loading="shopStore.loading"
      :error="shopStore.error"
      @submit="onSubmit"
      @cancel="goBack"
    />
  </div>
</template>

<script setup lang="ts">
import type { ShopCreateInput } from '~/shared/types'
import { useShopStore } from '~/stores/shop'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const shopStore = useShopStore()
const notification = useNotification()
const slug = computed(() => route.params.slug as string)

function goBack() {
  navigateTo(`/dashboard/shops/${slug.value}`)
}

onMounted(() => shopStore.fetchShopBySlug(slug.value))

async function onSubmit(data: ShopCreateInput) {
  const result = await shopStore.updateShop(slug.value, data)
  if (result.success) {
    notification.success('Shop updated')
    await navigateTo(`/dashboard/shops/${slug.value}`)
  } else {
    notification.error(shopStore.error ?? 'Update failed')
  }
}
</script>
