<template>
  <div class="py-12 sm:py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10 text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Template Gallery
        </h1>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Browse and customize print templates. Sign in to convert templates into real quotes.
        </p>
      </div>

      <LandingFeaturedTemplates :limit="0" :show-browse-all="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>
