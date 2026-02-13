<template>
  <VeeField v-slot="{ field, errors }" :name="name" :label="label">
    <UFormField :label="label" :required="required">
      <UInput
        v-bind="field"
        type="date"
        :disabled="disabled"
        :color="errors.length ? 'error' : undefined"
        :ui="{
          base: 'bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md'
        }"
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
  disabled?: boolean
  required?: boolean
}>()
</script>

<style scoped>
:deep(input[type="date"]) {
  background-color: transparent;
}
</style>