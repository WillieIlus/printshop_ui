<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Rate Card / Pricing Setup</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Machine printing prices and large format material rates</p>
      </div>
      <div class="flex gap-2">
        <UButton :to="`/dashboard/shops/${slug}`" variant="ghost" size="sm">Back</UButton>
        <UButton :to="`/shops/${slug}`" target="_blank" variant="outline" class="rounded-xl border-gray-200 hover:border-flamingo-300 hover:bg-flamingo-50 hover:text-flamingo-600">
          <UIcon name="i-lucide-eye" class="w-4 h-4 mr-2" />
          Preview Public Page
        </UButton>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1.5">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
        :class="activeTab === tab.id
          ? 'bg-flamingo-500 text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Loading State -->
    <CommonLoadingSpinner v-if="loading" />

    <!-- Tab Content -->
    <template v-else>
      <!-- Printing (Machines) Tab -->
      <div v-if="activeTab === 'printing'" class="space-y-4">
        <div v-if="!machineStore.machines.length" class="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
          <p class="text-sm text-amber-800 dark:text-amber-200">
            <UIcon name="i-lucide-alert-circle" class="inline w-4 h-4 mr-1" />
            Add machines first in <NuxtLink :to="`/dashboard/shops/${slug}/machines`" class="font-semibold text-amber-700 dark:text-amber-300 hover:underline">Machines</NuxtLink> before setting printing prices.
          </p>
        </div>
        <PricingPrintingRateGrid
          v-else
          :slug="slug"
          :machines="machineStore.machines"
          :printing-prices="pricingStore.printingPrices"
          :loading="pricingStore.loading"
          @save="onPrintingSave"
          @refresh="refreshPrinting"
        />
      </div>

      <!-- Materials (Large format) Tab -->
      <div v-if="activeTab === 'materials'" class="space-y-4">
        <PricingMaterialRateGrid
          :slug="slug"
          :material-prices="pricingStore.materialPrices"
          :loading="pricingStore.loading"
          :saving="materialSaving"
          :supports-active="true"
          @save="onMaterialSave"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { SheetSize, ColorMode, MaterialType } from '~/shared/types'
import { usePricingStore } from '~/stores/pricing'
import { useMachineStore } from '~/stores/machine'

type TabId = 'printing' | 'materials'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const pricingStore = usePricingStore()
const machineStore = useMachineStore()
const toast = useToast()

const slug = computed(() => route.params.slug as string)
const activeTab = ref<TabId>('printing')
const loading = ref(true)
const materialSaving = ref(false)

const tabs: { id: TabId; name: string }[] = [
  { id: 'printing', name: 'Printing (Machines)' },
  { id: 'materials', name: 'Materials (Large format)' },
]

async function onPrintingSave(payload: {
  machine: number
  sheet_size: SheetSize
  color_mode: ColorMode
  selling_price_per_side: string
  selling_price_duplex_per_sheet: string | null
}) {
  const existing = pricingStore.printingPrices.find(
    (p) =>
      p.machine === payload.machine &&
      p.sheet_size === payload.sheet_size &&
      p.color_mode === payload.color_mode
  )
  try {
    if (existing) {
      await pricingStore.updatePrintingPrice(slug.value, existing.id, {
        selling_price_per_side: payload.selling_price_per_side,
        selling_price_duplex_per_sheet: payload.selling_price_duplex_per_sheet,
      })
      toast.add({ title: 'Updated', description: 'Printing price updated' })
    } else {
      await pricingStore.createPrintingPrice(slug.value, {
        machine: payload.machine,
        sheet_size: payload.sheet_size,
        color_mode: payload.color_mode,
        selling_price_per_side: payload.selling_price_per_side,
        selling_price_duplex_per_sheet: payload.selling_price_duplex_per_sheet ?? undefined,
      })
      toast.add({ title: 'Added', description: 'Printing price added' })
    }
  } catch (err: unknown) {
    toast.add({
      title: 'Error',
      description: err instanceof Error ? err.message : 'Failed to save',
      color: 'error',
    })
  }
}

function refreshPrinting() {
  pricingStore.fetchPrintingPrices(slug.value)
}

async function onMaterialSave(payload: {
  material_type: MaterialType
  selling_price: string
  buying_price: string | null
  is_active?: boolean
}) {
  const existing = pricingStore.materialPrices.find((p) => p.material_type === payload.material_type)
  materialSaving.value = true
  try {
    if (existing) {
      await pricingStore.updateMaterialPrice(slug.value, existing.id, {
        selling_price: payload.selling_price,
        buying_price: payload.buying_price ?? undefined,
        is_active: payload.is_active,
      })
      toast.add({ title: 'Updated', description: 'Material price updated' })
    } else {
      await pricingStore.createMaterialPrice(slug.value, {
        material_type: payload.material_type,
        unit: 'SQM',
        selling_price: payload.selling_price,
        buying_price: payload.buying_price ?? undefined,
        is_active: payload.is_active ?? true,
      })
      toast.add({ title: 'Added', description: 'Material price added' })
    }
  } catch (err: unknown) {
    toast.add({
      title: 'Error',
      description: err instanceof Error ? err.message : 'Failed to save',
      color: 'error',
    })
  } finally {
    materialSaving.value = false
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      pricingStore.fetchPrintingPrices(slug.value),
      pricingStore.fetchMaterialPrices(slug.value),
      machineStore.fetchMachines(slug.value),
    ])
  } catch (err) {
    console.error('Error fetching pricing:', err)
  } finally {
    loading.value = false
  }
})
</script>
