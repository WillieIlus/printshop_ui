<template>
  <DashboardDashboardLayout>
    <template #header>
      <DashboardDashboardPageHeader
        title="My quotes"
        subtitle="All quotes you've requested"
      />
    </template>

    <DashboardSkeletonState v-if="quoteStore.loading" variant="list" :show-header="false" />
    <div v-else class="col-span-12">
      <QuotesQuoteList :quotes="quoteStore.myQuotes" />
    </div>
  </DashboardDashboardLayout>
</template>

<script setup lang="ts">
import { useQuoteStore } from '~/stores/quote'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const quoteStore = useQuoteStore()
onMounted(() => quoteStore.fetchMyQuotes())
</script>
