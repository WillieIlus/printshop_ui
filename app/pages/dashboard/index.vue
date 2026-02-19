<template>
  <DashboardDashboardLayout>
    <template #header>
      <DashboardDashboardPageHeader
        :title="`Welcome back, ${user?.first_name || 'there'}!`"
        subtitle="Here's what's happening with your business today."
      />
    </template>

    <!-- Row 1: 4 KPI cards (col-span-3 each) -->
    <div
      v-for="(stat, i) in stats"
      :key="stat.label"
      class="col-span-6 sm:col-span-6 lg:col-span-3"
    >
      <DashboardStatCard
        :label="stat.label"
        :value="stat.value"
        :icon="stat.icon"
        :icon-bg="stat.bgColor"
        :icon-color="stat.iconColor"
      />
    </div>

    <!-- Row 2: Big chart / activity (col-span-8) + side panel (col-span-4) -->
    <div class="col-span-12 lg:col-span-8">
      <DashboardQuickActions />
    </div>
    <div class="col-span-12 lg:col-span-4">
      <DashboardRecentActivity :activities="activities" />
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
    bgColor: 'bg-flamingo-50 dark:bg-flamingo-900/20',
    iconColor: 'text-flamingo-600 dark:text-flamingo-400',
  },
  {
    label: 'Active Quotes',
    value: quoteStore.quotes.filter((q: Quote) => q.status === 'pending').length,
    icon: 'i-lucide-file-text',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    label: 'Total Revenue',
    value: 'KES 0',
    icon: 'i-lucide-dollar-sign',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    label: 'Pending Claims',
    value: claimStore.claims.filter((c: Claim) => c.status === 'pending').length,
    icon: 'i-lucide-shield',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
])

const activities = ref<Array<{ title: string; time: string; icon: string }>>([])

onMounted(async () => {
  await Promise.all([shopStore.fetchMyShops(), quoteStore.fetchMyQuotes(), claimStore.fetchClaims()])
})
</script>
