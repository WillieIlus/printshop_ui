<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Request a quote</h1>
      <p class="text-gray-600 dark:text-gray-400">{{ slug }}</p>
    </div>
    <CommonLoadingSpinner v-if="shopStore.loading && !shopStore.currentShop" />
    <template v-else-if="shopStore.currentShop">
      <QuotesQuoteForm
        :loading="quoteStore.loading"
        @submit="onSubmit"
        @cancel="goBack"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'
import { useQuoteStore } from '~/stores/quote'

definePageMeta({ layout: 'default' })

const route = useRoute()
const shopStore = useShopStore()
const quoteStore = useQuoteStore()
const notification = useNotification()
const slug = computed(() => route.params.slug as string)

function goBack() {
  navigateTo(`/shops/${slug.value}`)
}

onMounted(() => shopStore.fetchShopBySlug(slug.value))

async function onSubmit(data: Record<string, unknown>) {
  const result = await quoteStore.requestQuote(slug.value, data)
  if (result.success) {
    notification.success('Quote request sent')
    await navigateTo(`/shops/${slug.value}`)
  } else {
    notification.error(result.error ?? 'Request failed')
  }
}
</script>
