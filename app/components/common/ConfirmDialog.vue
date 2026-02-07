<template>
  <UModal v-model="isOpen">
    <div class="p-4 sm:p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ title }}</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">{{ message }}</p>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="ghost" @click="isOpen = false">{{ cancelLabel }}</UButton>
        <UButton :color="confirmColor" @click="confirm">{{ confirmLabel }}</UButton>
      </div>
    </div>
  </UModal>
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
function confirm() {
  emit('confirm')
  isOpen.value = false
}
</script>
