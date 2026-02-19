<template>
  <div
    class="stat-card group relative overflow-hidden rounded-xl border border-gray-200/60 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800/60 dark:bg-gray-900/50"
  >
    <div class="relative flex items-start justify-between gap-3">
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        :class="iconBg ?? 'bg-flamingo-50 dark:bg-flamingo-900/20'"
      >
        <UIcon :name="icon" class="h-5 w-5" :class="iconColor ?? 'text-flamingo-600 dark:text-flamingo-400'" />
      </div>
      <span
        v-if="delta !== undefined && delta !== null"
        class="shrink-0 text-xs font-medium"
        :class="deltaClass"
      >
        {{ deltaLabel }}
      </span>
    </div>
    <div class="relative mt-3">
      <p class="text-3xl font-semibold text-gray-900 dark:text-white">
        {{ value }}
      </p>
      <p class="mt-0.5 text-sm text-muted">
        {{ label }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: string | number
  icon: string
  iconBg?: string
  iconColor?: string
  delta?: number | string
  deltaLabel?: string
  deltaTrend?: 'up' | 'down' | 'neutral'
}>()

const deltaClass = computed(() => {
  const t = props.deltaTrend ?? (typeof props.delta === 'number' ? (props.delta >= 0 ? 'up' : 'down') : 'neutral')
  if (t === 'up') return 'text-green-600 dark:text-green-400'
  if (t === 'down') return 'text-red-600 dark:text-red-400'
  return 'text-muted'
})
</script>
