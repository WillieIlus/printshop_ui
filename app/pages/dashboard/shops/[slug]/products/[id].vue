<template>
  <DashboardDashboardLayout>
    <template #header>
      <DashboardDashboardPageHeader
        title="Product template"
        :subtitle="slug"
        :breadcrumbs="[{ label: 'My Shops', to: '/dashboard/shops' }, { label: slug, to: `/dashboard/shops/${slug}` }, { label: 'Products', to: `/dashboard/shops/${slug}/products` }]"
      >
        <template #actions>
          <UButton :to="`/dashboard/shops/${slug}/products`" variant="ghost" size="sm">Back</UButton>
        </template>
      </DashboardDashboardPageHeader>
    </template>

    <div class="col-span-12">
      <DashboardSectionCard>
        <p class="text-sm text-muted">Product detail / edit (wire to API by id).</p>
      </DashboardSectionCard>
    </div>
  </DashboardDashboardLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const _id = computed(() => route.params.id as string)
</script>
