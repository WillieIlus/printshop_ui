<template>
  <div class="py-8 sm:py-12">
    <div class="max-w-3xl">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        Privacy Policy
      </h1>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Last updated: <ClientOnly>{{ new Date().toLocaleDateString() }}<template #fallback>—</template></ClientOnly>
      </p>
      <div class="mt-8 prose prose-gray dark:prose-invert max-w-none">
        <p class="text-gray-600 dark:text-gray-400">
          Printy respects your privacy. This policy describes how we collect, use, and protect your information.
        </p>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-2">1. Information We Collect</h2>
        <p class="text-gray-600 dark:text-gray-400">
          We collect information you provide when creating an account, such as your name, email address, and business details. We also collect usage data to improve our service.
        </p>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-2">2. How We Use Your Information</h2>
        <p class="text-gray-600 dark:text-gray-400">
          We use your information to provide and improve our quoting and pricing services, to communicate with you, and to ensure the security of our platform.
        </p>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-2">3. Data Security</h2>
        <p class="text-gray-600 dark:text-gray-400">
          We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, or destruction.
        </p>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-2">4. Contact</h2>
        <p class="text-gray-600 dark:text-gray-400">
          For questions about this Privacy Policy, please contact us through the support channels listed on our website.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>
