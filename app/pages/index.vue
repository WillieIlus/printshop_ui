<template>
  <div>
    <!-- Hero -->
    <section id="top" class="relative overflow-hidden bg-gray-900 py-20 sm:py-32 w-screen max-w-none left-1/2 -translate-x-1/2">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
        <div class="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000" />
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000" />
      </div>
      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div class="max-w-2xl">
            <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
              <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Not a marketplace — a pricing brain for your print shop
            </div>
            <h1 class="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Quote print jobs <br class="hidden lg:block"> <span class="text-primary-400">in seconds.</span>
            </h1>
            <p class="mt-6 text-lg text-gray-300 leading-relaxed">
              Printy mirrors how real print shops calculate pricing—using your machines, materials, and costs to generate fast, accurate quotes for <span class="text-white font-semibold">digital</span> and <span class="text-white font-semibold">large format</span> work.
            </p>
            <div class="mt-8 flex flex-col sm:flex-row gap-4">
              <NuxtLink to="/gallery" class="inline-flex items-center justify-center rounded-xl bg-white dark:bg-gray-100 px-6 py-3.5 text-sm font-bold text-gray-900 dark:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors">
                View Gallery Demo
                <UIcon name="i-lucide-chevron-right" class="ml-2 w-4 h-4" />
              </NuxtLink>
              <NuxtLink to="/about#how-it-works" class="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-colors backdrop-blur-sm">
                Learn how pricing works
              </NuxtLink>
            </div>
          </div>
          <div class="mt-16 lg:mt-0 relative">
            <LandingLandingQuoteSimulator ref="simulatorRef" v-model="demoForm" />
          </div>
        </div>
      </div>
    </section>

    <!-- Templates preview (WOW) -->
    <LandingTemplatesPreview />

    <!-- How it works (short) -->
    <section id="how" class="py-16 sm:py-24 bg-white dark:bg-gray-900">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl mx-auto text-center mb-12">
          <p class="text-sm font-bold uppercase tracking-wider text-primary-600">How it works</p>
          <h2 class="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Three steps to fast quotes
          </h2>
        </div>
        <div class="grid gap-6 sm:grid-cols-3">
          <div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-6 text-center">
            <div class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-3">
              <UIcon name="i-lucide-store" class="w-5 h-5" />
            </div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">Add shop & machines</h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Configure your equipment and capabilities once.</p>
          </div>
          <div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-6 text-center">
            <div class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-3">
              <UIcon name="i-lucide-coins" class="w-5 h-5" />
            </div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">Add pricing</h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Set material, printing, and finishing costs.</p>
          </div>
          <div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-6 text-center">
            <div class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-3">
              <UIcon name="i-lucide-zap" class="w-5 h-5" />
            </div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">Quote in seconds</h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Generate accurate, consistent quotes every time.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section id="cta" class="py-16 sm:py-24 bg-gray-900 text-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4">
          Turn pricing from guesswork into a system.
        </h2>
        <p class="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Configure your shop once and generate fast, accurate, and profitable quotes every time.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/auth/signup" class="inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/50">
            Create your first shop
          </NuxtLink>
          <NuxtLink to="/gallery" class="inline-flex items-center justify-center rounded-xl bg-white/10 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-colors backdrop-blur-sm">
            Back to Gallery
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { DemoFormState } from '~/shared/demoPricing'

definePageMeta({
  layout: 'default',
})

const demoForm = ref<Partial<DemoFormState>>({})
const simulatorRef = ref<InstanceType<typeof import('~/components/landing/LandingQuoteSimulator.vue').default> | null>(null)
</script>
