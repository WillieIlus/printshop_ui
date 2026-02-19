<template>
  <div class="col-span-12 space-y-6">
    <!-- Hero / Welcome -->
    <DashboardPageHeader
      :title="`Welcome back, ${user?.first_name ?? 'User'}!`"
      subtitle="Here's what's happening with your business today."
    >
      <template #actions>
        <slot name="actions" />
      </template>
    </DashboardPageHeader>

    <!-- Stats: 4 KPI cards (col-span-3 each) -->
    <div class="col-span-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
      <DashboardStatCard
        v-for="stat in stats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :icon="stat.icon"
        :variant="stat.variant"
      />
    </div>

    <!-- Row 2: Big chart / activity (col-span-8) + side panel (col-span-4) -->
    <div class="col-span-12 grid grid-cols-12 gap-4 lg:gap-6">
      <div class="col-span-12 lg:col-span-8">
        <DashboardQuickActions />
      </div>
      <div class="col-span-12 lg:col-span-4">
        <DashboardRecentActivity :activities="activities" />
      </div>
    </div>
  </DashboardDashboardLayout>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'
import { useQuoteStore } from '~/stores/quote'
import { useClaimStore } from '~/stores/claim'
import type { Quote, Claim } from '~/shared/types'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { user } = useAuth()
const shopStore = useShopStore()
const quoteStore = useQuoteStore()
const claimStore = useClaimStore()

const stats = computed(() => [
  {
    label: 'Total Shops',
    value: shopStore.myShops.length,
    icon: 'i-lucide-store',
    variant: 'flamingo' as const,
  },
  {
    label: 'Active Quotes',
    value: quoteStore.quotes.filter((q: Quote) => q.status === 'pending').length,
    icon: 'i-lucide-file-text',
    variant: 'green' as const,
  },
  {
    label: 'Total Revenue',
    value: 'KES 0',
    icon: 'i-lucide-dollar-sign',
    variant: 'purple' as const,
  },
  {
    label: 'Pending Claims',
    value: claimStore.claims.filter((c: Claim) => c.status === 'pending').length,
    icon: 'i-lucide-shield',
    variant: 'orange' as const,
  },
])

const activities = ref<Array<{ title: string; time: string; icon: string }>>([])

onMounted(async () => {
  await Promise.all([shopStore.fetchMyShops(), quoteStore.fetchMyQuotes(), claimStore.fetchClaims()])
})
</script>
