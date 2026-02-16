<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      :title="`Edit shop`"
      :subtitle="slug"
    >
      <template #actions>
        <UButton :to="`/dashboard/shops/${slug}`" variant="ghost" size="sm">Back</UButton>
      </template>
    </DashboardPageHeader>

    <DashboardSkeletonState v-if="shopStore.loading && !shopStore.currentShop" variant="block" />
    <div v-else-if="shopStore.currentShop" class="col-span-12">
      <ShopsShopForm
        :shop="shopStore.currentShop"
        :loading="shopStore.loading"
        :error="shopStore.error"
        @submit="onSubmit"
        @cancel="goBack"
      />
    </div>
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
