<template>
  <DashboardDashboardLayout>
    <template #header>
      <DashboardDashboardPageHeader
        v-if="shop"
        :title="shop.name"
          :subtitle="`${shop.city}, ${shop.state}`"
          :breadcrumbs="[{ label: 'My Shops', to: '/dashboard/shops' }, { label: shop.name, to: `/dashboard/shops/${slug}` }]"
        >
          <template #actions>
            <UBadge v-if="shop.is_verified" color="success" variant="soft" class="mr-2">
              <UIcon name="i-lucide-check-circle" class="w-3 h-3 mr-1" />
              Verified
            </UBadge>
            <UButton :to="`/dashboard/shops/${slug}/edit`" variant="outline">
              <UIcon name="i-lucide-edit" class="w-4 h-4 mr-2" />
              Edit
            </UButton>
            <UButton :to="`/shops/${slug}`" variant="outline" target="_blank">
              <UIcon name="i-lucide-external-link" class="w-4 h-4 mr-2" />
              View Public
            </UButton>
          </template>
        </DashboardDashboardPageHeader>
      <DashboardDashboardPageHeader v-else title="Loading..." subtitle="" />
    </template>

    <DashboardSkeletonState v-if="shopStore.loading" variant="dashboard" :show-header="false" />
    <template v-else-if="shop">
      <!-- Setup checklist: Machines → Stock & Prices -->
      <div v-if="setupProgress < 3" class="col-span-12 rounded-xl border border-flamingo-200/60 bg-flamingo-50/50 p-4 dark:border-flamingo-800/40 dark:bg-flamingo-900/10">
        <h3 class="text-sm font-medium text-muted mb-3">Setup your shop</h3>
        <p class="text-sm text-muted mb-4">
          Add machines first, then paper stock and prices to start quoting.
        </p>
        <div class="flex flex-wrap gap-4">
          <NuxtLink
            :to="`/dashboard/shops/${slug}/machines`"
            class="flex items-center gap-2 text-sm font-medium"
            :class="hasMachines ? 'text-green-600' : 'text-flamingo-600 hover:underline'"
          >
            <UIcon :name="hasMachines ? 'i-lucide-check-circle' : 'i-lucide-printer'" class="w-4 h-4" />
            1. Machines {{ hasMachines ? `(${machineCount})` : '' }}
          </NuxtLink>
          <NuxtLink
            :to="`/dashboard/shops/${slug}/pricing`"
            class="flex items-center gap-2 text-sm font-medium"
            :class="hasPricing ? 'text-green-600' : 'text-gray-600 hover:text-flamingo-600'"
          >
            <UIcon :name="hasPricing ? 'i-lucide-check-circle' : 'i-lucide-banknote'" class="w-4 h-4" />
            2. Stock & prices
          </NuxtLink>
          <NuxtLink
            :to="`/dashboard/shops/${slug}/products`"
            class="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-flamingo-600"
          >
            <UIcon name="i-lucide-package" class="w-4 h-4" />
            3. Products (optional)
          </NuxtLink>
        </div>
      </div>

      <div class="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <UCard :to="`/dashboard/shops/${slug}/machines`" as="NuxtLink" class="hover:ring-2 ring-flamingo-500 border-gray-200/60 dark:border-gray-800/60 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-flamingo-100 dark:bg-flamingo-900/30 rounded-lg">
              <UIcon name="i-lucide-printer" class="w-5 h-5 text-flamingo-600 dark:text-flamingo-400" />
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">Machines</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Printers & equipment</p>
            </div>
          </div>
        </UCard>
        <UCard :to="`/dashboard/shops/${slug}/pricing`" as="NuxtLink" class="hover:ring-2 ring-flamingo-500 border-gray-200/60 dark:border-gray-800/60 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <UIcon name="i-lucide-banknote" class="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">Stock & prices</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Paper, printing, finishing</p>
            </div>
          </div>
        </UCard>
        <UCard :to="`/dashboard/shops/${slug}/products`" as="NuxtLink" class="hover:ring-2 ring-flamingo-500 border-gray-200/60 dark:border-gray-800/60 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <UIcon name="i-lucide-package" class="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">Products</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Product templates</p>
            </div>
          </div>
        </UCard>
        <UCard :to="`/dashboard/shops/${slug}/quotes`" as="NuxtLink" class="hover:ring-2 ring-flamingo-500 border-gray-200/60 dark:border-gray-800/60 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <UIcon name="i-lucide-file-text" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">Quotes</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Manage quotes</p>
            </div>
          </div>
        </UCard>
        <UCard :to="`/dashboard/shops/${slug}/members`" as="NuxtLink" class="hover:ring-2 ring-flamingo-500 order-last border-gray-200/60 dark:border-gray-800/60 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <UIcon name="i-lucide-users" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">Team</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Manage members</p>
            </div>
          </div>
        </UCard>
        <UCard :to="`/dashboard/shops/${slug}/hours`" as="NuxtLink" class="hover:ring-2 ring-flamingo-500 order-last border-gray-200/60 dark:border-gray-800/60 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <UIcon name="i-lucide-clock" class="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">Hours</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Business hours</p>
            </div>
          </div>
        </UCard>
      </div>
      <div class="col-span-12 sm:col-span-4">
        <DashboardStatCard label="Total Quotes" :value="quoteCount" icon="i-lucide-file-text" icon-color="text-flamingo-600 dark:text-flamingo-400" icon-bg="bg-flamingo-50 dark:bg-flamingo-900/20" />
      </div>
      <div class="col-span-12 sm:col-span-4">
        <DashboardStatCard label="Revenue" value="$0" icon="i-lucide-dollar-sign" icon-color="text-green-600 dark:text-green-400" icon-bg="bg-green-50 dark:bg-green-900/20" />
      </div>
      <div class="col-span-12 sm:col-span-4">
        <DashboardStatCard label="Team Members" :value="shop.member_count ?? shop.members?.length ?? 0" icon="i-lucide-users" icon-color="text-blue-600 dark:text-blue-400" icon-bg="bg-blue-50 dark:bg-blue-900/20" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'
import { useQuoteStore } from '~/stores/quote'
import { useMachineStore } from '~/stores/machine'
import { usePricingStore } from '~/stores/pricing'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const shopStore = useShopStore()
const quoteStore = useQuoteStore()
const machineStore = useMachineStore()
const pricingStore = usePricingStore()
const slug = computed(() => route.params.slug as string)
const shop = computed(() => shopStore.currentShop)
const quoteCount = computed(() => quoteStore.quotes.length)

const hasMachines = computed(() => machineStore.machines.length > 0)
const machineCount = computed(() => machineStore.machines.length)
const hasPricing = computed(
  () =>
    pricingStore.paperPrices.length > 0 ||
    pricingStore.printingPrices.length > 0 ||
    pricingStore.finishingServices.length > 0
)
const setupProgress = computed(() => {
  let n = 0
  if (hasMachines.value) n++
  if (hasPricing.value) n++
  return n
})

onMounted(async () => {
  await shopStore.fetchShopBySlug(slug.value)
  if (slug.value) {
    await Promise.all([
      quoteStore.fetchShopQuotes(slug.value),
      machineStore.fetchMachines(slug.value),
      pricingStore.fetchPrintingPrices(slug.value),
      pricingStore.fetchPaperPrices(slug.value),
      pricingStore.fetchFinishingServices(slug.value),
    ])
  }
})
</script>
