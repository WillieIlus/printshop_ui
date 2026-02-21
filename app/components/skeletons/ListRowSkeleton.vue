<template>
  <div
    class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 animate-pulse"
    :class="wrapperClass"
  >
    <div v-if="showHeader" class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div class="flex gap-4 px-4 py-3 sm:px-6">
        <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-600" />
        <div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-600" />
        <div class="h-4 w-16 rounded bg-gray-200 dark:bg-gray-600" />
        <div class="ml-auto h-4 w-16 rounded bg-gray-200 dark:bg-gray-600" />
      </div>
    </div>
    <div class="divide-y divide-gray-200 dark:divide-gray-700">
      <div
        v-for="i in rows"
        :key="i"
        class="flex items-center gap-4 px-4 py-4 sm:px-6"
      >
        <div class="h-4 flex-1 rounded bg-gray-200 dark:bg-gray-600" />
        <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-600" />
        <div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-600" />
        <div class="h-8 w-16 rounded bg-gray-200 dark:bg-gray-600" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    rows?: number
    showHeader?: boolean
    class?: string
  }>(),
  { rows: 6, showHeader: true, class: '' }
)

const wrapperClass = computed(() => props.class ?? '')
</script>
