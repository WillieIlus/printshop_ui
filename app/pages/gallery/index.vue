<script setup lang="ts">
import { ref } from 'vue'
import type { DemoTemplate } from '~/shared/demoTemplates'

definePageMeta({
  layout: 'default',
})

const tweakerOpen = ref(false)
const selectedTemplate = ref<DemoTemplate | null>(null)

function openTweaker(template: DemoTemplate) {
  selectedTemplate.value = template
  tweakerOpen.value = true
}

function onTweakerOpenUpdate(v: boolean) {
  tweakerOpen.value = v
  if (!v) selectedTemplate.value = null
}
</script>

<template>
  <div class="py-8 sm:py-12">
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        Template Gallery
      </h1>
      <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
        Browse categories and tweak prices live (demo).
      </p>
    </div>

    <GalleryTemplateGalleryBrowser @tweak="openTweaker" />

    <GalleryTemplateTweakerModal
      :open="tweakerOpen"
      :template="selectedTemplate"
      @update:open="onTweakerOpenUpdate"
    />
  </div>
</template>
