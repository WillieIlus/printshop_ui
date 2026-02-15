<template>
  <Teleport to="#modal-portal">
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      :aria-describedby="description ? descriptionId : undefined"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/50"
        aria-hidden="true"
        @click="close"
      />
      <!-- Modal panel -->
      <div
        class="relative rounded-xl shadow-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 max-w-lg w-full max-h-[calc(100dvh-2rem)] overflow-hidden flex flex-col"
        role="document"
      >
        <div class="flex items-center justify-between p-4 sm:px-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div>
            <h2 :id="titleId" class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </h2>
            <p v-if="description" :id="descriptionId" class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              {{ description }}
            </p>
          </div>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close"
            @click="close"
          />
        </div>
        <div class="p-4 sm:p-6 overflow-y-auto flex-1">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean
  title: string
  description?: string
}>()

const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const instanceId = Math.random().toString(36).slice(2)
const titleId = `modal-title-${instanceId}`
const descriptionId = `modal-desc-${instanceId}`

function close() {
  emit('update:open', false)
}

// Close on Escape
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>
