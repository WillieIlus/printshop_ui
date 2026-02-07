<template>
  <VeeField v-slot="{ field, errors }" :name="name" :label="label">
    <UFormField :label="label" :error="errors[0]" :required="required">
      <UInput
        v-bind="field"
        type="date"
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
  disabled?: boolean
  required?: boolean
}>()
</script>
