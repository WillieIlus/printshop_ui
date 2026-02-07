<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Business hours</h3>
    </template>
    <p class="text-sm text-gray-600 dark:text-gray-400">Configure opening hours per day. Use the dashboard shop detail page to edit.</p>
    <div v-if="hours?.length" class="mt-4 space-y-2">
      <div v-for="h in hours" :key="h.id" class="flex justify-between items-center rounded-lg border dark:border-gray-700 px-3 py-2">
        <span class="font-medium text-gray-900 dark:text-white">{{ dayLabel(h.day_of_week) }}</span>
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ h.is_closed ? 'Closed' : `${h.open_time} – ${h.close_time}` }}</span>
      </div>
    </div>
    <slot />
  </UCard>
</template>

<script setup lang="ts">
import type { ShopHours } from '~/shared/types'
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
defineProps<{ hours?: ShopHours[] }>()
function dayLabel(day: number) {
  return DAYS[day] ?? `Day ${day}`
}
</script>
