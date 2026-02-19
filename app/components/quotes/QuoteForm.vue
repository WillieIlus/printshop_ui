<template>
  <VeeForm v-slot="{ meta }" :validation-schema="schema" :initial-values="initialValues" @submit="onSubmit">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6">
      <!-- Left column: Form sections -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Customer Details -->
        <section class="space-y-4">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Contact Details
          </h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <FormsFormInput name="customer_name" label="Customer name" placeholder="Name" required />
            <FormsFormInput name="customer_email" label="Email" type="email" placeholder="email@example.com" required />
            <FormsFormInput name="customer_phone" label="Phone" placeholder="+1 555 000 0000" class="sm:col-span-2" />
          </div>
        </section>

        <!-- Printing (when rate card available) -->
        <section v-if="slug && rateCard" class="space-y-4">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Printing
          </h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paper Size</label>
              <select
                v-model="sheetSize"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-flamingo-500 focus:ring-flamingo-500 dark:text-white"
              >
                <option value="A5">A5</option>
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="SRA3">SRA3</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity (sheets)</label>
              <input
                v-model.number="quantity"
                type="number"
                min="1"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-flamingo-500 focus:ring-flamingo-500 dark:text-white"
              >
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Print Sides</label>
              <div class="flex gap-4">
                <label class="flex items-center">
                  <input v-model="sides" type="radio" :value="1" class="text-flamingo-600 focus:ring-flamingo-500">
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Single-sided</span>
                </label>
                <label class="flex items-center">
                  <input v-model="sides" type="radio" :value="2" class="text-flamingo-600 focus:ring-flamingo-500">
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Double-sided</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        <!-- Paper (when rate card available) -->
        <section v-if="slug && rateCard" class="space-y-4">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Paper
          </h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paper Type</label>
              <select
                v-model="paperType"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-flamingo-500 focus:ring-flamingo-500 dark:text-white"
              >
                <option value="GLOSS">Gloss</option>
                <option value="MATTE">Matte</option>
                <option value="BOND">Bond</option>
                <option value="ART">Art Paper</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paper Weight (GSM)</label>
              <select
                v-model="gsm"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-flamingo-500 focus:ring-flamingo-500 dark:text-white"
              >
                <option v-for="g in availableGSM" :key="g" :value="g">{{ g }} gsm</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Finishing (when rate card has finishing) -->
        <section v-if="slug && rateCard?.finishing?.length" class="space-y-4">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Finishing
          </h3>
          <div class="space-y-2 max-h-40 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 p-3">
            <label
              v-for="service in rateCard.finishing"
              :key="service.id"
              class="flex items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            >
              <input
                v-model="selectedFinishing"
                type="checkbox"
                :value="service.id"
                class="text-flamingo-600 focus:ring-flamingo-500 rounded"
              >
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ service.name }}</span>
              <span class="ml-auto text-sm text-gray-500">{{ formatKES(service.price) }}/{{ (service.charge_by ?? '').replace('PER_', '').toLowerCase() }}</span>
            </label>
          </div>
        </section>

        <!-- Notes (Rich Text) -->
        <section class="space-y-4">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Notes
          </h3>
          <VeeField v-slot="{ field, errors }" name="notes">
            <FormsRichTextEditor
              :model-value="field.value ?? ''"
              placeholder="Describe your project, special requirements, delivery preferences..."
              :error="errors[0]"
              @update:model-value="field.onChange($event)"
            />
          </VeeField>
        </section>
      </div>

      <!-- Right column: Sticky Summary (desktop) -->
      <div class="lg:col-span-1">
        <div class="lg:sticky lg:top-24 space-y-4">
          <section class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-5">
            <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Summary
            </h3>
            <div v-if="pricingResult" class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatKES(pricingResult.grand_total) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <span class="text-gray-900 dark:text-white">Total</span>
                <span class="text-flamingo-600 dark:text-flamingo-400">{{ formatKES(pricingResult.grand_total) }}</span>
              </div>
            </div>
            <div v-else-if="slug && rateCard" class="flex items-center justify-center py-6 text-gray-500">
              <UIcon name="i-lucide-loader-2" class="w-6 h-6 animate-spin" />
            </div>
            <div v-else class="py-4 text-sm text-gray-500 dark:text-gray-400">
              Add job specs above for an estimate.
            </div>

            <div class="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <UButton type="submit" color="primary" :loading="loading" :disabled="!meta.valid" block>
                {{ submitLabel }}
              </UButton>
              <UButton variant="outline" block @click="$emit('cancel')">
                Cancel
              </UButton>
            </div>
          </section>
        </div>
      </div>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import type { Quote, RateCard, PriceCalculationInput, PriceCalculationResult } from '~/shared/types'
import { formatKES } from '~/utils/formatters'

const props = withDefaults(
  defineProps<{
    quote?: Quote | null
    loading?: boolean
    slug?: string
    rateCard?: RateCard | null
    submitLabel?: string
  }>(),
  { submitLabel: 'Submit Request' }
)

const emit = defineEmits<{ submit: [data: Partial<Quote> & Record<string, unknown>]; cancel: [] }>()

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

// Pricing form state (when rate card available)
const sheetSize = ref<'A5' | 'A4' | 'A3' | 'SRA3'>('A3')
const gsm = ref(150)
const quantity = ref(100)
const sides = ref<1 | 2>(1)
const paperType = ref<'GLOSS' | 'MATTE' | 'BOND' | 'ART'>('GLOSS')
const selectedFinishing = ref<number[]>([])

const availableGSM = computed(() => {
  if (!props.rateCard?.paper) return [80, 100, 130, 150, 170, 200, 250, 300]
  const gsms = [...new Set(props.rateCard.paper.map(p => p.gsm))]
  return gsms.sort((a, b) => a - b)
})

const pricingStore = usePricingStore()
const pricingResult = ref<PriceCalculationResult | null>(null)
let debounceTimer: ReturnType<typeof setTimeout>

async function calculatePrice() {
  if (!props.slug || !props.rateCard) return
  try {
    const input: PriceCalculationInput = {
      sheet_size: sheetSize.value,
      gsm: gsm.value,
      quantity: quantity.value,
      sides: sides.value,
      paper_type: paperType.value,
      finishing_ids: selectedFinishing.value,
    }
    pricingResult.value = await pricingStore.calculatePrice(props.slug, input)
  } catch {
    pricingResult.value = null
  }
}

watch([sheetSize, gsm, quantity, sides, paperType, selectedFinishing], () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(calculatePrice, 400)
}, { immediate: false })

watch([() => props.slug, () => props.rateCard], () => {
  if (props.slug && props.rateCard) {
    calculatePrice()
  } else {
    pricingResult.value = null
  }
}, { immediate: true })

function onSubmit(values: Partial<Quote>) {
  const payload: Partial<Quote> & Record<string, unknown> = {
    customer_name: values.customer_name ?? '',
    customer_email: values.customer_email ?? '',
    customer_phone: values.customer_phone || null,
    notes: values.notes || null,
  }
  if (props.slug && props.rateCard) {
    payload.sheet_size = sheetSize.value
    payload.gsm = gsm.value
    payload.quantity = quantity.value
    payload.sides = sides.value
    payload.paper_type = paperType.value
    payload.finishing_ids = selectedFinishing.value
  }
  emit('submit', payload)
}
</script>
