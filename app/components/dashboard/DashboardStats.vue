<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <UCard v-for="stat in stats" :key="stat.label" class="flex items-center gap-4">
      <div class="p-3 rounded-xl shrink-0" :class="stat.bgColor">
        <UIcon :name="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
      </div>
      <div>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ stat.label }}</p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stats: Array<{
    label: string
    value: string | number
    icon: string
    bgColor: string
    iconColor: string
  }>
}>()
</script>
