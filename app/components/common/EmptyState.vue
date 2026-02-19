<script setup lang="ts">
interface Props {
  title: string
  description?: string
  icon?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'i-lucide-inbox',
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-900 sm:p-8"
  >
    <div class="flex justify-center">
      <UIcon :name="icon" class="h-12 w-12 text-gray-400 dark:text-gray-500" />
    </div>
    <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
      {{ title }}
    </h3>
    <p v-if="description" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
      {{ description }}
    </p>
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>
