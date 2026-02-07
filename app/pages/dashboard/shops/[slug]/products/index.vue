<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Product templates</h1>
        <p class="text-gray-600 dark:text-gray-400">{{ slug }}</p>
      </div>
      <UButton :to="`/dashboard/shops/${slug}`" variant="ghost" size="sm">Back</UButton>
    </div>
    <CommonLoadingSpinner v-if="quoteStore.loading" />
    <ProductsProductTemplateList v-else :products="quoteStore.productTemplates" />
  </div>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'
import { useQuoteStore } from '~/stores/quote'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const shopStore = useShopStore()
const quoteStore = useQuoteStore()
const slug = computed(() => route.params.slug as string)

onMounted(async () => {
  await shopStore.fetchShopBySlug(slug.value)
  await quoteStore.fetchProductTemplates(slug.value)
})
</script>
