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
import type {
  PrintTemplateListDTO,
  PrintTemplateDetailDTO,
  TemplateCalculatePricePayload,
} from '~/shared/types/templates'
import { getShopTemplate, calculateShopTemplatePrice } from '~/shared/api/gallery'
import { formatKES } from '~/utils/formatters'

const props = withDefaults(
  defineProps<{
    open: boolean
    template: PrintTemplateListDTO | null
    shopSlug?: string
  }>(),
  { shopSlug: '' }
)

const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const quantity = ref(100)
const gsm = ref(300)
const printSides = ref<'SIMPLEX' | 'DUPLEX'>('DUPLEX')
const selectedOptionIds = ref<number[]>([])
const selectedFinishingIds = ref<number[]>([])

const templateDetail = ref<PrintTemplateDetailDTO | null>(null)
const loadingDetail = ref(false)
const calculating = ref(false)
const priceResult = ref<{ total: string | number; breakdown?: { label: string; amount: string | number }[] } | null>(null)
const inputError = ref<string | null>(null)

const gsmMin = computed(() => {
  const t = templateDetail.value ?? props.template
  return t?.gsm_min ?? 0
})

const gsmMax = computed(() => {
  const t = templateDetail.value ?? props.template
  return t?.gsm_max ?? 9999
})

const gsmPlaceholder = computed(() => {
  if (gsmMin.value && gsmMax.value && gsmMin.value < 9999 && gsmMax.value < 9999) {
    return `${gsmMin.value}–${gsmMax.value}`
  }
  if (gsmMin.value) return `Min ${gsmMin.value}`
  if (gsmMax.value < 9999) return `Max ${gsmMax.value}`
  return 'e.g. 300'
})

const allOptions = computed(() => {
  const t = templateDetail.value
  if (!t?.grouped_options) return []
  return t.grouped_options.flatMap((g) => g.options)
})

const optionalFinishing = computed(() => {
  const t = templateDetail.value
  return t?.optional_finishing ?? []
})

const mandatoryFinishing = computed(() => {
  const t = templateDetail.value
  return t?.mandatory_finishing ?? []
})

const minQuantity = computed(() => {
  const t = templateDetail.value ?? props.template
  return (t && 'min_quantity' in t && t.min_quantity) ?? 1
})

function validateInput(): boolean {
  inputError.value = null
  const g = gsm.value
  const q = quantity.value
  if (q < minQuantity.value) {
    inputError.value = `Quantity must be at least ${minQuantity.value}`
    return false
  }
  if (gsmMin.value != null && g < gsmMin.value) {
    inputError.value = `GSM must be at least ${gsmMin.value}`
    return false
  }
  if (gsmMax.value != null && gsmMax.value < 9999 && g > gsmMax.value) {
    inputError.value = `GSM must be at most ${gsmMax.value}`
    return false
  }
  return true
}

async function fetchPrice() {
  if (!props.shopSlug || !props.template || !validateInput()) return
  calculating.value = true
  priceResult.value = null
  try {
    const payload: TemplateCalculatePricePayload = {
      quantity: quantity.value,
      gsm: gsm.value,
      print_sides: printSides.value,
      selected_option_ids: selectedOptionIds.value.length ? selectedOptionIds.value : undefined,
      selected_finishing_ids: selectedFinishingIds.value.length ? selectedFinishingIds.value : undefined,
    }
    const result = await calculateShopTemplatePrice(props.shopSlug, props.template.slug, payload)
    priceResult.value = result
  } catch {
    inputError.value = 'Failed to calculate price'
  } finally {
    calculating.value = false
  }
}

function toggleOption(id: number) {
  const idx = selectedOptionIds.value.indexOf(id)
  if (idx >= 0) {
    selectedOptionIds.value = selectedOptionIds.value.filter((x) => x !== id)
  } else {
    selectedOptionIds.value = [...selectedOptionIds.value, id]
  }
  if (props.shopSlug && props.template) void fetchPrice()
}

function toggleFinishing(id: number) {
  const idx = selectedFinishingIds.value.indexOf(id)
  if (idx >= 0) {
    selectedFinishingIds.value = selectedFinishingIds.value.filter((x) => x !== id)
  } else {
    selectedFinishingIds.value = [...selectedFinishingIds.value, id]
  }
  if (props.shopSlug && props.template) void fetchPrice()
}

watch(
  () => [quantity.value, gsm.value, printSides.value],
  () => {
    if (props.shopSlug && props.template) void fetchPrice()
  }
)

watch(
  () => [props.open, props.template, props.shopSlug] as const,
  async ([open, template, slug]) => {
    if (!open) {
      templateDetail.value = null
      priceResult.value = null
      inputError.value = null
      return
    }
    if (template && slug) {
      quantity.value = template.min_quantity ?? 100
      gsm.value = template.gsm_min ?? template.gsm_max ?? 300
      if (template.gsm_min != null && template.gsm_max != null) {
        gsm.value = Math.round((template.gsm_min + template.gsm_max) / 2)
      } else if (template.gsm_min != null) {
        gsm.value = template.gsm_min
      } else if (template.gsm_max != null) {
        gsm.value = template.gsm_max
      }
      printSides.value = 'DUPLEX'
      selectedOptionIds.value = []
      selectedFinishingIds.value = []
      loadingDetail.value = true
      templateDetail.value = null
      priceResult.value = null
      inputError.value = null
      try {
        templateDetail.value = await getShopTemplate(slug, template.slug)
      } finally {
        loadingDetail.value = false
      }
      await fetchPrice()
    }
  },
  { immediate: true }
)

const templateTitle = computed(() => props.template?.title ?? templateDetail.value?.title ?? 'Configure Template')
const descriptionId = 'template-tweaker-desc'
const isShopScoped = computed(() => Boolean(props.shopSlug && props.template))
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
                {{ isShopScoped ? 'Adjust options to see live pricing' : 'Select a shop from the gallery to configure pricing' }}
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
            <div v-if="!isShopScoped" class="py-8 text-center">
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                Browse a shop's gallery to configure and price templates.
              </p>
              <NuxtLink to="/gallery" class="inline-flex items-center gap-2 rounded-xl bg-flamingo-500 px-4 py-3 text-sm font-semibold text-white hover:bg-flamingo-600" @click="emit('update:open', false)">
                <UIcon name="i-lucide-layout-grid" class="h-4 w-4" />
                Go to Gallery
              </NuxtLink>
            </div>

            <div v-else class="space-y-6">
              <CommonLoadingSpinner v-if="loadingDetail" />

              <template v-else>
                <!-- Quantity -->
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quantity
                  </label>
                  <UInput
                    v-model.number="quantity"
                    type="number"
                    :min="minQuantity"
                    size="lg"
                    class="w-full"
                  />
                </div>

                <!-- GSM -->
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    GSM (paper weight)
                  </label>
                  <UInput
                    v-model.number="gsm"
                    type="number"
                    :min="gsmMin || undefined"
                    :max="gsmMax < 9999 ? gsmMax : undefined"
                    :placeholder="gsmPlaceholder"
                    size="lg"
                    :class="['w-full', inputError && 'ring-2 ring-red-500 dark:ring-red-500']"
                  />
                  <p v-if="inputError" class="mt-1.5 text-sm text-red-600 dark:text-red-400">
                    {{ inputError }}
                  </p>
                </div>

                <!-- Print sides -->
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sides
                  </label>
                  <div class="flex gap-2">
                    <UButton
                      :variant="printSides === 'SIMPLEX' ? 'solid' : 'outline'"
                      :color="printSides === 'SIMPLEX' ? 'primary' : 'neutral'"
                      size="sm"
                      class="flex-1"
                      @click="printSides = 'SIMPLEX'"
                    >
                      Single
                    </UButton>
                    <UButton
                      :variant="printSides === 'DUPLEX' ? 'solid' : 'outline'"
                      :color="printSides === 'DUPLEX' ? 'primary' : 'neutral'"
                      size="sm"
                      class="flex-1"
                      @click="printSides = 'DUPLEX'"
                    >
                      Double
                    </UButton>
                  </div>
                </div>

                <!-- Options -->
                <div v-if="allOptions.length">
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Options
                  </label>
                  <div class="space-y-2">
                    <label
                      v-for="opt in allOptions"
                      :key="opt.id"
                      class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        :checked="selectedOptionIds.includes(opt.id)"
                        class="rounded text-flamingo-500 focus:ring-flamingo-500"
                        @change="toggleOption(opt.id)"
                      >
                      <span class="text-sm text-gray-700 dark:text-gray-300 flex-1">{{ opt.name }}</span>
                      <span v-if="opt.price_modifier" class="text-sm text-gray-500 dark:text-gray-400">
                        {{ opt.price_modifier }}
                      </span>
                    </label>
                  </div>
                </div>

                <!-- Finishing -->
                <div v-if="mandatoryFinishing.length || optionalFinishing.length">
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Finishing
                  </label>
                  <div v-if="mandatoryFinishing.length" class="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    Mandatory: {{ mandatoryFinishing.map((f) => f.name).join(', ') }}
                  </div>
                  <div class="space-y-2">
                    <label
                      v-for="f in optionalFinishing"
                      :key="f.id"
                      class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        :checked="selectedFinishingIds.includes(f.id)"
                        class="rounded text-flamingo-500 focus:ring-flamingo-500"
                        @change="toggleFinishing(f.id)"
                      >
                      <span class="text-sm text-gray-700 dark:text-gray-300 flex-1">{{ f.name }}</span>
                      <span v-if="f.price" class="text-sm text-gray-500 dark:text-gray-400">
                        {{ formatKES(f.price) }}
                      </span>
                    </label>
                  </div>
                </div>

                <!-- Price result -->
                <div
                  class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div v-if="calculating" class="flex items-center gap-2 text-sm text-gray-500">
                    <UIcon name="i-lucide-loader-2" class="h-4 w-4 animate-spin" />
                    Calculating...
                  </div>
                  <div v-else-if="priceResult" class="space-y-2 text-sm">
                    <div
                      v-for="item in (priceResult.breakdown ?? [])"
                      :key="item.label"
                      class="flex justify-between"
                    >
                      <span class="text-gray-600 dark:text-gray-400">{{ item.label }}</span>
                      <span class="font-medium text-gray-900 dark:text-white">
                        {{ formatKES(item.amount) }}
                      </span>
                    </div>
                    <div class="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span class="font-semibold text-gray-900 dark:text-white">Total</span>
                      <span class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400">
                        {{ formatKES(priceResult.total) }}
                      </span>
                    </div>
                  </div>
                  <div v-else-if="inputError" class="text-sm text-red-600 dark:text-red-400">
                    {{ inputError }}
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
