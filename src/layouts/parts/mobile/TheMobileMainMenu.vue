<template>
  <AskAnnaCard
    class="mx-auto"
    :class="{ 'fixed z-10  w-full': isSticky }"
  >
    <VList
      density="compact"
      open-strategy="single"
    >
      <TheMobileWorkspacesMenu @onClose="handleClickOnMenuItem" />
      <TheMobileProjectsMenu @onClose="handleClickOnMenuItem" />

      <VList>
        <VListItem
          target="_blank"
          title="Documentation"
          @click="handleClickOnMenuItem"
          href="https://docs.askanna.io"
        />
        <VListItem
          exact
          :key="'profile'"
          :to="profileRoute"
          title="Edit my profile"
          @click="handleClickOnMenuItem"
        />
        <VListItem
          exact
          :key="'logout'"
          title="Logout"
          @click="logout"
        />
      </VList>
    </VList>
  </AskAnnaCard>
</template>

<script setup lang="ts">
import TheMobileProjectsMenu from './TheMobileProjectsMenu.vue'
import TheMobileWorkspacesMenu from './TheMobileWorkspacesMenu.vue'

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
  routerPush({ name: 'signin' })
}

const handleClickOnMenuItem = () => emit('onClose')
</script>