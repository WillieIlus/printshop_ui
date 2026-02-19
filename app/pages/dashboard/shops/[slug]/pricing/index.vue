<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Stock & prices</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Paper prices, printing rates, finishing services</p>
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
    <div class="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1.5">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
        :class="activeTab === tab.id
          ? 'bg-flamingo-500 text-white shadow-sm'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
        @click="setActiveTab(tab.id)"
      >
        {{ tab.name }}
        <span
          v-if="tab.count !== undefined"
          class="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
          :class="activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Loading State -->
    <CommonLoadingSpinner v-if="loading" />

    <!-- Tab Content -->
    <template v-else>
      <!-- Printing Prices -->
      <div v-if="activeTab === 'printing'" class="space-y-4">
        <div v-if="!machineStore.machines.length" class="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p class="text-sm text-amber-800">
            <UIcon name="i-lucide-alert-circle" class="inline w-4 h-4 mr-1" />
            Add machines first in <NuxtLink :to="`/dashboard/shops/${slug}/machines`" class="font-semibold text-amber-700 hover:underline">Machines</NuxtLink> before setting printing prices.
          </p>
        </div>
        <div class="flex justify-between items-center">
          <p class="text-sm text-gray-600">Set the price per printed side for each paper size and color mode.</p>
          <UButton
            class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600"
            :disabled="!machineStore.machines.length"
            @click="openPrintingModal()"
          >
            <UIcon name="i-lucide-plus" class="w-4 h-4 mr-1" />
            Add Printing Price
          </UButton>
        </div>

        <div v-if="pricingStore.printingPrices.length" class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sell Price</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Buy Price</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Profit</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Active</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="price in pricingStore.printingPrices" :key="price.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ price.sheet_size }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ price.color_mode }}</td>
                <td class="px-4 py-3 text-sm text-right font-medium text-gray-900">KES {{ price.selling_price_per_side }}</td>
                <td class="px-4 py-3 text-sm text-right text-gray-500">{{ price.buying_price_per_side ? `KES ${price.buying_price_per_side}` : '-' }}</td>
                <td class="px-4 py-3 text-sm text-right text-green-600">KES {{ price.profit_per_side }}</td>
                <td class="px-4 py-3 text-center">
                  <UBadge :color="price.is_active ? 'success' : 'neutral'" variant="soft">
                    {{ price.is_active ? 'Yes' : 'No' }}
                  </UBadge>
                </td>
                <td class="px-4 py-3 text-right">
                  <UButton variant="ghost" size="xs" @click="editPrintingPrice(price)">Edit</UButton>
                  <UButton variant="ghost" size="xs" color="error" @click="deletePrintingPrice(price.id)">Delete</UButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <CommonEmptyState v-else title="No printing prices" description="Add machines first, then add printing prices per machine and paper size.">
          <NuxtLink v-if="!machineStore.machines.length" :to="`/dashboard/shops/${slug}/machines`">
            <UButton class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600">Add machines first</UButton>
          </NuxtLink>
          <UButton
            v-else
            class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600"
            @click="openPrintingModal()"
          >
            Add first printing price
          </UButton>
        </CommonEmptyState>
      </div>

      <!-- Paper Prices -->
      <div v-if="activeTab === 'paper'" class="space-y-4">
        <div class="flex justify-between items-center">
          <p class="text-sm text-gray-600">Set paper prices by GSM (weight). Customers see this as their rate card.</p>
          <UButton class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600" @click="openPaperModal()">
            <UIcon name="i-lucide-plus" class="w-4 h-4 mr-1" />
            Add Paper Price
          </UButton>
        </div>

        <div v-if="pricingStore.paperPrices.length" class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">GSM</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Buy Price</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sell Price</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Profit</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Margin</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="price in pricingStore.paperPrices" :key="price.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ price.gsm }} gsm</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ price.sheet_size }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ price.paper_type }}</td>
                <td class="px-4 py-3 text-sm text-right text-gray-500">KES {{ price.buying_price }}</td>
                <td class="px-4 py-3 text-sm text-right font-medium text-gray-900">KES {{ price.selling_price }}</td>
                <td class="px-4 py-3 text-sm text-right text-green-600">KES {{ price.profit }}</td>
                <td class="px-4 py-3 text-sm text-right text-gray-500">{{ parseFloat(price.margin_percent).toFixed(1) }}%</td>
                <td class="px-4 py-3 text-right">
                  <UButton variant="ghost" size="xs" @click="editPaperPrice(price)">Edit</UButton>
                  <UButton variant="ghost" size="xs" color="error" @click="deletePaperPrice(price.id)">Delete</UButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <CommonEmptyState v-else title="No paper prices" description="Add paper prices by GSM to create your rate card.">
          <UButton class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600" @click="openPaperModal()">Add First Paper Price</UButton>
        </CommonEmptyState>
      </div>

      <!-- Finishing Services -->
      <div v-if="activeTab === 'finishing'" class="space-y-4">
        <div class="flex justify-between items-center">
          <p class="text-sm text-gray-600">Add finishing services like lamination, binding, and cutting.</p>
          <UButton class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600" @click="openFinishingModal()">
            <UIcon name="i-lucide-plus" class="w-4 h-4 mr-1" />
            Add Finishing Service
          </UButton>
        </div>

        <div v-if="pricingStore.finishingServices.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="service in pricingStore.finishingServices" 
            :key="service.id" 
            class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium text-gray-900">{{ service.name }}</h3>
                <p class="text-sm text-gray-500">{{ service.category }}</p>
              </div>
              <UBadge v-if="service.is_default" color="info" variant="soft" size="xs">Default</UBadge>
            </div>
            <div class="mt-3 flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-900">KES {{ service.selling_price }}</span>
              <span class="text-sm text-gray-500">{{ service.charge_by.replace('PER_', '').toLowerCase() }}</span>
            </div>
            <div class="mt-3 flex gap-2">
              <UButton variant="ghost" size="xs" @click="editFinishingService(service)">Edit</UButton>
              <UButton variant="ghost" size="xs" color="error" @click="deleteFinishingService(service.id)">Delete</UButton>
            </div>
          </div>
        </div>
        <CommonEmptyState v-else title="No finishing services" description="Add services like lamination and binding.">
          <UButton class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600" @click="openFinishingModal()">Add First Finishing Service</UButton>
        </CommonEmptyState>
      </div>

      <!-- Volume Discounts -->
      <div v-if="activeTab === 'discounts'" class="space-y-4">
        <div class="flex justify-between items-center">
          <p class="text-sm text-gray-600">Set up bulk discounts for large orders.</p>
          <UButton class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600" @click="openDiscountModal()">
            <UIcon name="i-lucide-plus" class="w-4 h-4 mr-1" />
            Add Volume Discount
          </UButton>
        </div>

        <div v-if="pricingStore.volumeDiscounts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="discount in pricingStore.volumeDiscounts" 
            :key="discount.id" 
            class="bg-white rounded-lg border border-gray-200 p-4"
          >
            <h3 class="font-medium text-gray-900">{{ discount.name }}</h3>
            <p class="text-2xl font-bold text-green-600 mt-2">{{ discount.discount_percent }}% OFF</p>
            <p class="text-sm text-gray-500 mt-1">Min. {{ discount.min_quantity }} items</p>
            <div class="mt-3 flex gap-2">
              <UButton variant="ghost" size="xs" @click="editDiscount(discount)">Edit</UButton>
              <UButton variant="ghost" size="xs" color="error" @click="deleteDiscount(discount.id)">Delete</UButton>
            </div>
          </div>
        </div>
        <CommonEmptyState v-else title="No volume discounts" description="Encourage bulk orders with volume discounts.">
          <UButton class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600" @click="openDiscountModal()">Add First Discount</UButton>
        </CommonEmptyState>
      </div>
    </template>

    <!-- Modals with table-style forms -->
    <DashboardModalForm
      v-model="printingModalOpen"
      :title="editingPrintingPrice ? 'Edit Printing Price' : 'Add Printing Price'"
      :description="editingPrintingPrice ? 'Edit price per printed side.' : 'Set price per printed side for paper size and color mode.'"
    >
      <PricingPrintingPriceForm
        v-if="printingFormReady"
        :key="editingPrintingPrice?.id ?? 'new'"
        :price="editingPrintingPrice"
        :machine-options="machineOptions"
        :loading="formLoading"
        @submit="submitPrintingPrice"
        @cancel="closePrintingModal"
      />
    </DashboardModalForm>
    <DashboardModalForm
      v-model="paperModalOpen"
      :title="editingPaperPrice ? 'Edit Paper Price' : 'Add Paper Price'"
      :description="editingPaperPrice ? 'Edit paper price by GSM.' : 'Set paper price by GSM for your rate card.'"
    >
      <PricingPaperPriceForm
        v-if="paperFormReady"
        :key="editingPaperPrice?.id ?? 'new'"
        :price="editingPaperPrice"
        :loading="formLoading"
        @submit="submitPaperPrice"
        @cancel="closePaperModal"
      />
    </DashboardModalForm>
    <DashboardModalForm
      v-model="finishingModalOpen"
      :title="editingFinishingService ? 'Edit Finishing Service' : 'Add Finishing Service'"
      :description="editingFinishingService ? 'Edit finishing service details.' : 'Add finishing services like lamination and binding.'"
    >
      <PricingFinishingServiceForm
        v-if="finishingFormReady"
        :key="editingFinishingService?.id ?? 'new'"
        :service="editingFinishingService"
        :loading="formLoading"
        @submit="submitFinishingService"
        @cancel="closeFinishingModal"
      />
    </DashboardModalForm>
    <DashboardModalForm
      v-model="discountModalOpen"
      :title="editingDiscount ? 'Edit Volume Discount' : 'Add Volume Discount'"
      :description="editingDiscount ? 'Edit bulk discount details.' : 'Set up bulk discounts for large orders.'"
    >
      <PricingVolumeDiscountForm
        v-if="discountFormReady"
        :key="editingDiscount?.id ?? 'new'"
        :discount="editingDiscount"
        :loading="formLoading"
        @submit="submitVolumeDiscount"
        @cancel="closeDiscountModal"
      />
    </DashboardModalForm>
  </div>
</template>

<script setup lang="ts">
import type {
  PrintingPrice,
  PaperPrice,
  FinishingService,
  VolumeDiscount,
  PrintingPriceForm,
  PaperPriceForm,
  FinishingServiceForm,
  VolumeDiscountForm,
} from '~/shared/types'
import { usePricingStore } from '~/stores/pricing'
import { useMachineStore } from '~/stores/machine'

type TabId = 'printing' | 'paper' | 'finishing' | 'discounts'

definePageMeta({ 
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner']
})

const route = useRoute()
const pricingStore = usePricingStore()
const toast = useToast()

const slug = computed(() => route.params.slug as string)

// Tab management
const activeTab = ref<TabId>('paper')

function setActiveTab(id: string) {
  activeTab.value = id as TabId
}

const tabs = computed(() => [
  { id: 'paper' as TabId, name: 'Paper Prices', count: pricingStore.paperPrices.length },
  { id: 'printing' as TabId, name: 'Printing Prices', count: pricingStore.printingPrices.length },
  { id: 'finishing' as TabId, name: 'Finishing Services', count: pricingStore.finishingServices.length },
  { id: 'discounts' as TabId, name: 'Volume Discounts', count: pricingStore.volumeDiscounts.length },
])

// Loading state
const loading = ref(true)

// Modals
const printingModalOpen = ref(false)
const paperModalOpen = ref(false)
const finishingModalOpen = ref(false)
const discountModalOpen = ref(false)
const printingFormReady = ref(false)
const paperFormReady = ref(false)
const finishingFormReady = ref(false)
const discountFormReady = ref(false)
const editingPrintingPrice = ref<PrintingPrice | null>(null)
const editingPaperPrice = ref<PaperPrice | null>(null)
const editingFinishingService = ref<FinishingService | null>(null)
const editingDiscount = ref<VolumeDiscount | null>(null)
const formLoading = ref(false)
const machineStore = useMachineStore()

const machineOptions = computed(() => machineStore.machineOptions)

const openPrintingModal = (price?: PrintingPrice) => {
  editingPrintingPrice.value = price ?? null
  printingModalOpen.value = true
}
const editPrintingPrice = (price: PrintingPrice) => openPrintingModal(price)
const closePrintingModal = () => {
  printingModalOpen.value = false
  editingPrintingPrice.value = null
}
watch(printingModalOpen, (open) => {
  if (open) {
    printingFormReady.value = false
    nextTick(() => { printingFormReady.value = true })
  } else {
    printingFormReady.value = false
    editingPrintingPrice.value = null
  }
})
async function submitPrintingPrice(data: PrintingPriceForm) {
  formLoading.value = true
  try {
    if (editingPrintingPrice.value) {
      await pricingStore.updatePrintingPrice(slug.value, editingPrintingPrice.value.id, data)
      toast.add({ title: 'Updated', description: 'Printing price updated' })
    } else {
      await pricingStore.createPrintingPrice(slug.value, data)
      toast.add({ title: 'Added', description: 'Printing price added' })
    }
    closePrintingModal()
  } catch (err: unknown) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to save', color: 'error' })
  } finally {
    formLoading.value = false
  }
}
const deletePrintingPrice = async (id: number) => {
  if (confirm('Delete this printing price?')) {
    await pricingStore.deletePrintingPrice(slug.value, id)
    toast.add({ title: 'Deleted', description: 'Printing price deleted' })
  }
}

const openPaperModal = (price?: PaperPrice) => {
  editingPaperPrice.value = price ?? null
  paperModalOpen.value = true
}
const editPaperPrice = (price: PaperPrice) => openPaperModal(price)
const closePaperModal = () => {
  paperModalOpen.value = false
  editingPaperPrice.value = null
}
watch(paperModalOpen, (open) => {
  if (open) {
    paperFormReady.value = false
    nextTick(() => { paperFormReady.value = true })
  } else {
    paperFormReady.value = false
    editingPaperPrice.value = null
  }
})
async function submitPaperPrice(data: PaperPriceForm & { gsm?: string | number }) {
  formLoading.value = true
  const payload = { ...data, gsm: Number(data.gsm) }
  try {
    if (editingPaperPrice.value) {
      await pricingStore.updatePaperPrice(slug.value, editingPaperPrice.value.id, payload)
      toast.add({ title: 'Updated', description: 'Paper price updated' })
    } else {
      await pricingStore.createPaperPrice(slug.value, payload)
      toast.add({ title: 'Added', description: 'Paper price added' })
    }
    closePaperModal()
  } catch (err: unknown) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to save', color: 'error' })
  } finally {
    formLoading.value = false
  }
}
const deletePaperPrice = async (id: number) => {
  if (confirm('Delete this paper price?')) {
    await pricingStore.deletePaperPrice(slug.value, id)
    toast.add({ title: 'Deleted', description: 'Paper price deleted' })
  }
}

const openFinishingModal = (service?: FinishingService) => {
  editingFinishingService.value = service ?? null
  finishingModalOpen.value = true
}
const editFinishingService = (service: FinishingService) => openFinishingModal(service)
const closeFinishingModal = () => {
  finishingModalOpen.value = false
  editingFinishingService.value = null
}
watch(finishingModalOpen, (open) => {
  if (open) {
    finishingFormReady.value = false
    nextTick(() => { finishingFormReady.value = true })
  } else {
    finishingFormReady.value = false
    editingFinishingService.value = null
  }
})
async function submitFinishingService(data: FinishingServiceForm) {
  formLoading.value = true
  try {
    if (editingFinishingService.value) {
      await pricingStore.updateFinishingService(slug.value, editingFinishingService.value.id, data)
      toast.add({ title: 'Updated', description: 'Finishing service updated' })
    } else {
      await pricingStore.createFinishingService(slug.value, data)
      toast.add({ title: 'Added', description: 'Finishing service added' })
    }
    closeFinishingModal()
  } catch (err: unknown) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to save', color: 'error' })
  } finally {
    formLoading.value = false
  }
}
const deleteFinishingService = async (id: number) => {
  if (confirm('Delete this finishing service?')) {
    await pricingStore.deleteFinishingService(slug.value, id)
    toast.add({ title: 'Deleted', description: 'Finishing service deleted' })
  }
}

const openDiscountModal = (discount?: VolumeDiscount) => {
  editingDiscount.value = discount ?? null
  discountModalOpen.value = true
}
const editDiscount = (discount: VolumeDiscount) => openDiscountModal(discount)
const closeDiscountModal = () => {
  discountModalOpen.value = false
  editingDiscount.value = null
}
watch(discountModalOpen, (open) => {
  if (open) {
    discountFormReady.value = false
    nextTick(() => { discountFormReady.value = true })
  } else {
    discountFormReady.value = false
    editingDiscount.value = null
  }
})
async function submitVolumeDiscount(data: VolumeDiscountForm) {
  formLoading.value = true
  try {
    if (editingDiscount.value) {
      await pricingStore.updateVolumeDiscount(slug.value, editingDiscount.value.id, data)
      toast.add({ title: 'Updated', description: 'Volume discount updated' })
    } else {
      await pricingStore.createVolumeDiscount(slug.value, data)
      toast.add({ title: 'Added', description: 'Volume discount added' })
    }
    closeDiscountModal()
  } catch (err: unknown) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to save', color: 'error' })
  } finally {
    formLoading.value = false
  }
}
const deleteDiscount = async (id: number) => {
  if (confirm('Delete this discount?')) {
    await pricingStore.deleteVolumeDiscount(slug.value, id)
    toast.add({ title: 'Deleted', description: 'Volume discount deleted' })
  }
}

// Fetch all pricing data
onMounted(async () => {
  try {
    await Promise.all([
      pricingStore.fetchPrintingPrices(slug.value),
      pricingStore.fetchPaperPrices(slug.value),
      pricingStore.fetchFinishingServices(slug.value),
      pricingStore.fetchVolumeDiscounts(slug.value),
      machineStore.fetchMachines(slug.value),
    ])
  } catch (err) {
    console.error('Error fetching pricing:', err)
  } finally {
    loading.value = false
  }
})
</script>
