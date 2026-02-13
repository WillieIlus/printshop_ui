<template>
  <VeeField v-slot="{ field, errors }" :name="name" :label="label">
    <UFormField :label="hideLabel ? undefined : label" :required="required">
      <UInput
        v-bind="field"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :color="errors.length ? 'error' : undefined"
        :leading-icon="icon"
        :ui="{
          base: 'bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md',
          leading: { pointer: 'pointer-events-none' },
          input: icon ? 'pl-10' : ''
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
  type?: string
  placeholder?: string
  icon?: string
  disabled?: boolean
  required?: boolean
  hideLabel?: boolean
}>()
</script>

<style scoped>
:deep(.uinput) {
  background-color: #f3f4f6;
}

:deep(input) {
  padding-left: 2.5rem;
  background-color: transparent;
}

:deep([class*="leading"]) {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  pointer-events: none;
}
</style>