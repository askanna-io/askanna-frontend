<template>
  <div
    v-if="!$vuetify.display.xs"
    class="text-right flex items-center"
  >
    <AskAnnaButtonIcon
      v-if="uploadStatus.uploads.length"
      @click="uploadStatus.showHideSnackBar()"
    >
      <AskAnnaIcon
        :icon="uploadStatus.iconStatus"
        :color="uploadStatus.colorStatus"
      />
    </AskAnnaButtonIcon>
    <div
      v-else
      class=" h-12 w-12"
    ></div>
    <VMenu
      offset-y
      min-width="100px"
      close-on-content-click
      transition="slide-y-transition"
    >
      <template v-slot:activator="{ props }">
        <AskAnnaButtonIcon v-bind="props">
          <AskAnnaAvatar>
            <VImg :src="workspaceProfile?.avatar?.small || userStore.globalProfile?.avatar?.small" />
          </AskAnnaAvatar>
        </AskAnnaButtonIcon>
      </template>

      <VList>
        <VListItem
          :key="'profile'"
          exact
          :to="profileRoute"
        > Edit my profile</VListItem>
        <VListItem
          href="https://docs.askanna.io"
          target="_blank"
        >
          <VListItemTitle>Documentation</VListItemTitle>
        </VListItem>
        <VListItem
          :key="'logout'"
          exact
          @click="handleLogout()"
        >Logout</VListItem>
      </VList>
    </VMenu>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const userStore = useUserStore()
const peopleStore = usePeopleStore()
const uploadStatus = useUploadStatus()
const { routerPush } = useRouterAskAnna()
const workspaceStore = useWorkspaceStore()

const isMember = computed(() => workspaceStore.workspace.is_member)

const workspaceProfile = computed(() => peopleStore.currentPeople)
const workspaceShortUuid = computed(() => workspaceStore.workspace.suuid)

const profileRoute = computed(() => {
  if (isMember.value) {
    return { name: 'workspace-profile', params: { workspaceId: workspaceShortUuid.value } }
  }
  return { name: 'profile' }
})

const handleLogout = async () => {
  await authStore.logout()
  routerPush({ name: 'signin' })
}
</script>
