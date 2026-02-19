<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
      <p class="text-gray-600 dark:text-gray-400">View and manage your profile</p>
    </div>
    <CommonLoadingSpinner v-if="profileStore.loading" />
    <template v-else>
      <ProfileProfileCard :profile="profileStore.profile">
        <template #actions>
          <UButton :to="'/dashboard/profile/edit'" variant="outline" size="sm">
            <UIcon name="i-lucide-edit" class="w-4 h-4 mr-2" />
            Edit profile
          </UButton>
        </template>
      </ProfileProfileCard>
      <ProfileSocialLinksManager
        :links="profileStore.profile?.social_links"
        @remove="onRemoveLink"
      >
        <template #add-button>
          <UButton to="/dashboard/profile/edit" variant="outline" size="sm">Add link</UButton>
        </template>
      </ProfileSocialLinksManager>
    </template>
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

async function onRemoveLink(id: number) {
  const result = await profileStore.deleteSocialLink(id)
  if (result.success) {
    notification.success('Social link removed')
  } else {
    notification.error(result.error ?? 'Failed to remove link')
  }
}
</script>
