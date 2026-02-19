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
import type { Shop, ShopCreateInput } from '~/shared/types'
import { useShopStore } from '~/stores/shop'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const shopStore = useShopStore()
const notification = useNotification()

const modalOpen = ref(false)
const formReady = ref(false)
const editingShop = ref<Shop | null>(null)
const formLoading = ref(false)

const route = useRoute()

function openCreateModal() {
  editingShop.value = null
  modalOpen.value = true
}

function openEditModal(shop: Shop) {
  editingShop.value = shop
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  editingShop.value = null
}

watch(modalOpen, (open) => {
  if (open) {
    formReady.value = false
    nextTick(() => { formReady.value = true })
  } else {
    formReady.value = false
    editingShop.value = null
  }
})

// Support ?create=1 or ?edit=slug from redirects
watch(
  () => route.query,
  (query) => {
    if (query.create === '1') {
      openCreateModal()
    } else if (typeof query.edit === 'string') {
      const shop =
        shopStore.myShops.find((s) => s.slug === query.edit) ??
        (shopStore.currentShop?.slug === query.edit ? shopStore.currentShop : null)
      if (shop) {
        openEditModal(shop)
      } else if (query.edit) {
        shopStore.fetchShopBySlug(query.edit).then(() => {
          const s = shopStore.currentShop
          if (s) openEditModal(s)
        })
      }
    }
  },
  { immediate: true }
)

function goToView(slug: string) {
  navigateTo(`/dashboard/shops/${slug}`)
}

async function onSubmit(data: ShopCreateInput) {
  formLoading.value = true
  try {
    if (editingShop.value) {
      const result = await shopStore.updateShop(editingShop.value.slug, data)
      if (result.success) {
        notification.success('Shop updated')
        closeModal()
      } else {
        notification.error(shopStore.error ?? 'Update failed')
      }
    } else {
      const result = await shopStore.createShop(data)
      if (result.success && result.shop) {
        notification.success('Shop created! Add machines, then stock and prices.')
        closeModal()
        await navigateTo(`/dashboard/shops/${result.shop.slug}`)
      } else {
        notification.error(shopStore.error ?? 'Create failed')
      }
    }
  } finally {
    formLoading.value = false
  }
}

onMounted(() => shopStore.fetchMyShops())
</script>
