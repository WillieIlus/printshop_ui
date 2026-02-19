<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Shops</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage your business listings</p>
      </div>
      <UButton color="primary" @click="openCreateModal()">
        <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
        Add New Shop
      </UButton>
    </div>
    <CommonLoadingSpinner v-if="shopStore.loading && !shopStore.myShops.length" />
    <template v-else-if="shopStore.myShops.length">
      <div
        v-for="shop in shopStore.myShops"
        :key="shop.id"
        class="col-span-12 sm:col-span-6 lg:col-span-4"
      >
        <ShopsShopCard
          :shop="shop"
          show-actions
          @edit="openEditModal(shop)"
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
      <UButton color="primary" @click="openCreateModal()">Create Your First Shop</UButton>
    </UCard>

    <DashboardModalForm
      v-model="modalOpen"
      :title="editingShop ? 'Edit Shop' : 'Create Shop'"
      :description="editingShop ? 'Update your business details.' : 'Add a new business listing.'"
    >
      <ShopsShopForm
        v-if="formReady"
        :key="editingShop?.slug ?? 'new'"
        :shop="editingShop ?? undefined"
        :loading="formLoading"
        :error="shopStore.error"
        @submit="onSubmit"
        @cancel="closeModal"
      />
    </DashboardModalForm>
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
