<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Product templates</h1>
        <p class="text-gray-600 dark:text-gray-400">Presets for quick quoting</p>
      </div>
      <div class="flex gap-2">
        <UButton :to="`/dashboard/shops/${slug}`" variant="ghost" size="sm">Back</UButton>
        <UButton :to="`/dashboard/shops/${slug}/products/create`" color="primary">
          <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
          Add product
        </UButton>
      </div>
    </div>
    <CommonLoadingSpinner v-if="quoteStore.loading" />
    <ProductsProductTemplateList v-else :products="quoteStore.productTemplates">
      <template #card-actions="{ product }">
        <UButton :to="`/dashboard/shops/${slug}/products/${product.id}`" variant="ghost" size="sm">View</UButton>
      </template>
      <template #empty>
        <UButton :to="`/dashboard/shops/${slug}/products/create`" color="primary">Add first product</UButton>
      </template>
    </ProductsProductTemplateList>
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
