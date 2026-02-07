<template>
  <footer class="bg-slate-900 dark:bg-slate-950 border-t border-slate-800 pt-10 pb-10 mt-auto">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div class="flex items-center gap-2">
        <span class="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-white">
          <UIcon name="i-lucide-printer" class="w-5 h-5" />
        </span>
        <span class="text-slate-400 text-sm">© {{ new Date().getFullYear() }} PrintShop. All rights reserved.</span>
      </div>
      <div class="flex gap-6 text-sm text-slate-400">
        <NuxtLink to="/" class="hover:text-white transition-colors">Home</NuxtLink>
        <a href="#" class="hover:text-white transition-colors">Privacy</a>
        <a href="#" class="hover:text-white transition-colors">Terms</a>
        <a href="#" class="hover:text-white transition-colors">Support</a>
      </div>
    </div>
  </footer>
</template>
