<template>
  <UCard class="hover:shadow-lg transition-shadow">
    <div class="space-y-4">
      <div class="flex items-start gap-4">
        <UAvatar :src="shop.logo" :alt="shop.name" size="lg" class="shrink-0" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-gray-900 dark:text-white truncate">{{ shop.name }}</h3>
            <UBadge v-if="shop.is_verified" color="success" variant="soft" size="sm">
              <UIcon name="i-lucide-check" class="w-3 h-3" />
            </UBadge>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ shop.city }}, {{ shop.state }}</p>
        </div>
      </div>
      <p v-if="shop.description" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ shop.description }}</p>
      <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div v-if="shop.phone" class="flex items-center gap-1">
          <UIcon name="i-lucide-phone" class="w-4 h-4 shrink-0" />
          {{ shop.phone }}
        </div>
        <div v-if="shop.email" class="flex items-center gap-1 truncate">
          <UIcon name="i-lucide-mail" class="w-4 h-4 shrink-0" />
          {{ shop.email }}
        </div>
      </div>
      <div v-if="showActions" class="flex gap-2 pt-2 border-t dark:border-gray-700">
        <UButton variant="outline" size="sm" @click="$emit('view')">View</UButton>
        <UButton variant="outline" size="sm" @click="$emit('edit')">Edit</UButton>
      </div>
      <div v-else class="pt-2 border-t dark:border-gray-700">
        <UButton :to="`/shops/${shop.slug}`" variant="outline" size="sm" block>View Details</UButton>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Shop } from '~/shared/types'
defineProps<{ shop: Shop; showActions?: boolean }>()
defineEmits<{ view: []; edit: [] }>()
</script>
