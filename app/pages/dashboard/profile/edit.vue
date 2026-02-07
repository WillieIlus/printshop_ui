<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edit profile</h1>
        <p class="text-gray-600 dark:text-gray-400">Update your profile information</p>
      </div>
      <UButton to="/dashboard/profile" variant="ghost" size="sm">Back</UButton>
    </div>
    <CommonLoadingSpinner v-if="profileStore.loading && !profileStore.profile" />
    <ProfileProfileEditForm
      v-else
      :profile="profileStore.profile"
      :loading="profileStore.loading"
      @submit="onSubmit"
      @cancel="goBack"
    />
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
