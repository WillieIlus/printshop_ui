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
import type { PrintTemplateDetailDTO, TemplateShopCapability } from '~/shared/types/templates'
import type { CatalogTemplate } from '~/shared/types/template'
import { demoRateCard } from '~/shared/demoRateCard'
import {
  computeDemoQuote,
  type DemoFormState,
  type DemoQuoteResult,
} from '~/shared/demoPricing'
import { calculateTemplatePrice } from '~/shared/api/templates'
import { formatKES } from '~/utils/formatters'

const GSM_STEP = 50

type ApiTemplate = (PrintTemplateDetailDTO | CatalogTemplate) & { slug: string }

const props = defineProps<{
  open: boolean
  template: DemoTemplate | PrintTemplateDetailDTO | CatalogTemplate | null
}>()

const emit = defineEmits<{ 'update:open': [value: boolean] }>()

/** Demo flow state */
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

/** API flow state */
const apiFormState = ref({
  quantity: 500,
  gsm: 300,
  print_sides: 'DUPLEX' as 'SIMPLEX' | 'DUPLEX',
  selected_option_ids: [] as number[],
  selected_finishing_ids: [] as number[],
})

const apiPriceResult = ref<{ total: string | number; breakdown?: { label: string; amount: string | number }[] } | null>(null)
const apiLoading = ref(false)
const apiError = ref<string | null>(null)

function isDemoTemplate(t: typeof props.template): t is DemoTemplate {
  return !!t && 'unit' in t && typeof (t as DemoTemplate).unit === 'string'
}

function isApiTemplate(t: typeof props.template): t is ApiTemplate {
  return !!t && 'slug' in t && typeof (t as ApiTemplate).slug === 'string'
}

/** Build allowed GSM values from template constraints, optionally clamped by shop max_gsm */
function buildGsmOptions(
  t: ApiTemplate,
  shopCapability?: TemplateShopCapability | null
): number[] {
  const min = t.min_gsm ?? 80
  const max = t.max_gsm ?? 400
  const shopMax = shopCapability?.max_gsm

  let values: number[]
  if (t.allowed_gsm_values?.length) {
    values = [...t.allowed_gsm_values].sort((a, b) => a - b)
  } else {
    values = []
    for (let g = min; g <= max; g += GSM_STEP) {
      values.push(g)
    }
  }

  if (shopMax != null && shopMax > 0) {
    values = values.filter((v) => v <= shopMax)
  }
  if (values.length === 0) {
    values = [80, 130, 180, 230, 280, 330, 380]
  }
  return values
}

const templateTitle = computed(() => {
  const t = props.template
  if (!t) return 'Configure Template'
  if (isDemoTemplate(t)) return t.name
  return (t as ApiTemplate).title
})

const isApiMode = computed(() => isApiTemplate(props.template))

const apiTemplate = computed(() =>
  isApiTemplate(props.template) ? props.template : null
)

const gsmOptions = computed(() => {
  const t = apiTemplate.value
  if (!t) return []
  const detail = t as PrintTemplateDetailDTO
  const shopCap = detail?.shop_capability
  return buildGsmOptions(t, shopCap)
})

const templateSupportNote = computed(() => {
  const t = apiTemplate.value
  if (!t) return null
  if (t.allowed_gsm_values?.length) {
    const min = Math.min(...t.allowed_gsm_values)
    const max = Math.max(...t.allowed_gsm_values)
    return `This template supports ${min}–${max} gsm`
  }
  if (t.min_gsm != null && t.max_gsm != null) {
    return `This template supports ${t.min_gsm}–${t.max_gsm} gsm`
  }
  return null
})

const shopSupportNote = computed(() => {
  const t = apiTemplate.value as PrintTemplateDetailDTO | undefined
  const max = t?.shop_capability?.max_gsm
  if (max != null && max > 0) {
    return `This shop supports up to ${max} gsm`
  }
  return null
})

const gsmValid = computed(() => {
  const opts = gsmOptions.value
  if (opts.length === 0) return true
  return opts.includes(apiFormState.value.gsm)
})

const gsmError = computed(() => {
  if (gsmValid.value) return null
  const opts = gsmOptions.value
  if (opts.length === 0) return null
  return `Please select a GSM between ${opts[0]} and ${opts[opts.length - 1]} gsm`
})

const canCalculate = computed(() => gsmValid.value && !apiLoading.value)

watch(
  () => [props.open, props.template] as const,
  ([open, template]) => {
    if (open && template) {
      if (isDemoTemplate(template)) {
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
      } else if (isApiTemplate(template)) {
        const opts = buildGsmOptions(
          template,
          (template as PrintTemplateDetailDTO).shop_capability
        )
        const defaultGsm =
          opts.length > 0
            ? opts.includes(300)
              ? 300
              : opts[0]
            : 300
        apiFormState.value = {
          quantity: (template as PrintTemplateDetailDTO).min_quantity ?? 500,
          gsm: defaultGsm,
          print_sides: 'DUPLEX',
          selected_option_ids: [],
          selected_finishing_ids: [],
        }
        apiPriceResult.value = null
        apiError.value = null
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

async function onCalculate() {
  const t = apiTemplate.value
  if (!t || !canCalculate.value) return
  apiLoading.value = true
  apiError.value = null
  try {
    const result = await calculateTemplatePrice(t.slug, {
      quantity: apiFormState.value.quantity,
      gsm: apiFormState.value.gsm,
      print_sides: apiFormState.value.print_sides,
      selected_option_ids: apiFormState.value.selected_option_ids,
      selected_finishing_ids: apiFormState.value.selected_finishing_ids,
    })
    apiPriceResult.value = result
  } catch (e) {
    apiError.value = e instanceof Error ? e.message : 'Failed to calculate price'
  } finally {
    apiLoading.value = false
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
                {{ templateTitle }}
              </DialogTitle>
              <DialogDescription
                :id="descriptionId"
                class="mt-0.5 text-sm text-gray-500 dark:text-gray-400"
              >
                {{
                  isApiMode
                    ? 'Adjust options and calculate price'
                    : 'Adjust options to see demo pricing update live'
                }}
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
            <!-- API template flow: GSM-based -->
            <div v-if="isApiMode && apiTemplate" class="space-y-6">
              <!-- GSM constraint notes -->
              <div
                v-if="templateSupportNote || shopSupportNote"
                class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-200 dark:border-gray-700 space-y-1"
              >
                <p
                  v-if="templateSupportNote"
                  class="text-sm text-gray-700 dark:text-gray-300"
                >
                  {{ templateSupportNote }}
                </p>
                <p
                  v-if="shopSupportNote"
                  class="text-sm text-gray-600 dark:text-gray-400"
                >
                  {{ shopSupportNote }}
                </p>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quantity
                </label>
                <input
                  v-model.number="apiFormState.quantity"
                  type="number"
                  :min="(apiTemplate as PrintTemplateDetailDTO).min_quantity ?? 1"
                  class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20"
                >
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  GSM (paper weight)
                </label>
                <select
                  v-model.number="apiFormState.gsm"
                  class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20"
                  :class="{
                    'border-red-500 dark:border-red-500': gsmError,
                  }"
                >
                  <option
                    v-for="g in gsmOptions"
                    :key="g"
                    :value="g"
                  >
                    {{ g }} gsm
                  </option>
                </select>
                <p
                  v-if="gsmError"
                  class="mt-1.5 text-sm text-red-600 dark:text-red-400"
                >
                  {{ gsmError }}
                </p>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sides
                </label>
                <div class="flex gap-2">
                  <UButton
                    :variant="apiFormState.print_sides === 'SIMPLEX' ? 'solid' : 'outline'"
                    :color="apiFormState.print_sides === 'SIMPLEX' ? 'primary' : 'neutral'"
                    size="sm"
                    class="flex-1"
                    @click="apiFormState.print_sides = 'SIMPLEX'"
                  >
                    Single
                  </UButton>
                  <UButton
                    :variant="apiFormState.print_sides === 'DUPLEX' ? 'solid' : 'outline'"
                    :color="apiFormState.print_sides === 'DUPLEX' ? 'primary' : 'neutral'"
                    size="sm"
                    class="flex-1"
                    @click="apiFormState.print_sides = 'DUPLEX'"
                  >
                    Double
                  </UButton>
                </div>
              </div>

              <div v-if="apiError" class="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
                <p class="text-sm text-red-700 dark:text-red-400">{{ apiError }}</p>
              </div>

              <div
                v-if="apiPriceResult"
                class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-200 dark:border-gray-700"
              >
                <div class="flex justify-between items-center">
                  <span class="font-semibold text-gray-900 dark:text-white">Total</span>
                  <span class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400">
                    {{ formatKES(apiPriceResult.total) }}
                  </span>
                </div>
                <div
                  v-if="apiPriceResult.breakdown?.length"
                  class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1 text-sm"
                >
                  <div
                    v-for="item in apiPriceResult.breakdown"
                    :key="item.label"
                    class="flex justify-between text-gray-600 dark:text-gray-400"
                  >
                    <span>{{ item.label }}</span>
                    <span>{{ formatKES(item.amount) }}</span>
                  </div>
                </div>
              </div>

              <UButton
                color="primary"
                block
                :disabled="!canCalculate"
                :loading="apiLoading"
                @click="onCalculate"
              >
                {{ apiLoading ? 'Calculating…' : 'Calculate price' }}
              </UButton>

              <!-- CTAs -->
              <div class="flex flex-col sm:flex-row gap-2 pt-2">
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

            <!-- Demo template flow -->
            <div v-else-if="template && isDemoTemplate(template)" class="space-y-6">
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

            <!-- No template / CatalogTemplate without slug -->
            <div v-else class="py-8 text-center text-gray-500 dark:text-gray-400">
              <p>Select a template to configure.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
