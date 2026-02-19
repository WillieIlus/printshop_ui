<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
import {
  computeDemoQuote,
  type DemoFormState,
  type DemoQuoteResult,
} from '~/shared/demoPricing'
import { formatKES } from '~/utils/formatters'

const props = defineProps<{
  open: boolean
  template: DemoTemplate | null
}>()

const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const formState = ref<DemoFormState>({
  unit: 'A4',
  sheetSize: 'SRA3',
  piecesPerSheet: 1,
  sides: 1,
  quantity: 100,
  materialKey: '',
  finishingIds: [],
  widthM: 1,
  heightM: 1,
})

watch(
  () => [props.open, props.template] as const,
  ([open, template]) => {
    if (open && template) {
      formState.value = {
        unit: template.unit,
        sheetSize: template.sheetSize,
        piecesPerSheet: template.piecesPerSheet,
        sides: template.defaultSides,
        quantity: template.defaultQty,
        materialKey: template.defaultMaterial,
        finishingIds: [...template.defaultFinishings],
        widthM: template.defaultWidthM ?? 1,
        heightM: template.defaultHeightM ?? 1,
      }
    }
  },
  { immediate: true }
)

const quote = computed((): DemoQuoteResult => {
  return computeDemoQuote(formState.value, demoRateCard)
})

const digitalMaterials = computed(() => {
  return demoRateCard.paper.filter(
    (p) => p.sheet_size === formState.value.sheetSize
  )
})

const sqmMaterials = demoRateCard.sqm_materials

const finishingOptions = demoRateCard.finishing

function toggleFinishing(id: string) {
  const idx = formState.value.finishingIds.indexOf(id)
  if (idx >= 0) {
    formState.value.finishingIds = formState.value.finishingIds.filter(
      (x) => x !== id
    )
  } else {
    formState.value.finishingIds = [...formState.value.finishingIds, id]
  }
}

const descriptionId = 'template-tweaker-desc'
</script>

<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogPortal to="#modal-portal">
      <DialogOverlay
        class="fixed inset-0 z-[9999] bg-black/50"
        aria-hidden
        @click="emit('update:open', false)"
      />
      <DialogContent
        class="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-4 focus:outline-none"
        :aria-describedby="descriptionId"
      >
        <div
          class="relative w-full h-full sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-2xl sm:rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden flex flex-col"
          role="document"
        >
          <div
            class="flex items-center justify-between p-4 sm:px-6 border-b border-gray-200 dark:border-gray-700 shrink-0"
          >
            <div>
              <DialogTitle class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ template?.name ?? 'Configure Template' }}
              </DialogTitle>
              <DialogDescription
                :id="descriptionId"
                class="mt-0.5 text-sm text-gray-500 dark:text-gray-400"
              >
                Adjust options to see demo pricing update live
              </DialogDescription>
            </div>
            <DialogClose as-child>
              <UButton
                icon="i-lucide-x"
                color="neutral"
                variant="ghost"
                aria-label="Close"
              />
            </DialogClose>
          </div>

          <div class="flex-1 overflow-y-auto p-4 sm:p-6">
            <div class="space-y-6">
              <!-- Unit & Quantity (digital) or Dimensions (SQM) -->
              <div v-if="formState.unit !== 'SQM'" class="space-y-4">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quantity
                  </label>
                  <input
                    v-model.number="formState.quantity"
                    type="number"
                    min="1"
                    class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20"
                  >
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sides
                  </label>
                  <div class="flex gap-2">
                    <UButton
                      :variant="formState.sides === 1 ? 'solid' : 'outline'"
                      :color="formState.sides === 1 ? 'primary' : 'neutral'"
                      size="sm"
                      class="flex-1"
                      @click="formState.sides = 1"
                    >
                      Single
                    </UButton>
                    <UButton
                      :variant="formState.sides === 2 ? 'solid' : 'outline'"
                      :color="formState.sides === 2 ? 'primary' : 'neutral'"
                      size="sm"
                      class="flex-1"
                      @click="formState.sides = 2"
                    >
                      Double
                    </UButton>
                  </div>
                </div>
              </div>

              <div v-else class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Width (m)
                    </label>
                    <input
                      v-model.number="formState.widthM"
                      type="number"
                      min="0.1"
                      step="0.01"
                      class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20"
                    >
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Height (m)
                    </label>
                    <input
                      v-model.number="formState.heightM"
                      type="number"
                      min="0.1"
                      step="0.01"
                      class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20"
                    >
                  </div>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quantity
                  </label>
                  <input
                    v-model.number="formState.quantity"
                    type="number"
                    min="1"
                    class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20"
                  >
                </div>
              </div>

              <!-- Material -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Material
                </label>
                <select
                  v-if="formState.unit !== 'SQM'"
                  v-model="formState.materialKey"
                  class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20"
                >
                  <option
                    v-for="m in digitalMaterials"
                    :key="m.key"
                    :value="m.label"
                  >
                    {{ m.label }} — {{ formatKES(m.price_per_sheet) }}/sheet
                  </option>
                </select>
                <select
                  v-else
                  v-model="formState.materialKey"
                  class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20"
                >
                  <option
                    v-for="m in sqmMaterials"
                    :key="m.key"
                    :value="m.key"
                  >
                    {{ m.label }} — {{ formatKES(m.price_per_sqm) }}/m²
                  </option>
                </select>
              </div>

              <!-- Finishing -->
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Finishing
                </label>
                <div class="space-y-2">
                  <label
                    v-for="f in finishingOptions"
                    :key="f.id"
                    class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      :checked="formState.finishingIds.includes(f.id)"
                      class="rounded text-flamingo-500 focus:ring-flamingo-500"
                      @change="toggleFinishing(f.id)"
                    >
                    <span class="text-sm text-gray-700 dark:text-gray-300 flex-1">
                      {{ f.name }}
                    </span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {{ formatKES(f.price) }}/{{ f.charge_by.replace('PER_', '').toLowerCase() }}
                    </span>
                  </label>
                </div>
              </div>

              <!-- Price breakdown -->
              <div
                class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-200 dark:border-gray-700"
              >
                <div class="mb-2 flex items-center gap-2">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400"
                  >
                    <UIcon name="i-lucide-info" class="h-3.5 w-3.5" />
                    Demo prices — adjust in your shop pricing
                  </span>
                </div>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Printing</span>
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ formatKES(quote.printing) }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Material</span>
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ formatKES(quote.material) }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Finishing</span>
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ formatKES(quote.finishing) }}
                    </span>
                  </div>
                  <div class="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span class="font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span
                      class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400 transition-all duration-200"
                    >
                      {{ formatKES(quote.total) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- CTAs -->
              <div class="flex flex-col sm:flex-row gap-2">
                <NuxtLink
                  to="/auth/signup"
                  class="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-flamingo-500 px-4 py-3 text-sm font-semibold text-white hover:bg-flamingo-600 transition-colors"
                  @click="emit('update:open', false)"
                >
                  <UIcon name="i-lucide-store" class="h-4 w-4" />
                  Create your shop
                </NuxtLink>
                <NuxtLink
                  to="/auth/login"
                  class="w-full inline-flex justify-center items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  @click="emit('update:open', false)"
                >
                  <UIcon name="i-lucide-log-in" class="h-4 w-4" />
                  Sign in
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
