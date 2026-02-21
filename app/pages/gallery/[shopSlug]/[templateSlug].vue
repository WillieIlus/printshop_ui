<script setup lang="ts">
import type { PrintTemplateDetailDTO } from '~/shared/types/templates'
import { getShopTemplate } from '~/shared/api/gallery'
import { formatGsmConstraint } from '~/shared/types/templates'
import { formatKES } from '~/utils/formatters'

definePageMeta({ layout: 'default' })

const route = useRoute()
const shopSlug = computed(() => String(route.params.shopSlug))
const templateSlug = computed(() => String(route.params.templateSlug))

const template = ref<PrintTemplateDetailDTO | null>(null)
const loading = ref(true)
const fetchError = ref<string | null>(null)
const tweakerOpen = ref(false)

const { getMediaUrl } = useApi()

async function fetchTemplate() {
  if (!shopSlug.value || !templateSlug.value) return
  loading.value = true
  fetchError.value = null
  try {
    template.value = await getShopTemplate(shopSlug.value, templateSlug.value)
    if (!template.value) fetchError.value = 'Template not found'
  } catch {
    fetchError.value = 'Failed to load template'
  } finally {
    loading.value = false
  }
}

function previewUrl(): string | null {
  const t = template.value
  if (!t?.preview_image) return null
  if (t.preview_image.startsWith('http')) return t.preview_image
  return getMediaUrl(t.preview_image)
}

function constraintBadge(): string | null {
  return template.value ? formatGsmConstraint(template.value) : null
}

watch([shopSlug, templateSlug], fetchTemplate, { immediate: true })
</script>

<template>
  <div class="py-8 sm:py-12">
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-4">
        <NuxtLink
          :to="`/gallery/${shopSlug}`"
          class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-flamingo-600 dark:hover:text-flamingo-400"
        >
          <UIcon name="i-lucide-arrow-left" class="h-4 w-4" />
          Back to templates
        </NuxtLink>
      </div>
    </div>

    <SkeletonsTemplateDetailSkeleton v-if="loading" />

    <CommonErrorState
      v-else-if="fetchError"
      :message="fetchError"
    >
      <UButton color="primary" size="lg" @click="fetchTemplate">
        <UIcon name="i-lucide-refresh-cw" class="h-4 w-4 mr-2" />
        Try again
      </UButton>
    </CommonErrorState>

    <div v-else-if="template" class="max-w-3xl">
      <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
        <div class="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800">
          <NuxtImg
            v-if="previewUrl()"
            :src="previewUrl()!"
            :alt="template.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="absolute inset-0 flex items-center justify-center">
            <UIcon name="i-lucide-file-image" class="h-24 w-24 text-gray-300 dark:text-gray-600" />
          </div>
          <div v-if="template.badges?.length" class="absolute top-4 left-4 flex flex-wrap gap-2">
            <UBadge v-for="badge in template.badges" :key="badge" size="sm" color="primary" variant="solid">
              {{ badge }}
            </UBadge>
          </div>
        </div>
        <div class="p-6 sm:p-8">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            {{ template.title }}
          </h1>
          <p v-if="template.created_by_shop" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            By {{ template.created_by_shop.name }}
          </p>
          <UBadge v-if="constraintBadge()" variant="soft" size="sm" color="neutral" class="mt-2">
            {{ constraintBadge() }}
          </UBadge>
          <p v-if="template.description" class="mt-4 text-gray-600 dark:text-gray-400">
            {{ template.description }}
          </p>
          <div class="mt-6 flex items-center gap-4">
            <div>
              <span class="text-sm text-gray-500 dark:text-gray-400">From</span>
              <div class="text-2xl font-bold text-flamingo-600 dark:text-flamingo-400">
                {{ formatKES(template.starting_price) }}
              </div>
            </div>
            <UButton color="primary" size="lg" @click="tweakerOpen = true">
              Tweak price
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <GalleryTemplateTweakerModal
      :open="tweakerOpen"
      :template="template"
      :shop-slug="shopSlug"
      @update:open="tweakerOpen = $event"
    />
  </div>
</template>
