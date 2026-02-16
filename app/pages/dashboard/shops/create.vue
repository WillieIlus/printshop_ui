<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Create shop"
      subtitle="Add a new business listing"
    >
      <template #actions>
        <UButton to="/dashboard/shops" variant="ghost" size="sm">Back</UButton>
      </template>
    </DashboardPageHeader>

    <div class="col-span-12">
      <ShopsShopForm :loading="shopStore.loading" :error="shopStore.error" @submit="onSubmit" @cancel="goBack" />
    </div>
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
    notification.success('Shop created! Add machines, then stock and prices.')
    await navigateTo(`/dashboard/shops/${result.shop.slug}`)
  } else {
    notification.error(shopStore.error ?? 'Create failed')
  }
}
</script>
