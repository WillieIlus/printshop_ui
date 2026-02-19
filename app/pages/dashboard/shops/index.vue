<template>
  <DashboardDashboardLayout>
    <template #header>
      <DashboardDashboardPageHeader
        title="My Shops"
        subtitle="Manage your business listings"
      >
        <template #actions>
          <UButton to="/dashboard/shops/create" color="primary">
            <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
            Add New Shop
          </UButton>
        </template>
      </DashboardDashboardPageHeader>
    </template>

    <DashboardSkeletonState v-if="shopStore.loading" variant="card" :show-header="false" />
    <template v-else-if="shopStore.myShops.length">
      <div
        v-for="shop in shopStore.myShops"
        :key="shop.id"
        class="col-span-12 sm:col-span-6 lg:col-span-4"
      >
        <ShopsShopCard
          :shop="shop"
          show-actions
          @edit="goToEdit(shop.slug)"
          @view="goToView(shop.slug)"
        />
      </div>
    </template>
    <div v-else class="col-span-12">
      <CommonEmptyState
        title="No shops yet"
        description="Create your first shop to start receiving quotes and customers."
        icon="i-lucide-store"
      >
        <UButton to="/dashboard/shops/create" color="primary">Create Your First Shop</UButton>
      </CommonEmptyState>
    </div>
  </DashboardDashboardLayout>
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
