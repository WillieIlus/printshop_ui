<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
    </template>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <NuxtLink
        v-for="action in actions"
        :key="action.to"
        :to="action.to"
        class="flex flex-col items-center p-4 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div class="p-3 rounded-full mb-2" :class="action.bgColor">
          <UIcon :name="action.icon" class="w-6 h-6" :class="action.iconColor" />
        </div>
        <span class="text-sm text-center font-medium text-gray-900 dark:text-white">{{ action.label }}</span>
      </NuxtLink>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const actions = [
  { to: '/dashboard/shops/create', icon: 'i-lucide-plus', label: 'New Shop', bgColor: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400' },
  { to: '/dashboard/quotes', icon: 'i-lucide-file-text', label: 'View Quotes', bgColor: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600 dark:text-green-400' },
  { to: '/dashboard/profile/edit', icon: 'i-lucide-user-cog', label: 'Edit Profile', bgColor: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400' },
  { to: '/shops/nearby', icon: 'i-lucide-map-pin', label: 'Nearby Shops', bgColor: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400' },
]
</script>
