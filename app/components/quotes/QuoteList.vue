<template>
  <div class="space-y-4">
    <div v-if="quotes?.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <QuotesQuoteCard v-for="q in quotes" :key="q.id" :quote="q">
        <template #actions>
          <slot name="card-actions" :quote="q" />
        </template>
      </QuotesQuoteCard>
    </div>
    <UCard v-else class="text-center py-8">
      <p class="text-sm text-gray-500 dark:text-gray-400">No quotes yet.</p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Quote } from '~/shared/types'
defineProps<{ quotes?: Quote[] }>()
</script>
