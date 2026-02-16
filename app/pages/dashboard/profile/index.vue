<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Profile"
      subtitle="View and manage your profile"
    >
      <template #actions>
        <UButton to="/dashboard/profile/edit" variant="outline" size="sm">
          <UIcon name="i-lucide-edit" class="w-4 h-4 mr-2" />
          Edit profile
        </UButton>
      </template>
    </DashboardPageHeader>

    <DashboardSkeletonState v-if="profileStore.loading" variant="block" />
    <template v-else>
      <div class="col-span-12">
        <ProfileProfileCard :profile="profileStore.profile">
          <template #actions>
            <UButton to="/dashboard/profile/edit" variant="outline" size="sm">
              <UIcon name="i-lucide-edit" class="w-4 h-4 mr-2" />
              Edit profile
            </UButton>
          </template>
        </ProfileProfileCard>
      </div>
      <div class="col-span-12">
        <ProfileSocialLinksManager :links="profileStore.profile?.social_links">
          <template #add-button>
            <UButton to="/dashboard/profile/edit" variant="outline" size="sm">Add link</UButton>
          </template>
        </ProfileSocialLinksManager>
      </div>
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
onMounted(() => profileStore.fetchProfile())
</script>
