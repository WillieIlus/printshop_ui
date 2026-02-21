<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'reka-ui'
import type { DemoTemplate } from '~/shared/demoTemplates'
import { demoRateCard } from '~/shared/demoRateCard'
import { computeDemoQuote, type DemoFormState } from '~/shared/demoPricing'
import { formatKES } from '~/utils/formatters'

const props = defineProps<{
  open: boolean
  template: DemoTemplate | null
}>()

const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const quantity = ref(100)
const gsm = ref(300)
const sides = ref<1 | 2>(2)
const finishingIds = ref<string[]>([])
const widthM = ref(1)
const heightM = ref(2)
const sqmMaterialKey = ref('Banner')

/** Paper options for digital templates by sheet size */
const paperOptionsBySheet = computed(() => {
  const sheet = props.template?.sheetSize ?? 'SRA3'
  return demoRateCard.paper
    .filter((p) => p.sheet_size === sheet)
    .map((p) => ({ gsm: p.gsm, key: p.key, label: p.label }))
})

/** Available finishing options from rate card */
const finishingOptions = computed(() => demoRateCard.finishing)

/** Current material key for form state */
const materialKey = computed(() => {
  const t = props.template
  if (!t) return 'gloss150_sra3'
  if (t.unit === 'SQM') return sqmMaterialKey.value
  const opts = paperOptionsBySheet.value
  const match = opts.find((o) => o.gsm === gsm.value) ?? opts[0]
  return match?.key ?? t.materialKey ?? 'gloss150_sra3'
})

/** Build form state for computeDemoQuote */
const formState = computed((): DemoFormState => {
  const t = props.template
  if (!t) {
    return {
      unit: 'A4',
      sheetSize: 'SRA3',
      piecesPerSheet: 10,
      sides: sides.value,
      quantity: quantity.value,
      materialKey: materialKey.value,
      finishingIds: finishingIds.value,
      widthM: widthM.value,
      heightM: heightM.value,
    }
  }
  return {
    unit: t.unit,
    sheetSize: t.sheetSize,
    piecesPerSheet: t.piecesPerSheet,
    sides: t.unit === 'SQM' ? t.defaultSides : sides.value,
    quantity: quantity.value,
    materialKey: materialKey.value,
    finishingIds: finishingIds.value,
    widthM: t.defaultWidthM ?? widthM.value,
    heightM: t.defaultHeightM ?? heightM.value,
  }
})

const quote = computed(() => computeDemoQuote(formState.value, demoRateCard))

/** Childish math: sheets_needed = ceil(quantity / ups_per_sheet) */
const impositionLine = computed(() => {
  const t = props.template
  if (!t || t.unit === 'SQM') return null
  const ups = t.piecesPerSheet
  const sheets = Math.ceil(quantity.value / ups)
  return `${quantity.value} ÷ ${ups} = ${sheets} sheets`
})

function toggleFinishing(id: string) {
  const idx = finishingIds.value.indexOf(id)
  if (idx >= 0) {
    finishingIds.value = finishingIds.value.filter((x) => x !== id)
  } else {
    finishingIds.value = [...finishingIds.value, id]
  }
}

watch(
  () => [props.open, props.template] as const,
  ([open, template]) => {
    if (!open) return
    if (template) {
      quantity.value = template.defaultQty
      const opts = demoRateCard.paper.filter((p) => p.sheet_size === template.sheetSize)
      const defaultPaper = template.materialKey
        ? opts.find((p) => p.key === template.materialKey)
        : opts[0]
      gsm.value = defaultPaper?.gsm ?? template.defaultGsm ?? 300
      sides.value = template.defaultSides
      finishingIds.value = [...template.defaultFinishings]
      widthM.value = template.defaultWidthM ?? 1
      heightM.value = template.defaultHeightM ?? 2
      sqmMaterialKey.value = template.materialKey ?? 'Banner'
    }
  },
  { immediate: true }
)
</script>

<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogPortal to="#modal-portal">
      <DialogOverlay
        class="fixed inset-0 z-[9999] bg-black/50 dark:bg-black/60"
        aria-hidden
        @click="emit('update:open', false)"
      />
      <DialogContent
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 focus:outline-none"
        aria-describedby="demo-tweaker-desc"
      >
        <div
          class="relative w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl overflow-hidden"
          role="document"
        >
          <div class="flex items-center justify-between p-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <DialogTitle class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ template?.name ?? 'Demo Calculator' }}
              </DialogTitle>
              <DialogDescription id="demo-tweaker-desc" class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                Demo pricing — local calculation only
              </DialogDescription>
            </div>
            <DialogClose as-child>
              <UButton icon="i-lucide-x" color="neutral" variant="ghost" aria-label="Close" />
            </DialogClose>
          </div>

          <div v-if="template" class="p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[calc(100dvh-12rem)]">
            <!-- Quantity -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
              <UInput v-model.number="quantity" type="number" :min="1" size="lg" class="w-full" />
            </div>

            <!-- Digital: GSM + Sides -->
            <template v-if="template.unit !== 'SQM'">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">GSM</label>
                <div class="flex flex-wrap gap-2">
                  <UButton
                    v-for="opt in paperOptionsBySheet"
                    :key="opt.key"
                    :variant="gsm === opt.gsm ? 'solid' : 'outline'"
                    :color="gsm === opt.gsm ? 'primary' : 'neutral'"
                    size="sm"
                    @click="gsm = opt.gsm"
                  >
                    {{ opt.label }}
                  </UButton>
                </div>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Sides</label>
                <div class="flex gap-2">
                  <UButton
                    :variant="sides === 1 ? 'solid' : 'outline'"
                    :color="sides === 1 ? 'primary' : 'neutral'"
                    size="sm"
                    class="flex-1"
                    @click="sides = 1"
                  >
                    Single
                  </UButton>
                  <UButton
                    :variant="sides === 2 ? 'solid' : 'outline'"
                    :color="sides === 2 ? 'primary' : 'neutral'"
                    size="sm"
                    class="flex-1"
                    @click="sides = 2"
                  >
                    Double
                  </UButton>
                </div>
              </div>
            </template>

            <!-- SQM: dimensions + material -->
            <template v-else>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Width (m)</label>
                  <UInput v-model.number="widthM" type="number" step="0.1" :min="0.1" size="lg" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Height (m)</label>
                  <UInput v-model.number="heightM" type="number" step="0.1" :min="0.1" size="lg" />
                </div>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Material</label>
                <div class="flex flex-wrap gap-2">
                  <UButton
                    v-for="m in demoRateCard.sqm_materials"
                    :key="m.key"
                    :variant="sqmMaterialKey === m.key ? 'solid' : 'outline'"
                    :color="sqmMaterialKey === m.key ? 'primary' : 'neutral'"
                    size="sm"
                    @click="sqmMaterialKey = m.key"
                  >
                    {{ m.label }}
                  </UButton>
                </div>
              </div>
            </template>

            <!-- Finishing -->
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Finishing</label>
              <div class="flex flex-wrap gap-3">
                <label
                  v-for="f in finishingOptions"
                  :key="f.id"
                  class="flex items-center gap-2 cursor-pointer"
                >
                  <UCheckbox
                    :model-value="finishingIds.includes(f.id)"
                    @update:model-value="toggleFinishing(f.id)"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ f.name }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">({{ formatKES(f.price) }})</span>
                </label>
              </div>
            </div>

            <!-- Childish math -->
            <div
              v-if="impositionLine"
              class="rounded-xl border border-flamingo-200 dark:border-flamingo-800/50 bg-flamingo-50/50 dark:bg-flamingo-950/20 p-4"
            >
              <p class="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <UIcon name="i-lucide-calculator" class="h-4 w-4 text-flamingo-500" />
                Imposition
              </p>
              <p class="mt-1 font-mono text-sm text-gray-700 dark:text-gray-300">
                {{ impositionLine }}
              </p>
            </div>

            <!-- Breakdown + Total -->
            <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Material</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatKES(quote.material) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Printing</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatKES(quote.printing) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Finishing</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatKES(quote.finishing) }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span class="font-semibold text-gray-900 dark:text-white">Total</span>
                <span class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400">
                  {{ formatKES(quote.total) }}
                </span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Demo only — not a real quote</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
