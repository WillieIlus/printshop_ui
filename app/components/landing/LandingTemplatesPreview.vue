<script setup lang="ts">
import type { PrintTemplateListDTO } from '~/shared/types/templates'
import { listPublicShops, listShopTemplates } from '~/shared/api/gallery'
import { formatGsmConstraint } from '~/shared/types/templates'
import { formatKES } from '~/utils/formatters'

const MAX_TEMPLATES = 12
const MAX_SHOPS_TO_FETCH = 5

interface TemplateWithShop extends PrintTemplateListDTO {
  _shopSlug: string
  _shopName: string
}

const templates = ref<TemplateWithShop[]>([])
const loading = ref(true)
const fetchError = ref<string | null>(null)
const tweakerOpen = ref(false)
const selectedTemplate = ref<TemplateWithShop | null>(null)

const { getMediaUrl } = useApi()

async function fetchTemplates() {
  loading.value = true
  fetchError.value = null
  templates.value = []
  try {
    const shops = await listPublicShops()
    if (!shops.length) return

    const collected: TemplateWithShop[] = []
    for (const shop of shops.slice(0, MAX_SHOPS_TO_FETCH)) {
      if (collected.length >= MAX_TEMPLATES) break
      try {
        const res = await listShopTemplates(shop.slug)
        const items = res.results ?? []
        for (const t of items) {
          if (collected.length >= MAX_TEMPLATES) break
          collected.push({
            ...t,
            _shopSlug: shop.slug,
            _shopName: t.created_by_shop?.name ?? shop.name,
          })
        }
      } catch {
        // Skip this shop, continue with next
      }
    }
    templates.value = collected
  } catch {
    fetchError.value = 'Failed to load templates'
    templates.value = []
  } finally {
    loading.value = false
  }
}

function shopNameForTemplate(t: TemplateWithShop): string {
  return t._shopName
}

function constraintBadge(t: TemplateWithShop): string | null {
  return formatGsmConstraint(t)
}

function previewUrl(t: TemplateWithShop): string | null {
  if (!t.preview_image) return null
  if (t.preview_image.startsWith('http')) return t.preview_image
  return getMediaUrl(t.preview_image)
}

function openTweaker(t: TemplateWithShop) {
  selectedTemplate.value = t
  tweakerOpen.value = true
}

function onTweakerOpenUpdate(v: boolean) {
  tweakerOpen.value = v
  if (!v) selectedTemplate.value = null
}

onMounted(fetchTemplates)
</script>

<template>
  <section id="templates" class="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Browse Templates
        </h2>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Pre-configured templates that use your pricing logic in the background.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden animate-pulse">
          <div class="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
          <div class="p-5 space-y-3">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div class="flex gap-2">
              <div class="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              <div class="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="fetchError || !templates.length"
        class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg overflow-hidden"
      >
        <div class="flex flex-col items-center text-center p-12 sm:p-16">
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-flamingo-50 dark:bg-flamingo-950/50 text-flamingo-600 dark:text-flamingo-400">
            <UIcon name="i-lucide-layout-template" class="h-10 w-10" />
          </div>
          <h3 class="mt-6 text-xl font-bold text-gray-900 dark:text-white">
            No templates published yet
          </h3>
          <p class="mt-2 max-w-md text-gray-600 dark:text-gray-400">
            {{ fetchError ? 'Something went wrong loading templates. Check back later.' : 'Print shops haven\'t published templates yet. Browse the gallery to explore.' }}
          </p>
          <NuxtLink
            to="/gallery"
            class="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-flamingo-500 px-6 py-3.5 text-sm font-bold text-white hover:bg-flamingo-600 transition-colors"
          >
            <UIcon name="i-lucide-store" class="h-4 w-4" />
            Browse shops
          </NuxtLink>
        </div>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <article
          v-for="t in templates"
          :key="`${t._shopSlug}-${t.id}`"
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
            <div class="mt-4 flex items-center justify-between gap-2">
              <div>
                <span class="text-xs text-gray-500 dark:text-gray-400">From</span>
                <div class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400">
                  {{ formatKES(t.starting_price) }}
                </div>
              </div>
              <div class="flex gap-2 shrink-0">
                <NuxtLink :to="`/gallery/${t._shopSlug}/${t.slug}`">
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

      <!-- Browse all -->
      <div v-if="templates.length > 0" class="flex justify-center mt-10">
        <NuxtLink
          to="/gallery"
          class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-primary-700 shadow-md shadow-primary-200 dark:shadow-primary-900/50 transition-all"
        >
          Browse all templates
          <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
        </NuxtLink>
      </div>
    </div>

    <GalleryTemplateTweakerModal
      v-if="selectedTemplate"
      :open="tweakerOpen"
      :template="selectedTemplate"
      :shop-slug="selectedTemplate._shopSlug"
      @update:open="onTweakerOpenUpdate"
    />
  </section>
</template>
