<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Business hours</h1>
        <p class="text-gray-600 dark:text-gray-400">{{ slug }}</p>
      </div>
      <UButton :to="`/dashboard/shops/${slug}`" variant="ghost" size="sm">Back</UButton>
    </div>
    <CommonLoadingSpinner v-if="loading" />
    <ShopsShopHours v-else :hours="shopStore.shopHours" />
  </div>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const shopStore = useShopStore()
const slug = computed(() => route.params.slug as string)
const loading = ref(true)

onMounted(async () => {
  await shopStore.fetchShopBySlug(slug.value)
  await shopStore.fetchShopHoursList(slug.value)
  loading.value = false
})
</script>
