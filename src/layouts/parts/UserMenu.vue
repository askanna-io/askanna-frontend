<template>
  <div v-if="!$vuetify.breakpoint.xsOnly" class="text-right">
    <AskAnnaButton @click="uploadStatus.showHideSnackBar()" icon :color="uploadStatus.colorStatus">
      <AskAnnaIcon>{{ uploadStatus.iconStatus }}</AskAnnaIcon>
    </AskAnnaButton>
    <VMenu transition="slide-y-transition" min-width="100px" offset-y close-on-content-click>
      <template v-slot:activator="{ on }">
        <AskAnnaButton icon v-on="on">
          <AskAnnaAvatar class="ma-2" rounded="35" :size="35" tile>
            <VImg
              class="img--rounded"
              :src="workspaceProfile?.avatar?.small || userStore.globalProfile?.avatar?.small"
            />
          </AskAnnaAvatar>
        </AskAnnaButton>
      </template>

      <VList>
        <VListItem :key="'profile'" exact :to="profileRoute"> Edit my profile</VListItem>
        <VListItem href="https://docs.askanna.io" target="_blank">
          <VListItemTitle>Documentation</VListItemTitle>
        </VListItem>
        <VListItem :key="'logout'" exact @click="handleLogout()">Logout</VListItem>
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
