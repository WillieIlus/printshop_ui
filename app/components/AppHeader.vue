<template>
  <header class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between gap-3">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <span class="grid h-10 w-10 place-items-center rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 transition-transform group-hover:scale-105">
            <UIcon name="i-lucide-printer" class="w-6 h-6" />
          </span>
          <div class="leading-tight">
            <span class="text-sm font-bold tracking-tight sm:text-base">PrintShop</span>
            <span class="hidden text-xs text-gray-500 dark:text-gray-400 sm:block">Quoting & Pricing Engine</span>
          </div>
        </NuxtLink>
        <nav class="hidden items-center gap-6 md:flex">
          <NuxtLink to="/#problem" class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600">Problem</NuxtLink>
          <NuxtLink to="/#demo-gallery" class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600">Templates Gallery</NuxtLink>
          <NuxtLink to="/#models" class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600">Pricing Models</NuxtLink>
        </nav>
        <div class="flex items-center gap-3">
          <ClientOnly>
            <UButton
              :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
              color="neutral"
              variant="ghost"
              size="sm"
              aria-label="Toggle theme"
              @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
            />
          </ClientOnly>
          <NuxtLink to="/#demo-gallery" class="hidden rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 sm:inline-block">View Gallery</NuxtLink>
          <UButton to="/#cta" size="sm" color="primary">Get Started</UButton>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
</script>
