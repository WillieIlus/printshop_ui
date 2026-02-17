<template>
  <CommonSimpleModal
    v-if="isOpen"
    :open="isOpen"
    :title="title"
    @update:open="emit('update:open', $event)"
  >
    <div class="space-y-6">
      <p class="text-sm text-gray-600 dark:text-gray-400">{{ message }}</p>
      <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <UButton
          color="neutral"
          variant="ghost"
          class="w-full sm:w-auto"
          @click="close"
        >
          {{ cancelLabel }}
        </UButton>
        <UButton
          :color="confirmColor"
          :variant="confirmColor === 'error' ? 'solid' : 'solid'"
          class="w-full sm:w-auto"
          @click="confirm"
        >
          {{ confirmLabel }}
        </UButton>
      </div>
    </div>
  </CommonSimpleModal>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open?: boolean
    title?: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
    confirmColor?: 'primary' | 'error' | 'success'
  }>(),
  {
    title: 'Confirm',
    message: 'Are you sure?',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    confirmColor: 'primary',
  }
)
const emit = defineEmits<{ 'update:open': [value: boolean]; confirm: [] }>()
const isOpen = computed({
  get: () => props.open ?? false,
  set: (v) => emit('update:open', v),
})
function close() {
  emit('update:open', false)
}
function confirm() {
  emit('confirm')
  close()
}
</script>
