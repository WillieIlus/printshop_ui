<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">New quote</h1>
        <p class="text-gray-600 dark:text-gray-400">{{ slug }}</p>
      </div>
      <UButton :to="`/dashboard/shops/${slug}/quotes`" variant="ghost" size="sm">Back</UButton>
    </div>
    <QuotesQuoteForm
      :loading="quoteStore.loading"
      @submit="onSubmit"
      @cancel="goBack"
    />
  </div>
</template>

<script setup lang="ts">
import type { Quote } from '~/shared/types'
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
  navigateTo(`/dashboard/shops/${slug.value}/quotes`)
}

async function onSubmit(data: Partial<Quote>) {
  const result = await quoteStore.createQuote(slug.value, data)
  if (result.success && result.quote) {
    notification.success('Quote created')
    await navigateTo(`/dashboard/shops/${slug.value}/quotes/${result.quote.id}`)
  } else {
    notification.error(quoteStore.error ?? 'Create failed')
  }
}
</script>
