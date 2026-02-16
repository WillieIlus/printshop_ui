<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Machines"
      subtitle="Add your printers and equipment. Required before setting printing prices."
    >
      <template #actions>
        <UButton :to="`/dashboard/shops/${slug}`" variant="ghost" size="sm">Back</UButton>
        <UButton color="primary" @click="openModal()">
          <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
          Add machine
        </UButton>
      </template>
    </DashboardPageHeader>

    <div class="col-span-12">
      <DashboardSkeletonState v-if="machineStore.loading && !machineStore.machines.length" variant="table" :rows="5" />
      <template v-else>
        <DashboardDataTableCard v-if="machineStore.machines.length" title="Machines">
          <template #thead>
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</th>
              <th class="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </template>
          <template #tbody>
            <tr
              v-for="machine in machineStore.machines"
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
                <UButton variant="ghost" size="xs" @click="editMachine(machine)">Edit</UButton>
                <UButton variant="ghost" size="xs" color="error" @click="confirmDelete(machine)">
                  Delete
                </UButton>
              </td>
            </tr>
          </template>
        </DashboardDataTableCard>
        <DashboardEmptyState
          v-else
          title="No machines yet"
          description="Add your first printer or equipment. You'll need at least one machine before setting printing prices."
          icon="i-lucide-printer"
        >
          <UButton color="primary" @click="openModal()">
            Add first machine
          </UButton>
        </DashboardEmptyState>
      </template>
    </div>

    <UModal v-model:open="modalOpen" :title="editing ? 'Edit machine' : 'Add machine'">
      <template #body>
        <MachinesMachineForm
          :key="editing?.id ?? 'new'"
          :machine="editing"
          :loading="formLoading"
          @submit="onSubmit"
          @cancel="closeModal"
        />
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Machine } from '~/stores/machine'
import { useMachineStore } from '~/stores/machine'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const machineStore = useMachineStore()
const toast = useToast()

const slug = computed(() => route.params.slug as string)
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

async function onSubmit(data: { name: string; machine_type?: string }) {
  formLoading.value = true
  try {
    if (editing.value) {
      await machineStore.updateMachine(slug.value, editing.value.id, data)
      toast.add({ title: 'Updated', description: 'Machine updated' })
    } else {
      await machineStore.createMachine(slug.value, data)
      toast.add({ title: 'Added', description: 'Machine added' })
    }
    closeModal()
  } catch (err: unknown) {
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
  } catch (err: unknown) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to delete', color: 'error' })
  }
}

onMounted(async () => {
  await machineStore.fetchMachines(slug.value)
})
</script>
