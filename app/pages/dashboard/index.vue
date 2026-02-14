<template>
  <div class="space-y-8">
    <!-- Hero / Welcome -->
    <div class="rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm ring-1 ring-gray-100/60 backdrop-blur dark:border-gray-800 dark:bg-gray-900/70 dark:ring-gray-800/60">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <h1 class="truncate text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Welcome back, {{ user?.first_name }}!
          </h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Here's what's happening with your business today.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <slot name="actions" />
        </div>
      </div>
    </div>

    <!-- Stats -->
    <DashboardDashboardStats :stats="stats" />

    <!-- Two-column panels -->
    <div class="grid gap-6 lg:grid-cols-2">
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
    bgColor: 'bg-flamingo-50 ring-1 ring-inset ring-flamingo-100 dark:bg-flamingo-900/20 dark:ring-flamingo-900/40',
    iconColor: 'text-flamingo-600 dark:text-flamingo-400',
  },
  {
    label: 'Active Quotes',
    value: quoteStore.quotes.filter((q: Quote) => q.status === 'pending').length,
    icon: 'i-lucide-file-text',
    bgColor: 'bg-green-50 ring-1 ring-inset ring-green-100 dark:bg-green-900/20 dark:ring-green-900/40',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    label: 'Total Revenue',
    value: 'KES 0',
    icon: 'i-lucide-dollar-sign',
    bgColor: 'bg-purple-50 ring-1 ring-inset ring-purple-100 dark:bg-purple-900/20 dark:ring-purple-900/40',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    label: 'Pending Claims',
    value: claimStore.claims.filter((c: Claim) => c.status === 'pending').length,
    icon: 'i-lucide-shield',
    bgColor: 'bg-orange-50 ring-1 ring-inset ring-orange-100 dark:bg-orange-900/20 dark:ring-orange-900/40',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
])

const activities = ref<Array<{ title: string; time: string; icon: string }>>([])

onMounted(async () => {
  await Promise.all([shopStore.fetchMyShops(), quoteStore.fetchMyQuotes(), claimStore.fetchClaims()])
})
</script>
