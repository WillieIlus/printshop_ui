<script setup lang="ts">
import type { PrintTemplateListDTO, TemplateCategoryDTO } from '~/shared/types/templates'
import { formatGsmConstraint } from '~/shared/types/templates'
import { listShopCategories, listShopTemplates } from '~/shared/api/gallery'
import { useShopStore } from '~/stores/shop'
import { useAuthStore } from '~/stores/auth'
import { formatKES } from '~/utils/formatters'

definePageMeta({ layout: 'default' })

const route = useRoute()
const shopSlug = computed(() => String(route.params.shopSlug))

const shopStore = useShopStore()
const authStore = useAuthStore()
const { getMediaUrl } = useApi()

const categories = ref<TemplateCategoryDTO[]>([])
const templates = ref<PrintTemplateListDTO[]>([])
const loading = ref(true)
const fetchError = ref<string | null>(null)
const searchQuery = ref('')
const selectedCategory = ref('all')

const shop = computed(() => shopStore.currentShop)

const tweakerOpen = ref(false)
const selectedTemplate = ref<PrintTemplateListDTO | null>(null)

/** Whether the current user is a PRINTER who owns this shop */
const isPrinterOwner = computed(() => {
  if (!authStore.isAuthenticated || authStore.user?.role !== 'PRINTER') return false
  return shopStore.myShops.some((s) => s.slug === shopSlug.value)
})

async function fetchData() {
  if (!shopSlug.value) return
  loading.value = true
  fetchError.value = null
  try {
    const [catsRes, tmplRes] = await Promise.allSettled([
      listShopCategories(shopSlug.value),
      listShopTemplates(shopSlug.value, {
        category: selectedCategory.value === 'all' ? undefined : selectedCategory.value,
        search: searchQuery.value.trim() || undefined,
      }),
    ])
    categories.value = catsRes.status === 'fulfilled' ? catsRes.value : []
    if (tmplRes.status === 'fulfilled') {
      templates.value = tmplRes.value.results
    } else {
      templates.value = []
      fetchError.value = 'Failed to load templates'
    }
  } catch {
    categories.value = []
    templates.value = []
    fetchError.value = 'Failed to load templates'
  } finally {
    loading.value = false
  }
}

async function fetchShop() {
  await shopStore.fetchShopBySlug(shopSlug.value)
}

/** Fetch myShops when authenticated so we can show "Add template" for owners */
async function ensureMyShops() {
  if (authStore.isAuthenticated && shopStore.myShops.length === 0) {
    await shopStore.fetchMyShops()
  }
}

function openTweaker(template: PrintTemplateListDTO) {
  selectedTemplate.value = template
  tweakerOpen.value = true
}

function onTweakerOpenUpdate(v: boolean) {
  tweakerOpen.value = v
  if (!v) selectedTemplate.value = null
}

function clearCategoryFilter() {
  selectedCategory.value = 'all'
}

function constraintBadge(t: PrintTemplateListDTO): string | null {
  return formatGsmConstraint(t)
}

/** Shop name for display (shop-scoped: always current shop; from template.created_by_shop as fallback) */
function shopNameForTemplate(t: PrintTemplateListDTO): string {
  return t.created_by_shop?.name ?? shop.value?.name ?? 'Shop'
}

watch([shopSlug, selectedCategory, searchQuery], () => {
  fetchData()
}, { immediate: true })

watch(shopSlug, fetchShop, { immediate: true })

onMounted(() => {
  ensureMyShops()
})

function previewUrl(t: PrintTemplateListDTO): string | null {
  if (!t.preview_image) return null
  if (t.preview_image.startsWith('http')) return t.preview_image
  return getMediaUrl(t.preview_image)
}
</script>

<template>
  <div class="py-8 sm:py-12">
    <!-- Back + Shop info -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/gallery"
          class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-flamingo-600 dark:hover:text-flamingo-400"
        >
          <UIcon name="i-lucide-arrow-left" class="h-4 w-4" />
          Back to shops
        </NuxtLink>
        <div v-if="shop" class="flex items-center gap-2">
          <span class="text-gray-400">·</span>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ shop.name }}
          </h1>
        </div>
      </div>
    </div>

    <!-- Category tabs - skeleton when loading -->
    <div class="flex flex-wrap gap-2 mb-6">
      <SkeletonsCategoryPillsSkeleton v-if="loading" :count="5" />
      <template v-else>
      <UButton
        :variant="selectedCategory === 'all' ? 'solid' : 'outline'"
        :color="selectedCategory === 'all' ? 'primary' : 'neutral'"
        size="sm"
        class="rounded-full"
        @click="selectedCategory = 'all'"
      >
        All
      </UButton>
      <UButton
        v-for="cat in categories"
        :key="cat.slug"
        :variant="selectedCategory === cat.slug ? 'solid' : 'outline'"
        :color="selectedCategory === cat.slug ? 'primary' : 'neutral'"
        size="sm"
        class="rounded-full"
        @click="selectedCategory = cat.slug"
      >
        {{ cat.name }}
        <span v-if="(cat.template_count ?? cat.templates_count) != null" class="ml-1 opacity-75">({{ cat.template_count ?? cat.templates_count }})</span>
      </UButton>
      </template>
    </div>

    <!-- Search -->
    <UInput
      v-model="searchQuery"
      placeholder="Search templates..."
      icon="i-lucide-search"
      size="lg"
      class="w-full max-w-md mb-6"
    />

    <!-- Loading: skeleton cards (same grid layout) -->
    <SkeletonsCardGridSkeleton v-if="loading" :count="6" variant="template" />

    <!-- Error: retry state -->
    <GalleryErrorState
      v-else-if="fetchError"
      @retry="fetchData"
    />

    <!-- Empty: premium empty state -->
    <GalleryEmptyState
      v-else-if="!templates.length"
      :shop-name="shop ? shop.name : 'This printer'"
      :is-printer-owner="isPrinterOwner"
      :shop-slug="shopSlug"
      @browse-another-category="clearCategoryFilter"
    />

    <!-- Grid: templates -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="t in templates"
        :key="t.id"
        class="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shadow-sm hover:shadow-md hover:border-flamingo-200 dark:hover:border-flamingo-800/50 transition-all"
      >
        <div class="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <NuxtImg
            v-if="previewUrl(t)"
            :src="previewUrl(t)!"
            :alt="t.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div
            v-else
            class="absolute inset-0 flex items-center justify-center"
          >
            <UIcon name="i-lucide-file-image" class="h-16 w-16 text-gray-300 dark:text-gray-600" />
          </div>
          <div v-if="t.badges?.length" class="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <UBadge
              v-for="badge in t.badges.slice(0, 2)"
              :key="badge"
              size="xs"
              color="primary"
              variant="solid"
            >
              {{ badge }}
            </UBadge>
          </div>
        </div>
        <div class="p-5">
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-bold text-gray-900 dark:text-white group-hover:text-flamingo-600 dark:group-hover:text-flamingo-400 transition-colors">
              {{ t.title }}
            </h3>
            <UBadge
              v-if="constraintBadge(t)"
              variant="soft"
              size="xs"
              color="neutral"
            >
              {{ constraintBadge(t) }}
            </UBadge>
          </div>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            By {{ shopNameForTemplate(t) }}
          </p>
          <p v-if="t.description" class="mt-0.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {{ t.description }}
          </p>
          <div class="mt-4 flex items-center justify-between gap-2">
            <div>
              <span class="text-xs text-gray-500 dark:text-gray-400">From</span>
              <div class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400">
                {{ formatKES(t.starting_price) }}
              </div>
            </div>
            <div class="flex gap-2 shrink-0">
              <NuxtLink :to="`/gallery/${shopSlug}/${t.slug}`">
                <UButton color="neutral" variant="outline" size="sm">
                  View
                </UButton>
              </NuxtLink>
              <UButton
                color="primary"
                variant="soft"
                size="sm"
                @click="openTweaker(t)"
              >
                Tweak
              </UButton>
            </div>
          </div>
        </div>
      </article>
    </div>

    <GalleryTemplateTweakerModal
      :open="tweakerOpen"
      :template="selectedTemplate"
      :shop-slug="shopSlug"
      @update:open="onTweakerOpenUpdate"
    />
  </div>
</template>
