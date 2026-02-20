<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
    <!-- Top bar: back link + theme toggle (sample design) -->
    <div class="shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-200/70 dark:border-gray-800 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md">
      <NuxtLink
        v-if="backTo"
        :to="backTo"
        class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        {{ backLabel }}
      </NuxtLink>
      <span v-else />
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

    <!-- Centered card (sample: rounded-2xl, border-gray-100) -->
    <div class="flex-1 flex items-center justify-center p-4 sm:p-6">
      <div class="w-full max-w-md">
        <div v-if="$slots.branding || showBranding" class="text-center mb-8">
          <slot name="branding">
            <NuxtLink to="/" class="inline-flex items-center gap-2 group">
              <span class="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-flamingo-500 to-flamingo-700 text-white shadow-lg shadow-flamingo-500/25 transition-transform group-hover:scale-105">
                <UIcon name="i-lucide-printer" class="w-7 h-7" />
              </span>
              <span class="text-lg font-bold text-gray-900 dark:text-white">Printy</span>
            </NuxtLink>
          </slot>
        </div>

        <div v-if="$slots.title || $slots.subtitle" class="text-center mb-8">
          <slot name="title">
            <h1 v-if="title" class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ title }}
            </h1>
          </slot>
          <slot name="subtitle">
            <p v-if="subtitle" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {{ subtitle }}
            </p>
          </slot>
        </div>

        <div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8">
          <slot />
        </div>

        <div v-if="$slots.footer" class="mt-6 text-center">
          <slot name="footer" />
        </div>
      </div>
    </div>

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

withDefaults(
  defineProps<{
    /** Link for back button (hidden if not set) */
    backTo?: string
    /** Back button label */
    backLabel?: string
    /** Page title (used when no title slot) */
    title?: string
    /** Subtitle (used when no subtitle slot) */
    subtitle?: string
    /** Show default Printy branding when no branding slot */
    showBranding?: boolean
  }>(),
  {
    backLabel: 'Back',
    showBranding: true,
  }
)
</script>
