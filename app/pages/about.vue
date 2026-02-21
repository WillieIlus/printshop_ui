<script setup lang="ts">
import { templates, getCategoryByKey, type DemoTemplate } from '~/shared/demoTemplates'

definePageMeta({
  layout: 'default',
})

const tweakerOpen = ref(false)
const selectedTemplate = ref<DemoTemplate | null>(null)

const faqItems = [
  {
    label: 'What is Printy?',
    content: 'Printy is a quoting and pricing engine for print shops. It helps you generate fast, accurate quotes using your own machines, materials, and rates.',
  },
  {
    label: 'Do I need to connect a backend?',
    content: 'For the live gallery, yes — shops connect their backend to serve real templates. The About page mock templates work entirely offline for demo purposes.',
  },
  {
    label: 'How does the pricing calculation work?',
    content: 'Digital jobs use sheet-based logic: sheets needed = ceil(quantity ÷ pieces per sheet). Large format uses area (m²). Material, printing, and finishing costs are summed.',
  },
  {
    label: 'Can I try it before signing up?',
    content: "Yes. Browse the gallery, use the mock templates on this page, or explore the homepage simulator. Create a shop when you're ready to configure your own pricing.",
  },
]

function openTweaker(t: DemoTemplate) {
  selectedTemplate.value = t
  tweakerOpen.value = true
}

function onTweakerOpenUpdate(v: boolean) {
  tweakerOpen.value = v
  if (!v) selectedTemplate.value = null
}

function categoryLabel(key: string): string {
  return getCategoryByKey(key)?.label ?? key
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gray-900 dark:bg-gray-950 py-16 sm:py-24 w-screen max-w-none left-1/2 -translate-x-1/2">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 -left-4 w-72 h-72 bg-flamingo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
        <div class="absolute top-0 -right-4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
      </div>
      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          About Printy
        </h1>
        <p class="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          A pricing brain for print shops. Add your machines, set your rates, and generate accurate quotes in seconds.
        </p>
        <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/gallery"
            class="inline-flex items-center justify-center rounded-xl bg-white dark:bg-gray-100 px-6 py-3.5 text-sm font-bold text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors"
          >
            Browse Templates
            <UIcon name="i-lucide-chevron-right" class="ml-2 w-4 h-4" />
          </NuxtLink>
          <NuxtLink
            to="/auth/signup"
            class="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
          >
            Create a Shop
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-16 sm:py-24 bg-white dark:bg-gray-900">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
          How it works
        </h2>
        <div class="grid gap-8 sm:grid-cols-3">
          <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 sm:p-8">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400 mb-4">
              <UIcon name="i-lucide-printer" class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Add machines</h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Configure your digital and large-format printers with sheet sizes and click costs.
            </p>
          </div>
          <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 sm:p-8">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400 mb-4">
              <UIcon name="i-lucide-coins" class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Add pricing</h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Set material rates, finishing costs, and margins. Your shop, your numbers.
            </p>
          </div>
          <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 sm:p-8">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400 mb-4">
              <UIcon name="i-lucide-file-text" class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Use templates</h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Pre-configured templates use your pricing to generate quotes instantly.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Mock Templates Preview -->
    <section class="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
          Mock Templates Preview
        </h2>
        <p class="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-xl mx-auto">
          Demo data only — try the calculator without a backend.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            v-for="t in templates"
            :key="t.id"
            class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shadow-sm hover:shadow-md hover:border-flamingo-200 dark:hover:border-flamingo-800/50 transition-all"
          >
            <div class="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <UIcon
                :name="getCategoryByKey(t.category)?.icon ?? 'i-lucide-file-image'"
                class="h-16 w-16 text-gray-300 dark:text-gray-600"
              />
              <UBadge
                v-if="t.badge"
                class="absolute top-3 left-3"
                color="primary"
                variant="solid"
                size="xs"
              >
                {{ t.badge }}
              </UBadge>
            </div>
            <div class="p-5">
              <h3 class="font-bold text-gray-900 dark:text-white">
                {{ t.name }}
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ categoryLabel(t.category) }}
              </p>
              <div class="mt-4 flex items-center justify-between gap-2">
                <div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">From</span>
                  <div class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400">
                    {{ new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(t.demoBasePrice) }}
                  </div>
                </div>
                <UButton
                  color="primary"
                  variant="soft"
                  size="sm"
                  @click="openTweaker(t)"
                >
                  Try demo tweak
                </UButton>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-16 sm:py-24 bg-white dark:bg-gray-900">
      <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
          FAQ
        </h2>
        <UAccordion :items="faqItems" :ui="{ wrapper: 'space-y-2' }" />
      </div>
    </section>

    <AboutDemoTemplateTweakerModal
      :open="tweakerOpen"
      :template="selectedTemplate"
      @update:open="onTweakerOpenUpdate"
    />
  </div>
</template>
