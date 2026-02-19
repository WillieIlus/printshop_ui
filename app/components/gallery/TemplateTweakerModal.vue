<template>
  <CommonSimpleModal
    :open="open"
    :title="template?.title ?? 'Configure Template'"
    description="Adjust options to see how pricing changes in real-time"
    @update:open="$emit('update:open', $event)"
  >
    <div v-if="template" class="space-y-4">
      <!-- Size & Quantity -->
      <div class="space-y-3">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Size & Quantity</h4>
        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Size</label>
            <select
              v-model="selectedSize"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20"
            >
              <option v-for="s in sizes" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Quantity</label>
            <UInput
              v-model.number="quantity"
              type="number"
              min="1"
              placeholder="1000"
            />
          </div>
        </div>
      </div>

      <!-- Sides & Paper -->
      <div class="space-y-3">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Options</h4>
        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Sides</label>
            <div class="flex gap-2">
              <UButton
                v-for="side in [1, 2]"
                :key="side"
                :variant="sides === side ? 'solid' : 'outline'"
                :color="sides === side ? 'primary' : 'neutral'"
                size="sm"
                @click="sides = side"
              >
                {{ side === 1 ? 'Single' : 'Double' }}
              </UButton>
            </div>
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Paper</label>
            <select
              v-model="selectedPaper"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20"
            >
              <option v-for="p in papers" :key="p.value" :value="p.value">{{ p.label }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Live Price -->
      <div class="rounded-xl bg-gray-900 dark:bg-gray-800 px-4 py-3 text-white">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">Estimated total</span>
          <span class="text-lg font-bold">{{ formatKES(subtotal) }}</span>
        </div>
        <p class="mt-1 text-xs text-gray-400">
          {{ formatKES(perUnit) }} per piece (approx.)
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 pt-2">
        <UButton
          color="primary"
          block
          @click="onAddToQuote"
        >
          Add to Quote
        </UButton>
        <UButton
          variant="outline"
          @click="$emit('update:open', false)"
        >
          Close
        </UButton>
      </div>
    </div>
  </CommonSimpleModal>
</template>

<script setup lang="ts">
import type { CatalogTemplate } from '~/shared/types'
import { formatKES } from '~/utils/formatters'

const props = defineProps<{
  open: boolean
  template: CatalogTemplate | null
}>()

defineEmits<{ 'update:open': [value: boolean] }>()

const selectedSize = ref('A5')
const quantity = ref(1000)
const sides = ref(2)
const selectedPaper = ref('gloss150')

const sizes = [
  { value: 'A5', label: 'A5 (148 × 210 mm)' },
  { value: 'A4', label: 'A4 (210 × 297 mm)' },
  { value: 'A3', label: 'A3 (297 × 420 mm)' },
  { value: 'SRA3', label: 'SRA3 (320 × 450 mm)' },
]

const papers = [
  { value: 'bond80', label: '80gsm Bond' },
  { value: 'gloss150', label: '150gsm Gloss' },
  { value: 'art350', label: '350gsm Art Card' },
]

const piecesPerSheet: Record<string, number> = { A5: 4, A4: 2, A3: 1, SRA3: 1 }
const printPrices: Record<string, number> = { A5: 45, A4: 25, A3: 40, SRA3: 45 }
const paperCosts: Record<string, number> = { bond80: 3.5, gloss150: 8, art350: 12 }

const sheetsNeeded = computed(() =>
  Math.ceil(quantity.value / (piecesPerSheet[selectedSize.value] ?? 4))
)
const paperCost = computed(() => paperCosts[selectedPaper.value] ?? 8)
const printPricePerSide = computed(() => printPrices[selectedSize.value] ?? 45)
const materialTotal = computed(() => sheetsNeeded.value * paperCost.value)
const printingTotal = computed(() => sheetsNeeded.value * sides.value * printPricePerSide.value)
const subtotal = computed(() => materialTotal.value + printingTotal.value)
const perUnit = computed(() =>
  quantity.value > 0 ? subtotal.value / quantity.value : 0
)

function onAddToQuote() {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    navigateTo('/auth/login')
    return
  }
  // TODO: integrate with quote flow
  navigateTo('/dashboard')
}
</script>
