<template>
  <DashboardDashboardLayout>
    <template #header>
      <DashboardDashboardPageHeader
        title="Product templates"
        subtitle="Presets for quick quoting"
        :breadcrumbs="[{ label: 'My Shops', to: '/dashboard/shops' }, { label: slug, to: `/dashboard/shops/${slug}` }]"
      >
        <template #actions>
          <UButton :to="`/dashboard/shops/${slug}`" variant="ghost" size="sm">Back</UButton>
          <UButton :to="`/dashboard/shops/${slug}/products/create`" color="primary">
            <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
            Add product
          </UButton>
        </template>
      </DashboardDashboardPageHeader>
    </template>

    <DashboardSkeletonState v-if="quoteStore.loading" variant="list" :show-header="false" />
    <div v-else class="col-span-12">
      <ProductsProductTemplateList :products="quoteStore.productTemplates">
        <template #card-actions="{ product }">
          <UButton :to="`/dashboard/shops/${slug}/products/${product.id}`" variant="ghost" size="sm">View</UButton>
        </template>
        <template #empty>
          <UButton :to="`/dashboard/shops/${slug}/products/create`" color="primary">Add first product</UButton>
        </template>
      </ProductsProductTemplateList>
    </div>
  </DashboardDashboardLayout>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'
import { useQuoteStore } from '~/stores/quote'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const shopStore = useShopStore()
const quoteStore = useQuoteStore()
const slug = computed(() => route.params.slug as string)

onMounted(async () => {
  await shopStore.fetchShopBySlug(slug.value)
  await quoteStore.fetchProductTemplates(slug.value)
})
</script>
