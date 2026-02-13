<template>
  <VeeField v-slot="{ field, errors }" :name="name" :label="label">
    <UFormField :label="label" :required="required">
      <UTextarea
        v-bind="field"
        :placeholder="placeholder"
        :rows="rows"
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

<style scoped>
:deep(textarea) {
  background-color: transparent;
}
</style>