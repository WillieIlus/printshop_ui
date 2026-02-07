<template>
  <VeeForm v-slot="{ meta }" :validation-schema="shopSchema" :initial-values="initialValues" @submit="onSubmit">
    <div class="space-y-6">
      <UCard>
        <template #header>
          <h3 class="font-semibold text-gray-900 dark:text-white">Basic Information</h3>
        </template>
        <div class="space-y-4">
          <FormsFormInput name="name" label="Shop Name" placeholder="Enter shop name" required />
          <FormsFormTextarea name="description" label="Description" placeholder="Describe your business..." />
          <div class="grid md:grid-cols-2 gap-4">
            <FormsFormInput name="email" label="Email" type="email" placeholder="shop@example.com" />
            <FormsFormInput name="phone" label="Phone" placeholder="+1 (555) 000-0000" />
          </div>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <h3 class="font-semibold text-gray-900 dark:text-white">Location</h3>
        </template>
        <div class="space-y-4">
          <FormsFormInput name="address" label="Address" placeholder="Street address" required />
          <div class="grid md:grid-cols-2 gap-4">
            <FormsFormInput name="city" label="City" placeholder="City" required />
            <FormsFormInput name="state" label="State/Province" placeholder="State" required />
          </div>
          <div class="grid md:grid-cols-2 gap-4">
            <FormsFormInput name="country" label="Country" placeholder="Country" required />
            <FormsFormInput name="postal_code" label="Postal Code" placeholder="12345" required />
          </div>
        </div>
      </UCard>
      <div class="flex justify-end gap-4">
        <UButton variant="outline" @click="$emit('cancel')">Cancel</UButton>
        <UButton type="submit" color="primary" :loading="loading" :disabled="!meta.valid">
          {{ isEdit ? 'Update Shop' : 'Create Shop' }}
        </UButton>
      </div>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import type { Shop, ShopCreateInput } from '~/shared/types'

const props = defineProps<{ shop?: Shop; loading?: boolean }>()
const emit = defineEmits<{ submit: [data: ShopCreateInput]; cancel: [] }>()

const isEdit = computed(() => !!props.shop)
const initialValues = computed(() => ({
  name: props.shop?.name ?? '',
  description: props.shop?.description ?? '',
  email: props.shop?.email ?? '',
  phone: props.shop?.phone ?? '',
  address: props.shop?.address ?? '',
  city: props.shop?.city ?? '',
  state: props.shop?.state ?? '',
  country: props.shop?.country ?? '',
  postal_code: props.shop?.postal_code ?? '',
}))
const shopSchema = object({
  name: string().required('Shop name is required'),
  description: string(),
  email: string().email('Invalid email'),
  phone: string(),
  address: string().required('Address is required'),
  city: string().required('City is required'),
  state: string().required('State is required'),
  country: string().required('Country is required'),
  postal_code: string().required('Postal code is required'),
})
function onSubmit(values: ShopCreateInput) {
  emit('submit', values)
}
</script>
