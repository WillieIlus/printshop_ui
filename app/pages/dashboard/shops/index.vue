<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="My Shops"
      subtitle="Manage your business listings"
    >
      <template #actions>
        <UButton to="/dashboard/shops/create" color="primary">
          <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
          Add New Shop
        </UButton>
      </template>
    </DashboardPageHeader>

    <DashboardSkeletonState v-if="shopStore.loading" variant="cards" :card-count="6" />
    <div v-else-if="shopStore.myShops.length" class="col-span-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      <ShopsShopCard
        v-for="shop in shopStore.myShops"
        :key="shop.id"
        :shop="shop"
        show-actions
        @edit="goToEdit(shop.slug)"
        @view="goToView(shop.slug)"
      />
    </div>
    <div v-else class="col-span-12">
      <DashboardEmptyState
        title="No shops yet"
        description="Create your first shop to start receiving quotes and customers."
        icon="i-lucide-store"
      >
        <UButton to="/dashboard/shops/create" color="primary">Create Your First Shop</UButton>
      </DashboardEmptyState>
    </div>
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
