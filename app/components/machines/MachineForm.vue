<template>
  <VeeForm
    v-slot="{ meta }"
    :validation-schema="schema"
    :initial-values="initialValues"
    @submit="$emit('submit', $event)"
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
        portal="body"
        :create-item="{ when: 'always' }"
        :format-create-value="formatCreateValue"
        @create="onCreateType"
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

const typeOptions = ref([
  { label: 'Digital Printer', value: 'DIGITAL' },
  { label: 'Large Format', value: 'LARGE_FORMAT' },
  { label: 'Offset Press', value: 'OFFSET' },
  { label: 'Finishing Equipment', value: 'FINISHING' },
])

function formatCreateValue(raw: string): string {
  const label = raw.trim()
  if (!label) return ''
  return label.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '')
}

function onCreateType(value: string) {
  const val = formatCreateValue(value)
  if (!val || typeOptions.value.some((o) => o.value === val)) return
  typeOptions.value = [...typeOptions.value, { label: value.trim(), value: val }]
}

const schema = object({
  name: string().required('Name is required').max(150),
  machine_type: string().default('DIGITAL'),
})

const initialValues = computed(() => ({
  name: props.machine?.name ?? '',
  machine_type: props.machine?.machine_type ?? props.machine?.type ?? 'DIGITAL',
}))
</script>
