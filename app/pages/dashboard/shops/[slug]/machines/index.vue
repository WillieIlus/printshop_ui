<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Machines</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Add your printers and equipment. Required before setting printing prices.
        </p>
      </div>
      <div class="flex gap-2">
        <UButton :to="`/dashboard/shops/${slug}`" variant="ghost" size="sm">Back</UButton>
        <UButton
          class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600"
          @click="openModal()"
        >
          <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
          Add machine
        </UButton>
      </div>
    </div>

    <CommonLoadingSpinner v-if="machineStore.loading && !machines.length" />
    <template v-else>
      <div v-if="machines.length" class="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="machine in machines"
              :key="machine.id"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ machine.name }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">
                {{ machine.type_display ?? machine.machine_type ?? 'Digital Printer' }}
              </td>
              <td class="px-4 py-3 text-center">
                <UBadge :color="machine.is_active !== false ? 'success' : 'neutral'" variant="soft" size="xs">
                  {{ machine.is_active !== false ? 'Active' : 'Inactive' }}
                </UBadge>
              </td>
              <td class="px-4 py-3 text-right">
                <UButton variant="ghost" size="xs" @click="editMachine(machine)">Edit</UButton>
                <UButton variant="ghost" size="xs" color="error" @click="confirmDelete(machine)">
                  Delete
                </UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <CommonEmptyState
        v-else
        title="No machines yet"
        description="Add your first printer or equipment. You'll need at least one machine before setting printing prices."
      >
        <UButton class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600" @click="openModal()">
          Add first machine
        </UButton>
      </CommonEmptyState>
    </template>

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
        @submit="onSubmit"
        @cancel="closeModal"
      />
    </CommonSimpleModal>
  </div>
</template>

<script setup lang="ts">
import type { Machine } from '~/stores/machine'
import { useMachineStore } from '~/stores/machine'
import { useShopStore } from '~/stores/shop'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const machineStore = useMachineStore()
const shopStore = useShopStore()
const toast = useToast()

const slug = computed(() => route.params.slug as string)

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
    }
    closeModal()
  } catch (err: unknown) {
    console.error('Machine create/update failed:', err)
    const msg = err instanceof Error ? err.message : machineStore.error ?? 'Failed to save'
    toast.add({ title: 'Error', description: msg, color: 'error' })
  } finally {
    formLoading.value = false
  }
}

async function confirmDelete(machine: Machine) {
  if (!confirm(`Delete "${machine.name}"? This may affect printing prices.`)) return
  try {
    await machineStore.deleteMachine(slug.value, machine.id)
    toast.add({ title: 'Deleted', description: 'Machine removed' })
  } catch (err: any) {
    toast.add({ title: 'Error', description: err.message ?? 'Failed to delete', color: 'error' })
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && modalOpen.value) closeModal()
}
onMounted(async () => {
  document.addEventListener('keydown', onKeydown)
  await machineStore.fetchMachines(slug.value)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>
