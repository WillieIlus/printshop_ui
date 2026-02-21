<template>
  <div class="py-12 sm:py-16">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <!-- Page header -->
      <div class="mb-16">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          About Printy
        </h1>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          A pricing brain for print shops. Learn about the problem we solve and how our calculation engines work.
        </p>
      </div>

      <!-- Problem -->
      <section id="problem" class="mb-20 scroll-mt-24">
        <p class="text-sm font-bold uppercase tracking-wider text-primary-600">The Problem</p>
        <h2 class="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          Print pricing is often slow, inconsistent, and risky.
        </h2>
        <p class="mt-4 text-base text-gray-600 dark:text-gray-400">
          Most shops rely on mental math or spreadsheets. That makes quotes vary between staff and causes underpricing.
        </p>
        <div class="mt-8 grid gap-6 sm:grid-cols-3">
          <div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-6">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
              <UIcon name="i-lucide-clock" class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Slow quotes</h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Busy counters can't afford manual calculations for every walk-in customer.</p>
          </div>
          <div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-6">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-4">
              <UIcon name="i-lucide-trending-up" class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Inconsistent pricing</h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Same job, different staff member, different price. Customers lose trust.</p>
          </div>
          <div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-6">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-4">
              <UIcon name="i-lucide-file-warning" class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Underpricing risk</h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Finishing and material costs often get missed in rush estimates.</p>
          </div>
        </div>
      </section>

      <!-- How calculation works -->
      <section id="how-it-works" class="mb-20 scroll-mt-24">
        <p class="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Under the Hood</p>
        <h2 class="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          How the calculation works
        </h2>
        <p class="mt-4 text-base text-gray-600 dark:text-gray-400">
          Two engines drive the pricing: Digital is sheet-based, Large Format is area-based. Finishing attaches cleanly to both.
        </p>
        <div class="mt-8 grid gap-6 lg:grid-cols-2">
          <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 sm:p-8">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Digital Engine</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Per sheet & per side logic (SRA3 / SRA4)</p>
            <div class="rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700 font-mono text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p>material = sheets_needed × cost_per_sheet</p>
              <p>printing = sheets_needed × sides × click_cost</p>
              <p>total = material + printing + finishing</p>
            </div>
          </div>
          <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 sm:p-8">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Large Format</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Area-based logic (per m²)</p>
            <div class="rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700 font-mono text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p>area = width × height × quantity</p>
              <p>material = area × material_cost_per_m²</p>
              <p>total = material + printing + finishing</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-8 text-center">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Ready to get started?</h3>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Create your first shop and start quoting in seconds.</p>
        <div class="mt-6 flex flex-wrap gap-4 justify-center">
          <NuxtLink to="/auth/signup" class="inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white hover:bg-primary-500 transition-colors">
            Create your first shop
          </NuxtLink>
          <NuxtLink to="/gallery" class="inline-flex items-center justify-center rounded-xl border border-gray-300 dark:border-gray-600 px-6 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Browse Gallery
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>
