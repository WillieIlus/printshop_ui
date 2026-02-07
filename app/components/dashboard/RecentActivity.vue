<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
    </template>
    <div v-if="props.activities.length" class="space-y-3">
      <div
        v-for="(activity, i) in props.activities"
        :key="i"
        class="flex items-start gap-3 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div class="p-2 rounded-lg shrink-0 bg-gray-100 dark:bg-gray-700">
          <UIcon :name="activity.icon" class="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </div>
        <div class="min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.title }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ activity.time }}</p>
        </div>
      </div>
    </div>
    <p v-else class="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">No recent activity</p>
  </UCard>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    activities?: Array<{ title: string; time: string; icon: string }>
  }>(),
  { activities: () => [] }
)
</script>
