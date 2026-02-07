<template>
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
    <!-- Top bar (sample: sticky, backdrop-blur) -->
    <header class="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 border-b border-slate-200/70 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md px-4 sm:px-6">
      <UButton
        icon="i-lucide-menu"
        color="neutral"
        variant="ghost"
        size="sm"
        aria-label="Toggle sidebar"
        class="lg:hidden"
        @click="sidebarOpen = !sidebarOpen"
      />
      <NuxtLink to="/dashboard" class="flex items-center gap-2 shrink-0 group">
        <span class="grid h-8 w-8 place-items-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-transform group-hover:scale-105">
          <UIcon name="i-lucide-printer" class="w-4 h-4" />
        </span>
        <span class="font-semibold text-slate-900 dark:text-white hidden sm:inline">PrintShop</span>
      </NuxtLink>
      <div class="flex-1 min-w-0" />
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
      <slot name="topbar-end" />
    </header>

    <div class="flex flex-1 overflow-hidden">
      <aside
        class="fixed inset-y-0 left-0 z-30 w-64 transform border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pt-14 transition-transform duration-200 ease-out lg:static lg:translate-x-0 lg:pt-0"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <nav class="flex flex-col gap-1 p-4 overflow-y-auto">
          <template v-for="item in navItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
              :class="isActive(item.to)
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'"
            >
              <UIcon :name="item.icon" class="w-5 h-5 shrink-0" />
              {{ item.label }}
            </NuxtLink>
          </template>
          <div class="my-2 border-t border-slate-200 dark:border-slate-700 pt-2">
            <p class="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">My Shops</p>
            <template v-if="shopStore.myShops.length">
              <NuxtLink
                v-for="shop in shopStore.myShops"
                :key="shop.slug"
                :to="`/dashboard/shops/${shop.slug}`"
                class="mt-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                :class="{ 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400': isShopActive(shop.slug) }"
              >
                <UIcon name="i-lucide-store" class="w-4 h-4 shrink-0" />
                <span class="truncate">{{ shop.name }}</span>
              </NuxtLink>
            </template>
            <NuxtLink
              to="/dashboard/shops/create"
              class="mt-2 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
            >
              <UIcon name="i-lucide-plus" class="w-4 h-4 shrink-0" />
              Add shop
            </NuxtLink>
          </div>
        </nav>
        <div v-if="$slots['sidebar-footer']" class="mt-auto border-t border-slate-200 dark:border-slate-800 p-4">
          <slot name="sidebar-footer" />
        </div>
      </aside>

      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-20 bg-black/50 lg:hidden"
        aria-hidden
        @click="sidebarOpen = false"
      />

      <main class="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div v-if="$slots.title || $slots.actions" class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div v-if="$slots.title"><slot name="title" /></div>
          <div v-if="$slots.actions" class="shrink-0"><slot name="actions" /></div>
        </div>
        <slot />
      </main>
    </div>

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'

const colorMode = useColorMode()
const route = useRoute()
const shopStore = useShopStore()
const sidebarOpen = ref(false)

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'i-lucide-layout-dashboard' },
  { to: '/dashboard/profile', label: 'Profile', icon: 'i-lucide-user' },
  { to: '/dashboard/shops', label: 'My Shops', icon: 'i-lucide-store' },
  { to: '/dashboard/quotes', label: 'My Quotes', icon: 'i-lucide-file-text' },
  { to: '/dashboard/claims', label: 'Claims', icon: 'i-lucide-shield-check' },
]

function isActive(to: string) {
  if (to === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(to)
}

function isShopActive(slug: string) {
  return route.params.slug === slug
}

onMounted(() => {
  shopStore.fetchMyShops()
})
</script>
