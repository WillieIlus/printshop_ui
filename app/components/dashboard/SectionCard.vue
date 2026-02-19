<template>
  <div
    class="section-card overflow-hidden rounded-xl border border-gray-200/60 bg-white shadow-sm dark:border-gray-800/60 dark:bg-gray-900/50"
    :class="[colSpanClass, $attrs.class]"
  >
    <div v-if="title || $slots.title" class="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
      <h3 class="text-sm font-medium text-muted">
        <slot name="title">{{ title }}</slot>
      </h3>
    </div>
    <div class="p-5">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    /** Tailwind col-span class, e.g. 'col-span-12', 'col-span-8' */
    colSpan?: string
  }>(),
  { colSpan: 'col-span-12' }
)

const colSpanClass = computed(() => props.colSpan)
</script>
