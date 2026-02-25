<template>
  <div class="min-h-screen bg-amber-50/80 dark:bg-stone-950">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <CommonLoadingSpinner v-if="loading" />
      <template v-else-if="catalog">
        <!-- Shop header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 flex-wrap">
              <h1 class="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100 font-[family-name:var(--font-heading)]">
                {{ catalog.shop.name }}
              </h1>
              <ShopsShopFavoriteToggle
                :shop-id="catalog.shop.id"
                :shop-name="catalog.shop.name"
                :shop-slug="catalog.shop.slug"
              />
            </div>
            <div class="flex items-center gap-3 mt-1">
              <ShopsShopRatingSummary :summary="ratingSummary" />
              <p class="text-stone-600 dark:text-stone-400">Browse products and add to your quote</p>
            </div>
          </div>
          <div class="flex gap-2 shrink-0">
            <UButton v-if="quoteDraftStore.currentShopSlug === slug && quoteDraftStore.activeDraft?.items?.length" to="/quote-draft" color="primary" variant="outline">
              <UIcon name="i-lucide-shopping-cart" class="mr-2 h-4 w-4" />
              View your quote ({{ quoteDraftStore.activeDraft.items.length }})
            </UButton>
            <UButton to="/shops" variant="outline" color="neutral">
              <UIcon name="i-lucide-arrow-left" class="mr-2 h-4 w-4" />
              Back to shops
            </UButton>
          </div>
        </div>

        <!-- Product catalog -->
        <div v-if="catalog.products.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="product in catalog.products"
            :key="product.id"
            class="rounded-2xl border border-amber-200/80 dark:border-amber-800/50 bg-white dark:bg-stone-900 shadow-sm overflow-hidden hover:shadow-lg transition-all"
          >
            <div class="p-6">
              <div class="flex items-start gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
                  <UIcon name="i-lucide-package" class="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div class="min-w-0 flex-1">
                  <h3 class="font-semibold text-stone-800 dark:text-stone-100 truncate">
                    {{ product.name }}
                  </h3>
                  <p v-if="product.category" class="mt-0.5 text-sm text-amber-600 dark:text-amber-400">
                    {{ product.category }}
                  </p>
                  <p v-if="product.description" class="mt-2 text-sm text-stone-500 dark:text-stone-400 line-clamp-2">
                    {{ product.description }}
                  </p>
                </div>
              </div>
              <UButton
                color="primary"
                variant="solid"
                class="mt-4 w-full"
                block
                :loading="addingProductId === product.id"
                :disabled="!!addingProductId"
                @click="onAddToQuote(product)"
              >
                <UIcon name="i-lucide-plus" class="mr-2 h-4 w-4" />
                Add to Quote
              </UButton>
            </div>
          </div>
        </div>
        <div v-else class="rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-white dark:bg-stone-900 p-12 text-center">
          <UIcon name="i-lucide-package" class="mx-auto h-16 w-16 text-amber-200 dark:text-amber-800" />
          <h3 class="mt-4 text-lg font-medium text-stone-700 dark:text-stone-300">No products yet</h3>
          <p class="mt-2 text-sm text-stone-500 dark:text-stone-400">This shop hasn't added any products.</p>
        </div>

        <div v-if="canRateShop && catalog.shop" class="mt-8">
          <ShopsShopRateForm :shop-id="catalog.shop.id" />
        </div>
      </template>
      <div v-else class="rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-white dark:bg-stone-900 p-12 text-center">
        <UIcon name="i-lucide-store" class="mx-auto h-16 w-16 text-amber-200 dark:text-amber-800" />
        <h3 class="mt-4 text-lg font-medium text-stone-700 dark:text-stone-300">Shop not found</h3>
        <p class="mt-2 text-sm text-stone-500 dark:text-stone-400">The shop you're looking for doesn't exist or is inactive.</p>
        <UButton to="/shops" class="mt-4">Browse shops</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CatalogResponse } from '~/services/public'
import type { Product } from '~/shared/types'
import { getCatalog } from '~/services/public'
import { getRatingSummary } from '~/services/ratings'
import type { RatingSummary } from '~/services/ratings'
import { useQuoteDraftStore } from '~/stores/quoteDraft'

definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const quoteDraftStore = useQuoteDraftStore()
const favoritesStore = useFavoritesStore()
const { canRate, load: loadRatable } = useRatableShops()
const toast = useToast()

const catalog = ref<CatalogResponse | null>(null)
const loading = ref(true)
const addingProductId = ref<number | null>(null)
const ratingSummary = ref<RatingSummary | null>(null)
const canRateShop = computed(() => catalog.value?.shop && canRate(catalog.value.shop.id))

onMounted(async () => {
  try {
    const [cat, summary] = await Promise.all([
      getCatalog(slug.value),
      getRatingSummary(slug.value),
    ])
    catalog.value = cat
    ratingSummary.value = summary
    if (useAuthStore().isAuthenticated) {
      favoritesStore.loadFavorites()
      await loadRatable()
    }
  } catch (err) {
    console.error('Failed to load catalog:', err)
  } finally {
    loading.value = false
  }
})

async function onAddToQuote(product: Product) {
  addingProductId.value = product.id
  try {
    await quoteDraftStore.addToQuote(product.id, slug.value, product.pricing_mode)
    toast.add({ title: 'Added to Quote Draft', description: `${product.name} added.` })
  } catch (err) {
    toast.add({
      title: 'Could not add',
      description: err instanceof Error ? err.message : 'Please sign in to add to your quote.',
      color: 'error',
    })
  } finally {
    addingProductId.value = null
  }
}
</script>
