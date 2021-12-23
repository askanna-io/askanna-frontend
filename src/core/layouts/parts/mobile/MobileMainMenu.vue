<template>
  <v-card
    v-sticky="true"
    :flat="!sticked"
    on-stick="handleOnStick"
    class="mx-auto askAnna-main-menu"
    sticky-offset="{top: 58, bottom: 10}"
  >
    <v-list dense>
      <MobileWorkspaceMenu @onClose="handleClickOnMenuItem" />
      <MobileProjectMenu @onClose="handleClickOnMenuItem" />

      <v-list class="pt-0">
        <v-list-item @click="handleClickOnMenuItem" href="https://docs.askanna.io" target="_blank">
          <v-list-item-title>Documentation</v-list-item-title>
        </v-list-item>
        <v-list-item @click="handleClickOnMenuItem" :key="'profile'" exact :to="profileRoute"
          ><v-list-item-title>Edit my profile</v-list-item-title></v-list-item
        >
        <v-list-item :key="'logout'" exact @click="logout"><v-list-item-title>Logout</v-list-item-title></v-list-item>
      </v-list>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from '@vue/composition-api'
import MobileProjectMenu from './MobileProjectMenu.vue'
import MobileWorkspaceMenu from './MobileWorkspaceMenu.vue'

import useAuthStore from '@/features/auth/composition/useAuthStore'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'

const emits = defineEmits('onClose')

const authStore = useAuthStore()
const workspaceStore = useWorkspaceStore()

const sticked = ref(false)

const isMember = computed(() => workspaceStore.workspace.value.is_member)
const workspaceShortUuid = computed(() => workspaceStore.workspace.value.short_uuid)

const profileRoute = computed(() => {
  if (isMember.value) {
    return { name: 'workspace-profile', params: { workspaceId: workspaceShortUuid.value } }
  }
  return { name: 'profile' }
})

const logout = () => authStore.actions.logout()

const handleOnStick = data => (sticked.value = data.sticked)

const handleClickOnMenuItem = () => {
  emits('onClose')
}
</script>
