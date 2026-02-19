<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const slug = route.params.slug as string

// Redirect to shops index with edit modal
await navigateTo({ path: '/dashboard/shops', query: { edit: slug } }, { replace: true })
</script>
