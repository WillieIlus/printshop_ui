<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      :title="`Quote #${id}`"
      :subtitle="slug"
    >
      <template #actions>
        <UButton :to="`/dashboard/shops/${slug}/quotes`" variant="ghost" size="sm">Back</UButton>
      </template>
    </DashboardPageHeader>

    <DashboardSkeletonState v-if="quoteStore.loading" variant="block" />
    <template v-else-if="quoteStore.currentQuote">
      <div class="col-span-12 grid gap-6 lg:grid-cols-2">
        <DashboardSectionCard title="Details">
          <div class="space-y-2">
            <p class="text-sm">
              <span class="font-medium text-gray-500 dark:text-gray-400">Customer:</span>
              <span class="text-gray-900 dark:text-white">{{ quoteStore.currentQuote.customer_name }}</span>
            </p>
            <p class="text-sm">
              <span class="font-medium text-gray-500 dark:text-gray-400">Email:</span>
              <span class="text-gray-900 dark:text-white">{{ quoteStore.currentQuote.customer_email }}</span>
            </p>
            <p class="text-sm">
              <span class="font-medium text-gray-500 dark:text-gray-400">Status:</span>
              <UBadge :color="statusColor" variant="soft" size="sm" class="ml-1">{{ quoteStore.currentQuote.status }}</UBadge>
            </p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">Total: {{ quoteStore.currentQuote.total }}</p>
          </div>
        </DashboardSectionCard>
        <QuotesQuoteCalculator :totals="totals" />
      </div>
      <div class="col-span-12">
        <QuotesQuoteItemList :items="quoteItems" />
      </div>
    </template>
  </DashboardDashboardLayout>
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
