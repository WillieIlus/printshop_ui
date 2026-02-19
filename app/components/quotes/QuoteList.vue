<template>
  <div class="space-y-4">
    <div v-if="quotes?.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <QuotesQuoteCard v-for="q in quotes" :key="q.id" :quote="q">
        <template #actions>
          <slot name="card-actions" :quote="q" />
        </template>
      </QuotesQuoteCard>
    </div>
    <CommonEmptyState
      v-else
      title="No quotes yet"
      description="Create your first quote to get started."
      icon="i-lucide-file-text"
    >
      <slot name="empty-actions" />
    </CommonEmptyState>
  </div>
</template>

<script setup lang="ts">
import type { Quote } from '~/shared/types'
defineProps<{ quotes?: Quote[] }>()
</script>
