<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Claims</h1>
      <p class="text-gray-600 dark:text-gray-400">Manage shop ownership claims</p>
    </div>
    <CommonLoadingSpinner v-if="claimStore.loading" />
    <div v-else-if="claimStore.claims.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ClaimsClaimCard v-for="c in claimStore.claims" :key="c.id" :claim="c">
        <template #actions>
          <UButton :to="`/dashboard/claims/${c.id}`" variant="outline" size="sm">View</UButton>
        </template>
      </ClaimsClaimCard>
    </div>
    <UCard v-else class="text-center py-12">
      <UIcon name="i-lucide-shield-check" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
      <p class="text-gray-600 dark:text-gray-400">No claims yet.</p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useClaimStore } from '~/stores/claim'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const claimStore = useClaimStore()
onMounted(() => claimStore.fetchClaims())
</script>
