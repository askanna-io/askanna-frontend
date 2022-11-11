<template>
  <AskAnnaCard
    v-sticky="true"
    class="mx-auto askAnna-main-menu"
    :class="{ 'sticky-fox': isSticky }"
    sticky-offset="{top: 58, bottom: 10}"
  >
    <v-list dense>
      <MobileWorkspacesMenu @onClose="handleClickOnMenuItem" />
      <MobileProjectsMenu @onClose="handleClickOnMenuItem" />

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
  </AskAnnaCard>
</template>

<script setup lang="ts">
import MobileProjectsMenu from './MobileProjectsMenu.vue'
import MobileWorkspacesMenu from './MobileWorkspacesMenu.vue'

const emit = defineEmits('onClose')

const authStore = useAuthStore()
const mobileStore = useMobileStore()
const workspaceStore = useWorkspaceStore()

const isMember = computed(() => workspaceStore.workspace.is_member)
const workspaceShortUuid = computed(() => workspaceStore.workspace.suuid)

const profileRoute = computed(() => {
  if (isMember.value) {
    return { name: 'workspace-profile', params: { workspaceId: workspaceShortUuid.value } }
  }
  return { name: 'profile' }
})

const isSticky = computed(() => mobileStore.isMenuOpen && mobileStore.isMenuSticked)

const logout = () => authStore.logout()

const handleClickOnMenuItem = () => emit('onClose')
</script>
