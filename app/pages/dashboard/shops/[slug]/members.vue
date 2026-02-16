<template>
  <DashboardDashboardLayout>
    <template #header>
      <DashboardDashboardPageHeader
        title="Team members"
        :subtitle="slug"
        :breadcrumbs="[{ label: 'My Shops', to: '/dashboard/shops' }, { label: slug, to: `/dashboard/shops/${slug}` }]"
      >
        <template #actions>
          <UButton :to="`/dashboard/shops/${slug}`" variant="ghost" size="sm">Back</UButton>
        </template>
      </DashboardDashboardPageHeader>
    </template>

    <DashboardSkeletonState v-if="loading" variant="card" :show-header="false" />
    <div v-else class="col-span-12">
      <DashboardSectionCard>
        <ShopsShopMembers :members="shopStore.shopMembers" />
      </DashboardSectionCard>
    </div>
  </DashboardDashboardLayout>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const shopStore = useShopStore()
const slug = computed(() => route.params.slug as string)
const loading = ref(true)

onMounted(async () => {
  await shopStore.fetchShopBySlug(slug.value)
  await shopStore.fetchShopMembers(slug.value)
  loading.value = false
})
</script>
