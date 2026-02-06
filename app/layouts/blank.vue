<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100" :class="{ 'flex flex-col items-center justify-center': center }">
    <slot />
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Center content vertically and horizontally (e.g. for error pages) */
    center?: boolean
  }>(),
  { center: false }
)
</script>
