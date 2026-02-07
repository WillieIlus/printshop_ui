<template>
  <UCard class="hover:shadow-lg transition-shadow">
    <div class="space-y-3">
      <h3 class="font-semibold text-gray-900 dark:text-white">{{ product.name }}</h3>
      <p v-if="product.description" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ product.description }}</p>
      <p class="font-medium text-gray-900 dark:text-white">{{ product.base_price }} / {{ product.unit }}</p>
      <UBadge v-if="!product.is_active" color="neutral" variant="soft" size="sm">Inactive</UBadge>
      <slot name="actions" />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { ProductTemplate } from '~/shared/types'
defineProps<{ product: ProductTemplate }>()
</script>
