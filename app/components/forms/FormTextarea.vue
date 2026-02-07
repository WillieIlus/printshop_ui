<template>
  <VeeField v-slot="{ field, errors }" :name="name" :label="label">
    <UFormField :label="label" :error="errors[0]" :required="required">
      <UTextarea
        v-bind="field"
        :placeholder="placeholder"
        :rows="rows"
        :disabled="disabled"
        :color="errors.length ? 'error' : undefined"
      />
    </UFormField>
  </VeeField>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string
    label: string
    placeholder?: string
    rows?: number
    disabled?: boolean
    required?: boolean
  }>(),
  { rows: 4 }
)
</script>
