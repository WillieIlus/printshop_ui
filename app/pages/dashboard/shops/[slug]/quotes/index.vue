<template>
  <div class="space-y-6">
    <CommonPageHeader
      title="Quotes"
      :description="`Manage quotes for ${shopStore.currentShop?.name ?? slug}`"
    >
      <template #actions>
        <UButton :to="`/dashboard/shops/${slug}`" color="neutral" variant="ghost" size="sm">
          Back
        </UButton>
        <UButton :to="`/dashboard/shops/${slug}/quotes/create`" color="primary">
          <UIcon name="i-lucide-plus" class="mr-2 h-4 w-4" />
          New quote
        </UButton>
      </template>
    </CommonPageHeader>

    <!-- Skeleton → Error → Content -->
    <CommonDataListSkeleton v-if="quoteStore.loading && !quoteStore.quotes.length" variant="cards" />
    <CommonErrorState
      v-else-if="quoteStore.error && !quoteStore.quotes.length"
      title="Could not load quotes"
      :message="quoteStore.error"
    >
      <UButton color="primary" @click="retryFetch">
        <UIcon name="i-lucide-refresh-cw" class="mr-2 h-4 w-4" />
        Try again
      </UButton>
    </CommonErrorState>
    <QuotesQuoteList v-else :quotes="quoteStore.quotes">
      <template #card-actions="{ quote }">
        <UButton :to="`/dashboard/shops/${slug}/quotes/${quote.id}`" color="neutral" variant="ghost" size="sm">
          View
        </UButton>
      </template>
      <template #empty-actions>
        <UButton :to="`/dashboard/shops/${slug}/quotes/create`" color="primary">
          <UIcon name="i-lucide-plus" class="mr-2 h-4 w-4" />
          Create first quote
        </UButton>
      </template>
    </QuotesQuoteList>
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

async function retryFetch() {
  quoteStore.error = null
  await shopStore.fetchShopBySlug(slug.value)
  await quoteStore.fetchShopQuotes(slug.value)
}

onMounted(() => {
  retryFetch()
})
</script>
