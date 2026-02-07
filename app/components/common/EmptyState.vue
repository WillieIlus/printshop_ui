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
  <div class="bg-white rounded-xl border border-gray-200 p-8 text-center">
    <div class="flex justify-center">
      <UIcon :name="icon" class="w-12 h-12 text-gray-400" />
    </div>
    <h3 class="mt-4 text-lg font-medium text-gray-900">{{ title }}</h3>
    <p v-if="description" class="mt-2 text-sm text-gray-500">{{ description }}</p>
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>
