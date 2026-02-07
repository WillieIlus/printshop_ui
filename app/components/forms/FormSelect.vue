<template>
  <VeeField v-slot="{ field, errors }" :name="name" :label="label">
    <UFormField :label="label" :error="errors[0]" :required="required">
      <USelect
        v-bind="field"
        :options="options"
        :placeholder="placeholder"
        :disabled="disabled"
        :color="errors.length ? 'error' : undefined"
      />
    </UFormField>
  </VeeField>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  label: string
  options: Array<{ label: string; value: string | number }>
  placeholder?: string
  disabled?: boolean
  required?: boolean
}>()
</script>
