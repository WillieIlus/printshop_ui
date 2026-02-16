<template>
  <DashboardDashboardLayout>
    <template #header>
      <DashboardDashboardPageHeader
        title="Create shop"
        subtitle="Add a new business listing"
        :breadcrumbs="[{ label: 'My Shops', to: '/dashboard/shops' }]"
      >
        <template #actions>
          <UButton to="/dashboard/shops" variant="ghost" size="sm">Back</UButton>
        </template>
      </DashboardDashboardPageHeader>
    </template>

    <div class="col-span-12">
      <DashboardSectionCard>
        <ShopsShopForm :loading="shopStore.loading" :error="shopStore.error" @submit="onSubmit" @cancel="goBack" />
      </DashboardSectionCard>
    </div>
  </DashboardDashboardLayout>
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
