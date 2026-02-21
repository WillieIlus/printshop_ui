<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Shops</h1>
      <p class="text-gray-600 dark:text-gray-400">Browse print shops</p>
    </div>
    <SkeletonsCardGridSkeleton v-if="shopStore.loading" :count="6" variant="shop" />
    <CommonEmptyState
      v-else-if="shopStore.error || !shopStore.shops.length"
      :title="shopStore.error ? 'Could not load shops' : 'No shops available'"
      :description="shopStore.error ? 'Something went wrong. Please try again.' : 'There are no print shops to browse yet.'"
      icon="i-lucide-store"
    >
      <UButton v-if="shopStore.error" color="primary" @click="shopStore.fetchShops()">
        <UIcon name="i-lucide-refresh-cw" class="h-4 w-4 mr-2" />
        Retry
      </UButton>
    </CommonEmptyState>
    <ShopsShopList v-else :shops="shopStore.shops" />
  </div>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'

definePageMeta({ layout: 'default' })
const shopStore = useShopStore()
onMounted(() => shopStore.fetchShops())
</script>
