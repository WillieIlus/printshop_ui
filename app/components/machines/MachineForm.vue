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
  /** If false, hide printing types (Digital, Large Format, Offset) */
  canAddPrinting?: boolean
  /** If false, hide Finishing Equipment */
  canAddFinishing?: boolean
}>()

defineEmits<{
  submit: [data: { name: string; machine_type: string }]
  cancel: []
}>()

const PRINTING_TYPES = [
  { label: 'Digital Printer', value: 'DIGITAL' },
  { label: 'Large Format', value: 'LARGE_FORMAT' },
  { label: 'Offset Press', value: 'OFFSET' },
]
const FINISHING_TYPE = { label: 'Finishing Equipment', value: 'FINISHING' }

const customTypes = ref<{ label: string; value: string }[]>([])

const typeOptions = computed(() => {
  const canPrint = props.canAddPrinting !== false
  const canFinish = props.canAddFinishing !== false
  const base = canPrint ? [...PRINTING_TYPES] : []
  if (canFinish) base.push(FINISHING_TYPE)
  const allowed = base.length ? base : [...PRINTING_TYPES, FINISHING_TYPE]
  return [...allowed, ...customTypes.value]
})

function formatCreateValue(raw: string): string {
  const label = raw.trim()
  if (!label) return ''
  return label.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '')
}

function onCreateType(value: string) {
  const val = formatCreateValue(value)
  if (!val || customTypes.value.some((o) => o.value === val)) return
  customTypes.value = [...customTypes.value, { label: value.trim(), value: val }]
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
