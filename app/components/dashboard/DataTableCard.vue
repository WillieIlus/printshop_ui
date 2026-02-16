<template>
  <div
    class="data-table-card overflow-hidden rounded-xl border border-gray-200/60 bg-white shadow-sm dark:border-gray-800/60 dark:bg-gray-900/50"
    :class="[colSpanClass, $attrs.class]"
  >
    <div v-if="title || $slots.toolbar" class="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
      <h3 v-if="title" class="text-sm font-medium text-muted">
        {{ title }}
      </h3>
      <div v-if="$slots.toolbar" class="flex items-center gap-2">
        <slot name="toolbar" />
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900/80">
          <slot name="thead" />
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <slot name="tbody" />
        </tbody>
      </table>
    </div>
    <div v-if="$slots.pagination" class="border-t border-gray-100 px-5 py-3 dark:border-gray-800">
      <slot name="pagination" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    colSpan?: string
  }>(),
  { colSpan: 'col-span-12' }
)

const colSpanClass = computed(() => props.colSpan)
</script>
