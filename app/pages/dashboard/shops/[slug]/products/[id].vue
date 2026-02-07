<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Product template</h1>
        <p class="text-gray-600 dark:text-gray-400">{{ slug }}</p>
      </div>
      <UButton :to="`/dashboard/shops/${slug}/products`" variant="ghost" size="sm">Back</UButton>
    </div>
    <p class="text-sm text-gray-500 dark:text-gray-400">Product detail / edit (wire to API by id).</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const id = computed(() => route.params.id as string)
</script>
