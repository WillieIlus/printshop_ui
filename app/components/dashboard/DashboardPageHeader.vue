<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div class="min-w-0">
      <nav v-if="breadcrumbs?.length" class="mb-2 flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <template v-for="(crumb, i) in breadcrumbs" :key="i">
          <NuxtLink
            :to="crumb.to"
            class="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {{ crumb.label }}
          </NuxtLink>
          <span v-if="i < breadcrumbs.length - 1" class="text-muted">/</span>
        </template>
      </nav>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="mt-1 text-sm text-muted">
        {{ subtitle }}
      </p>
    </div>
    <div v-if="$slots.actions || $slots.filters" class="flex flex-wrap items-center gap-2 shrink-0">
      <slot name="filters" />
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  breadcrumbs?: Array<{ label: string; to: string }>
}>()
</script>
