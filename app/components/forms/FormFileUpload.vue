<template>
  <VeeField v-slot="{ field, handleChange }" :name="name" :label="label">
    <UFormField :label="label" :required="required">
      <UInput
        type="file"
        :accept="accept"
        :disabled="disabled"
        @change="(e: Event) => handleChange((e.target as HTMLInputElement)?.files?.[0])"
      />
    </UFormField>
  </VeeField>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  label: string
  accept?: string
  disabled?: boolean
  required?: boolean
}>()
</script>
