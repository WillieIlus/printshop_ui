<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { RateCard, PriceCalculationInput, PriceCalculationResult } from '~/shared/types'

interface Props {
  slug: string
  rateCard?: RateCard
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'calculated', result: PriceCalculationResult): void
}>()

const pricingStore = usePricingStore()

// Form state
const sheetSize = ref<'A5' | 'A4' | 'A3' | 'SRA3'>('A3')
const gsm = ref(150)
const quantity = ref(100)
const sides = ref<1 | 2>(1)
const paperType = ref<'GLOSS' | 'MATTE' | 'BOND' | 'ART'>('GLOSS')
const selectedFinishing = ref<number[]>([])

// Available GSM options from rate card
const availableGSM = computed(() => {
  if (!props.rateCard?.paper) return [80, 100, 130, 150, 170, 200, 250, 300]
  const gsms = [...new Set(props.rateCard.paper.map(p => p.gsm))]
  return gsms.sort((a, b) => a - b)
})

// Calculation result
const result = ref<PriceCalculationResult | null>(null)
const calculating = ref(false)
const error = ref<string | null>(null)

// Calculate price
const calculatePrice = async () => {
  calculating.value = true
  error.value = null
  
  try {
    const input: PriceCalculationInput = {
      sheet_size: sheetSize.value,
      gsm: gsm.value,
      quantity: quantity.value,
      sides: sides.value,
      paper_type: paperType.value,
      finishing_ids: selectedFinishing.value,
    }
    
    result.value = await pricingStore.calculatePrice(props.slug, input)
    emit('calculated', result.value)
  } catch (err: any) {
    error.value = err.message || 'Failed to calculate price'
  } finally {
    calculating.value = false
  }
}

// Auto-calculate on input change (debounced)
let debounceTimer: ReturnType<typeof setTimeout>
watch([sheetSize, gsm, quantity, sides, paperType, selectedFinishing], () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(calculatePrice, 500)
})

// Format price
const formatPrice = (price: string) => {
  const num = parseFloat(price)
  return `KES ${num.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Initial calculation
onMounted(() => {
  calculatePrice()
})
</script>

<template>
  <div class="price-calculator bg-white rounded-xl shadow-lg p-6">
    <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
      <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      Instant Price Calculator
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Left: Input Form -->
      <div class="space-y-4">
        <!-- Paper Size -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Paper Size</label>
          <select v-model="sheetSize" class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option value="A5">A5</option>
            <option value="A4">A4</option>
            <option value="A3">A3</option>
            <option value="SRA3">SRA3</option>
          </select>
        </div>

        <!-- Paper Weight (GSM) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Paper Weight (GSM)</label>
          <select v-model="gsm" class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option v-for="g in availableGSM" :key="g" :value="g">{{ g }} gsm</option>
          </select>
        </div>

        <!-- Paper Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Paper Type</label>
          <select v-model="paperType" class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option value="GLOSS">Gloss</option>
            <option value="MATTE">Matte</option>
            <option value="BOND">Bond</option>
            <option value="ART">Art Paper</option>
          </select>
        </div>

        <!-- Quantity -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Quantity (sheets)</label>
          <input 
            v-model.number="quantity" 
            type="number" 
            min="1" 
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <!-- Sides -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Print Sides</label>
          <div class="flex gap-4">
            <label class="flex items-center">
              <input type="radio" v-model="sides" :value="1" class="text-blue-600 focus:ring-blue-500" />
              <span class="ml-2 text-sm text-gray-700">Single-sided</span>
            </label>
            <label class="flex items-center">
              <input type="radio" v-model="sides" :value="2" class="text-blue-600 focus:ring-blue-500" />
              <span class="ml-2 text-sm text-gray-700">Double-sided</span>
            </label>
          </div>
        </div>

        <!-- Finishing Options -->
        <div v-if="rateCard?.finishing?.length">
          <label class="block text-sm font-medium text-gray-700 mb-2">Finishing (optional)</label>
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <label 
              v-for="service in rateCard.finishing" 
              :key="service.id" 
              class="flex items-center p-2 rounded hover:bg-gray-50"
            >
              <input 
                type="checkbox" 
                v-model="selectedFinishing" 
                :value="service.id" 
                class="text-blue-600 focus:ring-blue-500 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">{{ service.name }}</span>
              <span class="ml-auto text-sm text-gray-500">{{ formatPrice(service.price) }}/{{ service.charge_by.replace('PER_', '').toLowerCase() }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Right: Results -->
      <div class="bg-gray-50 rounded-xl p-6">
        <h4 class="text-lg font-semibold text-gray-800 mb-4">Price Breakdown</h4>

        <div v-if="calculating" class="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>

        <div v-else-if="error" class="text-red-600 text-sm py-4">
          {{ error }}
        </div>

        <div v-else-if="result" class="space-y-3">
          <!-- Printing Cost -->
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Printing ({{ result.printing_price_per_side }}/side × {{ result.sides }} × {{ result.quantity }})</span>
            <span class="font-medium">{{ formatPrice(result.total_printing) }}</span>
          </div>

          <!-- Paper Cost -->
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Paper ({{ result.paper_price_per_sheet }}/sheet × {{ result.quantity }})</span>
            <span class="font-medium">{{ formatPrice(result.total_paper) }}</span>
          </div>

          <!-- Finishing Cost -->
          <div v-if="parseFloat(result.total_finishing) > 0" class="space-y-1">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Finishing</span>
              <span class="font-medium">{{ formatPrice(result.total_finishing) }}</span>
            </div>
            <div v-for="(item, index) in result.finishing_breakdown" :key="index" class="flex justify-between text-xs text-gray-500 pl-4">
              <span>- {{ item.name }}</span>
              <span>{{ formatPrice(item.total) }}</span>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-gray-300 my-4"></div>

          <!-- Grand Total -->
          <div class="flex justify-between text-lg">
            <span class="font-semibold text-gray-800">Total</span>
            <span class="font-bold text-blue-600">{{ formatPrice(result.grand_total) }}</span>
          </div>

          <!-- Price Per Sheet -->
          <div class="flex justify-between text-sm text-gray-500">
            <span>Price per sheet</span>
            <span>{{ formatPrice(result.price_per_sheet) }}</span>
          </div>
        </div>

        <!-- Request Quote Button -->
        <div class="mt-6">
          <NuxtLink 
            :to="`/shops/${slug}/request-quote`"
            class="w-full inline-flex justify-center items-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Request Quote
            <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.price-calculator {
  @apply border border-gray-200;
}
</style>
