<template>
  <UModal
    :open="modelValue"
    :title="title"
    :description="description || 'Form dialog'"
    scrollable
    portal="#modal-portal"
    @update:open="$emit('update:modelValue', $event)"
  >
    <template #content="{ close }">
      <UCard class="border-0 shadow-none">
        <template #header>
          <div class="pr-8">
            <h2
              id="dashboard-modal-title"
              class="text-lg font-semibold text-gray-900 dark:text-white"
            >
              {{ title }}
            </h2>
            <p
              v-if="description"
              id="dashboard-modal-description"
              class="mt-0.5 text-sm text-gray-500 dark:text-gray-400"
            >
              {{ description }}
            </p>
          </div>
        </template>
        <div class="space-y-4 p-4 sm:p-6 [&_input]:w-full [&_select]:w-full [&_textarea]:w-full">
          <slot :close="close" />
        </div>
        <template v-if="$slots.footer" #footer>
          <div class="flex flex-wrap justify-end gap-2 sm:gap-4 pt-4">
            <slot name="footer" :close="close" />
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title: string
  description?: string
}>()

defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
