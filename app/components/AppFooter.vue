<!-- AppFooter.vue — Site footer with flamingo branding -->
<template>
  <footer class="border-t border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 py-12 text-gray-600 dark:text-gray-400 sm:py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
        <!-- Brand -->
        <div class="col-span-2 md:col-span-1">
          <div class="mb-4 flex items-center gap-2">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-flamingo-500 to-flamingo-700">
              <UIcon name="i-lucide-printer" class="h-6 w-6 text-white" />
            </div>
            <span class="text-xl font-bold text-gray-900 dark:text-white">Printy</span>
          </div>
          <p class="text-sm leading-relaxed">
            The intelligent quoting and pricing engine for modern print shops. Not a marketplace — a pricing brain.
          </p>
        </div>

        <!-- Product -->
        <div>
          <h4 class="mb-4 font-semibold text-gray-900 dark:text-white">Product</h4>
          <ul class="space-y-3 text-sm">
            <li><NuxtLink to="/dashboard" class="transition-colors hover:text-gray-900 dark:hover:text-white">Dashboard</NuxtLink></li>
            <li><NuxtLink to="/shops" class="transition-colors hover:text-gray-900 dark:hover:text-white">Shops</NuxtLink></li>
            <li><NuxtLink to="/gallery" class="transition-colors hover:text-gray-900 dark:hover:text-white">Templates</NuxtLink></li>
            <li><NuxtLink to="/dashboard/quotes" class="transition-colors hover:text-gray-900 dark:hover:text-white">Quotes</NuxtLink></li>
          </ul>
        </div>

        <!-- Company -->
        <div>
          <h4 class="mb-4 font-semibold text-gray-900 dark:text-white">Company</h4>
          <ul class="space-y-3 text-sm">
            <li><NuxtLink to="/about" class="transition-colors hover:text-gray-900 dark:hover:text-white">About</NuxtLink></li>
            <li><NuxtLink to="/about#mock-templates" class="transition-colors hover:text-gray-900 dark:hover:text-white">Mock Templates</NuxtLink></li>
            <li><a href="#" class="transition-colors hover:text-gray-900 dark:hover:text-white">Blog</a></li>
            <li><a href="#" class="transition-colors hover:text-gray-900 dark:hover:text-white">Careers</a></li>
            <li><a href="#" class="transition-colors hover:text-gray-900 dark:hover:text-white">Contact</a></li>
          </ul>
        </div>

        <!-- Legal & Support -->
        <div>
          <h4 class="mb-4 font-semibold text-gray-900 dark:text-white">Legal</h4>
          <ul class="space-y-3 text-sm">
            <li><NuxtLink to="/terms" class="transition-colors hover:text-gray-900 dark:hover:text-white">Terms & Conditions</NuxtLink></li>
            <li><NuxtLink to="/privacy" class="transition-colors hover:text-gray-900 dark:hover:text-white">Privacy Policy</NuxtLink></li>
            <li><a href="#" class="transition-colors hover:text-gray-900 dark:hover:text-white">Help Center</a></li>
            <li><a href="#" class="transition-colors hover:text-gray-900 dark:hover:text-white">FAQ</a></li>
          </ul>
        </div>
      </div>

      <div class="flex flex-col items-center justify-between gap-4 border-t border-gray-200 dark:border-gray-800 pt-8 sm:flex-row">
        <p class="text-sm">© <ClientOnly>{{ new Date().getFullYear() }}<template #fallback>2025</template></ClientOnly> <span class="font-semibold text-gray-900 dark:text-white">Printy</span>. All rights reserved.</p>
        <div class="flex items-center gap-6 text-sm">
          <NuxtLink to="/privacy" class="transition-colors hover:text-gray-900 dark:hover:text-white">Privacy Policy</NuxtLink>
          <NuxtLink to="/terms" class="transition-colors hover:text-gray-900 dark:hover:text-white">Terms & Conditions</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
