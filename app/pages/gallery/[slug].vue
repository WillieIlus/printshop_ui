<template>
  <div class="space-y-6">
    <div v-if="loading" class="space-y-4">
      <div class="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 aspect-video bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
        <div class="space-y-4">
          <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div class="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div class="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>

    <div v-else-if="!template" class="py-12">
      <CommonEmptyState
        title="Template not found"
        description="The template you're looking for doesn't exist or was removed."
        icon="i-lucide-file-question"
      >
        <UButton to="/gallery" color="primary">Back to Gallery</UButton>
      </CommonEmptyState>
    </div>

    <template v-else>
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <NuxtLink
          to="/gallery"
          class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-flamingo-600 dark:hover:text-flamingo-400"
        >
          <UIcon name="i-lucide-arrow-left" class="h-4 w-4" />
          Back to Gallery
        </NuxtLink>
        <UButton color="primary" @click="openTweaker">
          Tweak price
        </UButton>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Preview -->
        <div class="lg:col-span-2">
          <div class="aspect-video rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <NuxtImg
              v-if="template.preview_image"
              :src="getMediaUrl(template.preview_image)"
              :alt="template.title"
              class="h-full w-full object-contain"
              width="800"
              height="450"
            />
            <div
              v-else
              class="flex h-full items-center justify-center text-gray-400 dark:text-gray-500"
            >
              <UIcon name="i-lucide-file-image" class="h-24 w-24" />
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="space-y-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ template.title }}</h1>
            <div class="mt-2 flex flex-wrap gap-2">
              <UBadge
                v-for="b in templateBadges"
                :key="b"
                variant="soft"
                size="sm"
                color="primary"
              >
                {{ b }}
              </UBadge>
            </div>
            <p v-if="template.dimensions_label || template.weight_label" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {{ template.dimensions_label }}{{ template.dimensions_label && template.weight_label ? ' · ' : '' }}{{ template.weight_label }}
            </p>
            <p class="mt-3 font-semibold text-flamingo-600 dark:text-flamingo-400">
              {{ formatKES(template.starting_price) }} starting
            </p>
          </div>

          <div v-if="template.description" class="prose prose-sm dark:prose-invert max-w-none">
            <p class="text-gray-600 dark:text-gray-300">{{ template.description }}</p>
          </div>
        </div>
      </div>

      <!-- Options & Finishing -->
      <div class="grid md:grid-cols-2 gap-8">
        <div v-if="template.grouped_options?.length" class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Options</h2>
          <div class="space-y-4">
            <div
              v-for="group in template.grouped_options"
              :key="group.group_name"
            >
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{{ group.group_name }}</h3>
              <ul class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li v-for="opt in group.options" :key="opt.id">
                  {{ opt.name }}
                  <span v-if="opt.price_modifier" class="text-gray-500">({{ opt.price_modifier }})</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Finishing</h2>
          <div class="space-y-4">
            <div v-if="template.mandatory_finishing?.length">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Mandatory</h3>
              <ul class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li v-for="f in template.mandatory_finishing" :key="f.id">
                  {{ f.name }}
                  <span v-if="f.price" class="text-gray-500">({{ f.price }})</span>
                </li>
              </ul>
            </div>
            <div v-if="template.optional_finishing?.length">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Optional</h3>
              <ul class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li v-for="f in template.optional_finishing" :key="f.id">
                  {{ f.name }}
                  <span v-if="f.price" class="text-gray-500">({{ f.price }})</span>
                </li>
              </ul>
            </div>
            <p v-if="!template.mandatory_finishing?.length && !template.optional_finishing?.length" class="text-sm text-gray-500">
              No finishing options
            </p>
          </div>
        </div>
      </div>
    </template>

    <GalleryTemplateTweakerModal
      v-model:open="tweakerOpen"
      :template="template"
      @close="() => {}"
    />
  </div>
</template>

<script setup lang="ts">
import type { PrintTemplateDetailDTO } from '~/shared/types'
import { getTemplate } from '~/shared/api/templates'
import { formatKES } from '~/utils/formatters'
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { getMediaUrl } = useApi()

const template = ref<PrintTemplateDetailDTO | null>(null)
const loading = ref(true)
const tweakerOpen = ref(false)

const templateBadges = computed(() => {
  const t = template.value
  if (!t) return []
  const out: string[] = []
  if (t.is_popular) out.push('Popular')
  if (t.is_best_value) out.push('Best Value')
  if (t.is_new) out.push('New')
  if (t.badges?.length) out.push(...t.badges)
  return out
})

function openTweaker() {
  tweakerOpen.value = true
}

async function fetchTemplate() {
  loading.value = true
  try {
    template.value = await getTemplate(slug.value)
  } catch {
    template.value = null
  } finally {
    loading.value = false
  }
}

watch(slug, fetchTemplate, { immediate: true })
</script>
