<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Shops nearby</h2>
    <SkeletonsCardGridSkeleton v-if="loading" :count="6" variant="shop" />
    <CommonErrorState
      v-else-if="error"
      title="Could not load nearby shops"
      :message="error"
    >
      <UButton color="primary" @click="$emit('retry')">
        <UIcon name="i-lucide-refresh-cw" class="h-4 w-4 mr-2" />
        Try again
      </UButton>
    </CommonErrorState>
    <UCard v-else-if="!shops?.length" class="text-center py-8">
      <UIcon name="i-lucide-map-pin" class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
      <p class="text-sm text-gray-600 dark:text-gray-400">No nearby shops or location not set.</p>
    </UCard>
    <ShopsShopList v-else :shops="shops" />
  </div>
</template>

<script setup lang="ts">
import type { Shop } from '~/shared/types'
defineProps<{ shops?: Shop[]; loading?: boolean; error?: string | null }>()
defineEmits<{ retry: [] }>()
</script>
