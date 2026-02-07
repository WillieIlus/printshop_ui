<template>
  <div class="space-y-6">
    <CommonLoadingSpinner v-if="shopStore.loading" />
    <template v-else-if="shop">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-4">
          <UAvatar :src="shop.logo" :alt="shop.name" size="xl" />
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ shop.name }}</h1>
            <p class="text-gray-600 dark:text-gray-400">{{ shop.city }}, {{ shop.state }}</p>
            <UBadge v-if="shop.is_verified" color="success" variant="soft" class="mt-2">
              <UIcon name="i-lucide-check-circle" class="w-3 h-3 mr-1" />
              Verified
            </UBadge>
          </div>
        </div>
        <div class="flex gap-2">
          <UButton :to="`/dashboard/shops/${slug}/edit`" variant="outline">
            <UIcon name="i-lucide-edit" class="w-4 h-4 mr-2" />
            Edit
          </UButton>
          <UButton :to="`/shops/${slug}`" variant="outline" target="_blank">
            <UIcon name="i-lucide-external-link" class="w-4 h-4 mr-2" />
            View Public
          </UButton>
        </div>
      </div>
      <div class="grid md:grid-cols-4 gap-4">
        <UCard :to="`/dashboard/shops/${slug}/quotes`" as="NuxtLink" class="hover:ring-2 ring-primary-500">
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
        <UCard :to="`/dashboard/shops/${slug}/products`" as="NuxtLink" class="hover:ring-2 ring-primary-500">
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
        <UCard :to="`/dashboard/shops/${slug}/members`" as="NuxtLink" class="hover:ring-2 ring-primary-500">
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
        <UCard :to="`/dashboard/shops/${slug}/hours`" as="NuxtLink" class="hover:ring-2 ring-primary-500">
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
      <div class="grid md:grid-cols-3 gap-6">
        <UCard>
          <div class="text-center">
            <p class="text-3xl font-bold text-primary-600 dark:text-primary-400">{{ quoteCount }}</p>
            <p class="text-gray-600 dark:text-gray-400">Total Quotes</p>
          </div>
        </UCard>
        <UCard>
          <div class="text-center">
            <p class="text-3xl font-bold text-green-600 dark:text-green-400">$0</p>
            <p class="text-gray-600 dark:text-gray-400">Revenue</p>
          </div>
        </UCard>
        <UCard>
          <div class="text-center">
            <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ shop.members?.length ?? 0 }}</p>
            <p class="text-gray-600 dark:text-gray-400">Team Members</p>
          </div>
        </UCard>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'
import { useQuoteStore } from '~/stores/quote'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const shopStore = useShopStore()
const quoteStore = useQuoteStore()
const slug = computed(() => route.params.slug as string)
const shop = computed(() => shopStore.currentShop)
const quoteCount = computed(() => quoteStore.quotes.length)

onMounted(async () => {
  await shopStore.fetchShopBySlug(slug.value)
  if (slug.value) await quoteStore.fetchShopQuotes(slug.value)
})
</script>
