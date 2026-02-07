<template>
  <UCard class="hover:shadow-lg transition-shadow">
    <div class="space-y-3">
      <div class="flex justify-between items-start">
        <h3 class="font-semibold text-gray-900 dark:text-white">#{{ quote.id }} {{ quote.customer_name }}</h3>
        <UBadge :color="statusColor" variant="soft" size="sm">{{ quote.status }}</UBadge>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-400">{{ quote.customer_email }}</p>
      <p class="text-lg font-bold text-gray-900 dark:text-white">Total: {{ quote.total }}</p>
      <slot name="actions" />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Quote } from '~/shared/types'
const props = defineProps<{ quote: Quote }>()
const statusColor = computed(() => {
  const m: Record<Quote['status'], string> = {
    draft: 'neutral',
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    completed: 'success',
  }
  return m[props.quote.status] ?? 'neutral'
})
</script>
