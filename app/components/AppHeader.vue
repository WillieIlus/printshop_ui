<template>
  <nav class="sticky top-0 z-50 border-b border-gray-200/70 dark:border-gray-800/70 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2.5">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-flamingo-500 to-flamingo-700 shadow-lg shadow-flamingo-500/25">
            <UIcon name="i-lucide-printer" class="h-6 w-6 text-white" />
          </div>
          <div class="leading-tight">
            <div class="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Printy</div>
            <div class="hidden text-[11px] text-gray-500 dark:text-gray-400 sm:block">Quoting & Pricing Engine</div>
          </div>
        </NuxtLink>

        <!-- Desktop Nav Links -->
        <div class="hidden items-center gap-1 md:flex">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.label"
            :to="link.to"
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:bg-flamingo-50 dark:hover:bg-flamingo-900/30 hover:text-flamingo-600 dark:hover:text-flamingo-400"
          >
            <UIcon v-if="link.icon" :name="link.icon" class="h-4 w-4" />
            {{ link.label }}
          </NuxtLink>
        </div>

        <!-- Right side -->
        <div class="flex items-center gap-3">
          <ThemeCycleButton />

          <!-- User Avatar / Login -->
          <div v-if="authStore.isAuthenticated" class="flex items-center gap-2">
            <UPopover mode="click" :popper="{ placement: 'bottom-end' }">
              <template #default>
                <button class="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 transition-all hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm">
                  <div class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-flamingo-400 to-flamingo-600 text-xs font-bold text-white">
                    {{ userInitials }}
                  </div>
                  <span class="hidden text-sm font-medium text-gray-700 dark:text-gray-200 sm:inline">{{ userName }}</span>
                  <UIcon name="i-lucide-chevron-down" class="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </button>
              </template>
              <template #content>
                <div class="w-48 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl shadow-xl p-2 flex flex-col gap-1">
                  <NuxtLink to="/dashboard" class="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-flamingo-50 dark:hover:bg-flamingo-900/30 hover:text-flamingo-600 dark:hover:text-flamingo-400">Dashboard</NuxtLink>
                  <NuxtLink to="/dashboard/profile" class="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-flamingo-50 dark:hover:bg-flamingo-900/30 hover:text-flamingo-600 dark:hover:text-flamingo-400">Profile</NuxtLink>
                  <NuxtLink to="/dashboard/shops" class="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-flamingo-50 dark:hover:bg-flamingo-900/30 hover:text-flamingo-600 dark:hover:text-flamingo-400">My Shops</NuxtLink>
                  <NuxtLink to="/dashboard/quotes" class="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-flamingo-50 dark:hover:bg-flamingo-900/30 hover:text-flamingo-600 dark:hover:text-flamingo-400">My Quotes</NuxtLink>
                  <button
                    v-if="isCustomer"
                    class="rounded-lg px-3 py-2 text-left text-sm font-medium text-flamingo-600 dark:text-flamingo-400 hover:bg-flamingo-50 dark:hover:bg-flamingo-900/30 w-full flex items-center gap-2"
                    :disabled="becomingPrinter"
                    @click="onBecomePrinter"
                  >
                    <UIcon name="i-lucide-store" class="h-4 w-4" />
                    {{ becomingPrinter ? 'Updating...' : 'Become a printer' }}
                  </button>
                  <div class="my-1 border-t border-gray-100 dark:border-gray-800" />
                  <button class="rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 w-full" @click="authStore.logout">
                    Log Out
                  </button>
                </div>
              </template>
            </UPopover>
          </div>
          <div v-else class="flex items-center gap-2">
            <NuxtLink to="/auth/login" class="hidden text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors hover:text-flamingo-600 dark:hover:text-flamingo-400 sm:inline-flex">
              Log In
            </NuxtLink>
            <NuxtLink
              to="/auth/signup"
              class="rounded-xl bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-flamingo-500/25 transition-all hover:bg-flamingo-600 hover:shadow-flamingo-500/40"
            >
              Get Started
            </NuxtLink>
          </div>

          <!-- Mobile Menu Toggle -->
          <button
            class="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            aria-label="Menu"
            @click="mobileOpen = !mobileOpen"
          >
            <UIcon :name="mobileOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="mobileOpen" class="border-t border-gray-200 dark:border-gray-800 pb-4 pt-3 md:hidden">
          <div class="grid gap-1">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.label"
              :to="link.to"
              class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-flamingo-50 dark:hover:bg-flamingo-900/30 hover:text-flamingo-600 dark:hover:text-flamingo-400"
              @click="mobileOpen = false"
            >
              <UIcon v-if="link.icon" :name="link.icon" class="h-4 w-4 shrink-0" />
              {{ link.label }}
            </NuxtLink>
          </div>
          <div v-if="authStore.isAuthenticated && isCustomer" class="mt-3 grid gap-2 px-3">
            <button
              class="rounded-xl bg-flamingo-500 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-flamingo-600 flex items-center justify-center gap-2"
              :disabled="becomingPrinter"
              @click="onBecomePrinter(); mobileOpen = false"
            >
              <UIcon name="i-lucide-store" class="h-4 w-4" />
              {{ becomingPrinter ? 'Updating...' : 'Become a printer' }}
            </button>
          </div>
          <div v-if="!authStore.isAuthenticated" class="mt-3 grid gap-2 px-3">
            <NuxtLink to="/auth/login" class="rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-2.5 text-center text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700" @click="mobileOpen = false">
              Log In
            </NuxtLink>
            <NuxtLink to="/auth/signup" class="rounded-xl bg-flamingo-500 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-flamingo-600" @click="mobileOpen = false">
              Get Started
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useUserStore } from '~/stores/user'

const authStore = useAuthStore()
const userStore = useUserStore()
const mobileOpen = ref(false)
const becomingPrinter = ref(false)
const notification = useNotification()

const isCustomer = computed(() => {
  const u = authStore.user
  return !u?.role || u.role === 'CUSTOMER'
})

async function onBecomePrinter() {
  if (becomingPrinter.value) return
  becomingPrinter.value = true
  try {
    const result = await userStore.updateMe({ role: 'PRINTER' })
    if (result.success) {
      await authStore.fetchUser()
      await navigateTo('/onboarding/printer')
    } else {
      notification.error(userStore.error ?? 'Failed to update role')
    }
  } finally {
    becomingPrinter.value = false
  }
}

const navLinks = [
  { label: 'Templates', to: '/gallery', icon: 'i-lucide-layout-grid' },
  { label: 'Problem', to: '/#problem' },
  { label: 'Pricing Models', to: '/#models' },
  { label: 'Shops', to: '/shops' },
  { label: 'My Quotes', to: '/quotes' },
]

const userName = computed(() => {
  const u = authStore.user
  if (!u) return 'User'
  return [u.first_name, u.last_name].filter(Boolean).join(' ') || u.email?.split('@')[0] || 'User'
})

const userInitials = computed(() => {
  const u = authStore.user
  if (!u) return 'U'
  if (u.first_name && u.last_name) return `${u.first_name[0]}${u.last_name[0]}`.toUpperCase()
  if (u.first_name) return u.first_name.slice(0, 2).toUpperCase()
  if (u.email) return u.email[0]?.toUpperCase() ?? 'U'
  return 'U'
})
</script>
