<template>
  <div class="py-8 sm:py-12">
    <div class="mb-12">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        About Printy
      </h1>
      <p class="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
        Printy is the intelligent quoting and pricing engine for modern print shops. We help shops generate fast, accurate quotes using their machines, materials, and operational costs.
      </p>
    </div>

    <section class="mb-16">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
      <p class="text-gray-600 dark:text-gray-400">
        We believe print pricing should be systematic, not guesswork. Printy mirrors how real print shops calculate pricing—digital, large format, and finishing—so you can quote with confidence.
      </p>
    </section>

    <section id="mock-templates" class="mb-16 scroll-mt-24">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mock Templates</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Our template gallery includes mock templates for demonstration and testing. These templates use sample pricing logic to illustrate how Printy works without requiring a live backend connection.
      </p>
      <p class="text-gray-600 dark:text-gray-400">
        Browse the <NuxtLink to="/gallery" class="text-primary-600 hover:underline dark:text-primary-400 font-medium">Template Gallery</NuxtLink> to explore business cards, flyers, posters, banners, and more. Each template shows how Printy calculates pricing based on quantity, material, and finishing options.
      </p>
    </section>

    <section class="mb-16">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
      <p class="text-gray-600 dark:text-gray-400">
        Printy uses two pricing engines: Digital (sheet-based) and Large Format (area-based). Finishing services attach cleanly to both. Configure your shop once and generate fast, accurate, and profitable quotes every time.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>
