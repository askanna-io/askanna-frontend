<template>
  <div v-if="!$vuetify.breakpoint.xsOnly" class="text-right">
    <v-btn @click="uploadStatus.showHideSnackBar()" icon :color="uploadStatus.colorStatus">
      <v-icon>{{ uploadStatus.iconStatus }}</v-icon>
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
                userStore.globalProfile.avatar.small
              "
            />
          </v-avatar>
        </v-btn>
      </template>

      <v-list>
        <v-list-item :key="'profile'" exact :to="profileRoute"> Edit my profile </v-list-item>
        <v-list-item href="https://docs.askanna.io" target="_blank">
          <v-list-item-title>Documentation</v-list-item-title>
        </v-list-item>
        <v-list-item :key="'logout'" exact @click="authStore.logout()">Logout </v-list-item>
      </v-list>
    </v-menu>
    <v-btn v-if="isReview" small icon class="white--text" @click.stop="drawer = !drawer">
      <v-icon dark>mdi-tune</v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import '@/core/plugins/intercom.js'
import { computed } from '@vue/composition-api'
import useTitle from '@/core/composition/useTitle'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { useUserStore } from '@/features/user/useUserStore'
import { usePeopleStore } from '@/features/people/usePeopleStore'
import { useWorkspaceStore } from '@/features/workspace/useWorkspaceStore'
import { useUploadStatus } from '@/core/components/uploadStatus/useUploadStatus'

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
