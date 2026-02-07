<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Welcome back, {{ user?.first_name }}!
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Here's what's happening with your business today.
      </p>
    </div>
    <DashboardDashboardStats :stats="stats" />
    <div class="grid lg:grid-cols-2 gap-6">
      <DashboardQuickActions />
      <DashboardRecentActivity :activities="activities" />
    </div>
  </div>
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
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    label: 'Active Quotes',
    value: quoteStore.quotes.filter((q: Quote) => q.status === 'pending').length,
    icon: 'i-lucide-file-text',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    label: 'Total Revenue',
    value: '$0',
    icon: 'i-lucide-dollar-sign',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    label: 'Pending Claims',
    value: claimStore.claims.filter((c: Claim) => c.status === 'pending').length,
    icon: 'i-lucide-shield',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
])

const activities = ref<Array<{ title: string; time: string; icon: string }>>([])

onMounted(async () => {
  await Promise.all([
    shopStore.fetchMyShops(),
    quoteStore.fetchMyQuotes(),
    claimStore.fetchClaims(),
  ])
})
</script>
