<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Create shop"
      subtitle="Add a new business listing"
    >
      <template #actions>
        <UButton to="/dashboard/shops" variant="ghost" size="sm">Back</UButton>
      </template>
    </DashboardPageHeader>

    <div class="col-span-12">
      <ShopsShopForm :loading="shopStore.loading" :error="shopStore.error" @submit="onSubmit" @cancel="goBack" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

// Redirect to shops index with create modal
await navigateTo({ path: '/dashboard/shops', query: { create: '1' } }, { replace: true })
</script>
