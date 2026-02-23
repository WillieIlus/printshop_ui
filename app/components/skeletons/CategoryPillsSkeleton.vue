<template>
  <div class="flex flex-wrap gap-2">
    <div
      v-for="i in count"
      :key="i"
      class="h-9 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number
  }>(),
  { count: 5 }
)
</script>
