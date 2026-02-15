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

    <!-- Modal: Teleport to app-level portal (outside layout overflow-hidden) -->
    <Teleport to="#modal-portal">
      <div
        v-if="modalOpen"
      class="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="machine-modal-title"
      @click.self="closeModal"
    >
      <div
        class="absolute inset-0 bg-black/50"
        aria-hidden="true"
        @click="closeModal"
      />
      <div
        class="relative rounded-xl shadow-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 max-w-lg w-full max-h-[calc(100dvh-2rem)] overflow-hidden flex flex-col"
        role="document"
      >
        <div class="flex justify-between items-center p-4 sm:px-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h2 id="machine-modal-title" class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ editing ? 'Edit machine' : 'Add machine' }}
          </h2>
          <button
            type="button"
            class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close"
            @click="closeModal"
          >
            <UIcon name="i-lucide-x" class="w-5 h-5" />
          </button>
        </div>
        <div class="p-4 sm:p-6 overflow-y-auto flex-1">
          <MachinesMachineForm
            :key="editing?.id ?? 'new'"
            :machine="editing"
            :loading="formLoading"
            @submit="onSubmit"
            @cancel="closeModal"
          />
        </div>
      </div>
    </div>
    </Teleport>
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
