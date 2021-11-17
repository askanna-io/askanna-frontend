<template>
  <div class="text-right hidden-sm-and-down">
    <v-btn @click="handleShowHideUploadStatus" icon :color="colorStatus">
      <v-icon>{{ iconStatus }}</v-icon>
    </v-btn>
    <v-menu transition="slide-y-transition" min-width="100px" offset-y close-on-content-click>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-avatar class="ma-2" rounded="35" :size="35" tile>
            <v-img
              class="img--rounded"
              :src="
                (workspaceProfile.membership &&
                  workspaceProfile.membership.avatar &&
                  workspaceProfile.membership.avatar.small) ||
                globalProfile.avatar.small
              "
            />
          </v-avatar>
        </v-btn>
      </template>

      <v-list>
        <v-list-item :key="'profile'" exact :to="profileRoute">
          Edit my profile
        </v-list-item>
        <v-list-item href="https://docs.askanna.io" target="_blank">
          <v-list-item-title>Documentation</v-list-item-title>
        </v-list-item>
        <v-list-item :key="'logout'" exact @click="logout">
          Logout
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn v-if="isReview" small icon class="white--text" @click.stop="drawer = !drawer">
      <v-icon dark>mdi-tune</v-icon>
    </v-btn>
  </div>
</template>

<script>
import '@/core/plugins/intercom.js'
import useTitle from '@/core/composition/useTitle'
import { computed, defineComponent } from '@vue/composition-api'
import useAuthStore from '@/features/auth/composition/useAuthStore'
import useUserStore from '@/features/user/composition/useUserStore'
import useUploadStatus from '@/core/components/uploadStatus/useUploadStatus'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'

export default defineComponent({
  name: 'AskAnnaUserMenu',

  setup(_, context) {
    useTitle(context)
    const authStore = useAuthStore()
    const uploadStatus = useUploadStatus()
    const userStore = useUserStore()

    const workspaceStore = useWorkspaceStore()

    const logout = () => authStore.actions.logout()

    const isMember = computed(() => workspaceStore.workspace.value.is_member)
    const globalProfile = computed(() => userStore.state.globalProfile.value)

    const workspaceProfile = computed(() => workspaceStore.state.currentPeople.value)
    const workspaceShortUuid = computed(() => workspaceStore.workspace.value.short_uuid)

    const profileRoute = computed(() => {
      if (isMember.value) {
        return { name: 'workspace-profile', params: { workspaceId: workspaceShortUuid.value } }
      }
      return { name: 'profile' }
    })

    const handleShowHideUploadStatus = () => {
      uploadStatus.showHideSnackBar()
    }

    return {
      logout,
      profileRoute,
      globalProfile,
      workspaceProfile,
      iconStatus: uploadStatus.iconStatus,
      colorStatus: uploadStatus.colorStatus,

      handleShowHideUploadStatus
    }
  }
})
</script>
