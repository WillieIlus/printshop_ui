<template>
  <div class="space-y-8">
    <CommonLoadingSpinner v-if="shopStore.loading" />
    <template v-else-if="shop">
      <!-- Shop Header -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-start gap-6">
          <UAvatar :src="shop.logo ?? undefined" :alt="shop.name" size="2xl" class="shrink-0" />
          <div class="min-w-0 flex-1">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ shop.name }}</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">{{ shop.city }}, {{ shop.state }}</p>
            <UBadge v-if="shop.is_verified" color="success" variant="soft" class="mt-2">Verified</UBadge>
            <p v-if="shop.description" class="mt-4 text-gray-600 dark:text-gray-400">{{ shop.description }}</p>
            <div class="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span v-if="shop.phone_number" class="flex items-center gap-1"><UIcon name="i-lucide-phone" class="w-4 h-4" />{{ shop.phone_number }}</span>
              <span v-if="shop.business_email" class="flex items-center gap-1"><UIcon name="i-lucide-mail" class="w-4 h-4" />{{ shop.business_email }}</span>
            </div>
            <div class="mt-6 flex gap-3">
              <UButton :to="`/shops/${slug}/request-quote`" color="primary">Request a Quote</UButton>
              <UButton variant="outline" @click="scrollToRateCard">View Prices</UButton>
            </div>
          </div>
        </div>
        <ShopsShopSocialLinks v-if="shop.social_links?.length" :links="shop.social_links" class="mt-6" />
      </div>

      <!-- Machines / Equipment -->
      <div v-if="shop.machines?.length" class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Our Equipment</h2>
        <div class="flex flex-wrap gap-3">
          <div
            v-for="machine in shop.machines"
            :key="machine.id"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-2.5"
          >
            <UIcon name="i-lucide-printer" class="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ machine.name }}</span>
            <UBadge v-if="machine.type_display ?? machine.machine_type" color="neutral" variant="soft" size="xs">
              {{ machine.type_display ?? machine.machine_type }}
            </UBadge>
          </div>
        </div>
      </div>

      <!-- Price Calculator -->
      <div id="price-calculator">
        <PricingPriceCalculatorWidget 
          v-if="rateCard" 
          :slug="slug" 
          :rate-card="rateCard"
          :shop-name="shop?.name"
          :shop-phone="shop?.phone_number ?? undefined"
          @calculated="onPriceCalculated"
        />
      </div>

      <!-- Rate Card -->
      <div id="rate-card">
        <CommonLoadingSpinner v-if="pricingStore.loading" />
        <PricingRateCardDisplay 
          v-else-if="rateCard" 
          :rate-card="rateCard"
          :shop-name="shop.name"
        />
        <div v-else-if="!pricingStore.loading" class="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Pricing not available</h3>
          <p class="mt-2 text-sm text-gray-500">This shop hasn't published their rate card yet.</p>
          <p class="mt-4 text-sm text-gray-600">Contact them directly or request a custom quote.</p>
          <UButton :to="`/shops/${slug}/request-quote`" color="primary" class="mt-4">Request a Quote</UButton>
        </div>
      </div>
    </template>
    <UCard v-else class="text-center py-12">
      <p class="text-gray-600 dark:text-gray-400">Shop not found.</p>
      <UButton to="/shops" class="mt-4">Browse shops</UButton>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { PriceCalculationResult } from '~/shared/types'
import { useShopStore } from '~/stores/shop'
import { usePricingStore } from '~/stores/pricing'

definePageMeta({ layout: 'default' })

const route = useRoute()
const shopStore = useShopStore()
const pricingStore = usePricingStore()

const slug = computed(() => route.params.slug as string)
const shop = computed(() => shopStore.currentShop)
const rateCard = computed(() => pricingStore.rateCard)

onMounted(async () => {
  await shopStore.fetchShopBySlug(slug.value)
  try {
    await pricingStore.fetchRateCard(slug.value)
  } catch {
    // Rate card might not be available - that's okay
  }
})
onUnmounted(() => {
  pricingStore.clearPricing()
})

// Scroll to rate card
const scrollToRateCard = () => {
  document.getElementById('rate-card')?.scrollIntoView({ behavior: 'smooth' })
}

// Handle price calculation
const onPriceCalculated = (result: PriceCalculationResult) => {
  console.log('Price calculated:', result)
}
</script>
