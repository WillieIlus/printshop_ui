<template>
  <NuxtLayout name="auth" title="Sign in to your account" subtitle="Welcome back! Please enter your details.">
    <AuthLoginForm />
    <template #footer>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?
        <NuxtLink to="/auth/signup" class="text-primary-600 hover:underline font-medium dark:text-primary-400">
          Sign up
        </NuxtLink>
      </p>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">

import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
definePageMeta({
  layout: false,
  middleware: 'guest',
})
</script>