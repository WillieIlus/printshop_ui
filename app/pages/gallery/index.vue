<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Template Gallery</h1>
      <p class="mt-1 text-gray-600 dark:text-gray-400">Browse print templates and tweak pricing</p>
    </div>

    <!-- Filters -->
    <div class="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <!-- Category pills -->
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="cat in categories"
          :key="cat.id"
          :variant="selectedCategory === cat.slug ? 'solid' : 'outline'"
          :color="selectedCategory === cat.slug ? 'primary' : 'neutral'"
          size="sm"
          @click="selectedCategory = selectedCategory === cat.slug ? '' : cat.slug"
        >
          {{ cat.name }}
        </UButton>
      </div>

      <!-- Search + Badges -->
      <div class="flex flex-col sm:flex-row gap-3">
        <UButton
          v-for="badge in badgeFilters"
          :key="badge.key"
          :variant="activeBadges[badge.key] ? 'solid' : 'outline'"
          :color="activeBadges[badge.key] ? 'primary' : 'neutral'"
          size="sm"
          @click="toggleBadge(badge.key)"
        >
          {{ badge.label }}
        </UButton>
        <UInput
          v-model="searchQuery"
          placeholder="Search templates..."
          icon="i-lucide-search"
          size="md"
          class="flex-1 min-w-0 sm:max-w-xs"
          :ui="{ root: 'flex-1' }"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="i in 6"
        :key="i"
        class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden"
      >
        <div class="aspect-[4/3] bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div class="p-4 space-y-3">
          <div class="h-2 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div class="h-2 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div class="h-2 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div class="flex gap-2 pt-2">
            <div class="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div class="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <CommonEmptyState
      v-else-if="!loading && templates.length === 0"
      title="No templates found"
      description="Try adjusting your filters or search."
      icon="i-lucide-search-x"
    />

    <!-- Grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="t in templates"
        :key="t.id"
        class="group overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all hover:border-flamingo-200 dark:hover:border-flamingo-800 hover:shadow-lg"
      >
        <div class="aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <NuxtImg
            v-if="t.preview_image"
            :src="getMediaUrl(t.preview_image)"
            :alt="t.title"
            class="h-full w-full object-cover transition-transform group-hover:scale-105"
            width="400"
            height="300"
          />
          <div
            v-else
            class="flex h-full items-center justify-center text-gray-400 dark:text-gray-500"
          >
            <UIcon name="i-lucide-file-image" class="h-16 w-16" />
          </div>
        </div>
        <div class="p-4 space-y-3">
          <h3 class="font-semibold text-gray-900 dark:text-white line-clamp-2">{{ t.title }}</h3>
          <div class="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span v-if="t.dimensions_label">{{ t.dimensions_label }}</span>
            <span v-if="t.weight_label">{{ t.weight_label }}</span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <UBadge
              v-for="b in templateBadges(t)"
              :key="b"
              variant="soft"
              size="xs"
              color="primary"
            >
              {{ b }}
            </UBadge>
          </div>
          <p class="font-semibold text-flamingo-600 dark:text-flamingo-400">
            {{ formatKES(t.starting_price) }}
          </p>
          <div class="flex gap-2 pt-1">
            <UButton
              variant="outline"
              size="sm"
              color="primary"
              block
              :to="`/gallery/${t.slug}`"
            >
              View
            </UButton>
            <UButton
              variant="solid"
              size="sm"
              color="primary"
              block
              @click="openTweaker(t)"
            >
              Tweak
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <GalleryTemplateTweakerModal
      v-model:open="tweakerOpen"
      :template="tweakerTemplate"
      @close="tweakerTemplate = null"
    />
  </div>
</template>

<script setup lang="ts">
import type { PrintTemplateListDTO, TemplateCategoryDTO } from '~/shared/types'
import { listCategories, listTemplates } from '~/shared/api/templates'
import { formatKES } from '~/utils/formatters'
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'default' })

const { getMediaUrl } = useApi()

const categories = ref<TemplateCategoryDTO[]>([])
const templates = ref<PrintTemplateListDTO[]>([])
const loading = ref(true)
const selectedCategory = ref('')
const searchQuery = ref('')
const searchDebounced = ref('')
const activeBadges = ref<Record<string, boolean>>({
  is_popular: false,
  is_best_value: false,
  is_new: false,
})
const tweakerOpen = ref(false)
const tweakerTemplate = ref<PrintTemplateListDTO | null>(null)

const badgeFilters = [
  { key: 'is_popular', label: 'Popular' },
  { key: 'is_best_value', label: 'Best Value' },
  { key: 'is_new', label: 'New' },
]

function toggleBadge(key: string) {
  activeBadges.value[key] = !activeBadges.value[key]
}

function templateBadges(t: PrintTemplateListDTO): string[] {
  const out: string[] = []
  if (t.is_popular) out.push('Popular')
  if (t.is_best_value) out.push('Best Value')
  if (t.is_new) out.push('New')
  if (t.badges?.length) out.push(...t.badges)
  return out
}

function openTweaker(t: PrintTemplateListDTO) {
  tweakerTemplate.value = t
  tweakerOpen.value = true
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchDebounced.value = searchQuery.value
    debounceTimer = null
  }, 300)
})

async function fetchCategories() {
  try {
    categories.value = await listCategories()
  } catch {
    categories.value = []
  }
}

async function fetchTemplates() {
  loading.value = true
  try {
    const params: Record<string, string | number | boolean> = {}
    if (selectedCategory.value) params.category__slug = selectedCategory.value
    if (activeBadges.value.is_popular) params.is_popular = true
    if (activeBadges.value.is_best_value) params.is_best_value = true
    if (activeBadges.value.is_new) params.is_new = true
    if (searchDebounced.value) params.search = searchDebounced.value

    const res = await listTemplates(params)
    templates.value = res.results
  } catch {
    templates.value = []
  } finally {
    loading.value = false
  }
}

watch([selectedCategory, activeBadges, searchDebounced], () => fetchTemplates(), { deep: true })

onMounted(() => {
  fetchCategories()
  fetchTemplates()
})
</script>
