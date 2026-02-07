<template>
  <header class="sticky top-0 z-50 border-b border-slate-200/70 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between gap-3">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <span class="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-transform group-hover:scale-105">
            <UIcon name="i-lucide-printer" class="w-6 h-6" />
          </span>
          <div class="leading-tight">
            <span class="text-sm font-bold tracking-tight sm:text-base text-slate-900 dark:text-white">PrintShop</span>
            <span class="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">Quoting & Pricing Engine</span>
          </div>
        </NuxtLink>
        <nav class="hidden items-center gap-6 md:flex">
          <NuxtLink to="/#problem" class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">Problem</NuxtLink>
          <NuxtLink to="/#demo-gallery" class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">Templates Gallery</NuxtLink>
          <NuxtLink to="/#models" class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">Pricing Models</NuxtLink>
          <NuxtLink to="/shops" class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">Shops</NuxtLink>
        </nav>
        <div class="hidden items-center gap-3 sm:flex">
          <NuxtLink to="/#demo-gallery" class="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">View Gallery</NuxtLink>
          <NuxtLink to="/#cta" class="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 shadow-md shadow-primary-200 dark:shadow-primary-900/50 transition-all hover:shadow-lg">Get Started</NuxtLink>
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
        </div>
        <div class="flex items-center gap-2 sm:hidden">
          <ClientOnly>
            <UButton :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'" color="neutral" variant="ghost" size="sm" aria-label="Toggle theme" @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'" />
          </ClientOnly>
          <UPopover mode="click" :popper="{ placement: 'bottom-end' }">
            <UButton icon="i-lucide-menu" color="neutral" variant="ghost" size="sm" aria-label="Menu" />
            <template #panel>
              <div class="w-48 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl shadow-xl p-2 flex flex-col gap-1">
                <NuxtLink to="/#problem" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Problem</NuxtLink>
                <NuxtLink to="/#demo-gallery" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Templates Gallery</NuxtLink>
                <NuxtLink to="/#models" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Pricing Models</NuxtLink>
                <NuxtLink to="/shops" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Shops</NuxtLink>
                <NuxtLink to="/#cta" class="rounded-lg px-3 py-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20">Get Started</NuxtLink>
              </div>
            </template>
          </UPopover>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
</script>
