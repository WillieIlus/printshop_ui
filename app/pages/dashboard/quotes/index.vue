<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My quotes</h1>
      <p class="text-gray-600 dark:text-gray-400">All quotes you've requested</p>
    </div>
    <CommonLoadingSpinner v-if="quoteStore.loading" />
    <QuotesQuoteList v-else :quotes="quoteStore.myQuotes" />
  </div>
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
