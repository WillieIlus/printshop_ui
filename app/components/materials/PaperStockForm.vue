<template>
  <VeeForm
    v-slot="{ meta }"
    :validation-schema="schema"
    :initial-values="initialValues"
    @submit="$emit('submit', $event)"
  >
    <div class="space-y-4">
      <FormsFormSelect
        name="sheet_size"
        label="Sheet size"
        :options="sheetSizeOptions"
        placeholder="Select size"
        required
        portal="#modal-portal"
      />
      <FormsFormInput
        name="gsm"
        label="GSM (weight)"
        type="number"
        placeholder="e.g. 80, 130, 150, 200, 300"
        required
      />
      <FormsFormSelect
        name="paper_type"
        label="Paper type"
        :options="paperTypeOptions"
        placeholder="Select type"
        required
        portal="#modal-portal"
      />
      <FormsFormInput
        name="quantity_in_stock"
        label="Quantity in stock (sheets)"
        type="number"
        placeholder="0"
      />
      <FormsFormInput
        name="reorder_level"
        label="Reorder level"
        type="number"
        placeholder="100"
      />
      <FormsFormInput
        name="buying_price_per_sheet"
        label="Buying price per sheet (optional)"
        type="number"
        placeholder="0.00"
      />
      <div class="flex justify-end gap-2 pt-4">
        <UButton variant="outline" @click="$emit('cancel')">Cancel</UButton>
        <UButton
          type="submit"
          class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600"
          :loading="loading"
          :disabled="loading"
        >
          {{ stock ? 'Update' : 'Add' }} paper stock
        </UButton>
      </div>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import type { PaperStock } from '~/stores/paperStock'
import { object, number, string } from 'yup'

const props = defineProps<{
  stock: PaperStock | null
  loading?: boolean
}>()

defineEmits<{
  submit: [data: {
    sheet_size: string
    gsm: number
    paper_type: string
    quantity_in_stock?: number
    reorder_level?: number
    buying_price_per_sheet?: string
  }]
  cancel: []
}>()

const sheetSizeOptions = [
  { label: 'A5 (148 × 210 mm)', value: 'A5' },
  { label: 'A4 (210 × 297 mm)', value: 'A4' },
  { label: 'A3 (297 × 420 mm)', value: 'A3' },
  { label: 'SRA3 (320 × 450 mm)', value: 'SRA3' },
  { label: 'SRA4 (225 × 320 mm)', value: 'SRA4' },
]
const paperTypeOptions = [
  { label: 'Gloss', value: 'GLOSS' },
  { label: 'Matte', value: 'MATTE' },
  { label: 'Bond', value: 'BOND' },
  { label: 'Art Paper', value: 'ART' },
]

const schema = object({
  sheet_size: string().oneOf(['A5', 'A4', 'A3', 'SRA3', 'SRA4']).required('Size is required'),
  gsm: number().min(60, 'Min 60 GSM').max(500, 'Max 500 GSM').required('GSM is required'),
  paper_type: string().oneOf(['GLOSS', 'MATTE', 'BOND', 'ART']).required('Paper type is required'),
  quantity_in_stock: number().min(0).optional(),
  reorder_level: number().min(0).optional(),
  buying_price_per_sheet: string().optional(),
})

const initialValues = computed(() => ({
  sheet_size: props.stock?.sheet_size ?? 'SRA3',
  gsm: props.stock?.gsm ?? '',
  paper_type: props.stock?.paper_type ?? 'GLOSS',
  quantity_in_stock: props.stock?.quantity_in_stock ?? 0,
  reorder_level: props.stock?.reorder_level ?? 100,
  buying_price_per_sheet: props.stock?.buying_price_per_sheet ?? '',
}))
</script>
