<template>
  <div class="space-y-6">
    <CommonPageHeader
      title="Machines"
      :description="'Add your printers and equipment. Required before setting printing prices.'"
      :badge="subscription?.plan_name"
    >
      <template #actions>
        <UButton :to="`/dashboard/shops/${slug}`" color="neutral" variant="ghost" size="sm">
          Back
        </UButton>
        <UButton
          v-if="canAddMachine"
          color="primary"
          @click="openModal()"
        >
          <UIcon name="i-lucide-plus" class="mr-2 h-4 w-4" />
          Add machine
        </UButton>
        <UButton
          v-else
          color="amber"
          @click="upgradeModalOpen = true"
        >
          <UIcon name="i-lucide-lock" class="mr-2 h-4 w-4" />
          Upgrade to add more
        </UButton>
      </template>
    </CommonPageHeader>

    <!-- Skeleton → Empty → Error → Content -->
    <CommonDataListSkeleton v-if="machineStore.loading && !machines.length" />
    <CommonErrorState
      v-else-if="machineStore.error"
      title="Could not load machines"
      :message="machineStore.error"
    >
      <UButton color="primary" @click="retryFetch">
        <UIcon name="i-lucide-refresh-cw" class="mr-2 h-4 w-4" />
        Try again
      </UButton>
    </CommonErrorState>
    <template v-else>
      <CommonSectionCard v-if="machines.length">
        <div class="overflow-x-auto -mx-4 sm:mx-0">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</th>
                <th class="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="machine in machines"
                :key="machine.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{{ machine.name }}</td>
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {{ machine.type_display ?? machine.machine_type ?? 'Digital Printer' }}
                </td>
                <td class="px-4 py-3 text-center">
                  <UBadge :color="machine.is_active !== false ? 'success' : 'neutral'" variant="soft" size="xs">
                    {{ machine.is_active !== false ? 'Active' : 'Inactive' }}
                  </UBadge>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex justify-end gap-1">
                    <UButton color="neutral" variant="ghost" size="xs" @click="editMachine(machine)">Edit</UButton>
                    <UButton color="error" variant="ghost" size="xs" @click="openDeleteConfirm(machine)">
                      Delete
                    </UButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CommonSectionCard>
      <CommonEmptyState
        v-else
        title="No machines yet"
        description="Add your first printer or equipment. You'll need at least one machine before setting printing prices."
      >
        <UButton
          v-if="canAddMachine"
          color="primary"
          @click="openModal()"
        >
          Add first machine
        </UButton>
        <UButton
          v-else
          color="amber"
          @click="upgradeModalOpen = true"
        >
          <UIcon name="i-lucide-lock" class="mr-2 h-4 w-4" />
          Upgrade to add machines
        </UButton>
      </CommonEmptyState>
    </template>

    <CommonConfirmDialog
      v-model:open="deleteConfirmOpen"
      title="Delete machine?"
      :message="deleteConfirmMessage"
      confirm-label="Delete"
      cancel-label="Cancel"
      confirm-color="error"
      @confirm="executeDelete"
    />

    <CommonSimpleModal
      :open="modalOpen"
      :title="editing ? 'Edit machine' : 'Add machine'"
      :description="editing ? 'Edit printer or equipment details.' : 'Add a printer or equipment. Required before setting printing prices.'"
      @update:open="onModalOpenChange"
    >
      <MachinesMachineForm
        v-if="formReady"
        :key="editing?.id ?? 'new'"
        :machine="editing"
        :loading="formLoading"
        :can-add-printing="subscription?.can_add_printing_machine ?? true"
        :can-add-finishing="subscription?.can_add_finishing_machine ?? true"
        @submit="onSubmit"
        @cancel="closeModal"
      />
    </CommonSimpleModal>

    <SubscriptionUpgradeModal
      :open="upgradeModalOpen"
      :shop-slug="slug"
      :reason="subscription ? `Your plan allows ${subscription.usage.printing_machines}/${subscription.limits.max_printing_machines || '∞'} printing and ${subscription.usage.finishing_machines}/${subscription.limits.max_finishing_machines || '∞'} finishing machines.` : 'Upgrade to add more machines.'"
      :plans="subscriptionStore.plans"
      @update:open="upgradeModalOpen = $event"
    />
  </div>
</template>

<script setup lang="ts">
import type { Machine } from '~/stores/machine'
import { useMachineStore } from '~/stores/machine'
import { useShopStore } from '~/stores/shop'
import { useSubscriptionStore } from '~/stores/subscription'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const machineStore = useMachineStore()
const shopStore = useShopStore()
const subscriptionStore = useSubscriptionStore()
const toast = useToast()

const slug = computed(() => route.params.slug as string)

const subscription = computed(() => subscriptionStore.getSubscription(slug.value))
const canAddMachine = computed(
  () =>
    (subscription.value?.can_add_printing_machine ?? true) ||
    (subscription.value?.can_add_finishing_machine ?? false)
)
const upgradeModalOpen = ref(false)

// Shop detail API (public) embeds machines; machines API (auth required) may fail.
// Use shop.machines as fallback since shop-owner middleware already loaded the shop.
const machines = computed(() => {
  if (machineStore.machines.length) return machineStore.machines
  return (shopStore.currentShop?.machines ?? []) as Machine[]
})
const modalOpen = ref(false)
const formReady = ref(false)
const editing = ref<Machine | null>(null)
const formLoading = ref(false)

function openModal(machine?: Machine) {
  editing.value = machine ?? null
  modalOpen.value = true
}

function editMachine(machine: Machine) {
  openModal(machine)
}

function closeModal() {
  modalOpen.value = false
  editing.value = null
}

function onModalOpenChange(open: boolean) {
  modalOpen.value = open
  if (!open) editing.value = null
}

watch(modalOpen, (open) => {
  if (open) {
    formReady.value = false
    nextTick(() => { formReady.value = true })
  } else {
    formReady.value = false
    editing.value = null
  }
})

async function onSubmit(data: { name: string; machine_type?: string | { value: string } }) {
  formLoading.value = true
  try {
    const machineType =
      typeof data.machine_type === 'object' && data.machine_type?.value
        ? data.machine_type.value
        : (data.machine_type as string) ?? 'DIGITAL'
    const payload = { name: data.name, machine_type: machineType }
    if (editing.value) {
      await machineStore.updateMachine(slug.value, editing.value.id, payload)
      toast.add({ title: 'Updated', description: 'Machine updated' })
    } else {
      await machineStore.createMachine(slug.value, payload)
      toast.add({ title: 'Added', description: 'Machine added' })
      await subscriptionStore.fetchSubscription(slug.value)
    }
    closeModal()
  } catch (err: unknown) {
    console.error('Machine create/update failed:', err)
    const msg = err instanceof Error ? err.message : machineStore.error ?? 'Failed to save'
    toast.add({ title: 'Error', description: msg, color: 'error' })
    if (msg.toLowerCase().includes('upgrade')) {
      closeModal()
      upgradeModalOpen.value = true
    }
  } finally {
    formLoading.value = false
  }
}

const deleteConfirmOpen = ref(false)
const machineToDelete = ref<Machine | null>(null)
const deleteConfirmMessage = computed(() =>
  machineToDelete.value
    ? `Delete "${machineToDelete.value.name}"? This may affect printing prices.`
    : ''
)

function openDeleteConfirm(machine: Machine) {
  machineToDelete.value = machine
  deleteConfirmOpen.value = true
}

async function executeDelete() {
  const m = machineToDelete.value
  if (!m) return
  try {
    await machineStore.deleteMachine(slug.value, m.id)
    toast.add({ title: 'Deleted', description: 'Machine removed' })
  } catch (err: unknown) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to delete', color: 'error' })
  } finally {
    machineToDelete.value = null
  }
}

async function retryFetch() {
  machineStore.error = null
  await machineStore.fetchMachines(slug.value)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && modalOpen.value) closeModal()
}
onMounted(async () => {
  document.addEventListener('keydown', onKeydown)
  await Promise.all([
    machineStore.fetchMachines(slug.value),
    subscriptionStore.fetchSubscription(slug.value),
    subscriptionStore.fetchPlans(),
  ])
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>
