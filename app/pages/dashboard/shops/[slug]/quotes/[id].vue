<template>
  <DashboardDashboardLayout>
    <template #header>
      <DashboardDashboardPageHeader
        :title="`Quote #${id}`"
        :subtitle="slug"
        :breadcrumbs="[{ label: 'My Shops', to: '/dashboard/shops' }, { label: slug, to: `/dashboard/shops/${slug}` }, { label: 'Quotes', to: `/dashboard/shops/${slug}/quotes` }]"
      >
        <template #actions>
          <UButton :to="`/dashboard/shops/${slug}/quotes`" variant="ghost" size="sm">Back</UButton>
        </template>
      </DashboardDashboardPageHeader>
    </template>

    <DashboardSkeletonState v-if="quoteStore.loading" variant="card" :show-header="false" />
    <template v-else-if="quoteStore.currentQuote">
      <div class="col-span-12 lg:col-span-8">
        <DashboardSectionCard title="Details">
          <div class="space-y-2 text-sm">
            <p><span class="text-muted">Customer:</span> {{ quoteStore.currentQuote.customer_name }}</p>
            <p><span class="text-muted">Email:</span> {{ quoteStore.currentQuote.customer_email }}</p>
            <p><span class="text-muted">Status:</span> <UBadge :color="statusColor" variant="soft" size="sm">{{ quoteStore.currentQuote.status }}</UBadge></p>
            <p class="font-semibold text-gray-900 dark:text-white">Total: {{ quoteStore.currentQuote.total }}</p>
          </div>
        </DashboardSectionCard>
      </div>
      <div class="col-span-12 lg:col-span-4">
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
