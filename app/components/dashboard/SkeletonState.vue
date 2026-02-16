<template>
  <div class="skeleton-state space-y-4" :class="[$attrs.class]">
    <!-- Header skeleton -->
    <div v-if="showHeader" class="flex items-center justify-between">
      <div class="h-8 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
      <div class="h-9 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
    </div>

    <!-- KPI row (4 cards) -->
    <div v-if="variant === 'dashboard'" class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="h-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
    </div>

    <!-- Content cards -->
    <div v-if="variant === 'dashboard'" class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="h-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
      <div class="h-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
    </div>

    <!-- Table skeleton -->
    <div v-if="variant === 'table' || variant === 'list'" class="overflow-hidden rounded-xl border border-gray-200/60 dark:border-gray-800/60">
      <div class="border-b border-gray-100 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-900/50">
        <div class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="i in rows" :key="i" class="flex items-center gap-4 px-5 py-4">
          <div class="h-4 w-32 flex-1 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div class="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>

    <!-- Generic card skeleton -->
    <div v-if="variant === 'card'" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-20 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'dashboard' | 'table' | 'list' | 'card'
    showHeader?: boolean
    rows?: number
  }>(),
  { variant: 'card', showHeader: true, rows: 5 }
)
</script>
