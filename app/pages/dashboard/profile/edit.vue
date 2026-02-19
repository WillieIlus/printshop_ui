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
    <CommonLoadingSpinner v-if="profileStore.loading && !profileStore.profile" />
    <ProfileProfileEditForm
      v-else
      :profile="profileStore.profile"
      :user="userForForm"
      :loading="saving"
      @submit="onSubmit"
      @cancel="goBack"
    />
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'
import { useUserStore } from '~/stores/user'
import { useAuthStore } from '~/stores/auth'
import type { UserUpdatePayload } from '~/shared/types'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const profileStore = useProfileStore()
const userStore = useUserStore()
const authStore = useAuthStore()
const notification = useNotification()
const saving = ref(false)

const userForForm = computed(() => authStore.user ?? userStore.currentUser)

onMounted(() => {
  profileStore.fetchProfile()
  if (!authStore.user && !userStore.currentUser) {
    userStore.fetchMe()
  }
})

function goBack() {
  navigateTo('/dashboard/profile')
}

async function onSubmit(data: UserUpdatePayload) {
  saving.value = true
  try {
    const result = await userStore.updateMe(data)
    if (result.success) {
      await userStore.fetchMe()
      await profileStore.fetchProfile()
      notification.success('Profile updated successfully')
      await navigateTo('/dashboard/profile')
    } else {
      notification.error(result.error ?? 'Update failed')
    }
  } finally {
    saving.value = false
  }
}
</script>
