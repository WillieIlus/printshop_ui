<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePricingStore } from '~/stores/pricing'
import { useLocalQuotesStore } from '~/stores/localQuotes'
import { useNotification } from '~/composables/useNotification'
import { formatKES } from '~/utils/formatters'
import type { RateCard, PriceCalculationInput, PriceCalculationResult } from '~/shared/types'
import { usePricingStore } from '~/stores/pricing'

interface Props {
  slug: string
  rateCard?: RateCard
  shopName?: string
  shopPhone?: string
}

const props = withDefaults(defineProps<Props>(), { shopName: '', shopPhone: '' })
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
const overridePrice = ref<string | null>(null)
const saving = ref(false)
const savedQuoteId = ref<string | null>(null)

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
    if (result.value) emit('calculated', result.value)
  } catch (err: unknown) {
    error.value = (err instanceof Error ? err.message : null) || 'Failed to calculate price'
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


// Initial calculation
onMounted(() => {
  calculatePrice()
})

// Quote snapshot for Copy/WhatsApp
const quoteSnapshot = computed(() => {
  const price = overridePrice.value && overridePrice.value !== ''
    ? overridePrice.value
    : result.value?.grand_total ?? '0'
  const finishingNames = props.rateCard?.finishing
    ?.filter((f) => selectedFinishing.value.includes(f.id))
    .map((f) => f.name) ?? []
  return {
    shopName: props.shopName || 'Print Shop',
    shopPhone: props.shopPhone,
    sheetSize: sheetSize.value,
    gsm: gsm.value,
    paperType: paperType.value,
    quantity: quantity.value,
    sides: sides.value,
    finishingNames: finishingNames.length ? finishingNames : undefined,
    suggestedPrice: price,
    validityDays: 7,
  }
})

const localQuotesStore = useLocalQuotesStore()
const notification = useNotification()

async function handleSaveQuote() {
  if (!quoteSnapshot.value || !result.value) return
  saving.value = true
  try {
    const costRows = [
      { label: 'Paper', amount: result.value.total_paper, configured: parseFloat(result.value.total_paper) > 0 },
      { label: 'Printing', amount: result.value.total_printing, configured: parseFloat(result.value.total_printing) > 0 },
      { label: 'Finishing', amount: result.value.total_finishing, configured: parseFloat(result.value.total_finishing) > 0 },
    ]
    const quote = localQuotesStore.addQuote({
      shopSlug: props.slug,
      shopName: props.shopName || 'Print Shop',
      snapshot: quoteSnapshot.value,
      costBreakdown: costRows,
      suggestedPrice: overridePrice.value || result.value.grand_total,
      overridePrice: overridePrice.value,
      status: 'draft',
    })
    savedQuoteId.value = quote.id
    notification.success('Quote saved locally')
  } catch (err) {
    notification.error(err instanceof Error ? err.message : 'Failed to save')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">

    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
      <UIcon name="i-lucide-calculator" class="w-6 h-6 text-emerald-600" />
      Quote in under 60 seconds
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Left: Input Form (collapsible sections) -->
      <div class="space-y-3">
        <QuotesQuoteInputsSection title="Print Specs" :default-open="true">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paper Size</label>
              <select v-model="sheetSize" class="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white">
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
                class="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Print Sides</label>
              <div class="flex gap-4">
                <label class="flex items-center">
                  <input type="radio" v-model="sides" :value="1" class="text-emerald-600 focus:ring-emerald-500" />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Single-sided</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="sides" :value="2" class="text-emerald-600 focus:ring-emerald-500" />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Double-sided</span>
                </label>
              </div>
            </div>
          </div>
        </QuotesQuoteInputsSection>

        <QuotesQuoteInputsSection title="Materials" :default-open="true">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paper Type</label>
              <select v-model="paperType" class="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white">
                <option value="GLOSS">Gloss</option>
                <option value="MATTE">Matte</option>
                <option value="BOND">Bond</option>
                <option value="ART">Art Paper</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paper Weight (GSM)</label>
              <select v-model="gsm" class="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white">
                <option v-for="g in availableGSM" :key="g" :value="g">{{ g }} gsm</option>
              </select>
            </div>
          </div>
        </QuotesQuoteInputsSection>

        <QuotesQuoteInputsSection v-if="rateCard?.finishing?.length" title="Finishing & Delivery" :default-open="false">
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <label
              v-for="service in rateCard.finishing"
              :key="service.id"
              class="flex items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <input
                type="checkbox"
                v-model="selectedFinishing"
                :value="service.id"
                class="text-emerald-600 focus:ring-emerald-500 rounded"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ service.name }}</span>
              <span class="ml-auto text-sm text-gray-500">{{ formatKES(service.price) }}/{{ service.charge_by.replace('PER_', '').toLowerCase() }}</span>
            </label>
          </div>
        </QuotesQuoteInputsSection>
      </div>

      <!-- Right: Business Output Panel (sticky on desktop) -->
      <div class="lg:sticky lg:top-24 self-start">
        <div v-if="calculating" class="flex items-center justify-center py-12 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <CommonLoadingSpinner />
        </div>

        <div v-else-if="error" class="rounded-xl border-2 border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-5">
          <p class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
        </div>

        <QuotesQuoteOutputPanel
          v-else
          :pricing="result"
          :override-price="overridePrice"
          :show-override="true"
          @update:override-price="overridePrice = $event"
        >
          <template #actions>
            <QuotesQuoteActions
              :snapshot="quoteSnapshot"
              :show-save="true"
              :show-print="!!savedQuoteId"
              :print-url="savedQuoteId ? `/quote/print?id=${savedQuoteId}` : null"
              :saving="saving"
              @save="handleSaveQuote"
            />
            <NuxtLink
              :to="`/shops/${props.slug}/request-quote`"
              class="w-full inline-flex justify-center items-center gap-2 px-4 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors mt-2"
            >
              Request Quote
              <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
            </NuxtLink>
          </template>
        </QuotesQuoteOutputPanel>
      </div>
    </div>
  </div>
</template>

