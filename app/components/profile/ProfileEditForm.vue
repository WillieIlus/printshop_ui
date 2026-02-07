<template>
  <VeeForm v-slot="{ meta }" :validation-schema="schema" :initial-values="initialValues" @submit="onSubmit">
    <div class="space-y-4">
      <FormsFormInput name="phone" label="Phone" placeholder="+1 555 000 0000" />
      <FormsFormTextarea name="bio" label="Bio" placeholder="Short bio..." :rows="3" />
      <FormsFormInput name="address" label="Address" placeholder="Street address" />
      <div class="grid grid-cols-2 gap-4">
        <FormsFormInput name="city" label="City" placeholder="City" />
        <FormsFormInput name="state" label="State" placeholder="State" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <FormsFormInput name="country" label="Country" placeholder="Country" />
        <FormsFormInput name="postal_code" label="Postal code" placeholder="12345" />
      </div>
      <div class="flex justify-end gap-2">
        <UButton variant="outline" @click="$emit('cancel')">Cancel</UButton>
        <UButton type="submit" color="primary" :loading="loading" :disabled="!meta.valid">Save</UButton>
      </div>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import type { Profile } from '~/shared/types'

const props = defineProps<{ profile: Profile | null; loading?: boolean }>()
const emit = defineEmits<{ submit: [data: Partial<Profile>]; cancel: [] }>()

const schema = object({
  phone: string(),
  bio: string(),
  address: string(),
  city: string(),
  state: string(),
  country: string(),
  postal_code: string(),
})
const initialValues = computed(() => ({
  phone: props.profile?.phone ?? '',
  bio: props.profile?.bio ?? '',
  address: props.profile?.address ?? '',
  city: props.profile?.city ?? '',
  state: props.profile?.state ?? '',
  country: props.profile?.country ?? '',
  postal_code: props.profile?.postal_code ?? '',
}))
function onSubmit(values: Partial<Profile>) {
  emit('submit', values)
}
</script>
