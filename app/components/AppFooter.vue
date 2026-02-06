<template>
  <footer class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mt-auto">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center gap-2">
          <span class="grid h-8 w-8 place-items-center rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900">
            <UIcon name="i-lucide-printer" class="w-5 h-5" />
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            © {{ new Date().getFullYear() }} PrintShop. All rights reserved.
          </span>
        </div>
        <div class="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
          <NuxtLink to="/" class="hover:text-gray-900 dark:hover:text-white transition-colors">Home</NuxtLink>
          <a href="#" class="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
          <a href="#" class="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
          <a href="#" class="hover:text-gray-900 dark:hover:text-white transition-colors">Support</a>
        </div>
      </div>
    </div>
  </footer>
</template>
