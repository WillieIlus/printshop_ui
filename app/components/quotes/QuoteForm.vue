<template>
  <VeeForm v-slot="{ meta }" :validation-schema="schema" :initial-values="initialValues" @submit="onSubmit">
    <div class="space-y-4">
      <FormsFormInput name="customer_name" label="Customer name" placeholder="Name" required />
      <FormsFormInput name="customer_email" label="Customer email" type="email" placeholder="email@example.com" required />
      <FormsFormInput name="customer_phone" label="Customer phone" placeholder="+1 555 000 0000" />
      <FormsFormRichText name="notes" label="Notes" placeholder="Notes..." />
      <div class="flex justify-end gap-2">
        <UButton variant="outline" @click="$emit('cancel')">Cancel</UButton>
        <UButton type="submit" color="primary" :loading="loading" :disabled="!meta.valid">Save</UButton>
      </div>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import type { Quote } from '~/shared/types'

const props = defineProps<{ quote?: Quote | null; loading?: boolean }>()
const emit = defineEmits<{ submit: [data: Partial<Quote>]; cancel: [] }>()

const schema = object({
  customer_name: string().required('Name is required'),
  customer_email: string().email('Invalid email').required('Email is required'),
  customer_phone: string(),
  notes: string(),
})
const initialValues = computed(() => ({
  customer_name: props.quote?.customer_name ?? '',
  customer_email: props.quote?.customer_email ?? '',
  customer_phone: props.quote?.customer_phone ?? '',
  notes: props.quote?.notes ?? '',
}))
function onSubmit(values: Partial<Quote>) {
  emit('submit', values)
}
</script>
