<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <ProductsProductTemplateCard v-for="p in products" :key="p.id" :product="p">
      <template #actions>
        <slot name="card-actions" :product="p" />
      </template>
    </ProductsProductTemplateCard>
  </div>
</template>

<script setup lang="ts">
import type { ProductTemplate } from '~/shared/types'
defineProps<{ products?: ProductTemplate[] }>()
</script>
