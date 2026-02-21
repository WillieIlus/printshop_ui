<template>
  <div class="py-8 sm:py-12">
    <div class="max-w-3xl">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        Terms & Conditions
      </h1>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Last updated: <ClientOnly>{{ new Date().toLocaleDateString() }}<template #fallback>—</template></ClientOnly>
      </p>
      <div class="mt-8 prose prose-gray dark:prose-invert max-w-none">
        <p class="text-gray-600 dark:text-gray-400">
          Welcome to Printy. By accessing or using our service, you agree to be bound by these Terms & Conditions.
        </p>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-2">1. Acceptance of Terms</h2>
        <p class="text-gray-600 dark:text-gray-400">
          By creating an account or using Printy, you accept and agree to these terms. If you do not agree, please do not use our service.
        </p>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-2">2. Use of Service</h2>
        <p class="text-gray-600 dark:text-gray-400">
          Printy provides a quoting and pricing engine for print shops. You agree to use the service only for lawful purposes and in accordance with these terms.
        </p>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-2">3. Account Responsibilities</h2>
        <p class="text-gray-600 dark:text-gray-400">
          You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
        </p>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-2">4. Contact</h2>
        <p class="text-gray-600 dark:text-gray-400">
          For questions about these Terms & Conditions, please contact us through the support channels listed on our website.
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
