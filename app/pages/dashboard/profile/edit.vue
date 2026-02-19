<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Edit profile"
      subtitle="Update your profile information"
    >
      <template #actions>
        <UButton to="/dashboard/profile" variant="ghost" size="sm">Back</UButton>
      </template>
    </DashboardPageHeader>

    <DashboardSkeletonState v-if="profileStore.loading && !profileStore.profile" variant="block" />
    <div v-else class="col-span-12">
      <ProfileProfileEditForm
        :profile="profileStore.profile"
        :loading="profileStore.loading"
        @submit="onSubmit"
        @cancel="goBack"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const profileStore = useProfileStore()
const notification = useNotification()

onMounted(() => profileStore.fetchProfile())

function goBack() {
  navigateTo('/dashboard/profile')
}

async function onSubmit(data: Parameters<typeof profileStore.updateProfile>[0]) {
  const result = await profileStore.updateProfile(data)
  if (result.success) {
    notification.success('Profile updated')
    await navigateTo('/dashboard/profile')
  } else {
    notification.error(result.error ?? 'Update failed')
  }
}
</script>
