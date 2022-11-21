<template>
  <AskAnnaCard
    v-sticky="true"
    class="mx-auto askAnna-main-menu"
    :class="{ 'sticky-fox': isSticky }"
    sticky-offset="{top: 58, bottom: 10}"
  >
    <VList dense>
      <MobileWorkspacesMenu @onClose="handleClickOnMenuItem" />
      <MobileProjectsMenu @onClose="handleClickOnMenuItem" />

      <VList class="pt-0">
        <VListItem @click="handleClickOnMenuItem" href="https://docs.askanna.io" target="_blank">
          <VListItemTitle>Documentation</VListItemTitle>
        </VListItem>
        <VListItem @click="handleClickOnMenuItem" :key="'profile'" exact :to="profileRoute"
          ><VListItemTitle>Edit my profile</VListItemTitle></VListItem
        >
        <VListItem :key="'logout'" exact @click="logout"><VListItemTitle>Logout</VListItemTitle></VListItem>
      </VList>
    </VList>
  </AskAnnaCard>
</template>

<script setup lang="ts">
import MobileProjectsMenu from './MobileProjectsMenu.vue'
import MobileWorkspacesMenu from './MobileWorkspacesMenu.vue'

const emit = defineEmits('onClose')

const authStore = useAuthStore()
const mobileStore = useMobileStore()
const { routerPush } = useRouterAskAnna()
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

const logout = async () => {
  await authStore.logout()
  routerPush({ path: '/signin' })
}

const handleClickOnMenuItem = () => emit('onClose')
</script>
