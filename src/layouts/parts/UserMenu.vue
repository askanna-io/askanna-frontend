<template>
  <div v-if="!$vuetify.breakpoint.xsOnly" class="text-right">
    <AskAnnaButton @click="uploadStatus.showHideSnackBar()" icon :color="uploadStatus.colorStatus">
      <AskAnnaIcon>{{ uploadStatus.iconStatus }}</AskAnnaIcon>
    </AskAnnaButton>
    <v-menu transition="slide-y-transition" min-width="100px" offset-y close-on-content-click>
      <template v-slot:activator="{ on }">
        <AskAnnaButton icon v-on="on">
          <AskAnnaAvatar class="ma-2" rounded="35" :size="35" tile>
            <v-img
              class="img--rounded"
              :src="
                (workspaceProfile.membership &&
                  workspaceProfile.membership.avatar &&
                  workspaceProfile.membership.avatar.small) ||
                userStore.globalProfile.avatar.small
              "
            />
          </AskAnnaAvatar>
        </AskAnnaButton>
      </template>

      <v-list>
        <v-list-item :key="'profile'" exact :to="profileRoute"> Edit my profile </v-list-item>
        <v-list-item href="https://docs.askanna.io" target="_blank">
          <v-list-item-title>Documentation</v-list-item-title>
        </v-list-item>
        <v-list-item :key="'logout'" exact @click="authStore.logout()">Logout </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
useTitle()
const authStore = useAuthStore()
const userStore = useUserStore()
const peopleStore = usePeopleStore()
const uploadStatus = useUploadStatus()
const workspaceStore = useWorkspaceStore()

const isMember = computed(() => workspaceStore.workspace.is_member)

const workspaceProfile = computed(() => peopleStore.currentPeople)
const workspaceShortUuid = computed(() => workspaceStore.workspace.short_uuid)

const profileRoute = computed(() => {
  if (isMember.value) {
    return { name: 'workspace-profile', params: { workspaceId: workspaceShortUuid.value } }
  }
  return { name: 'profile' }
})
</script>
