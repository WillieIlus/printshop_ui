<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Shops</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage your business listings</p>
      </div>
      <UButton to="/dashboard/shops/create" color="primary">
        <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
        Add New Shop
      </UButton>
    </div>
    <CommonLoadingSpinner v-if="shopStore.loading" />
    <template v-else-if="shopStore.myShops.length">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ShopsShopCard
          v-for="shop in shopStore.myShops"
          :key="shop.id"
          :shop="shop"
          show-actions
          @edit="goToEdit(shop.slug)"
          @view="goToView(shop.slug)"
        />
      </div>
    </template>
    <UCard v-else class="text-center py-12">
      <UIcon name="i-lucide-store" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No shops yet</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Create your first shop to start receiving quotes and customers.
      </p>
      <UButton to="/dashboard/shops/create" color="primary">Create Your First Shop</UButton>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const shopStore = useShopStore()

function goToEdit(slug: string) {
  navigateTo(`/dashboard/shops/${slug}/edit`)
}

function goToView(slug: string) {
  navigateTo(`/dashboard/shops/${slug}`)
}

onMounted(() => shopStore.fetchMyShops())
</script>
