<template>
  <v-app>
    <v-app-bar app clipped-left dark color="primary" :dense="!$vuetify.breakpoint.xsOnly">
      <template v-if="!$vuetify.breakpoint.xsOnly">
        <v-app-bar-nav-icon v-if="showAppBarIcon" @click.stop="handleChangeSticked" />
      </template>

      <div v-else class="pl-9" />

      <v-container fluid class="pl-1">
        <div
          class="d-flex align-center"
          align="center"
          :class="{
            'justify-center': $vuetify.breakpoint.xsOnly,
            'justify-space-between': !$vuetify.breakpoint.xsOnly
          }"
          no-gutters
        >
          <div md="auto" sm="12" text-sm-left>
            <v-btn class="pa-0 mt-1" :to="{ name: 'workspace', params: { ...$route.params } }" text color="transparent">
              <img alt="AskAnna logo" src="/assets/logo.svg" class="logo" />
            </v-btn>
          </div>
          <MainMenu />
          <UserMenu />
        </div>
      </v-container>
      <template v-if="$vuetify.breakpoint.xsOnly">
        <v-app-bar-nav-icon @click.stop="handleOpenMenu" />
      </template>
    </v-app-bar>

    <v-main class="scrollbar">
      <v-container
        class="a-content"
        :class="{ 'px-0 mx-0 pt-1': $vuetify.breakpoint.xsOnly, 'a-content--full': mobileStore.isFullScreen }"
      >
        <MobileMainMenu v-if="mobileStore.isMenuOpen" @onClose="handleOnCloseMobileMenu" />
        <router-view />
      </v-container>
      <the-snack-bar />
      <TheUploadStatus />
      <UpdateApp />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import MainMenu from './parts/MainMenu.vue'
import UserMenu from './parts/UserMenu.vue'
import MobileMainMenu from './parts/mobile/MobileMainMenu.vue'

const token = window.localStorage.getItem('token')

useTitle()
const userStore = useUserStore()
const { route } = useRouterAskAnna()
const mobileStore = useMobileStore()
const projectStore = useProjectStore()
const projectsStore = useProjectsStore()
const workspacesStore = useWorkspacesStore()

const showAppBarIcon = computed(() => !route.meta?.hideAppBarIcon)

const handleChangeSticked = () => (projectStore.menu.sticked = !projectStore.menu.sticked)

const fetchData = async () => {
  await userStore.getGlobalProfile()

  if (token) {
    await userStore.getUserProfile()
  }

  await projectsStore.getProjects()
  await workspacesStore.getAllWorkspaces()
  await workspacesStore.getMemberWorkspaces()
}
const handleOnCloseMobileMenu = () => (mobileStore.isMenuOpen = false)
const handleOpenMenu = () => {
  mobileStore.isMenuOpen = !mobileStore.isMenuOpen
  mobileStore.isMenuSticked = window.pageYOffset > 1
}

onBeforeMount(() => fetchData())

onUpdated(() => {
  if (import.meta.env.VITE_APP_INTERCOM === 'on') {
    window.Intercom('update')
  }
})
</script>
<style scoped lang="scss">
.logo {
  height: 30px;
}
.logo.--mobile {
  height: 67px;
}
</style>
