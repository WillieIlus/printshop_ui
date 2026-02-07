<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Claim #{{ id }}</h1>
      </div>
      <UButton to="/dashboard/claims" variant="ghost" size="sm">Back</UButton>
    </div>
    <CommonLoadingSpinner v-if="claimStore.loading" />
    <template v-else-if="claimStore.currentClaim">
      <UCard>
        <div class="space-y-2">
          <p><span class="text-gray-500 dark:text-gray-400">Status:</span> <UBadge :color="statusColor" variant="soft">{{ claimStore.currentClaim.status }}</UBadge></p>
          <p v-if="claimStore.currentClaim.shop_details"><span class="text-gray-500 dark:text-gray-400">Shop:</span> {{ claimStore.currentClaim.shop_details.name }}</p>
          <p><span class="text-gray-500 dark:text-gray-400">Created:</span> {{ formatDate(claimStore.currentClaim.created_at) }}</p>
        </div>
      </UCard>
    </template>
  </div>
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
