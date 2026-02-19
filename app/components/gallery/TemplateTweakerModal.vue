<template>
  <CommonSimpleModal
    :open="open"
    title="Tweak Template Price"
    description="Adjust options to see real-time pricing"
    @update:open="$emit('update:open', $event)"
  >
    <div v-if="!detail && !detailLoading" class="py-4 text-center text-gray-500">
      Select a template to get started.
    </div>

    <div v-else-if="detailLoading" class="py-8 flex justify-center">
      <CommonLoadingSpinner size="lg" />
    </div>

    <div v-else-if="detail" class="space-y-6">
      <h3 class="font-semibold text-gray-900 dark:text-white">{{ detail.title }}</h3>

      <!-- Quantity -->
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
        <UInput
          v-model.number="quantity"
          type="number"
          :min="minQuantity"
          size="md"
          @update:model-value="recalculate"
        />
        <p v-if="minQuantity > 1" class="mt-1 text-xs text-gray-500">Minimum: {{ minQuantity }}</p>
      </div>

      <!-- GSM -->
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Paper Weight (GSM)</label>
        <USelectMenu
          v-if="gsmOptions.length > 0"
          v-model="selectedGsm"
          :items="gsmOptions"
          value-attribute="value"
          option-attribute="label"
          size="md"
          :portal="true"
          @update:model-value="recalculate"
        />
        <UInput
          v-else
          v-model.number="gsmNumeric"
          type="number"
          min="1"
          placeholder="Enter GSM"
          size="md"
          @update:model-value="recalculate"
        />
      </div>

      <!-- Print sides -->
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Print Sides</label>
        <div class="flex gap-2">
          <UButton
            :variant="printSides === 'SIMPLEX' ? 'solid' : 'outline'"
            :color="printSides === 'SIMPLEX' ? 'primary' : 'neutral'"
            size="md"
            @click="printSides = 'SIMPLEX'; recalculate()"
          >
            Simplex (1 side)
          </UButton>
          <UButton
            :variant="printSides === 'DUPLEX' ? 'solid' : 'outline'"
            :color="printSides === 'DUPLEX' ? 'primary' : 'neutral'"
            size="md"
            @click="printSides = 'DUPLEX'; recalculate()"
          >
            Duplex (2 sides)
          </UButton>
        </div>
      </div>

      <!-- Selectable options (non-GSM groups) -->
      <div
        v-for="group in selectableOptionGroups"
        :key="group.group_name"
      >
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ group.group_name }}</label>
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="opt in group.options"
            :key="opt.id"
            :variant="selectedOptionIds.includes(opt.id) ? 'solid' : 'outline'"
            :color="selectedOptionIds.includes(opt.id) ? 'primary' : 'neutral'"
            size="sm"
            @click="toggleOption(opt.id); recalculate()"
          >
            {{ opt.name }}
          </UButton>
        </div>
      </div>

      <!-- Optional finishing (mandatory auto-included) -->
      <div v-if="detail.optional_finishing?.length">
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Optional Finishing</label>
        <div class="space-y-2">
          <label
            v-for="f in detail.optional_finishing"
            :key="f.id"
            class="flex items-center gap-2 cursor-pointer"
          >
            <input
              :checked="selectedOptionalFinishingIds.includes(f.id)"
              type="checkbox"
              class="rounded border-gray-300 text-flamingo-600 focus:ring-flamingo-500"
              @change="toggleOptionalFinishing(f.id)"
            >
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ f.name }}</span>
          </label>
        </div>
      </div>

      <!-- Price result -->
      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 space-y-2">
        <template v-if="priceLoading">
          <div class="flex justify-center py-4">
            <UIcon name="i-lucide-loader-2" class="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </template>
        <template v-else>
          <div
            v-for="item in priceBreakdown"
            :key="item.label"
            class="flex justify-between text-sm"
          >
            <span class="text-gray-600 dark:text-gray-400">{{ item.label }}</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ formatKES(item.amount) }}</span>
          </div>
          <div v-if="priceBreakdown.length" class="h-px bg-gray-200 dark:bg-gray-700" />
          <div class="flex justify-between font-semibold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>{{ formatKES(priceTotal) }}</span>
          </div>
        </template>
      </div>

      <p class="text-xs text-gray-500 dark:text-gray-400">
        Demo / template price. Final price depends on shop pricing.
      </p>
    </div>
  </CommonSimpleModal>
</template>

<script setup lang="ts">
import type { PrintTemplateListDTO, PrintTemplateDetailDTO, GroupedOptionDTO } from '~/shared/types'
import { getTemplate, calculateTemplatePrice } from '~/shared/api/templates'
import { formatKES } from '~/utils/formatters'

const props = defineProps<{
  open: boolean
  template: PrintTemplateListDTO | PrintTemplateDetailDTO | null
}>()

defineEmits<{ 'update:open': [value: boolean]; close: [] }>()

const GSM_GROUP_NAMES = ['Paper Weight (GSM)', 'GSM', 'Paper Weight']

const detail = ref<PrintTemplateDetailDTO | null>(null)
const detailLoading = ref(false)

const quantity = ref(100)
const selectedGsm = ref<{ value: number; label: string } | null>(null)
const gsmNumeric = ref<number>(80)
const printSides = ref<'SIMPLEX' | 'DUPLEX'>('DUPLEX')
const selectedOptionIds = ref<number[]>([])
const selectedOptionalFinishingIds = ref<number[]>([])

const priceResult = ref<{ total: string | number; breakdown?: { label: string; amount: string | number }[] } | null>(null)
const priceLoading = ref(false)

const slug = computed(() => props.template?.slug ?? '')

const minQuantity = computed(() => {
  const d = detail.value
  return d?.min_quantity ?? 1
})

const gsmOptions = computed(() => {
  const group = findGsmGroup(detail.value?.grouped_options ?? [])
  if (!group) return []
  return group.options.map((o) => {
    const val = parseFloat(String(o.price_modifier ?? o.name)) || 80
    return { value: val, label: o.name }
  })
})

function findGsmGroup(groups: GroupedOptionDTO[]): GroupedOptionDTO | undefined {
  return groups.find((g) =>
    GSM_GROUP_NAMES.some((n) =>
      g.group_name.toLowerCase().includes(n.toLowerCase())
    )
  )
}

const selectableOptionGroups = computed(() => {
  const groups = detail.value?.grouped_options ?? []
  const gsmGroup = findGsmGroup(groups)
  return groups.filter((g) => g !== gsmGroup)
})

const priceBreakdown = computed(() => priceResult.value?.breakdown ?? [])
const priceTotal = computed(() => priceResult.value?.total ?? 0)

function toggleOption(id: number) {
  const idx = selectedOptionIds.value.indexOf(id)
  if (idx >= 0) {
    selectedOptionIds.value = selectedOptionIds.value.filter((x) => x !== id)
  } else {
    selectedOptionIds.value = [...selectedOptionIds.value, id]
  }
}

async function fetchDetail() {
  if (!slug.value) return
  detailLoading.value = true
  try {
    const d = await getTemplate(slug.value)
    detail.value = d
    if (d) {
      quantity.value = Math.max(d.min_quantity ?? 1, quantity.value)
      const gsmGroup = findGsmGroup(d.grouped_options ?? [])
      if (gsmGroup?.options?.length) {
        const first = gsmGroup.options[0]
        const val = parseFloat(String(first.price_modifier ?? first.name)) || 80
        selectedGsm.value = { value: val, label: first.name }
      } else {
        gsmNumeric.value = 80
      }
      selectedOptionIds.value = []
      selectedOptionalFinishingIds.value = []
      await recalculate()
    }
  } finally {
    detailLoading.value = false
  }
}

const mandatoryFinishingIds = computed(() =>
  (detail.value?.mandatory_finishing ?? []).map((f) => f.id)
)

const selectedFinishingIds = computed(() => [
  ...mandatoryFinishingIds.value,
  ...selectedOptionalFinishingIds.value,
])

function toggleOptionalFinishing(id: number) {
  const idx = selectedOptionalFinishingIds.value.indexOf(id)
  if (idx >= 0) {
    selectedOptionalFinishingIds.value = selectedOptionalFinishingIds.value.filter((x) => x !== id)
  } else {
    selectedOptionalFinishingIds.value = [...selectedOptionalFinishingIds.value, id]
  }
  recalculate()
}

async function recalculate() {
  if (!detail.value || !slug.value) return
  priceLoading.value = true
  try {
    const gsm = selectedGsm.value ? selectedGsm.value.value : gsmNumeric.value
    const res = await calculateTemplatePrice(slug.value, {
      quantity: quantity.value,
      gsm: Number(gsm) || 80,
      print_sides: printSides.value,
      selected_option_ids: selectedOptionIds.value,
      selected_finishing_ids: selectedFinishingIds.value,
    })
    priceResult.value = res ?? { total: 0, breakdown: [] }
  } finally {
    priceLoading.value = false
  }
}

watch(
  () => [props.open, slug.value] as const,
  ([open, s]) => {
    if (open && s) {
      const isDetail = props.template && 'grouped_options' in props.template
      if (isDetail) {
        detail.value = props.template as PrintTemplateDetailDTO
        recalculate()
      } else {
        fetchDetail()
      }
    } else if (!open) {
      detail.value = null
      priceResult.value = null
    }
  },
  { immediate: true }
)
</script>
