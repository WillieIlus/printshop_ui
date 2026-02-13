<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create shop</h1>
        <p class="text-gray-600 dark:text-gray-400">Add a new business listing</p>
      </div>
      <UButton to="/dashboard/shops" variant="ghost" size="sm">Back</UButton>
    </div>
    <ShopsShopForm :loading="shopStore.loading" :error="shopStore.error" @submit="onSubmit" @cancel="goBack" />
  </div>
</template>

<script setup lang="ts">
import type { ShopCreateInput } from '~/shared/types'
import { useShopStore } from '~/stores/shop'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const shopStore = useShopStore()
const notification = useNotification()

function goBack() {
  navigateTo('/dashboard/shops')
}

async function onSubmit(data: ShopCreateInput) {
  const result = await shopStore.createShop(data)
  if (result.success && result.shop) {
    notification.success('Shop created')
    await navigateTo(`/dashboard/shops/${result.shop.slug}`)
  } else {
    notification.error(shopStore.error ?? 'Create failed')
  }
}
</script>
