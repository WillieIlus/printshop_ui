<template>
  <VeeField v-slot="{ field, handleChange, errors }" :name="name" :label="label">
    <UFormField :label="hideLabel ? undefined : label" :required="required">
      <USelectMenu
        v-bind="field"
        :options="options"
        :placeholder="placeholder"
        :disabled="disabled"
        value-attribute="value"
        :color="errors.length ? 'error' : undefined"
        class="w-full"
        @update:model-value="handleChange"
      />
      <div class="h-5 mt-1">
        <p v-if="errors.length" class="text-red-500 text-xs">
          {{ errors[0] }}
        </p>
      </div>
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
  hideLabel?: boolean
}>()
</script>
