<template>
  <VeeForm v-slot="{ meta }" :validation-schema="loginSchema" @submit="onSubmit">
    <div class="space-y-4">
      <FormsFormInput
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        icon="i-lucide-mail"
      />
      <FormsFormInput
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        icon="i-lucide-lock"
      />
      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2">
          <UCheckbox v-model="rememberMe" />
          <span class="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
        </label>
        <NuxtLink to="/auth/forgot-password" class="text-sm text-primary-600 hover:underline dark:text-primary-400">
          Forgot password?
        </NuxtLink>
      </div>
      <UButton type="submit" color="primary" block :loading="loading" :disabled="!meta.valid">
        Sign In
      </UButton>
      <p class="text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?
        <NuxtLink to="/auth/signup" class="text-primary-600 hover:underline font-medium dark:text-primary-400">Sign up</NuxtLink>
      </p>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, string } from 'yup'

const { login, loading } = useAuth()
const notification = useNotification()
const rememberMe = ref(false)

const loginSchema = object({
  email: string().email('Invalid email').required('Email is required'),
  password: string().min(8, 'Password must be at least 8 characters').required('Password is required'),
})

async function onSubmit(values: { email: string; password: string }) {
  const result = await login(values.email, values.password)
  if (!result.success) {
    notification.error(result.error || 'Login failed')
  }
}
</script>
