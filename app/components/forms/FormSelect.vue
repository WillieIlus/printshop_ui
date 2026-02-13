<template>
  <VeeField v-slot="{ field, handleChange, errors }" :name="name" :label="label">
    <UFormField :label="label" :required="required">
      <UInput
        type="file"
        :accept="accept"
        :disabled="disabled"
        :color="errors.length ? 'error' : undefined"
        :ui="{
          base: 'bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md'
        }"
        @change="(e: Event) => handleChange((e.target as HTMLInputElement)?.files?.[0])"
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
  accept?: string
  disabled?: boolean
  required?: boolean
}>()
</script>

<style scoped>
:deep(input[type="file"]) {
  background-color: transparent;
}
</style>