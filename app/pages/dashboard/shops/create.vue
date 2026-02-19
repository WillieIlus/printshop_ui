<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

// Redirect to shops index with create modal
await navigateTo({ path: '/dashboard/shops', query: { create: '1' } }, { replace: true })
</script>
