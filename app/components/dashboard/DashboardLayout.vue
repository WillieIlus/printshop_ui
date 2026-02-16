<template>
  <div class="dashboard-surface min-h-full">
    <div class="dashboard-container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <!-- Header slot: title, subtitle, actions, filters -->
      <div v-if="$slots.header" class="mb-6">
        <slot name="header" />
      </div>

      <!-- Content: 12-col grid, gap-4 or gap-6 -->
      <div
        class="dashboard-grid grid grid-cols-12 gap-4 sm:gap-6"
        :class="{ 'dashboard-grid--no-header': !$slots.header }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * DashboardLayout — Single source of truth for all dashboard pages.
 * Rule: A dashboard page must NEVER freestyle its own margins/paddings.
 *
 * Provides:
 * - Same max-width (max-w-7xl)
 * - Same page padding (py-6, px-4)
 * - Same background (subtle app surface)
 * - Same header pattern (via header slot)
 * - Same content grid (12-col, gap-4/gap-6)
 */
</script>
