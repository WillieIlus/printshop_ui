<template>
  <DashboardDashboardLayout>
    <template #header>
      <DashboardDashboardPageHeader
        title="New quote"
        :subtitle="slug"
        :breadcrumbs="[{ label: 'My Shops', to: '/dashboard/shops' }, { label: slug, to: `/dashboard/shops/${slug}` }, { label: 'Quotes', to: `/dashboard/shops/${slug}/quotes` }]"
      >
        <template #actions>
          <UButton :to="`/dashboard/shops/${slug}/quotes`" variant="ghost" size="sm">Back</UButton>
        </template>
      </DashboardDashboardPageHeader>
    </template>

    <div class="col-span-12">
      <DashboardSectionCard>
        <QuotesQuoteForm
          :loading="quoteStore.loading"
          @submit="onSubmit"
          @cancel="goBack"
        />
      </DashboardSectionCard>
    </div>
  </DashboardDashboardLayout>
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
