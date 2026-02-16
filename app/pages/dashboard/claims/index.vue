<template>
  <DashboardDashboardLayout>
    <template #header>
      <DashboardDashboardPageHeader
        title="Claims"
        subtitle="Manage shop ownership claims"
      />
    </template>

    <DashboardSkeletonState v-if="claimStore.loading" variant="card" :show-header="false" />
    <template v-else-if="claimStore.claims.length">
      <div
        v-for="c in claimStore.claims"
        :key="c.id"
        class="col-span-12 sm:col-span-6 lg:col-span-4"
      >
        <ClaimsClaimCard :claim="c">
          <template #actions>
            <UButton :to="`/dashboard/claims/${c.id}`" variant="outline" size="sm">View</UButton>
          </template>
        </ClaimsClaimCard>
      </div>
    </template>
    <div v-else class="col-span-12">
      <CommonEmptyState
        title="No claims yet"
        description="Shop ownership claims will appear here."
        icon="i-lucide-shield-check"
      />
    </div>
  </DashboardDashboardLayout>
</template>

<script setup lang="ts">
import { useClaimStore } from '~/stores/claim'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const claimStore = useClaimStore()
onMounted(() => claimStore.fetchClaims())
</script>
