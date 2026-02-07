<template>
  <div class="flex items-center justify-center" :class="iconClass">
    <UIcon name="i-lucide-printer" :class="iconClass" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    iconClass?: string
  }>(),
  { iconClass: '' }
)
</script>
