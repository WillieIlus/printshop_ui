<template>
  <VeeForm v-slot="{ meta }" :validation-schema="schema" :initial-values="initialValues" @submit="onSubmit">
    <table class="w-full text-sm">
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top w-40">Service Name</td>
          <td class="py-3">
            <FormsFormInput
              name="name"
              label="Service Name"
              placeholder="e.g. Matt Lamination A3"
              required
              hide-label
            />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top">Category</td>
          <td class="py-3">
            <FormsFormSelect
              name="category"
              label="Category"
              :options="categoryOptions"
              placeholder="Select category"
              required
              hide-label
            />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top">Charge By</td>
          <td class="py-3">
            <FormsFormSelect
              name="charge_by"
              label="Charge By"
              :options="chargeByOptions"
              placeholder="Select"
              required
              hide-label
            />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top">Buying Price (optional)</td>
          <td class="py-3">
            <FormsFormInput
              name="buying_price"
              label="Buying Price (optional)"
              type="number"
              placeholder="0.00"
              hide-label
            />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top">Selling Price</td>
          <td class="py-3">
            <FormsFormInput
              name="selling_price"
              label="Selling Price"
              type="number"
              placeholder="0.00"
              required
              hide-label
            />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top">Default</td>
          <td class="py-3">
            <label class="flex items-center gap-2">
              <UCheckbox v-model="isDefault" />
              <span class="text-sm text-gray-700 dark:text-gray-300">Default selection for customers</span>
            </label>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
      <UButton variant="outline" @click="$emit('cancel')">Cancel</UButton>
      <UButton type="submit" color="primary" :loading="loading" :disabled="!meta.valid">
        {{ editing ? 'Update' : 'Add' }}
      </UButton>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import type { FinishingService, FinishingServiceForm } from '~/shared/types'

const props = defineProps<{
  service?: FinishingService | null
  loading?: boolean
}>()
const emit = defineEmits<{ submit: [data: FinishingServiceForm]; cancel: [] }>()

const editing = computed(() => !!props.service)
const isDefault = ref(props.service?.is_default ?? false)

const categoryOptions = [
  { label: 'Lamination', value: 'LAMINATION' },
  { label: 'Binding', value: 'BINDING' },
  { label: 'Cutting', value: 'CUTTING' },
  { label: 'Folding', value: 'FOLDING' },
  { label: 'Other', value: 'OTHER' },
]
const chargeByOptions = [
  { label: 'Per Sheet', value: 'PER_SHEET' },
  { label: 'Per Piece/Item', value: 'PER_PIECE' },
  { label: 'Per Job (Flat Fee)', value: 'PER_JOB' },
]

const initialValues = computed(() => ({
  name: props.service?.name ?? '',
  category: props.service?.category ?? 'OTHER',
  charge_by: props.service?.charge_by ?? 'PER_SHEET',
  buying_price: props.service?.buying_price ?? '',
  selling_price: props.service?.selling_price ?? '',
}))

const schema = object({
  name: string().required('Name is required'),
  category: string().oneOf(['LAMINATION', 'BINDING', 'CUTTING', 'FOLDING', 'OTHER']).required('Category is required'),
  charge_by: string().oneOf(['PER_SHEET', 'PER_PIECE', 'PER_JOB']).required('Charge by is required'),
  buying_price: string().optional(),
  selling_price: string().required('Selling price is required'),
})

function onSubmit(values: Record<string, unknown>) {
  emit('submit', { ...values, is_default: isDefault.value } as FinishingServiceForm)
}
</script>
