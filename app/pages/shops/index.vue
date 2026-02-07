<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Shops</h1>
      <p class="text-gray-600 dark:text-gray-400">Browse print shops</p>
    </div>
    <CommonLoadingSpinner v-if="shopStore.loading" />
    <ShopsShopList v-else :shops="shopStore.shops" />
  </div>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'

definePageMeta({ layout: 'default' })
const shopStore = useShopStore()
onMounted(() => shopStore.fetchShops())
</script>
