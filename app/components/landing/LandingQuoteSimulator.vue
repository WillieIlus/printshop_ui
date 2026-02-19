<template>
  <div class="relative rounded-2xl bg-gray-800/50 border border-white/10 p-6 backdrop-blur-md shadow-2xl">
    <div class="flex justify-between items-center mb-6">
      <div class="flex gap-2">
        <span class="w-3 h-3 rounded-full bg-red-400" />
        <span class="w-3 h-3 rounded-full bg-yellow-400" />
        <span class="w-3 h-3 rounded-full bg-green-400" />
      </div>
      <span class="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Demo prices</span>
    </div>

    <div class="space-y-4">
      <!-- Product template (read-only) -->
      <div class="p-3 rounded-lg bg-white/5 border border-white/5">
        <div class="text-sm font-medium text-white">{{ templateName }}</div>
        <div class="text-xs text-gray-400">
          {{ unit }} • {{ unit === 'SQM' ? 'Large format' : sides === 2 ? 'Double-sided' : 'Single-sided' }}
        </div>
      </div>

      <!-- Unit select -->
      <UFormField label="Size" class="[&_.text-gray-400]:text-gray-400">
        <USelectMenu
          v-model="selectedUnit"
          :items="unitOptions"
          value-attribute="value"
          class="w-full"
          :ui="{ base: 'bg-white/5 border-white/10 text-white' }"
        />
      </UFormField>

      <!-- Sides toggle (only for digital) -->
      <UFormField v-if="unit !== 'SQM'" label="Sides" class="[&_.text-gray-400]:text-gray-400">
        <div class="flex gap-2">
          <UButton
            :color="sides === 1 ? 'primary' : 'neutral'"
            variant="soft"
            size="sm"
            @click="sides = 1"
          >
            1-sided
          </UButton>
          <UButton
            :color="sides === 2 ? 'primary' : 'neutral'"
            variant="soft"
            size="sm"
            @click="sides = 2"
          >
            2-sided
          </UButton>
        </div>
      </UFormField>

      <!-- Quantity -->
      <UFormField label="Quantity" class="[&_.text-gray-400]:text-gray-400">
        <UInput
          v-model.number="quantity"
          type="number"
          min="1"
          :max="unit === 'SQM' ? undefined : 100000"
          class="w-full"
          :ui="{ base: 'bg-white/5 border-white/10 text-white' }"
        />
      </UFormField>

      <!-- Paper / Material -->
      <template v-if="unit !== 'SQM'">
        <UFormField label="Paper (gsm)" class="[&_.text-gray-400]:text-gray-400">
          <USelectMenu
            v-model="selectedGsm"
            :items="gsmOptions"
            value-attribute="value"
            class="w-full"
            :ui="{ base: 'bg-white/5 border-white/10 text-white' }"
          />
        </UFormField>
      </template>
      <template v-else>
        <UFormField label="Material" class="[&_.text-gray-400]:text-gray-400">
          <USelectMenu
            v-model="selectedMaterial"
            :items="materialOptions"
            value-attribute="value"
            class="w-full"
            :ui="{ base: 'bg-white/5 border-white/10 text-white' }"
          />
        </UFormField>
        <div class="grid grid-cols-2 gap-3">
          <UFormField label="Width (m)" class="[&_.text-gray-400]:text-gray-400">
            <UInput
              v-model.number="widthM"
              type="number"
              min="0"
              step="0.1"
              class="w-full"
              :ui="{ base: 'bg-white/5 border-white/10 text-white' }"
            />
          </UFormField>
          <UFormField label="Height (m)" class="[&_.text-gray-400]:text-gray-400">
            <UInput
              v-model.number="heightM"
              type="number"
              min="0"
              step="0.1"
              class="w-full"
              :ui="{ base: 'bg-white/5 border-white/10 text-white' }"
            />
          </UFormField>
        </div>
      </template>

      <!-- Finishing checkboxes -->
      <UFormField label="Finishing" class="[&_.text-gray-400]:text-gray-400">
        <div class="flex flex-wrap gap-3">
          <UCheckbox v-model="finishing.lamination" label="Lamination" :ui="{ base: 'text-white' }" />
          <UCheckbox v-model="finishing.rounding" label="Round edging" :ui="{ base: 'text-white' }" />
          <UCheckbox v-model="finishing.folding" label="Folding" :ui="{ base: 'text-white' }" />
          <UCheckbox v-model="finishing.binding" label="Binding" :ui="{ base: 'text-white' }" />
        </div>
      </UFormField>

      <!-- Breakdown & Total -->
      <div class="grid grid-cols-2 gap-4">
        <div class="p-3 rounded-lg bg-white/5 border border-white/5">
          <div class="text-xs text-gray-400 mb-1">Material Cost</div>
          <div class="text-sm font-medium text-white transition-all duration-300">
            {{ formatKES(materialCost) }}
          </div>
        </div>
        <div class="p-3 rounded-lg bg-white/5 border border-white/5">
          <div class="text-xs text-gray-400 mb-1">Printing Cost</div>
          <div class="text-sm font-medium text-white transition-all duration-300">
            {{ formatKES(printingCost) }}
          </div>
        </div>
      </div>
      <div v-if="finishingCost > 0" class="p-3 rounded-lg bg-white/5 border border-white/5">
        <div class="text-xs text-gray-400 mb-1">Finishing Cost</div>
        <div class="text-sm font-medium text-white transition-all duration-300">
          {{ formatKES(finishingCost) }}
        </div>
      </div>
      <div class="p-3 rounded-lg bg-primary-600/20 border border-primary-500/30">
        <div class="flex justify-between items-center">
          <span class="text-sm text-primary-200">Total</span>
          <span
            :key="displayTotal"
            class="text-sm font-bold text-emerald-400 transition-all duration-300"
          >
            {{ formatKES(displayTotal) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  UNITS,
  GSM_OPTIONS,
  LARGE_FORMAT_MATERIALS,
  printingRates,
  paperRates,
  largeFormatMaterials,
  largeFormatPrintingPerSqm,
  finishingRates,
  impressionsPerSheet,
} from '~/shared/demo/demo-rate-card'
import type {
  DemoUnit,
  DemoGsm,
  DemoLargeFormatMaterial,
  SimulatorPreset,
} from '~/shared/demo/demo-rate-card'
function formatKES(val: number): string {
  if (Number.isNaN(val)) return 'KES 0'
  return `KES ${val.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

const props = withDefaults(
  defineProps<{
    templateName?: string
    preset?: SimulatorPreset | null
  }>(),
  { templateName: 'Flyers', preset: null }
)

const templateName = ref(props.templateName)
const unit = ref<DemoUnit>('A5')
const selectedUnit = ref<{ value: DemoUnit; label: string }>({ value: 'A5', label: 'A5' })
const sides = ref<1 | 2>(2)
const quantity = ref(1000)
const selectedGsm = ref<{ value: DemoGsm; label: string }>({ value: 150, label: '150 gsm' })
const selectedMaterial = ref<{ value: DemoLargeFormatMaterial; label: string }>({
  value: 'banner',
  label: 'Banner',
})
const widthM = ref(1)
const heightM = ref(1)
const finishing = ref({
  lamination: false,
  rounding: false,
  folding: false,
  binding: false,
})

const unitOptions = UNITS.map((u) => ({ value: u, label: u }))
const gsmOptions = GSM_OPTIONS.map((g) => ({ value: g, label: `${g} gsm` }))
const materialOptions = LARGE_FORMAT_MATERIALS.map((m) => ({
  value: m,
  label: m.charAt(0).toUpperCase() + m.slice(1),
}))

watch(selectedUnit, (v) => {
  if (v?.value) unit.value = v.value
})
watch(unit, (u) => {
  if (u === 'SQM') return
  const rates = paperRates[u as Exclude<DemoUnit, 'SQM'>]
  const gsm = selectedGsm.value?.value
  if (gsm && rates && rates[gsm] === undefined) {
    selectedGsm.value = gsmOptions[0]
  }
})
watch(selectedGsm, (v) => {
  if (unit.value === 'SQM') return
  if (v?.value && !paperRates[unit.value as Exclude<DemoUnit, 'SQM'>]?.[v.value]) {
    selectedGsm.value = gsmOptions[0]
  }
})
watch(
  () => props.preset,
  (p) => {
    if (p) applyPreset(p)
  },
  { immediate: true }
)

const materialCost = computed(() => {
  const qty = Math.max(1, quantity.value)
  if (unit.value === 'SQM') {
    const w = Math.max(0, widthM.value)
    const h = Math.max(0, heightM.value)
    if (w <= 0 || h <= 0) return 0
    const area = w * h * qty
    const rate = largeFormatMaterials[selectedMaterial.value?.value ?? 'banner']
    return area * rate
  }
  const u = unit.value as Exclude<DemoUnit, 'SQM'>
  const gsm = selectedGsm.value?.value ?? 150
  const pricePerSheet = paperRates[u]?.[gsm] ?? 1.5
  const impressions = impressionsPerSheet[u]
  const sheets = Math.ceil(qty / impressions)
  return sheets * pricePerSheet
})

const printingCost = computed(() => {
  const qty = Math.max(1, quantity.value)
  if (unit.value === 'SQM') {
    const w = Math.max(0, widthM.value)
    const h = Math.max(0, heightM.value)
    if (w <= 0 || h <= 0) return 0
    const area = w * h * qty
    return area * largeFormatPrintingPerSqm
  }
  const u = unit.value as Exclude<DemoUnit, 'SQM'>
  const rate = sides.value === 1 ? printingRates[u].oneSided : printingRates[u].duplexPerSheet
  const impressions = impressionsPerSheet[u]
  const sheets = Math.ceil(qty / impressions)
  return sheets * rate
})

const finishingCost = computed(() => {
  const qty = Math.max(1, quantity.value)
  let total = 0
  if (unit.value === 'SQM') {
    const w = Math.max(0, widthM.value)
    const h = Math.max(0, heightM.value)
    const area = w * h * qty
    const sheets = Math.ceil(area) // simplified
    if (finishing.value.lamination) total += sheets * finishingRates.laminationPerSheet
    if (finishing.value.rounding) total += qty * finishingRates.roundingPerPiece
    if (finishing.value.folding) total += qty * finishingRates.foldingPerPiece
    if (finishing.value.binding) total += qty * finishingRates.bindingPerPiece
  } else {
    const u = unit.value as Exclude<DemoUnit, 'SQM'>
    const impressions = impressionsPerSheet[u]
    const sheets = Math.ceil(qty / impressions)
    if (finishing.value.lamination) total += sheets * finishingRates.laminationPerSheet
    if (finishing.value.rounding) total += qty * finishingRates.roundingPerPiece
    if (finishing.value.folding) total += qty * finishingRates.foldingPerPiece
    if (finishing.value.binding) total += qty * finishingRates.bindingPerPiece
  }
  return total
})

const totalCost = computed(
  () => materialCost.value + printingCost.value + finishingCost.value
)

const displayTotal = computed(() => Math.round(totalCost.value))

function applyPreset(preset: SimulatorPreset) {
  templateName.value = preset.templateName
  unit.value = preset.unit
  selectedUnit.value = { value: preset.unit, label: preset.unit }
  sides.value = preset.sides ?? 2
  quantity.value = Math.max(1, preset.quantity)
  if (preset.gsm) {
    selectedGsm.value = { value: preset.gsm, label: `${preset.gsm} gsm` }
  }
  if (preset.material) {
    selectedMaterial.value = {
      value: preset.material,
      label: preset.material.charAt(0).toUpperCase() + preset.material.slice(1),
    }
  }
  if (preset.widthM != null) widthM.value = Math.max(0, preset.widthM)
  if (preset.heightM != null) heightM.value = Math.max(0, preset.heightM)
  if (preset.finishing) {
    finishing.value = {
      lamination: preset.finishing.lamination ?? false,
      rounding: preset.finishing.rounding ?? false,
      folding: preset.finishing.folding ?? false,
      binding: preset.finishing.binding ?? false,
    }
  }
}

defineExpose({ applyPreset })
</script>
