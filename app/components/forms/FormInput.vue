<template>
  <VeeField v-slot="{ field, errors }" :name="name" :label="label">
    <UFormField :label="label" :error="errors[0]" :required="required">
      <UInput
        v-bind="field"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :color="errors.length ? 'error' : undefined"
      >
        <template v-if="icon" #leading>
          <UIcon :name="icon" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </template>
      </UInput>
    </UFormField>
  </VeeField>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  label: string
  type?: string
  placeholder?: string
  icon?: string
  disabled?: boolean
  required?: boolean
}>()
</script>
