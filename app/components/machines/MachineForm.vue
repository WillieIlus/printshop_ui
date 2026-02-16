<template>
  <VeeForm
    v-slot="{}"
    :validation-schema="schema"
    :initial-values="initialValues"
    @submit="(values: Record<string, unknown>) => $emit('submit', values as { name: string; machine_type: string })"
  >
    <div class="space-y-4">
      <FormsFormInput
        name="name"
        label="Machine name"
        placeholder="e.g. Xerox Versant 80"
        required
      />
      <FormsFormSelect
        name="machine_type"
        label="Type"
        :options="typeOptions"
        placeholder="Select type"
      />
      <div class="flex justify-end gap-2 pt-4">
        <UButton variant="outline" @click="$emit('cancel')">Cancel</UButton>
        <UButton
          type="submit"
          class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600"
          :loading="loading"
          :disabled="loading"
        >
          {{ machine ? 'Update' : 'Add' }} machine
        </UButton>
      </div>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import type { Machine } from '~/stores/machine'
import { object, string } from 'yup'

const props = defineProps<{
  machine: Machine | null
  loading?: boolean
}>()

defineEmits<{
  submit: [data: { name: string; machine_type: string }]
  cancel: []
}>()

const typeOptions = [
  { label: 'Digital Printer', value: 'DIGITAL' },
  { label: 'Large Format', value: 'LARGE_FORMAT' },
  { label: 'Offset Press', value: 'OFFSET' },
  { label: 'Finishing Equipment', value: 'FINISHING' },
]

const schema = object({
  name: string().required('Name is required').max(150),
  machine_type: string().default('DIGITAL'),
})

const initialValues = computed(() => ({
  name: props.machine?.name ?? '',
  machine_type: props.machine?.machine_type ?? props.machine?.type ?? 'DIGITAL',
}))
</script>
