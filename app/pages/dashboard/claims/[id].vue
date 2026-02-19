<template>
  <DashboardDashboardLayout>
    <template #header>
      <DashboardDashboardPageHeader
        :title="`Claim #${id}`"
        :breadcrumbs="[{ label: 'Claims', to: '/dashboard/claims' }]"
      >
        <template #actions>
          <UButton to="/dashboard/claims" variant="ghost" size="sm">Back</UButton>
        </template>
      </DashboardDashboardPageHeader>
    </template>

    <DashboardSkeletonState v-if="claimStore.loading" variant="card" :show-header="false" />
    <div v-else-if="claimStore.currentClaim" class="col-span-12">
      <DashboardSectionCard>
        <div class="space-y-2 text-sm">
          <p><span class="text-muted">Status:</span> <UBadge :color="statusColor" variant="soft">{{ claimStore.currentClaim.status }}</UBadge></p>
          <p v-if="claimStore.currentClaim.shop_details"><span class="text-muted">Shop:</span> {{ claimStore.currentClaim.shop_details.name }}</p>
          <p><span class="text-muted">Created:</span> {{ formatDate(claimStore.currentClaim.created_at) }}</p>
        </div>
      </DashboardSectionCard>
    </div>
  </DashboardDashboardLayout>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils/formatters'
import { useClaimStore } from '~/stores/claim'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const route = useRoute()
const claimStore = useClaimStore()
const id = computed(() => Number(route.params.id))
const statusColor = computed((): 'warning' | 'success' | 'error' | 'neutral' => {
  const m: Record<string, 'warning' | 'success' | 'error'> = { pending: 'warning', approved: 'success', rejected: 'error' }
  return m[claimStore.currentClaim?.status ?? ''] ?? 'neutral'
})

onMounted(() => claimStore.fetchClaim(id.value))
</script>
