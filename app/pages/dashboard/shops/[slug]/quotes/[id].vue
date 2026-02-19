<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Quote #{{ id }}</h1>
        <p class="text-gray-600 dark:text-gray-400">{{ slug }}</p>
      </div>
      <UButton :to="`/dashboard/shops/${slug}/quotes`" variant="ghost" size="sm">Back</UButton>
    </div>
    <CommonLoadingSpinner v-if="quoteStore.loading" />
    <template v-else-if="quoteStore.currentQuote">
      <div class="grid lg:grid-cols-2 gap-6">
        <UCard>
          <template #header>Details</template>
          <div class="space-y-2">
            <p><span class="text-gray-500 dark:text-gray-400">Customer:</span> {{ quoteStore.currentQuote.customer_name }}</p>
            <p><span class="text-gray-500 dark:text-gray-400">Email:</span> {{ quoteStore.currentQuote.customer_email }}</p>
            <p><span class="text-gray-500 dark:text-gray-400">Status:</span> <UBadge :color="statusColor" variant="soft" size="sm">{{ quoteStore.currentQuote.status }}</UBadge></p>
            <p class="font-semibold text-gray-900 dark:text-white">Total: {{ quoteStore.currentQuote.total }}</p>
            <div v-if="quoteStore.currentQuote.notes" class="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Notes</p>
              <EditorRichTextDisplay :html="quoteStore.currentQuote.notes" />
            </div>
          </div>
        </UCard>
        <QuotesQuoteCalculator :totals="totals" />
      </div>
      <QuotesQuoteItemList :items="quoteItems" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useQuoteStore } from '~/stores/quote'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const quoteStore = useQuoteStore()
const slug = computed(() => route.params.slug as string)
const id = computed(() => Number(route.params.id))
const statusColor = computed((): 'neutral' | 'warning' | 'success' | 'error' => {
  const m: Record<string, 'neutral' | 'warning' | 'success' | 'error'> = { draft: 'neutral', pending: 'warning', approved: 'success', rejected: 'error', completed: 'success' }
  return m[quoteStore.currentQuote?.status ?? ''] ?? 'neutral'
})
const totals = ref<{ subtotal: string; tax: string; total: string } | null>(null)

const quoteItems = computed(() => quoteStore.currentQuote?.items ?? [])

onMounted(async () => {
  await quoteStore.fetchQuote(slug.value, id.value)
  if (quoteStore.currentQuote && (!quoteStore.currentQuote.items?.length)) {
    await quoteStore.fetchQuoteItems(slug.value, id.value)
    if (quoteStore.currentQuote) quoteStore.currentQuote.items = [...quoteStore.quoteItems]
  }
  try {
    totals.value = await quoteStore.calculateQuote(slug.value, id.value)
  } catch {
    totals.value = quoteStore.currentQuote
      ? { subtotal: quoteStore.currentQuote.subtotal, tax: quoteStore.currentQuote.tax, total: quoteStore.currentQuote.total }
      : null
  }
})
</script>
