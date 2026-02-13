<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add product template</h1>
        <p class="text-gray-600 dark:text-gray-400">Create a preset for quick quoting</p>
      </div>
      <UButton :to="`/dashboard/shops/${slug}/products`" variant="ghost" size="sm">Back</UButton>
    </div>
    <UCard>
      <ProductsProductTemplateForm
        :loading="quoteStore.loading"
        @submit="onSubmit"
        @cancel="goBack"
      />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { ProductTemplate } from '~/shared/types'
import { useQuoteStore } from '~/stores/quote'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const quoteStore = useQuoteStore()
const notification = useNotification()
const slug = computed(() => route.params.slug as string)

function goBack() {
  navigateTo(`/dashboard/shops/${slug.value}/products`)
}

async function onSubmit(data: Partial<ProductTemplate> & { base_price?: string; unit?: string }) {
  const payload = {
    name: data.name,
    description: data.description ?? null,
    is_active: data.is_active ?? true,
    defaults: {
      ...(data.base_price && { base_price: data.base_price }),
      ...(data.unit && { unit: data.unit }),
    },
  }
  const result = await quoteStore.createProductTemplate(slug.value, payload)
  if (result.success && result.product) {
    notification.success('Product template created')
    await navigateTo(`/dashboard/shops/${slug.value}/products`)
  } else {
    notification.error(quoteStore.error ?? 'Create failed')
  }
}
</script>
